// Light/dark toggle shared by index.html and birds.html.
// Each page sets data-theme early from localStorage (inline in <head>) to avoid a flash;
// this file wires up .theme-toggle buttons and fades smoothly between themes.
(function () {
  var root = document.documentElement;
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function current() {
    var t = root.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t;
    return darkQuery.matches ? 'dark' : 'light';
  }

  function syncButtons() {
    var dark = current() === 'dark';
    document.querySelectorAll('.theme-toggle').forEach(function (b) {
      b.setAttribute('aria-pressed', String(dark));
      b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      b.title = dark ? 'Light mode' : 'Dark mode';
    });
  }

  function apply(next) {
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncButtons();
    document.dispatchEvent(new CustomEvent('themechange', { detail: next }));
  }

  // Fade the whole page into the new theme (see "Theme change" in fieldnotes.css).
  function toggle() {
    var next = current() === 'dark' ? 'light' : 'dark';
    if (reduceQuery.matches) { apply(next); return; }
    if (document.startViewTransition) {
      document.startViewTransition(function () { apply(next); });
      return;
    }
    root.classList.add('theme-fading');
    apply(next);
    window.setTimeout(function () { root.classList.remove('theme-fading'); }, 550);
  }

  document.querySelectorAll('.theme-toggle').forEach(function (b) {
    b.addEventListener('click', toggle);
  });
  darkQuery.addEventListener('change', function () {
    syncButtons();
    document.dispatchEvent(new CustomEvent('themechange', { detail: current() }));
  });
  syncButtons();

  window.siteTheme = { current: current };
})();
