import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const root = document.documentElement;
if (reducedMotion) root.classList.add('reduced-motion');

/* ---------------- Small dynamic bits ---------------- */
document.getElementById('age').textContent = String(new Date().getFullYear() - 2005);
document.getElementById('year').textContent = String(new Date().getFullYear());
document.getElementById('form-next').value = `${location.origin}/thanks.html`;

/* ---------------- Smooth scroll (Lenis) ---------------- */
let lenis = null;
if (!reducedMotion) {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Anchor links go through Lenis so they stay smooth and respect the nav offset.
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = id.length > 1 && document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    if (lenis) lenis.scrollTo(target, { offset: id === '#hero' ? 0 : -72 });
    else target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  });
});

/* ---------------- Nav ---------------- */
const nav = document.querySelector('.nav');
const burger = document.getElementById('burger');
function closeMenu() {
  nav.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Open menu');
  lenis?.start();
}
burger.addEventListener('click', () => {
  const open = !nav.classList.contains('is-open');
  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  if (open) lenis?.stop();
  else lenis?.start();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

let lastY = 0;
ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate: (self) => {
    const y = self.scroll();
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > 400 && y > lastY && !nav.classList.contains('is-open'));
    lastY = y;
  },
});

// Highlight the nav link for the section in view.
const navLinks = [...document.querySelectorAll('.nav__links a')];
navLinks.forEach((link) => {
  const section = document.querySelector(link.getAttribute('href'));
  if (!section) return;
  ScrollTrigger.create({
    trigger: section,
    start: 'top 50%',
    end: 'bottom 50%',
    onToggle: ({ isActive }) => isActive && navLinks.forEach((l) => l.classList.toggle('is-active', l === link)),
  });
});

gsap.to('.scroll-progress', {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
});

/* ---------------- Music ---------------- */
const music = document.getElementById('music');
const musicBtn = document.getElementById('music-btn');
music.volume = 0.35;
musicBtn.addEventListener('click', async () => {
  const playing = musicBtn.getAttribute('aria-pressed') === 'true';
  if (playing) {
    music.pause();
  } else {
    try {
      await music.play();
    } catch {
      return;
    }
  }
  musicBtn.setAttribute('aria-pressed', String(!playing));
  musicBtn.setAttribute('aria-label', playing ? 'Play lofi music' : 'Pause music');
});

/* ---------------- Typed role ---------------- */
const roles = ['"Full Stack & Mobile Developer"', '"iOS & Android App Builder"', '"High-Quality Apps"', '"Three.js Creator"'];
const typedEl = document.getElementById('typed');
if (!reducedMotion) {
  let r = 0;
  let i = roles[0].length;
  let deleting = true;
  const tick = () => {
    const word = roles[r];
    i += deleting ? -1 : 1;
    typedEl.textContent = word.slice(0, i);
    let delay = deleting ? 35 : 70;
    if (!deleting && i === word.length) {
      deleting = true;
      delay = 2200;
    } else if (deleting && i === 0) {
      deleting = false;
      r = (r + 1) % roles.length;
      delay = 300;
    }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 2600);
}

/* ---------------- Rotating quotes ---------------- */
const quotes = [
  ['First, solve the problem. Then, write the code.', 'John Johnson'],
  ['Simplicity is the soul of efficiency.', 'Austin Freeman'],
  ['Make it work, make it right, make it fast.', 'Kent Beck'],
  ['Code is like humor. When you have to explain it, it’s bad.', 'Cory House'],
  ['The best error message is the one that never shows up.', 'Thomas Fuchs'],
  ['Talk is cheap. Show me the code.', 'Linus Torvalds'],
];
const quoteBox = document.querySelector('.orbit__quote');
const quoteText = document.getElementById('quote');
const quoteAuthor = document.getElementById('quote-author');
let q = 0;
setInterval(() => {
  if (document.hidden || !quoteBox) return;
  quoteBox.classList.add('is-swapping');
  setTimeout(() => {
    q = (q + 1) % quotes.length;
    [quoteText.textContent, quoteAuthor.textContent] = quotes[q];
    quoteBox.classList.remove('is-swapping');
  }, 500);
}, 6500);

