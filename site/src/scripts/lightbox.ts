// Gallery lightbox. Progressive enhancement: without this script every thumbnail is a plain link to the image.
// Markup: <a href="full.jpg" data-lb data-album="…" data-caption="…" data-w data-h><img alt></a> and one empty <div class="lb">.
const lb = document.querySelector<HTMLElement>('.lb');
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-lb]'));

if (lb && links.length) {
  const L = lb.dataset;
  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, text = '') => {
    const n = document.createElement(tag); n.className = cls; if (text) n.textContent = text; return n;
  };
  const top = el('div', 'lb-top');
  const count = el('span', 'n');
  const close = el('button', 'hbtn x', L.close || 'Close'); close.type = 'button';
  top.append(count, close);
  const stage = el('div', 'lb-stage');
  const img = el('img', ''); img.decoding = 'async';
  const prev = el('button', 'lb-nav prev', '←'); prev.type = 'button'; prev.setAttribute('aria-label', L.prev || 'Previous');
  const next = el('button', 'lb-nav next', '→'); next.type = 'button'; next.setAttribute('aria-label', L.next || 'Next');
  stage.append(img, prev, next);
  const cap = el('p', 'lb-cap');
  const live = el('span', 'vh'); live.setAttribute('aria-live', 'polite');
  lb.append(top, stage, cap, live);
  document.body.appendChild(lb); // direct child of <body>, so everything else can be made inert

  let set: HTMLAnchorElement[] = [];
  let at = 0;
  let opener: HTMLElement | null = null;
  let inerted: Element[] = [];
  let scrollLock = '';
  const isOpen = () => lb.classList.contains('open');

  function show(i: number) {
    at = (i + set.length) % set.length;
    const a = set[at], thumb = a.querySelector('img');
    const label = (L.of || '{n} / {t}').replace('{n}', String(at + 1)).replace('{t}', String(set.length));
    img.alt = thumb?.alt || label;
    if (a.dataset.w && a.dataset.h) { img.width = +a.dataset.w; img.height = +a.dataset.h; }
    img.src = a.href;
    count.textContent = `${at + 1} / ${set.length}`;
    cap.textContent = a.dataset.caption || '';
    live.textContent = a.dataset.caption ? `${label}: ${a.dataset.caption}` : label;
    const single = set.length < 2;
    prev.hidden = next.hidden = single;
    if (!single) new Image().src = set[(at + 1) % set.length].href; // preload the next image only
  }

  function open(a: HTMLAnchorElement) {
    opener = a;
    set = links.filter((x) => x.dataset.album === a.dataset.album);
    inerted = Array.from(document.body.children).filter((c) => c !== lb && !c.hasAttribute('inert') && c.tagName !== 'SCRIPT');
    inerted.forEach((c) => c.setAttribute('inert', ''));
    scrollLock = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    lb!.classList.add('open');
    show(set.indexOf(a));
    close.focus();
  }

  function shut() {
    if (!isOpen()) return;
    lb!.classList.remove('open');
    inerted.forEach((c) => c.removeAttribute('inert')); inerted = [];
    document.documentElement.style.overflow = scrollLock;
    img.removeAttribute('src');
    // return to the thumbnail that is showing now, so the visitor keeps their place in the grid
    (set[at] || opener)?.focus({ preventScroll: true });
    (set[at] || opener)?.scrollIntoView({ block: 'nearest' });
  }

  links.forEach((a) => a.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault(); open(a);
  }));
  close.addEventListener('click', shut);
  prev.addEventListener('click', () => show(at - 1));
  next.addEventListener('click', () => show(at + 1));
  stage.addEventListener('click', (e) => { if (e.target === stage) shut(); });

  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') { e.preventDefault(); shut(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); }
    else if (e.key === 'Tab') { // keep focus inside the dialog (fallback where `inert` is missing)
      const f = [close, prev, next].filter((b) => !b.hidden);
      const i = f.indexOf(document.activeElement as HTMLButtonElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  // swipe left / right
  let sx = 0, sy = 0, tracking = false;
  stage.addEventListener('touchstart', (e) => {
    tracking = e.touches.length === 1;
    if (tracking) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (!tracking || set.length < 2) return;
    tracking = false;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) show(at + (dx < 0 ? 1 : -1));
  }, { passive: true });
}
