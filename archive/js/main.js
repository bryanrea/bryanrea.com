// Vanilla JS rewrite of the original jQuery-based slide navigation.
// Uses native scrollIntoView for smooth scrolling and CSS transitions
// for the Philosophy carousel. No external dependencies.
(function () {
  // Map of header menu IDs to their target slide IDs.
  // (Keeps the original mapping; just collapses 15 near-identical handlers
  // into a single config-driven loop.)
  const navMap = {
    headerName: 'slide0',
    welcome:    'slide0',
    me:         'slide1',
    philosophy: 'slide2',
    p0:         'slide3',
    p1:         'slide4',
    p2:         'slide5',
    p3:         'slide6',
    p4:         'slide7',
    p5:         'slide8',
    p6:         'slide9',
    p7:         'slide10',
    p8:         'slide11',
    p9:         'slide12',
    p10:        'slide13',
    p11:        'slide14',
    p12:        'slide15',
  };

  const scrollArea = document.querySelector('#container .scrollable');

  function focusSlide(slideId) {
    const target = document.getElementById(slideId);
    if (!target) return;

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });

    scrollArea.querySelectorAll('.focus').forEach((el) => {
      el.classList.remove('focus');
      el.classList.add('unfocus');
    });
    target.classList.remove('unfocus');
    target.classList.add('focus');
  }

  // Header menu → slide
  Object.entries(navMap).forEach(([navId, slideId]) => {
    const navEl = document.getElementById(navId);
    if (!navEl) return;
    navEl.addEventListener('click', (e) => {
      e.preventDefault();
      focusSlide(slideId);
    });
  });

  // Clicking a slide focuses it (mirrors the original behavior).
  scrollArea.querySelectorAll('.slide').forEach((slide) => {
    slide.addEventListener('click', () => focusSlide(slide.id));
  });

  // Suppress link navigation when the link sits inside an unfocused slide —
  // so clicking an unfocused card brings it into focus instead of following
  // the link. Once focused, links work normally.
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const slide = link.closest('.slide');
    if (slide && slide.classList.contains('unfocus')) {
      e.preventDefault();
    }
  });

  // Land on slide0 without animation on first load.
  const initial = document.getElementById('slide0');
  if (initial) {
    initial.scrollIntoView({ block: 'center', inline: 'center' });
  }

  // Philosophy carousel: cycle through .subslide items inside #ss2.
  // Uses transform on .slideshow with a CSS transition (see main.css).
  (function initCarousel() {
    const slideshow = document.querySelector('#ss2 .slideshow');
    if (!slideshow) return;
    const subslides = slideshow.querySelectorAll('.subslide');
    if (!subslides.length) return;

    const prev = document.querySelector('#slide2 > .navigationLeft');
    const next = document.querySelector('#slide2 > .navigationRight');
    const slideWidth = 780; // matches .slideshowContainer width in CSS
    let current = 0;

    function show(index) {
      // Wrap around in both directions.
      current = ((index % subslides.length) + subslides.length) % subslides.length;
      slideshow.style.transform = `translateX(-${current * slideWidth}px)`;
    }

    if (prev) prev.addEventListener('click', (e) => {
      e.stopPropagation();
      show(current - 1);
    });
    if (next) next.addEventListener('click', (e) => {
      e.stopPropagation();
      show(current + 1);
    });
  })();
})();
