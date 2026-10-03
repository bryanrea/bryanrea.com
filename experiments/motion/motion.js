import { createScene } from './scenes.js';

/* No dependencies. Each study is a set of circle keyframes in a 240 × 144 stage.
   One cycle plays on tap; hover/keyboard focus repeats with a short rest. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hover = window.matchMedia('(hover: hover)');
  const transform = (x = 0, y = 0, sx = 1, sy = sx) =>
    `translate(${x}px, ${y}px) scale(${sx}, ${sy})`;
  const frame = (offset, x, y = 0, sx = 1, sy = sx, extra = {}) =>
    ({ offset, transform: transform(x, y, sx, sy), ...extra });
  const track = (dot, frames, idle = frames[0]) => ({ dot, frames, idle });
  const travel = (easing) => [
    track(0, [frame(0, -85), frame(.12, -85, 0, 1, 1, { easing }), frame(.82, 85), frame(1, 85)]),
    track(1, [frame(0, 85), frame(1, 85)]),
  ];
  const studies = {
    linear: travel('linear'),
    'ease-in': travel('cubic-bezier(.55, 0, 1, 1)'),
    'ease-out': travel('cubic-bezier(0, 0, .25, 1)'),
    'ease-in-out': travel('cubic-bezier(.65, 0, .35, 1)'),
    anticipation: [track(0, [frame(0, -55), frame(.12, -55), frame(.27, -82, 0, 1, 1, { easing: 'cubic-bezier(.4,0,.2,1)' }), frame(.72, 75), frame(1, 75)])],
    overshoot: [track(0, [frame(0, -85), frame(.12, -85, 0, 1, 1, { easing: 'cubic-bezier(.2,0,.2,1)' }), frame(.62, 95), frame(.82, 65), frame(1, 65)])],
    spring: [track(0, [frame(0, -85), frame(.1, -85), frame(.36, 92), frame(.49, 41), frame(.61, 75), frame(.72, 56), frame(.81, 63), frame(.9, 60), frame(1, 60)])],
    bounce: [track(0, [frame(0, 0, -44), frame(.08, 0, -44, 1, 1, { easing: 'ease-in' }), frame(.36, 0, 35, 1, 1, { easing: 'ease-out' }), frame(.52, 0, -12, 1, 1, { easing: 'ease-in' }), frame(.68, 0, 35, 1, 1, { easing: 'ease-out' }), frame(.77, 0, 18, 1, 1, { easing: 'ease-in' }), frame(.86, 0, 35), frame(1, 0, 35)])],
    'squash-stretch': [track(0, [frame(0, 0, -42), frame(.12, 0, -42, 1, 1, { easing: 'ease-in' }), frame(.36, 0, 21, .8, 1.25), frame(.43, 0, 40, 1.45, .69), frame(.5, 0, 27, .85, 1.18, { easing: 'ease-out' }), frame(.67, 0, -13), frame(.8, 0, 35), frame(.85, 0, 38, 1.2, .83), frame(.93, 0, 35), frame(1, 0, 35)])],
    stagger: [-55, 0, 55].map((x, i) => track(i, [frame(0, x, 35, .7, .7, { opacity: .15 }), frame(.12 + i * .12, x, 35, .7, .7, { opacity: .15, easing: 'ease-out' }), frame(.5 + i * .12, x, 0, 1, 1, { opacity: 1 }), frame(1, x, 0)], frame(0, x, 12, 1, 1, { opacity: 1 }))),
    'follow-through': [0, 1, 2].map((i) => track(i, [frame(0, -64, (i - 1) * 38, .8), frame(.1, -64, (i - 1) * 38, .8), frame(.43 + i * .08, 70 + i * 8, (i - 1) * 38, .8), frame(.57 + i * .11, 55, (i - 1) * 38, .8), frame(1, 55, (i - 1) * 38, .8)])),
    arc: [track(0, Array.from({ length: 41 }, (_, i) => {
      const t = i / 40;
      return frame(t, -85 * Math.cos(Math.PI * t), 32 - 80 * Math.sin(Math.PI * t));
    }))],
    orbit: [0, 1, 2].map((i) => track(i, Array.from({ length: 61 }, (_, j) => {
      const angle = j / 60 * Math.PI * 2 + i * Math.PI * 2 / 3;
      return frame(j / 60, Math.cos(angle) * 54, Math.sin(angle) * 54, .7);
    }))),
    fade: [track(0, [{ offset: 0, opacity: 0 }, { offset: .15, opacity: 0 }, { offset: .7, opacity: 1 }, { offset: 1, opacity: 1 }], { opacity: .5 })],
    scale: [track(0, [frame(0, 0, 0, .08), frame(.12, 0, 0, .08, .08, { easing: 'cubic-bezier(.2,0,.2,1)' }), frame(.76, 0, 0, 2.2), frame(1, 0, 0, 2.2)], frame(0, 0, 0, 1.2))],
    reveal: [track(0, [frame(0, -35, 0, 1.6), frame(.12, -35, 0, 1.6, 1.6, { easing: 'cubic-bezier(.2,0,.2,1)' }), frame(.8, 28, 0, 1.6), frame(1, 28, 0, 1.6)], frame(0, -5, 0, 1.6))],
    crossfade: [
      track(0, [frame(0, 0, 0, 1.8, 1.8, { opacity: 1 }), frame(.2, 0, 0, 1.8, 1.8, { opacity: 1 }), frame(.8, 0, 0, 1.8, 1.8, { opacity: 0 }), frame(1, 0, 0, 1.8, 1.8, { opacity: 0 })]),
      track(1, [frame(0, 0, 0, 1.8, 1.8, { opacity: 0 }), frame(.2, 0, 0, 1.8, 1.8, { opacity: 0 }), frame(.8, 0, 0, 1.8, 1.8, { opacity: 1 }), frame(1, 0, 0, 1.8, 1.8, { opacity: 1 })], frame(0, 15, 0, 1.8, 1.8, { opacity: .5 })),
    ],
    'shared-element': [track(0, [frame(0, -82, 0, .8), frame(.15, -82, 0, .8, .8, { easing: 'cubic-bezier(.65,0,.35,1)' }), frame(.85, 57, 0, 2.25), frame(1, 57, 0, 2.25)])],
  };

  let speed = 1;
  const states = [];
  function reset(state) {
    window.clearTimeout(state.timer);
    state.animations.forEach(animation => animation.cancel());
    state.animations = [];
    cancelAnimationFrame(state.raf);
    state.raf = null;
    if (state.renderer) state.renderer.draw(state.progress);
    if (state.scrubber) state.scrubber.value = Math.round(state.progress * 100);
    state.button.classList.remove('is-playing');
  }
  function shouldLoop(state) {
    return !reduced.matches && (state.hovered || state.button.matches(':focus-visible'));
  }
  function play(state) {
    reset(state);
    if (document.hidden || !state.visible || state.article.hidden || (!state.renderer && !state.tracks.length)) return;
    state.button.classList.add('is-playing');
    if (state.renderer) {
      const duration = state.renderer.duration / speed;
      let started;
      const tick = now => {
        if (started === undefined) started = now;
        const progress = Math.min(1, (now - started) / duration);
        state.renderer.draw(progress);
        if (state.scrubber) state.scrubber.value = Math.round(progress * 100);
        if (progress < 1) state.raf = requestAnimationFrame(tick);
        else {
          state.raf = null;
          state.timer = window.setTimeout(() => {
            if (shouldLoop(state)) play(state);
            else reset(state);
          }, 450 / speed);
        }
      };
      state.raf = requestAnimationFrame(tick);
      return;
    }
    state.animations = state.tracks.map(({ dot, frames }) =>
      state.dots[dot].animate(frames, { duration: 1800 / speed, fill: 'both' }));
    const current = state.animations[0];
    current.finished.then(() => {
      if (state.animations[0] !== current) return;
      state.timer = window.setTimeout(() => {
        if (shouldLoop(state)) play(state);
        else reset(state);
      }, 450 / speed);
    }).catch(() => {}); // Cancellation is expected on exit, filtering, or replay.
  }
  document.querySelectorAll('.study').forEach(article => {
    const button = article.querySelector('.stage');
    const dots = [...button.querySelectorAll('.dot')];
    const tracks = studies[article.dataset.technique] || [];
    const renderer = createScene(article.dataset.technique, button.querySelector('canvas'));
    const scrubber = article.querySelector('input[type="range"]');
    tracks.forEach(({ dot, idle }) => {
      for (const [key, value] of Object.entries(idle)) {
        if (key !== 'offset' && key !== 'easing') dots[dot].style[key] = value;
      }
    });
    const state = { article, button, dots, tracks, renderer, scrubber, progress: 0,
      animations: [], timer: null, raf: null, hovered: false, visible: true };
    if (renderer) renderer.draw(0);
    if (scrubber) {
      scrubber.addEventListener('input', () => {
        state.progress = Number(scrubber.value) / 100;
        reset(state);
      });
    }
    states.push(state);
    button.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch' || !hover.matches) return;
      state.hovered = true;
      if (!reduced.matches) play(state);
    });
    button.addEventListener('pointerleave', () => {
      state.hovered = false;
      if (!button.matches(':focus-visible')) reset(state);
    });
    button.addEventListener('focus', () => {
      if (!reduced.matches && button.matches(':focus-visible')) play(state);
    });
    button.addEventListener('blur', () => { if (!state.hovered) reset(state); });
    button.addEventListener('click', () => play(state));
  });
  /* Filtering animates with a view transition where supported: studies that
     stay glide to their new grid positions, the rest fade out or in (see
     motion.css). Each study gets a view-transition-name only for the length of
     the transition. Without support, or with reduced motion, it's instant. */
  let filterTransition = null;
  function applyFilter(category) {
    states.forEach(state => {
      reset(state);
      state.hovered = false;
      state.article.hidden = category !== 'all' && state.article.dataset.category !== category;
    });
  }
  document.querySelectorAll('.filter').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
      const category = button.dataset.filter;
      if (!document.startViewTransition || reduced.matches) {
        applyFilter(category);
        return;
      }
      states.forEach((state, i) => { state.article.style.viewTransitionName = `study-${i}`; });
      const transition = document.startViewTransition(() => applyFilter(category));
      filterTransition = transition;
      transition.finished.finally(() => {
        // A quick second click skips this transition; leave the names for the new one.
        if (filterTransition !== transition) return;
        states.forEach(state => { state.article.style.viewTransitionName = ''; });
      });
    });
  });
  document.querySelector('.speed-control').addEventListener('click', event => {
    speed = speed === 1 ? .5 : 1;
    event.currentTarget.setAttribute('aria-pressed', String(speed === .5));
    states.forEach(state => { if (state.button.classList.contains('is-playing')) play(state); });
  });
  function updateMotionPreference() {
    document.querySelector('.reduced-note').hidden = !reduced.matches;
    states.forEach(reset);
  }
  reduced.addEventListener('change', updateMotionPreference);
  updateMotionPreference();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const state = states.find(item => item.button === entry.target);
      state.visible = entry.isIntersecting;
      if (!state.visible) reset(state);
    });
  });
  states.forEach(state => observer.observe(state.button));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) states.forEach(reset);
  });
})();
