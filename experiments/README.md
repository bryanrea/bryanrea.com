# Experiments

Small, standalone prototypes — things built to try ideas out. Plain static
files served by Nginx like the rest of the portfolio: no dependencies, no build
step.

```sh
# from the repository root
python3 -m http.server 8000
# http://localhost:8000/experiments/
```

## Conventions

- **Low-profile, not private.** Experiments are left out of the site nav and the
  sitemap and carry `<meta name="robots" content="noindex, nofollow">`. Anyone
  with the URL can still visit. No analytics.
- **Built on the site's foundations.** Every page loads `reset.css`,
  `shared/css/shared.css`, and `shared/js/main.js`, uses the standard site nav and
  animated background, and composes headings from `.display` / `.label`.
  `experiments.css` holds the layout all experiment pages share.
- **Free to bend the rules inside an experiment.** Form controls, canvas, extra
  diagram colors, and one-off layout are fine, scoped to the experiment's own
  folder. See §11 of `design.md`.

## Adding an experiment

1. Create a sibling folder (e.g. `experiments/sound/`) with its own `index.html`,
   starting from `motion/index.html`'s `<head>`, nav, and intro.
2. Put experiment-specific CSS/JS in that folder.
3. Add a numbered `.experiment-entry` to `experiments/index.html`. The link goes
   on the title (`<h2><a href="…">`); `experiments.js` makes the rest of the row
   clickable while keeping its text selectable.

## Motion studies (`motion/`)

A vocabulary of 48 studies in eight groups: Timing, Physics, Choreography,
Transitions, Scroll, Spatial, Navigation, and Camera.

- `index.html` — every study's definition and use case, readable without JS.
- `motion.js` — keyframes for the dot studies, playback, filtering, slow motion.
- `scenes.js` — Canvas 2D renderers for the scroll, spatial, navigation, and
  camera studies. Each is a pure function of progress (0–1), drawn only while
  playing.
- `motion.css` — toolbar, stage, and diagram styles.

**Behavior.** Hover or keyboard focus loops a study; click/tap replays it. Slow
motion plays at half speed. Scroll studies add a range input that scrubs the
simulated scroll position. With reduced motion on, nothing plays except an
explicit click/Enter/Space, which plays one cycle. Playback stops when a stage
leaves the viewport or the tab is hidden.

**Adding a study.** Add an `<article class="study">` with a `data-technique`
and `data-category`, then either keyframes under that key in `motion.js` or a
renderer in `scenes.js`. Update the "All" count.

**Accuracy notes.** Spring and bounce are illustrative keyframes, not physics
simulations. Rack focus fakes the focus shift with blur. The camera studies
share one scene with subjects at different depths so dolly, zoom, and dolly zoom
can be told apart.

### References

Definitions, diagrams, and code are original; these informed the terminology.

- [Codrops — A Collection of Page Transitions](https://tympanus.net/Development/PageTransitions/)
- [Material Components — Motion](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)
- [Bramus — Scroll-driven Animations](https://scroll-driven-animations.style/)
- [Chrome — Scroll-driven Animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
- [StudioBinder — Camera Movement](https://www.studiobinder.com/blog/different-types-of-camera-movements-in-film/)
- [StudioBinder — Rack Focus](https://www.studiobinder.com/blog/rack-focus-shot-camera-movement-angles/)
- [Animista](https://animista.net/)
