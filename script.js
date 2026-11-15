const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    siteNav.classList.toggle('is-open', !isExpanded);
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
    });
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const revealTargets = document.querySelectorAll(
  '.welcome-mark, .welcome-copy, .section-heading, .feature-card, .menu-callout, .gallery-copy, .gallery-carousel, .contact-card'
);

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -35px 0px' });

  revealTargets.forEach((element) => {
    element.setAttribute('data-reveal', '');
    revealObserver.observe(element);
  });
} else {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
}

const galleryCarousel = document.querySelector('[data-carousel]');

if (galleryCarousel) {
  const track = galleryCarousel.querySelector('.carousel-track');
  const slides = [...galleryCarousel.querySelectorAll('.gallery-slide')];
  const dots = [...galleryCarousel.querySelectorAll('.carousel-dot')];
  const status = galleryCarousel.querySelector('[data-carousel-status]');
  const toggleButton = galleryCarousel.querySelector('[data-carousel-toggle]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pauseReasons = new Set();
  let activeIndex = 0;

  const showSlide = (nextIndex, announce = false) => {
    activeIndex = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.setAttribute('aria-label', `${index + 1} de ${slides.length}`);
      dots[index].classList.toggle('is-active', isActive);
      dots[index].setAttribute('aria-pressed', String(isActive));
    });

    if (announce && status) {
      const caption = slides[activeIndex].querySelector('figcaption')?.textContent.trim();
      status.textContent = `Foto ${activeIndex + 1} de ${slides.length}${caption ? `: ${caption}` : ''}`;
    }
  };

  galleryCarousel.querySelector('[data-carousel-prev]')?.addEventListener('click', () => showSlide(activeIndex - 1, true));
  galleryCarousel.querySelector('[data-carousel-next]')?.addEventListener('click', () => showSlide(activeIndex + 1, true));
  dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index, true)));
  toggleButton?.addEventListener('click', () => {
    const shouldPause = !pauseReasons.has('user');
    if (shouldPause) pauseReasons.add('user');
    else pauseReasons.delete('user');
    toggleButton.setAttribute('aria-pressed', String(shouldPause));
    toggleButton.setAttribute('aria-label', shouldPause ? 'Retomar apresentação' : 'Pausar apresentação');
    toggleButton.textContent = shouldPause ? '▶' : 'Ⅱ';
  });

  galleryCarousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showSlide(activeIndex - 1, true);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(activeIndex + 1, true);
    }
  });

  galleryCarousel.addEventListener('pointerenter', () => pauseReasons.add('pointer'));
  galleryCarousel.addEventListener('pointerleave', () => pauseReasons.delete('pointer'));
  galleryCarousel.addEventListener('focusin', () => pauseReasons.add('focus'));
  galleryCarousel.addEventListener('focusout', (event) => {
    if (!galleryCarousel.contains(event.relatedTarget)) pauseReasons.delete('focus');
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseReasons.add('hidden');
    else pauseReasons.delete('hidden');
  });

  showSlide(0);

  if (!reducedMotion && slides.length > 1) {
    window.setInterval(() => {
      if (pauseReasons.size === 0) showSlide(activeIndex + 1);
    }, 5000);
  } else if (toggleButton) {
    toggleButton.hidden = true;
  }
}
