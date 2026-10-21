/**
 * RD CLINIC — SCRIPT DE INTERAÇÕES, CARROSSEL INFINITO E ROLAGEM SUAVE LENIS
 * Rolagem suave com Lenis + Carrossel infinito Swiper controlável + Reveal on scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. INICIALIZAÇÃO DA ROLAGEM SUAVE (LENIS)
  let lenisInstance = null;

  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
      infinite: false
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Suporte a cliques em links com âncora (#hero, #especialidades, etc.)
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            lenisInstance.scrollTo(targetEl, { offset: -30, duration: 1.4 });
          }
        }
      });
    });
  }

  // 2. INICIALIZAÇÃO DO CARROSSEL INFINITO CONTROLÁVEL (SWIPER)
  if (typeof Swiper !== 'undefined') {
    const specialtiesSwiper = new Swiper('.specialties-swiper', {
      loop: true,
      speed: 750,
      grabCursor: true,
      spaceBetween: 24,
      slidesPerView: 1.15,
      autoplay: {
        delay: 3200,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        nextEl: '.carousel-next',
        prevEl: '.carousel-prev',
      },
      pagination: {
        el: '.carousel-pagination',
        clickable: true,
      },
      breakpoints: {
        600: {
          slidesPerView: 2.15,
          spaceBetween: 24,
        },
        992: {
          slidesPerView: 3.15,
          spaceBetween: 28,
        },
        1240: {
          slidesPerView: 4,
          spaceBetween: 28,
        }
      }
    });
  }

  // 3. REVEAL ON SCROLL ELEGANTE COM STAGGER
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  // Adiciona stagger automático para grupos de links e triptych
  const cardGrids = document.querySelectorAll('.contact-links-group, .personal-gallery');
  cardGrids.forEach(grid => {
    const children = grid.querySelectorAll('.reveal-on-scroll');
    children.forEach((child, index) => {
      if (!child.style.transitionDelay) {
        child.style.transitionDelay = `${(index % 4) * 0.12}s`;
      }
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }
});
