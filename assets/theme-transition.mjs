const TRANSITION_MS = 320;
let transitionTimer;

export function animateThemeChange(changeTheme) {
  const root = document.documentElement;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    window.clearTimeout(transitionTimer);
    root.classList.remove('theme-changing');
    changeTheme();
    return;
  }

  root.classList.add('theme-changing');
  changeTheme();
  window.clearTimeout(transitionTimer);
  transitionTimer = window.setTimeout(() => root.classList.remove('theme-changing'), TRANSITION_MS + 40);
}
