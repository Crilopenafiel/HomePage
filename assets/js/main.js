/* ================================================================
   main.js - Navigation, Particles, Counters, Scroll Animations
   ================================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     Utility
  ---------------------------------------------------------------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------
     Footer year
  ---------------------------------------------------------------- */
  const yearEl = $('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------------
     Navigation - scroll state + hamburger + scrollspy
  ---------------------------------------------------------------- */
  const navbar   = $('#navbar');
  const hamburger = $('.nav-hamburger');
  const navLinks  = $('#nav-links');
  const allNavLinks = $$('.nav-links a');

  // Add background when scrolled
  function onNavScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    // Back to top button
    const btt = $('#back-to-top');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  }
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    // Close on link click
    navLinks.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scrollspy - highlight active nav link
  const sections = $$('section[id]');
  const sectionOffsets = [];

  function buildOffsets() {
    sectionOffsets.length = 0;
    sections.forEach(sec => {
      sectionOffsets.push({ id: sec.id, top: sec.offsetTop - 120 });
    });
  }

  function scrollSpy() {
    const y = window.scrollY;
    let current = '';
    sectionOffsets.forEach(s => { if (y >= s.top) current = s.id; });
    allNavLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('load', () => { buildOffsets(); scrollSpy(); });
  window.addEventListener('scroll', scrollSpy, { passive: true });
  window.addEventListener('resize', buildOffsets, { passive: true });

  /* ----------------------------------------------------------------
     AOS - Animate On Scroll (custom IntersectionObserver)
  ---------------------------------------------------------------- */
  if (!prefersReducedMotion) {
    const aosObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-visible');
          aosObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    $$('[data-aos]').forEach(el => aosObserver.observe(el));
  } else {
    // Show everything immediately if reduced motion preferred
    $$('[data-aos]').forEach(el => el.classList.add('aos-visible'));
  }

  /* ----------------------------------------------------------------
     Stat Counters
  ---------------------------------------------------------------- */
  function animateCount(el) {
    const target  = parseInt(el.dataset.count, 10);
    const prefix  = el.dataset.prefix || '';
    const suffix  = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const value = Math.round(ease * target);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  $$('[data-count]').forEach(el => counterObserver.observe(el));

  /* ----------------------------------------------------------------
     Contact Form (Web3Forms)
  ---------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formResult  = document.getElementById('form-result');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn     = contactForm.querySelector('button[type="submit"]');
      const btnText = btn.querySelector('span');
      btn.disabled      = true;
      btnText.textContent = 'Sending…';

      try {
        const res  = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: new FormData(contactForm)
        });
        const json = await res.json();
        if (json.success) {
          formResult.textContent = 'Message sent. I\'ll be in touch soon.';
          formResult.className   = 'form-result success';
          contactForm.reset();
        } else {
          throw new Error(json.message);
        }
      } catch {
        formResult.textContent = 'Something went wrong. Please try again.';
        formResult.className   = 'form-result error';
      }

      btn.disabled        = false;
      btnText.textContent = 'Send message';
    });
  }

  /* ----------------------------------------------------------------
     Particle System - Canvas 2D
  ---------------------------------------------------------------- */
  if (prefersReducedMotion) return;

  const canvas = $('#particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animFrame;
  const PARTICLE_COUNT = 70;
  const CONNECTION_DIST = 130;
  const mouse = { x: -1000, y: -1000 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 1.5 + 0.8
      });
    }
  }

  function updateParticles() {
    particles.forEach(p => {
      // Subtle mouse attraction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        p.vx += dx / dist * 0.012;
        p.vy += dy / dist * 0.012;
      }
      // Speed limit
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.2) { p.vx *= 0.98; p.vy *= 0.98; }

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0)  { p.x = 0;  p.vx *= -1; }
      if (p.x > W)  { p.x = W;  p.vx *= -1; }
      if (p.y < 0)  { p.y = 0;  p.vy *= -1; }
      if (p.y > H)  { p.y = H;  p.vy *= -1; }
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECTION_DIST) {
          const alpha = (1 - d / CONNECTION_DIST) * 0.35;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,191,166,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,191,166,0.7)';
      ctx.fill();
    });

    // Copper accent dots (every ~7th particle)
    particles.forEach((p, i) => {
      if (i % 7 === 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212,129,42,0.5)';
        ctx.fill();
      }
    });
  }

  function loop() {
    updateParticles();
    drawParticles();
    animFrame = requestAnimationFrame(loop);
  }

  // Mouse tracking (hero section only)
  const hero = $('#hero');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  }, { passive: true });

  // Pause particles when hero is off screen (performance)
  const heroObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      if (!animFrame) loop();
    } else {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
  });
  if (hero) heroObserver.observe(hero);

  resize();
  createParticles();
  loop();

})();
