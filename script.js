(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);

  const updateScrollUI = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    header?.classList.toggle('is-compact', window.scrollY > 80);
  };

  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', updateScrollUI);

  if (reduceMotion || !('IntersectionObserver' in window)) return;

  document.body.classList.add('motion-ready');

  const revealGroups = [
    ['#about .section-kicker, #about h2', 'reveal reveal-left'],
    ['#about .about-copy', 'reveal'],
    ['#work .section-heading > *', 'reveal'],
    ['#work .project-card', 'reveal'],
    ['#experience .section-heading > *', 'reveal'],
    ['#experience .background-label', 'reveal'],
    ['#experience .background-item', 'reveal'],
    ['#contact', 'reveal']
  ];

  revealGroups.forEach(([selector, classes]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add(...classes.split(' '));
      element.style.setProperty('--reveal-delay', `${Math.min(index % 3, 2) * 90}ms`);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
})();
