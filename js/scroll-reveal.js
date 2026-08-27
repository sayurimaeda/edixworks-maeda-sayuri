(() => {
  const sections = document.querySelectorAll('main section.reveal');

  if (sections.length === 0) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    sections.forEach((section) => section.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    sections.forEach((section) => observer.observe(section));
  }

  const worksGrid = document.querySelector('.works-grid');
  const dotsContainer = document.querySelector('.carousel-dots');
  if (!worksGrid || !dotsContainer) return;
  const cards = Array.from(worksGrid.querySelectorAll('.work-card'));
  const mobileQuery = window.matchMedia('(max-width: 480px)');
  cards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Works ${index + 1}枚目を表示`);
    dot.addEventListener('click', () => {
      if (mobileQuery.matches) cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);
  const updateDots = () => {
    if (!mobileQuery.matches) return;
    const center = worksGrid.scrollLeft + worksGrid.clientWidth / 2;
    let activeIndex = 0;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      const currentDistance = Math.abs(cards[activeIndex].offsetLeft + cards[activeIndex].offsetWidth / 2 - center);
      if (distance < currentDistance) activeIndex = index;
    });
    dots.forEach((dot, index) => dot.classList.toggle('is-active', index === activeIndex));
  };
  worksGrid.addEventListener('scroll', updateDots, { passive: true });
  window.addEventListener('resize', updateDots);
  updateDots();
})();
