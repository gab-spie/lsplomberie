/* ============================================
   LS PLOMBERIE — Premium Interactions
   Skills: emil-design-eng + high-end-visual-design
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Loader ---- */
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loaderProgress');
  let progress = 0;

  const tick = setInterval(() => {
    progress += Math.random() * 20 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      setTimeout(() => {
        loader.classList.add('done');
        document.getElementById('nav').classList.add('visible');
        initObservers();
      }, 350);
    }
    loaderProgress.style.width = progress + '%';
  }, 70);

  /* ---- Custom Cursor (spring-like follow) ---- */
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  let cx = 0, cy = 0, dx = 0, dy = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      dot.style.left = cx + 'px';
      dot.style.top = cy + 'px';
    });

    (function loop() {
      dx += (cx - dx) * 0.12;
      dy += (cy - dy) * 0.12;
      cursor.style.left = dx + 'px';
      cursor.style.top = dy + 'px';
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

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

  /* ---- 3D tilt on card-shell (high-end-visual) ---- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.card-shell').forEach(shell => {
      const inner = shell.querySelector('.card-inner');
      if (!inner) return;
      shell.addEventListener('mousemove', e => {
        const rect = shell.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        inner.style.transform = 'perspective(700px) rotateX(' + (y * -4) + 'deg) rotateY(' + (x * 4) + 'deg)';
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
