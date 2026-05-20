/* ============================================
   LS PLOMBERIE — Premium Interactions
   Skills: emil-design-eng + high-end-visual-design
   Inspired by Apple AirPods Pro scroll-driven 3D
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Splash — carte de visite ---- */
  const splash = document.getElementById('splash');
  const splashEnter = document.getElementById('splashEnter');

  function dismissSplash() {
    splash.classList.add('done');
    document.getElementById('nav').classList.add('visible');
    initObservers();
    initScrollDriven();
  }

  splashEnter.addEventListener('click', dismissSplash);

  /* Auto-dismiss after 6s if user hasn't clicked */
  setTimeout(() => {
    if (!splash.classList.contains('done')) dismissSplash();
  }, 6000);

  /* ---- Nav scroll ---- */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
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

  /* ---- Smooth scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        const y = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ---- Parallax (only transform + opacity — GPU safe) ---- */
  const parallaxEls = document.querySelectorAll('[data-speed]');
  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.speed);
      const parent = el.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        el.style.transform = 'translateY(' + (scrollY * speed) + 'px) scale(1.08)';
      }
    });
  }
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  /* ---- 3D tilt + shine on card-shell (high-end-visual) ---- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.card-shell').forEach(shell => {
      const inner = shell.querySelector('.card-inner');
      const shine = shell.querySelector('.card-shine');
      if (!inner) return;
      shell.addEventListener('mousemove', e => {
        const rect = shell.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const x = px - 0.5;
        const y = py - 0.5;
        inner.style.transform = 'perspective(700px) rotateX(' + (y * -6) + 'deg) rotateY(' + (x * 6) + 'deg)';
        if (shine) {
          shine.style.setProperty('--shine-x', (px * 100) + '%');
          shine.style.setProperty('--shine-y', (py * 100) + '%');
        }
      });
      shell.addEventListener('mouseleave', () => {
        inner.style.transform = '';
        inner.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        setTimeout(() => inner.style.transition = '', 500);
      });
    });

    /* Magnetic buttons */
    document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.1) + 'px, ' + (y * 0.12) + 'px)';
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ============================================================
     SCROLL-DRIVEN 3D ANIMATIONS (Apple AirPods Pro inspired)
     — Elements transform continuously based on scroll position,
       not just triggered once on enter.
     ============================================================ */
  function initScrollDriven() {
    /* Skip on mobile for performance */
    const isMobile = window.innerWidth < 768;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const vh = window.innerHeight;
    let ticking = false;

    /* Collect scroll-driven targets */
    const serviceCards = document.querySelectorAll('.services-grid .card-shell');
    const statShells = document.querySelectorAll('.stat-shell');
    const features = document.querySelectorAll('.feature');
    const heroTitle = document.querySelector('.hero-title');
    const heroDesc = document.querySelector('.hero-desc');
    const heroActions = document.querySelector('.hero-actions');
    const sectionTitles = document.querySelectorAll('.section-title');
    const bentoCards = document.querySelectorAll('.bento-card');
    const zoneCard = document.querySelector('.zone-card-shell');

    /* Utility: map value from viewport position to 0..1 range */
    function scrollProgress(el) {
      const rect = el.getBoundingClientRect();
      /* 0 = element just entered bottom, 1 = element reached top */
      const raw = 1 - (rect.top / vh);
      return Math.max(0, Math.min(1, raw));
    }

    /* Utility: map progress to a sub-range */
    function remap(val, inMin, inMax, outMin, outMax) {
      const t = Math.max(0, Math.min(1, (val - inMin) / (inMax - inMin)));
      return outMin + t * (outMax - outMin);
    }

    /* Easing: smooth step for organic motion */
    function smoothstep(t) {
      return t * t * (3 - 2 * t);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const scrollY = window.scrollY;

        /* ---- Hero parallax multi-layer ---- */
        if (heroTitle) {
          const heroP = Math.min(scrollY / vh, 1);
          const ease = smoothstep(heroP);
          heroTitle.style.transform = 'translateY(' + (ease * 60) + 'px)';
          heroTitle.style.opacity = 1 - ease * 1.2;
        }
        if (heroDesc) {
          const heroP = Math.min(scrollY / vh, 1);
          heroDesc.style.transform = 'translateY(' + (heroP * 80) + 'px)';
          heroDesc.style.opacity = Math.max(0, 1 - heroP * 1.5);
        }
        if (heroActions) {
          const heroP = Math.min(scrollY / vh, 1);
          heroActions.style.transform = 'translateY(' + (heroP * 100) + 'px)';
          heroActions.style.opacity = Math.max(0, 1 - heroP * 1.8);
        }

        /* ---- Service cards — scroll-linked 3D rotation (Apple-style) ---- */
        if (!isMobile) {
          serviceCards.forEach((card, i) => {
            const p = scrollProgress(card);
            if (p <= 0 || p >= 1.3) return;

            const inner = card.querySelector('.card-inner');
            if (!inner) return;

            /* Don't override mouse-driven tilt if user is hovering */
            if (card.matches(':hover')) return;

            /* Each card gets slightly different rotation axis */
            const angle = remap(p, 0.1, 0.8, 1, 0);
            const rotY = (i % 2 === 0 ? 1 : -1) * angle * 8;
            const rotX = angle * 4;
            const translateZ = remap(p, 0, 0.5, -30, 0);
            const scale = remap(p, 0, 0.4, 0.92, 1);

            inner.style.transform = 'perspective(1000px) rotateY(' + rotY + 'deg) rotateX(' + rotX + 'deg) translateZ(' + translateZ + 'px) scale(' + scale + ')';
            inner.style.transition = 'none';
          });
        }

        /* ---- Stats — staggered elevation + rotation ---- */
        statShells.forEach((stat, i) => {
          const p = scrollProgress(stat);
          if (p <= 0 || p >= 1.3) return;

          const inner = stat.querySelector('.stat-inner');
          if (!inner) return;

          const ease = smoothstep(remap(p, 0.1, 0.7, 0, 1));
          const rotX = (1 - ease) * 12;
          const rotY = (i % 2 === 0 ? 1 : -1) * (1 - ease) * 6;
          const ty = (1 - ease) * 30;

          inner.style.transform = 'perspective(800px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(' + ty + 'px)';
        });

        /* ---- Features — staggered slide-in from alternating sides ---- */
        features.forEach((feat, i) => {
          const p = scrollProgress(feat);
          if (p <= 0 || p >= 1.3) return;

          const ease = smoothstep(remap(p, 0.05, 0.5, 0, 1));
          const dir = i % 2 === 0 ? -1 : 1;
          const tx = (1 - ease) * dir * 20;
          const ty = (1 - ease) * 15;

          feat.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';
        });

        /* ---- Zone card — slow tilt as you scroll ---- */
        if (zoneCard && !isMobile) {
          const p = scrollProgress(zoneCard);
          if (p > 0 && p < 1.2) {
            const inner = zoneCard.querySelector('.card-inner');
            if (inner) {
              const centered = (p - 0.5) * 2; /* -1 to 1 */
              const rotY = centered * 5;
              const rotX = centered * -2;
              inner.style.transform = 'perspective(1000px) rotateY(' + rotY + 'deg) rotateX(' + rotX + 'deg)';
            }
          }
        }

        /* ---- Bento cards — cascading depth entrance ---- */
        if (!isMobile) {
          bentoCards.forEach((card, i) => {
            const p = scrollProgress(card);
            if (p <= 0 || p >= 1.2) return;

            const ease = smoothstep(remap(p, 0.05, 0.55, 0, 1));
            const rotX = (1 - ease) * 8;
            const tz = (1 - ease) * -40;
            const ty = (1 - ease) * 20;

            card.style.transform = 'perspective(900px) rotateX(' + rotX + 'deg) translateZ(' + tz + 'px) translateY(' + ty + 'px)';
          });
        }

        /* ---- Section titles — horizontal slide reveal ---- */
        sectionTitles.forEach(title => {
          const p = scrollProgress(title);
          if (p <= 0 || p >= 1) return;

          const ease = smoothstep(remap(p, 0.05, 0.45, 0, 1));
          const tx = (1 - ease) * -30;
          title.style.transform = 'translateX(' + tx + 'px)';
          title.style.opacity = ease;
        });
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); /* Initial call */
  }

  /* ---- Scroll-triggered reveals (IntersectionObserver, not scroll listener) ---- */
  function initObservers() {
    const anims = document.querySelectorAll('.anim');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const d = parseFloat(el.dataset.delay) || 0;
          if (d > 0) {
            setTimeout(() => el.classList.add('visible'), d * 1000);
          } else {
            el.classList.add('visible');
          }
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    anims.forEach(el => obs.observe(el));

    /* Stat counters */
    const statNums = document.querySelectorAll('.stat-num[data-target]');
    const statObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target, parseInt(entry.target.dataset.target, 10));
          statObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => statObs.observe(el));
  }

  function countUp(el, target) {
    const dur = target > 1000 ? 2600 : 1800;
    const start = performance.now();
    const fmt = target >= 1000 ? new Intl.NumberFormat('fr-FR') : null;

    (function step(now) {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      const val = Math.floor(ease * target);
      el.textContent = fmt ? fmt.format(val) : val;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = fmt ? fmt.format(target) : target;
    })(start);
  }

});
