/* ============================================
   LS PLOMBERIE — Premium Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Loader ---- */
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loaderProgress');
  let progress = 0;

  const loaderInterval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loaderInterval);
      setTimeout(() => {
        loader.classList.add('done');
        document.body.style.overflow = '';
        document.getElementById('nav').classList.add('visible');
        startScrollAnimations();
      }, 400);
    }
    loaderProgress.style.width = progress + '%';
  }, 80);

  /* ---- Custom Cursor ---- */
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursorDot.style.left = cursorX + 'px';
      cursorDot.style.top = cursorY + 'px';
    });

    function animateCursor() {
      dotX += (cursorX - dotX) * 0.15;
      dotY += (cursorY - dotY) * 0.15;
      cursor.style.left = dotX + 'px';
      cursor.style.top = dotY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  /* ---- Nav scroll ---- */
  const nav = document.getElementById('nav');
  const scrollContainer = document.getElementById('scrollContainer');

  scrollContainer.addEventListener('scroll', () => {
    if (scrollContainer.scrollTop > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ---- Hamburger ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  /* ---- Smooth scroll for anchors ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---- Parallax ---- */
  const parallaxLayers = document.querySelectorAll('.parallax-layer');

  function updateParallax() {
    const scrollY = scrollContainer.scrollTop;
    parallaxLayers.forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0.1;
      const parent = el.closest('.hero-bg, .expertise-bg, .cta-bg');
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        el.style.transform = 'translateY(' + (scrollY * speed) + 'px) scale(1.1)';
      }
    });
  }

  scrollContainer.addEventListener('scroll', updateParallax, { passive: true });

  /* ---- 3D Tilt on Cards ---- */
  document.querySelectorAll('.card-3d').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'perspective(800px) rotateX(' + (y * -6) + 'deg) rotateY(' + (x * 6) + 'deg) translateZ(10px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('.card-3d-light').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'perspective(600px) rotateX(' + (y * -4) + 'deg) rotateY(' + (x * 4) + 'deg) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---- Magnetic buttons ---- */
  document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.12) + 'px, ' + (y * 0.15) + 'px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ---- Scroll-triggered Animations ---- */
  function startScrollAnimations() {
    const animElements = document.querySelectorAll('.anim-title, .anim-fade, .service-card, .stat-card, .feature-card');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseFloat(el.dataset.delay) || (parseFloat(getComputedStyle(el).getPropertyValue('--index')) || 0) * 0.12;
          setTimeout(() => el.classList.add('visible'), delay * 1000);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1, root: scrollContainer });

    animElements.forEach(el => observer.observe(el));

    /* ---- Stat Counters ---- */
    const statNums = document.querySelectorAll('.stat-num[data-target]');
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target, parseInt(entry.target.dataset.target, 10));
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5, root: scrollContainer });

    statNums.forEach(el => statObserver.observe(el));
  }

  function animateCounter(el, target) {
    const duration = target > 1000 ? 2800 : 2000;
    const start = performance.now();
    const formatter = target >= 1000 ? new Intl.NumberFormat('fr-FR') : null;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(eased * target);
      el.textContent = formatter ? formatter.format(current) : current;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = formatter ? formatter.format(target) : target;
      }
    }
    requestAnimationFrame(update);
  }

});
