// Randomize each blob's animation phase so the page never opens
// on the same frame twice.
(function () {
  const circles = [
    { el: document.querySelector(".circle-1"), duration: 64 },
    { el: document.querySelector(".circle-2"), duration: 82 },
  ];
  circles.forEach(({ el, duration }) => {
    if (!el) return;
    el.style.animationDelay = `-${Math.random() * duration}s`;
  });
})();

// Nav scroll behavior:
// - Adds a subtle border once the page scrolls past 8px.
// - Reveals the centered "Bryan Rea" title once the hero h1 scrolls out of
//   view. On pages without a hero (post pages, subpages), shows it immediately.
(function () {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  // Observe the big hero h1 if present. Using header.hero h1 means the
  // swap fires the moment the name leaves the viewport, not the whole hero.
  const hero = document.querySelector("header.hero h1");

  function updateScrolled() {
    nav.classList.toggle("site-nav--scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", updateScrolled, { passive: true });
  updateScrolled();

  if (hero && "IntersectionObserver" in window) {
    const navHeight =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--nav-height")
        .trim() || "56px";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          nav.classList.toggle("site-nav--title-visible", !entry.isIntersecting);
        });
      },
      { rootMargin: "-" + navHeight + " 0px 0px 0px", threshold: 0 }
    );
    observer.observe(hero);
  } else {
    // No hero on this page — show nav title and border immediately.
    nav.classList.add("site-nav--title-visible", "site-nav--scrolled");
  }
})();
