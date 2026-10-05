// Light/dark toggle shared by index.html and birds.html.
// Each page sets data-theme early from localStorage (inline in <head>) to avoid a flash;
// this file wires up .theme-toggle buttons and switches themes instantly.
(function () {
  var root = document.documentElement;
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

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

  // Instant switch: pause transitions for one frame so every color flips at once.
  function toggle() {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.classList.add('theme-switching');
    apply(next);
    void root.offsetHeight;
    window.requestAnimationFrame(function () { root.classList.remove('theme-switching'); });
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
