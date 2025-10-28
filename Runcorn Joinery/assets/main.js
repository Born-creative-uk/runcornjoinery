// Mobile nav toggle + current year + smooth-ish hash scroll
const byId = (id) => document.getElementById(id);

(function(){
  const toggle = document.querySelector('.nav-toggle');
  const menu = byId('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Close menu after clicking a link (mobile)
  menu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });

  // Set copyright year
  const y = new Date().getFullYear();
  const el = byId('year');
  if (el) el.textContent = y;

  // Optional: smooth scroll for same-page links
  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click', e=>{
      const id = link.getAttribute('href').slice(1);
      const target = byId(id);
      if (target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        history.pushState(null, '', `#${id}`);
      }
    });
  });

  // Simple auto-advancing gallery slider
  const initSlider = (root) => {
    const slides = Array.from(root.querySelectorAll('[data-slide]'));
    if (slides.length <= 1) return;

    let active = 0;
    const interval = Number(root.dataset.interval) || 6000;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = null;

    const setActive = (index) => {
      slides[active].classList.remove('is-active');
      slides[active].setAttribute('aria-hidden', 'true');
      slides[index].classList.add('is-active');
      slides[index].setAttribute('aria-hidden', 'false');
      active = index;
    };

    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    });

    const goTo = (direction) => {
      const next = (active + direction + slides.length) % slides.length;
      setActive(next);
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const start = () => {
      stop();
      if (prefersReduced.matches) return;
      timer = window.setInterval(() => goTo(1), interval);
    };

    const prev = root.querySelector('[data-slider-prev]');
    const next = root.querySelector('[data-slider-next]');

    prev?.addEventListener('click', () => {
      goTo(-1);
      start();
    });

    next?.addEventListener('click', () => {
      goTo(1);
      start();
    });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', (event) => {
      if (!root.contains(event.relatedTarget)) {
        start();
      }
    });

    const handleMotionChange = () => {
      if (prefersReduced.matches) {
        stop();
      } else {
        start();
      }
    };

    if (typeof prefersReduced.addEventListener === 'function') {
      prefersReduced.addEventListener('change', handleMotionChange);
    } else if (typeof prefersReduced.addListener === 'function') {
      prefersReduced.addListener(handleMotionChange);
    }

    start();
  };

  document.querySelectorAll('[data-slider]').forEach(initSlider);
})();
