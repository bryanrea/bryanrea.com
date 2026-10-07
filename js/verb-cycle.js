// Home intro headline: steps through a run of verbs ("connect", "create",
// "learn"…) and rests on the last one ("thrive"). The words are stacked in
// one grid cell (see .verb-cycle in style.css); this only moves the
// .is-current / .is-leaving classes along. Skipped under reduced motion, so
// the markup's default — the last word — simply shows.
(function () {
  const cycle = document.querySelector("[data-verb-cycle]");
  if (!cycle) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const HOLD = 1200; // ms each word rests before the next arrives
  const SETTLE = 1000; // ms after the last word starts arriving before its underline draws
  const words = Array.from(cycle.children);
  let current = 0;

  // Start on the first word without animating away from the default.
  words.forEach((word, i) => word.classList.toggle("is-current", i === 0));

  function advance() {
    const leaving = words[current];
    current += 1;
    leaving.classList.remove("is-current");
    leaving.classList.add("is-leaving");
    const arriving = words[current];
    arriving.classList.add("is-current");
    if (current < words.length - 1) {
      setTimeout(advance, HOLD);
    } else {
      setTimeout(() => arriving.classList.add("is-landed"), SETTLE);
    }
  }

  // Enable transitions a frame after the silent reset above, then begin.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cycle.classList.add("is-ready");
      setTimeout(advance, HOLD);
    });
  });
})();
