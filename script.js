(() => {
  const progress = document.querySelector('.scroll-progress');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const toast = document.querySelector('.toast');

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const amount = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${amount}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Reveal content as it enters the viewport; respect reduced-motion preferences.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const closeMenu = () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    nav.classList.toggle('open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 620) closeMenu();
  });

  let toastTimer;
  document.querySelector('.copy-email').addEventListener('click', async event => {
    const email = event.currentTarget.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      toast.textContent = 'Email copied to clipboard';
    } catch {
      toast.textContent = email;
    }
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