/* ---------------- Custom cursor + magnetic buttons ---------------- */
if (finePointer && !reducedMotion) {
  const cursor = document.querySelector('.cursor');
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
  window.addEventListener(
    'pointermove',
    (e) => {
      cursor.classList.add('is-visible');
      xTo(e.clientX);
      yTo(e.clientY);
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  document.querySelectorAll('a, button, .chips li').forEach((el) => {
    el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
  });

  document.querySelectorAll('.magnetic').forEach((el) => {
    const mx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const my = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      mx((e.clientX - r.left - r.width / 2) * 0.25);
      my((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => {
      mx(0);
      my(0);
    });
  });

  // 3D tilt for project cards
  document.querySelectorAll('.tilt').forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
    gsap.set(card, { transformPerspective: 900 });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 8);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
    });
    card.addEventListener('pointerleave', () => {
      rx(0);
      ry(0);
    });
  });

  // Spotlight that follows the pointer on bento cells
  document.querySelectorAll('.bento__cell').forEach((cell) => {
    cell.addEventListener('pointermove', (e) => {
      const r = cell.getBoundingClientRect();
      cell.style.setProperty('--mx', `${e.clientX - r.left}px`);
      cell.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* ---------------- Intro + scroll animations ---------------- */
function splitChars(el) {
  const text = el.textContent;
  el.setAttribute('aria-label', text);
  el.textContent = '';
  for (const ch of text) {
    const span = document.createElement('span');
    span.className = 'char';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = ch === ' ' ? ' ' : ch;
    el.appendChild(span);
  }
}

function intro() {
  document.querySelector('.loader').classList.add('is-done');
  document.body.classList.remove('is-loading');
  if (reducedMotion) return;

  // The gradient line stays whole: background-clip:text can't span split inline-blocks.
  document.querySelectorAll('.hero__line:not(.hero__line--grad)').forEach(splitChars);
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero__title .char', { yPercent: 110, opacity: 0, rotate: 8, duration: 1.2, stagger: 0.035 }, 0.1)
    .from('.hero__line--grad', { yPercent: 60, opacity: 0, clipPath: 'inset(0 100% 0 0)', duration: 1.4 }, 0.35)
    .from('[data-hero]:not(.hero__title)', { y: 30, opacity: 0, duration: 1, stagger: 0.1 }, 0.4)
    // clearProps: a leftover transform would trap the fixed mobile menu inside the pill.
    .from('.nav__pill', { y: -30, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.5)
    .from('.hero__scroll', { opacity: 0, duration: 1 }, 1);
}

function scrollAnimations() {
  if (reducedMotion) return;

  // Reveal on scroll, batched for performance.
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    once: true,
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });

  // Hero content drifts up and fades out as you scroll past it.
  gsap.to('.hero__content', {
    yPercent: -25,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  // Generic parallax layers: [data-speed] (ambient orbs, big section numbers).
  gsap.utils.toArray('[data-speed]').forEach((el) => {
    const speed = parseFloat(el.dataset.speed);
    const trigger = el.closest('section') || document.body;
    gsap.fromTo(
      el,
      { y: () => -speed * window.innerHeight * 0.5 },
      {
        y: () => speed * window.innerHeight * 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  });

  // Image parallax inside project cards.
  gsap.utils.toArray('[data-parallax]').forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -8 },
      {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: { trigger: img.closest('.project'), start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  // Marquee skews with scroll velocity.
  const skewTo = gsap.quickTo('.marquee__track', 'skewX', { duration: 0.4, ease: 'power3' });
  ScrollTrigger.create({
    onUpdate: (self) => skewTo(gsap.utils.clamp(-12, 12, self.getVelocity() / -250)),
  });

  // Count-up stats.
  document.querySelectorAll('.counter').forEach((el) => {
    const obj = { v: 0 };
    gsap.to(obj, {
      v: Number(el.dataset.to),
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = Math.round(obj.v)),
    });
  });
}

if (reducedMotion) {
  document.querySelectorAll('.counter').forEach((el) => (el.textContent = el.dataset.to));
}

/* ---------------- 3D (lazy) ----------------
   Three.js is only fetched after first paint, and each scene only
   renders while its canvas is on screen. */
function load3D() {
  import('./three/scenes.js')
    .then((m) => m.initScenes({ reducedMotion, onScroll: (cb) => ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onUpdate: cb }) }))
    .catch((err) => console.warn('3D disabled:', err));
}

document.body.classList.add('is-loading');
const start = () => {
  intro();
  scrollAnimations();
  ScrollTrigger.refresh();
  ('requestIdleCallback' in window ? requestIdleCallback : setTimeout)(load3D, { timeout: 1200 });
};
// Start once web fonts are in (so the split title measures correctly),
// but never let a slow font hold the page hostage.
Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1200))]).then(start);
