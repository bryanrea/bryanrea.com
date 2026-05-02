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

// Scroll behavior for the nav.
// - Add a subtle bottom border to the nav once the page has scrolled at all.
// - Reveal the centered "Bryan Rea" title once the hero (the big name at the
//   top) has scrolled out of view.
(function () {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  // Observe the big name itself, not the whole hero. The handoff is
  // "big mark out of view → small mark in nav" — anchoring on the h1
  // means it fires the moment the name actually leaves the viewport,
  // regardless of how tall the surrounding hero is.
  const hero = document.querySelector("header.hero h1");

  function updateScrolled() {
    nav.classList.toggle("site-nav--scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", updateScrolled, { passive: true });
  updateScrolled();

  if (hero && "IntersectionObserver" in window) {
    // Offset the observation area by the nav height so the swap happens
    // as the hero passes UNDER the nav, not after it's fully off-screen.
    const navHeight =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--nav-height")
        .trim() || "56px";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          nav.classList.toggle(
            "site-nav--title-visible",
            !entry.isIntersecting
          );
        });
      },
      { rootMargin: "-" + navHeight + " 0px 0px 0px", threshold: 0 }
    );
    observer.observe(hero);
  } else {
    // No hero or no IntersectionObserver — just show the title.
    nav.classList.add("site-nav--title-visible", "site-nav--scrolled");
  }
})();
