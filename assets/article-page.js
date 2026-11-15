const pageLocale = document.body.dataset.articleLocale || 'en';
let theme = 'dark';
try {
  localStorage.setItem('setuptheca.locale', pageLocale);
  theme = localStorage.getItem('setuptheca.theme.v2') === 'light' ? 'light' : 'dark';
} catch { /* Private browsing can disable storage. */ }

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  document.getElementById('themeButton')?.setAttribute('aria-label', theme === 'dark'
    ? (pageLocale === 'ru' ? 'Включить светлую тему' : 'Switch to light theme')
    : (pageLocale === 'ru' ? 'Включить тёмную тему' : 'Switch to dark theme'));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#151C28' : '#F5F3ED');
}
applyTheme();

document.getElementById('themeButton')?.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('setuptheca.theme.v2', theme); } catch { /* Ignore. */ }
  applyTheme();
});

document.querySelectorAll('.language-button').forEach(button => button.addEventListener('click', () => {
  const lang = button.dataset.lang;
  try { localStorage.setItem('setuptheca.locale', lang); } catch { /* Ignore. */ }
  window.location.assign(button.dataset.destination);
}));

const labels = pageLocale === 'ru' ? { copy: 'Копировать', copied: 'Скопировано' } : { copy: 'Copy', copied: 'Copied' };
document.querySelectorAll('.article-prose pre').forEach(block => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-code';
  button.textContent = labels.copy;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(block.querySelector('code')?.textContent || '');
      button.textContent = labels.copied;
      window.setTimeout(() => { button.textContent = labels.copy; }, 1500);
    } catch { button.textContent = labels.copy; }
  });
  block.append(button);
});

// Highlight the section currently near the reading position.
const tocLinks = [...document.querySelectorAll('.desktop-toc a[href^="#"]')];
const sections = tocLinks.map(link => ({ link, target: document.getElementById(decodeURIComponent(link.hash.slice(1))) })).filter(item => item.target);
const updateActiveSection = () => {
  const current = [...sections].reverse().find(item => item.target.getBoundingClientRect().top < 175) || sections[0];
  for (const item of sections) item.link.classList.toggle('is-active', item === current);
};
window.addEventListener('scroll', updateActiveSection, { passive: true });
updateActiveSection();

