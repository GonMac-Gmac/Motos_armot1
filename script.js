(function () {
  'use strict';

  // Registrar ScrollTrigger de GSAP
  gsap.registerPlugin(ScrollTrigger);

  const motoLeft       = document.getElementById('motoLeft');
  const motoRight      = document.getElementById('motoRight');
  const motoScrollHint = document.getElementById('moto-scroll-hint');
  const nav            = document.getElementById('nav');
  const cursor         = document.getElementById('cursor');
  const cursorRing     = document.getElementById('cursor-ring');
  
  // Elementos del Menú Hamburguesa y Nav Inteligente
  const hamburger = document.getElementById('hamburger');
  const fullMenu  = document.getElementById('fullMenu');
  const closeMenu = document.getElementById('closeMenu');
  const menuLinks = document.querySelectorAll('.full-menu-links a');

  /* ── LÓGICA DEL MENÚ A PANTALLA COMPLETA ── */
  if (hamburger && fullMenu && closeMenu) {
    hamburger.addEventListener('click', () => {
      fullMenu.classList.add('active');
    });
    
    closeMenu.addEventListener('click', () => {
      fullMenu.classList.remove('active');
    });

    // Cerrar al hacer clic en un enlace del menú
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        fullMenu.classList.remove('active');
      });
    });
  }

  /* ── NAVEGACIÓN INTELIGENTE (Desaparece al bajar) ── */
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Si bajamos de los 80px, añadimos el fondo oscuro
    if (currentScroll > 80) {
      nav.classList.add('scrolled');
      
      // Si estamos bajando, ocultamos la barra
      if (currentScroll > lastScroll) {
        nav.classList.add('nav-hidden');
      } else {
        // Si estamos subiendo, mostramos la barra (con la hamburguesa activa vía CSS)
        nav.classList.remove('nav-hidden');
      }
    } else {
      // Arriba del todo vuelve a su estado inicial
      nav.classList.remove('scrolled');
      nav.classList.remove('nav-hidden');
    }
    
    lastScroll = currentScroll <= 0 ? 0 : currentScroll; 
  }, { passive: true });

  /* ── ANIMACIÓN MOTO DIVIDIDA ── */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#intro-space',
      start: 'top top',
      end: '+=100%',
      scrub: 1.5,
      pin: true
    }
  });

  tl.to(motoLeft, { xPercent: -100, ease: 'none' }, 0);
  tl.to(motoRight, { xPercent: 100, ease: 'none' }, 0);
  tl.to(motoScrollHint, { opacity: 0, ease: 'none' }, 0);

  /* ── LÓGICA DEL CURSOR ── */
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; 
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px'; 
    cursor.style.top  = mouseY + 'px';
  });

  (function animRing() {
    const ease = 0.11;
    ringX += (mouseX - ringX) * ease; 
    ringY += (mouseY - ringY) * ease;
    cursorRing.style.left = ringX + 'px'; 
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animRing);
  })();

  document.addEventListener('mouseleave', () => { 
    cursor.style.opacity = '0'; cursorRing.style.opacity = '0'; 
  });
  document.addEventListener('mouseenter', () => { 
    cursor.style.opacity = '1'; cursorRing.style.opacity = '1'; 
  });

  /* ── SCROLL REVEAL (Aparición de Secciones) ── */
  const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => { entry.target.classList.add('visible'); }, idx >= 0 ? idx * 90 : 0);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── EFECTO HERO PARALLAX ── */
  const heroPhoto = document.querySelector('.hero-photo');
  if (heroPhoto) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroPhoto.style.transform = `translateY(${scrollY * 0.25}px)`;
      }
    }, { passive: true });
  }

  /* ── TICKER INFINITO ── */
  const tickerInner = document.querySelector('.ticker-inner');
  if (tickerInner) {
    const ticker = document.querySelector('.ticker');
    ticker.addEventListener('mouseenter', () => { tickerInner.style.animationPlayState = 'paused'; });
    ticker.addEventListener('mouseleave', () => { tickerInner.style.animationPlayState = 'running'; });
  }

  /* ── CARGA SUAVE DE IMÁGENES ── */
  document.querySelectorAll('.gallery-item img, .catalog-img-wrap img, .hero-photo').forEach(img => {
    if (img.complete) { img.style.opacity = '1'; }
    else {
      img.style.opacity = '0'; 
      img.style.transition = 'opacity .6s ease';
      img.addEventListener('load', () => { img.style.opacity = '1'; });
    }
  });

  /* ── NAV ACTIVO POR SECCIÓN ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + entry.target.id) { 
              link.style.color = 'var(--yellow)'; 
            }
          });
        }
      });
    }, { threshold: 0.4 }
  );
  sections.forEach(s => sectionObserver.observe(s));

})();