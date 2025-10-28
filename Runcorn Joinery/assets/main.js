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
})();
