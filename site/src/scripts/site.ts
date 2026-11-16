// Small behaviours shared by every page. No dependencies.
const $ = <T extends Element>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const pad = (n: number) => String(n).padStart(2, '0');
const lang = document.body.dataset.lang === 'en' ? 'en' : 'de';

// --- mobile menu
const menu = $<HTMLButtonElement>('.hbtn.menu'), sheet = $<HTMLElement>('#sheet');
function setSheet(open: boolean) {
  if (!menu || !sheet) return;
  sheet.classList.toggle('open', open);
  document.body.classList.toggle('sheet-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? menu.dataset.close! : menu.dataset.open!;
  if (open) sheet.querySelector<HTMLElement>('a')?.focus();
}
menu?.addEventListener('click', () => setSheet(!sheet!.classList.contains('open')));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet?.classList.contains('open')) { setSheet(false); menu?.focus(); } });
window.matchMedia('(min-width: 1160px)').addEventListener('change', (e) => { if (e.matches) setSheet(false); });

// --- next training: every Saturday 15:00 (the club pauses during school holidays; the page says so)
export function nextTraining(): Date {
  const n = new Date(), d = new Date(n.getFullYear(), n.getMonth(), n.getDate(), 15, 0, 0, 0);
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7));
  if (d <= n) d.setDate(d.getDate() + 7);
  return d;
}
const nt = nextTraining();
const dateText = lang === 'de' ? `Sa. ${pad(nt.getDate())}.${pad(nt.getMonth() + 1)}.` : `Sat ${nt.getDate()} ${nt.toLocaleString('en-GB', { month: 'short' })}`;
$$('[data-next-date]').forEach((el) => (el.textContent = dateText));
$$('[data-next-full]').forEach((el) => (el.textContent = `${pad(nt.getDate())}.${pad(nt.getMonth() + 1)}.${nt.getFullYear()}`));
const cd = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
if (cd.d && cd.h && cd.m && cd.s) {
  const tick = () => {
    const s = Math.max(0, Math.floor((nextTraining().getTime() - Date.now()) / 1000));
    cd.d!.textContent = pad(Math.floor(s / 86400)); cd.h!.textContent = pad(Math.floor((s % 86400) / 3600));
    cd.m!.textContent = pad(Math.floor((s % 3600) / 60)); cd.s!.textContent = pad(s % 60);
  };
  tick(); setInterval(() => { if (!document.hidden) tick(); }, 1000);
}

// --- map: nothing is requested from OpenStreetMap until the visitor clicks
$$<HTMLElement>('[data-map]').forEach((box) => {
  $('[data-map-load]', box)?.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = box.dataset.map!; f.title = box.dataset.title || 'OpenStreetMap'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer';
    box.appendChild(f); box.classList.add('loaded');
  });
});

// --- forms: validate, then say honestly that no mail service is connected yet
$$<HTMLFormElement>('[data-form]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let first: HTMLElement | null = null;
    $$<HTMLInputElement | HTMLTextAreaElement>('[required]', form).forEach((f) => {
      const ok = f instanceof HTMLInputElement && f.type === 'checkbox' ? f.checked
        : f instanceof HTMLInputElement && f.type === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value.trim())
        : f.value.trim().length > 1;
      f.setAttribute('aria-invalid', String(!ok));
      const err = document.getElementById(f.id + '-e'); if (err) err.hidden = ok;
      if (!ok && !first) first = f;
    });
    const note = $<HTMLElement>('.f-note', form)!;
    if (first) { note.hidden = true; (first as HTMLElement).focus(); return; }
    if (form.querySelector<HTMLInputElement>('[name="website"]')?.value) return; // spam trap
    note.hidden = false; note.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
});

// --- class picker (P1–P5)
$$<HTMLElement>('[data-cls]').forEach((box) => {
  const out = $<HTMLElement>('[data-cls-out]', box), btns = $$<HTMLButtonElement>('button[data-text]', box);
  btns.forEach((b) => b.addEventListener('click', () => {
    btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    if (out) out.textContent = b.dataset.text!;
  }));
});

// --- header start lights double as a reading-progress meter (desktop home only)
const lights = $$('.lights.on-home i');
if (lights.length) {
  let raf = 0;
  const paint = () => { raf = 0; const max = document.documentElement.scrollHeight - innerHeight;
    const lit = Math.round(Math.min(1, Math.max(0, scrollY / Math.max(1, max))) * 5);
    lights.forEach((l, i) => l.classList.toggle('on', i < lit)); };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(paint); }, { passive: true }); paint();
}

// --- pointer tilt for department panels: fine pointers only, never under reduced motion
if (matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  $$<HTMLElement>('.pan').forEach((el) => {
    el.addEventListener('pointermove', (e) => { const b = el.getBoundingClientRect();
      el.style.setProperty('--rx', (((e.clientY - b.top) / b.height - .5) * -6).toFixed(2));
      el.style.setProperty('--ry', (((e.clientX - b.left) / b.width - .5) * 8).toFixed(2)); });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0'); el.style.setProperty('--ry', '0'); });
  });
}
