/* ============================================
   ATF — Main Script
   ============================================ */

// --- THEME ---
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function getTheme() {
  const saved = localStorage.getItem('atf-theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('atf-theme', theme);
}

// Init theme immediately
setTheme(getTheme());

themeToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// --- NAVBAR SCROLL ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
}, { passive: true });

// --- MOBILE NAV ---
const burger = document.getElementById('navBurger');
const mobileNav = document.getElementById('navMobile');

burger?.addEventListener('click', () => {
  mobileNav?.classList.toggle('open');
});

mobileNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileNav.classList.remove('open'));
});

// --- SCROLL REVEAL ---
function initReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', initReveal);

// --- WORLD MAP TABS & TOOLTIP ---
function initMap() {
  const tabs = document.querySelectorAll('.map-tab');
  const views = document.querySelectorAll('.map-view');
  const tooltip = document.getElementById('mapTooltip');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.map;
      tabs.forEach(t => t.classList.remove('active'));
      views.forEach(v => v.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`.map-view[data-view="${target}"]`)?.classList.add('active');
    });
  });

  document.querySelectorAll('.map-dot').forEach(dot => {
    dot.addEventListener('mouseenter', (e) => {
      if (!tooltip) return;
      const city = dot.dataset.city;
      const wrap = dot.closest('.world-map-svg-wrap');
      const wrapRect = wrap.getBoundingClientRect();
      const svg = dot.closest('svg');
      const pt = svg.createSVGPoint();
      pt.x = dot.cx.baseVal.value;
      pt.y = dot.cy.baseVal.value;
      const screenPt = pt.matrixTransform(svg.getScreenCTM());

      tooltip.textContent = city;
      tooltip.style.left = (screenPt.x - wrapRect.left) + 'px';
      tooltip.style.top = (screenPt.y - wrapRect.top) + 'px';
      tooltip.classList.add('visible');
      wrap.style.position = 'relative';
      wrap.appendChild(tooltip);
    });
    dot.addEventListener('mouseleave', () => {
      tooltip?.classList.remove('visible');
    });
  });
}

// --- TESTIMONIAL CAROUSEL ---
function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('testimonialDots');
  if (!slides.length || !dotsContainer) return;

  let current = 0;
  let interval;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.testimonial-dot');

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startAutoplay() {
    interval = setInterval(next, 5000);
  }

  startAutoplay();

  dotsContainer.addEventListener('click', () => {
    clearInterval(interval);
    startAutoplay();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initTestimonials();
});
