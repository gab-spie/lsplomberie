/* ============================================
   LS PLOMBERIE — Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // All reveal-type elements
  const allReveals = document.querySelectorAll('.reveal, .reveal-slide-up, .reveal-scale, .reveal-slide-left');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  allReveals.forEach(el => revealObserver.observe(el));

  // Nav scroll effect
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Parallax backgrounds
  const parallaxEls = document.querySelectorAll('.parallax-bg');

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const parent = el.closest('.hero-bg, .expertise-bg, .cta-banner-bg');
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inView) {
        const speed = 0.15;
        const offset = scrollY * speed;
        el.style.transform = 'scale(1.1) translateY(' + offset + 'px)';
      }
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  // Hamburger + mobile menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Animated stat counters
  const statNumbers = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statObserver.observe(el));

  function animateCounter(el, target) {
    const duration = target > 1000 ? 2800 : 2000;
    const start = performance.now();
    const formatter = target >= 1000
      ? new Intl.NumberFormat('fr-FR')
      : null;

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

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      if (id === '#zone' && anchor.closest('.zone-layout')) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 100;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // Magnetic effect on primary buttons
  document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.1) + 'px, ' + (y * 0.15) + 'px)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // Tilt effect on service cards
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'translateY(-8px) perspective(600px) rotateX(' + (y * -4) + 'deg) rotateY(' + (x * 4) + 'deg)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
