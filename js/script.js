  /* Hicham El-Mansour */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('siteHeader');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const NAV_GLASS_THRESHOLD = 60;
  const onScrollHeader = () => {
    header.classList.toggle('nav-glass', window.scrollY > NAV_GLASS_THRESHOLD);
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  const setActiveLink = () => {
    const fromTop = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.offsetTop <= fromTop) current = section;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${current.id}`);
    });
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('mobile-open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('mobile-open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  const profileTrigger = document.getElementById('profileTrigger');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');

  const openModal = () => {
    modalOverlay.classList.add('is-open');
    modalClose.focus();
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modalOverlay.classList.remove('is-open');
    profileTrigger.focus();
    document.body.style.overflow = '';
  };

  profileTrigger.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) closeModal();
  });

  document.getElementById('footerYear').textContent = new Date().getFullYear();

  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  if (reduceMotion) {

    gsap.set('[data-anim]', { opacity: 1, x: 0, y: 0 });
    return;
  }


  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('[data-anim="hero-media"]', { opacity: 0, scale: 0.85, duration: 0.9 })
    .from('[data-anim="hero-text"]', { opacity: 0, y: 26, stagger: 0.12, duration: 0.8 }, '-=0.55')
    .from('.site-header', { opacity: 0, y: -20, duration: 0.6 }, 0);

  const heroBgFade = document.querySelector('.hero-bg-fade');
  if (heroBgFade) {
    gsap.timeline({
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    }).to(heroBgFade, { opacity: 1, ease: 'none' });
  }

  gsap.utils.toArray('[data-anim="fade-up"]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
      },
    });
  });

  gsap.utils.toArray('.contact-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 24,
      duration: 0.7,
      delay: i * 0.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: card, start: 'top 90%' },
    });
  });

  const skillsSection = document.getElementById('skills');
  const skillsStage = document.getElementById('skillsStage');
  const cards = gsap.utils.toArray('.skill-card');

  if (skillsSection && skillsStage && cards.length) {

    const baseScale = [1, 0.86, 0.94, 1.08, 0.9, 1, 0.88];

    let spacingX = 190;
    let depthStep = 150;

    const updateMetrics = () => {
      const rect = skillsStage.getBoundingClientRect();

      spacingX = gsap.utils.clamp(90, 210, rect.width * 0.15);
      depthStep = gsap.utils.clamp(90, 160, rect.width * 0.11);
    };
    updateMetrics();
    window.addEventListener('resize', updateMetrics);

    gsap.set(cards, { xPercent: -50, yPercent: -50, transformPerspective: 1400 });

    const renderGallery = (focus) => {
      cards.forEach((card, i) => {
        const offset = i - focus;
        const abs = Math.abs(offset);

        const x = offset * spacingX;
        const z = -abs * depthStep;
        const rotateY = gsap.utils.clamp(-32, 32, offset * -16);
        const scale = gsap.utils.clamp(0.55, 1.15, (1.12 - abs * 0.16) * baseScale[i]);
        const opacity = gsap.utils.clamp(0, 1, 1 - abs * 0.3);
        const zIndex = Math.round(200 - abs * 10);

        gsap.set(card, { x, z, rotateY, scale, opacity, zIndex });
        card.classList.toggle('is-focus', abs < 0.5);
      });
    };

    renderGallery(0);

    ScrollTrigger.create({
      trigger: skillsSection,
      start: 'top top',
      end: '+=2400',
      pin: '.skills-pin',
      scrub: 0.7,
      anticipatePin: 1,
      onUpdate: (self) => renderGallery(self.progress * (cards.length - 1)),
      onRefresh: (self) => {
        updateMetrics();
        renderGallery(self.progress * (cards.length - 1));
      },
      id: 'skillsTrigger',
    });
  }
})();
