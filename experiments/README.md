# Experiments

Small, standalone prototypes. Served as static files by the existing Nginx setup;
no dependencies or build step. Start a server from the repository root:

```sh
python3 -m http.server 8000
# http://localhost:8000/experiments/
```

## Motion studies

`/experiments/motion/` is a vocabulary of 48 studies, grouped into Timing,
Physics, Choreography, Transitions, Scroll, Spatial, Navigation, and Camera. Hover or keyboard-focus a stage to loop;
click/tap to replay. Slow motion plays at half speed. With reduced motion enabled,
only explicit click/Enter/Space plays a single cycle. Animations stop when their
stage leaves view or the browser tab is hidden. Spring and bounce are illustrative
keyframes rather than physical simulations.

- `motion/index.html`: readable definitions and use cases, available without JS.
- `motion/motion.js`: keyframes, playback, filtering, and speed control.
- `motion/scenes.js`: deterministic Canvas diagrams for scroll, navigation, spatial, and camera studies.
- `motion/motion.css`: study layout and experiment-only diagram colors.
- `experiments.css`: shared experiments layout; main site tokens come from `shared/`.

To add a study, add an article and matching keyframes keyed by `data-technique`,
or a renderer in `scenes.js`, and update the counts. For a new prototype, create a sibling folder with its own
`index.html` and add an entry to the experiments index.

## Local design conventions

Reuse the main site's typography, cream background, and crimson accent. Additional
teal and ochre colors distinguish circles inside diagrams only. Filters and speed
controls use native buttons, visible shared focus rings, pressed-state semantics,
hover borders, and active feedback. No disabled state is currently needed.

The experiments are omitted from the main navigation and sitemap and request
`noindex, nofollow`. This keeps them low-profile, not private: anyone with a URL
can visit them after deployment. No analytics script is loaded here.


## Expanded studies

The new groups retain circle-based subjects, with small viewport frames, surfaces,
and perspective grids where the context is essential to understanding the motion.

- **Scroll (6):** parallax, scrubbing, pinning, horizontal sequence, view reveal,
  and stacking. Hover simulates scrolling; a native range input gives direct,
  reversible control of the simulated scroll position. These are viewport
  diagrams, not scroll handlers attached to the library page. They do not capture
  the reader’s wheel or touch scrolling.
- **Spatial (6):** 3D flip, depth travel, carousel, exploded layers, particle field,
  and perspective tilt. These use projected 3D coordinates drawn with Canvas 2D.
- **Navigation (6):** push, cover, shared axis, fade through, container transform,
  and iris wipe. These illustrate view changes inside a small frame; they do not
  navigate away from the library.
- **Camera (12):** pan, tilt, truck, pedestal, dolly in, pull out, zoom, dolly zoom,
  orbit shot, roll, rack focus, and handheld. A shared world with subjects at
  different depths makes the distinctions visible. Dolly changes camera position;
  zoom changes focal length; dolly zoom compensates focal length to hold the red
  subject’s projected size constant. Rack focus illustrates a focus handoff with
  blur, not a physically accurate lens simulation.

WebGL is a rendering technology, not a motion principle. The simple 3D projection
here keeps the page dependency-free. Geometry, materials, lighting, or shader
experiments could later justify a WebGL renderer. Neither this page nor its
filters depend on an external service. Fonts are the same Google Fonts as the
main site.

Canvas scenes render once when idle and only schedule animation frames during
playback. Filtering, leaving the stage, reduced-motion preference changes, leaving
the viewport, and hiding the tab cancel playback. Scrubbing is an explicit action
and remains available with reduced motion. Half speed affects playback, not the
relationship between the slider and its diagram.

## References

This is a curated vocabulary, not a universal taxonomy. A technique can belong
to several contexts (parallax, for example, appears in both scrolling and camera
travel). Definitions, diagrams, and code are original; references inform the
terminology. No third-party assets or animation code are copied.

- [Codrops — A Collection of Page Transitions](https://tympanus.net/Development/PageTransitions/): a broad visual catalog of screen changes.
- [Material Components — Motion](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md): named navigation patterns, including shared axis, fade through, and container transform.
- [Bramus — Scroll-driven Animations](https://scroll-driven-animations.style/): runnable scroll examples and timeline tools.
- [Chrome — Scroll-driven Animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations): distinguishes scroll progress from view progress.
- [StudioBinder — Camera Movement](https://www.studiobinder.com/blog/different-types-of-camera-movements-in-film/): filmmaking terminology and film examples.
- [StudioBinder — Rack Focus](https://www.studiobinder.com/blog/rack-focus-shot-camera-movement-angles/): shifting focus as a way to direct attention.
- [Animista](https://animista.net/): an interactive library for exploring CSS animation variations.
