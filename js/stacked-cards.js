// Home stacked cards: each sticky card shrinks and dims as later cards slide
// over it (off under prefers-reduced-motion). Also keeps cards that are
// taller than the viewport readable: such a card sticks with its bottom edge
// in view instead of its top, so it scrolls fully before the next one covers it.
(function () {
  const cards = Array.from(document.querySelectorAll("[data-card]"));
  if (cards.length < 2) return;

  const SCALE_STEP = 0.05; // scale lost per card stacked on top
  const DIM_STEP = 0.05; // brightness lost per card stacked on top

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let stickyTops = [];
  let frame = 0;

  // Each card's sticky `top` in px. Starts from the CSS stagger; a card too
  // tall to fit below it gets a (negative) top that pins its bottom edge
  // above the viewport's instead, leaving room for the gap and the next
  // card's peek (main.home's bottom padding is exactly that). Only changes
  // on resize and load, so it's cached rather than read every frame.
  function measure() {
    const vh = window.innerHeight;
    const reserve = parseFloat(getComputedStyle(cards[0].parentElement).paddingBottom) || 0;
    cards.forEach((card) => {
      card.style.top = "";
    });
    stickyTops = cards.map((card) => {
      const top = parseFloat(getComputedStyle(card).top) || 0;
      const fit = vh - card.offsetHeight - reserve;
      if (fit >= top) return top;
      card.style.top = `${fit}px`;
      return fit;
    });
  }

  function reset() {
    cards.forEach((card) => {
      card.style.transform = "";
      card.style.filter = "";
    });
  }

  function update() {
    frame = 0;
    if (reduceMotion.matches) {
      reset();
      return;
    }

    // How far each card has travelled from the viewport bottom to its sticky
    // top, 0..1. Read every rect before writing any style. Scaling from the
    // top edge (transform-origin in CSS) leaves the rect's top unchanged.
    const vh = window.innerHeight;
    const progress = cards.map((card, i) => {
      const travel = Math.max(1, vh - stickyTops[i]);
      const moved = vh - card.getBoundingClientRect().top;
      return Math.min(1, Math.max(0, moved / travel));
    });

    // A card's depth is the summed progress of every card after it.
    let depth = 0;
    for (let i = cards.length - 1; i >= 0; i--) {
      cards[i].style.transform = depth ? `scale(${(1 - SCALE_STEP * depth).toFixed(4)})` : "";
      cards[i].style.filter = depth ? `brightness(${(1 - DIM_STEP * depth).toFixed(3)})` : "";
      depth += progress[i];
    }
  }

  function queue() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  function remeasure() {
    measure();
    queue();
  }

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", remeasure);
  reduceMotion.addEventListener("change", remeasure);
  // Card heights shift as fonts and the portrait load (and on any reflow),
  // so re-measure whenever a card's size changes. measure() only touches
  // `top`, which doesn't resize the card, so this can't loop.
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(remeasure);
    cards.forEach((card) => observer.observe(card));
  } else {
    window.addEventListener("load", remeasure);
  }

  measure();
  update();
})();
