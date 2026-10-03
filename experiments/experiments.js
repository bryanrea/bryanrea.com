// Make each index row clickable without wrapping it in a link, so its text
// stays selectable. The title holds the real <a> (keyboard, screen readers,
// and no-JS all use that); a click anywhere else in the row follows it —
// unless the click just finished a text selection.
(function () {
  document.querySelectorAll(".experiment-entry").forEach((entry) => {
    const link = entry.querySelector("h2 a");
    if (!link) return;

    entry.addEventListener("click", (event) => {
      if (event.target.closest("a")) return; // the link handles itself
      if (window.getSelection().toString()) return; // reader selected text

      // Keep cmd/ctrl-click opening a new tab, as it would on a real link.
      if (event.metaKey || event.ctrlKey) {
        window.open(link.href, "_blank", "noopener");
      } else {
        link.click();
      }
    });
  });
})();
