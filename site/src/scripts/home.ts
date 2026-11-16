// Home page only: layered hero parallax and the scroll-driven photo strip.
// Both are skipped under reduced motion; the strip also needs a fine pointer and a large viewport,
// otherwise it stays a normal swipeable row.
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const hero = document.querySelector<HTMLElement>('.hero');
const gal = document.querySelector<HTMLElement>('[data-gal3d]');
const stage = gal?.querySelector<HTMLElement>('.gal-stage') ?? null;
const items = gal ? Array.from(gal.querySelectorAll<HTMLElement>('.gal-track li')) : [];
const bar = gal?.querySelector<HTMLElement>('.gal-bar i') ?? null;
let raf = 0, g3d = false, step = 0, heroOn = true, galOn = false;
const ptr = { x: 0, y: 0, tx: 0, ty: 0 };

function measure() {
  g3d = !!gal && !reduce.matches && fine.matches && innerWidth >= 900 && innerHeight >= 640;
  gal?.classList.toggle('is-3d', g3d);
  if (!g3d) items.forEach((li) => { li.style.transform = li.style.opacity = li.style.zIndex = li.style.filter = ''; });
  else step = items[0].offsetWidth * .66;
}
function schedule() { if (!raf) raf = requestAnimationFrame(frame); }
function frame() {
  raf = 0;
  if (hero && heroOn && !reduce.matches) {
    const r = hero.getBoundingClientRect();
    ptr.x += (ptr.tx - ptr.x) * .12; ptr.y += (ptr.ty - ptr.y) * .12;
    hero.style.setProperty('--sy', clamp(-r.top, 0, r.height).toFixed(1));
    hero.style.setProperty('--px', ptr.x.toFixed(3)); hero.style.setProperty('--py', ptr.y.toFixed(3));
    if (Math.abs(ptr.tx - ptr.x) + Math.abs(ptr.ty - ptr.y) > .002) schedule();
  }
  if (g3d && galOn && gal && stage) {
    const gr = gal.getBoundingClientRect(), top = parseFloat(getComputedStyle(stage).top) || 0;
    const n = items.length, p = clamp((top - gr.top) / Math.max(1, gr.height - stage.offsetHeight), 0, 1), q = n > 2 ? 1 + p * (n - 3) : p * (n - 1);
    items.forEach((li, i) => {
      const d = i - q, a = Math.min(Math.abs(d), 2.6);
      li.style.transform = `translate(-50%,-50%) translateX(${(d * step).toFixed(1)}px) translateZ(${(-a * 230).toFixed(1)}px) rotateY(${(clamp(d, -1, 1) * -50).toFixed(2)}deg)`;
      li.style.zIndex = String(100 - Math.round(Math.abs(d) * 10)); li.style.opacity = Math.abs(d) > 2.5 ? '0' : '1'; li.style.filter = `brightness(${(1 - Math.min(Math.abs(d), 2) * .28).toFixed(2)})`;
    });
    if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
  }
}
// only do scroll work while the hero or the strip is on screen
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.target === hero) heroOn = e.isIntersecting; else galOn = e.isIntersecting;
  schedule();
}));
if (hero) io.observe(hero);
if (gal) io.observe(gal);
addEventListener('scroll', () => { if (heroOn || galOn) schedule(); }, { passive: true });
addEventListener('resize', () => { measure(); schedule(); });
reduce.addEventListener('change', () => { measure(); schedule(); });
if (hero && fine.matches) {
  hero.addEventListener('pointermove', (e) => { const b = hero.getBoundingClientRect(); ptr.tx = (e.clientX - b.left) / b.width - .5; ptr.ty = (e.clientY - b.top) / b.height - .5; schedule(); });
  hero.addEventListener('pointerleave', () => { ptr.tx = ptr.ty = 0; schedule(); });
}
measure(); schedule();
