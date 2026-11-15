import { articleCategories, availableCategories, filterAndSortArticles, localize } from "./catalog.mjs";

const DICTIONARY = {
  en: {
    brand: "Setuptheca", socials: "Socials", skipContent: "Skip to content", contactLabel: "Contact email:",
    introTitle: "Get more out of your software.",
    introDescription: "Software reviews, useful features, and the finer points of customization.",
    catalogTitle: "All articles", sortLabel: "Sort by",
    sortNewest: "Newest first", sortOldest: "Oldest first", sortTitle: "Title A–Z",
    searchLabel: "Search articles", searchPlaceholder: "Search articles by name or topic...",
    showMore: "Show more articles", resetFilters: "Clear filters",
    noGuidesTitle: "Articles are on the way.",
    noGuidesDescription: "New stories and ideas are coming soon. Check back later.",
    noMatchesTitle: "No matching articles.",
    noMatchesDescription: "Try another search or clear the category filter.",
    loadErrorTitle: "The catalog couldn't be loaded.",
    loadErrorDescription: "Please refresh the page and try again.",
    count: (matching, total) => `${matching} of ${total} ${total === 1 ? "article" : "articles"}`,
    minRead: n => `${n} min read`,
    allCategories: "All topics",
    backToGuides: "← Back to articles", connectKicker: "STAY CONNECTED",
    socialsTitle: "Other platforms and projects.",
    socialsDescription: "Our channels, communities, and projects about software and customization.",
    pageTitles: { catalog: "Articles", socials: "Socials" },
    themeToDark: "Switch to dark theme", themeToLight: "Switch to light theme"
  },
  ru: {
    brand: "Настротека", socials: "Соцсети", skipContent: "Перейти к содержимому", contactLabel: "Почта для связи:",
    introTitle: "Раскрывай возможности софта.",
    introDescription: "Обзоры программ, полезные функции и тонкости настройки.",
    catalogTitle: "Все статьи", sortLabel: "Сортировка",
    sortNewest: "Сначала новые", sortOldest: "Сначала старые", sortTitle: "По названию А–Я",
    searchLabel: "Поиск статей", searchPlaceholder: "Поиск по названию или теме...",
    showMore: "Показать ещё", resetFilters: "Сбросить фильтры",
    noGuidesTitle: "Статьи скоро появятся.",
    noGuidesDescription: "Новые материалы скоро появятся. Загляни позже.",
    noMatchesTitle: "Ничего не найдено.",
    noMatchesDescription: "Попробуй другой запрос или сбрось фильтр категорий.",
    loadErrorTitle: "Не удалось загрузить каталог.",
    loadErrorDescription: "Обнови страницу и попробуй ещё раз.",
    count: (matching, total) => `${matching} из ${total} ${pluralRu(total, ["статьи", "статей", "статей"])}`,
    minRead: n => `${n} мин чтения`,
    allCategories: "Все темы",
    backToGuides: "← Ко всем статьям", connectKicker: "НА СВЯЗИ",
    socialsTitle: "Другие платформы и проекты.",
    socialsDescription: "Наши каналы, сообщества и проекты о программах и их настройке.",
    pageTitles: { catalog: "Статьи", socials: "Соцсети" },
    themeToDark: "Включить тёмную тему", themeToLight: "Включить светлую тему"
  }
};

const ICONS = {
  code: '<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-6 4 4-16"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3m5 0h5"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  puzzle: '<path d="M8 4H4v6a2 2 0 1 1 0 4v6h6a2 2 0 1 1 4 0h6v-6a2 2 0 1 1 0-4V4h-6a2 2 0 1 1-4 0H8Z"/>',
  window: '<rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="M2.5 9h19M7 6.5h.1m3 0h.1"/>',
  shield: '<path d="m12 2 8 3v6c0 5-3 9-8 11-5-2-8-6-8-11V5l8-3Z"/><path d="m9 12 2 2 4-4"/>',
  sync: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 9a7 7 0 0 1 12-2l2 5M4 12l2 5a7 7 0 0 0 12-2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19 13a7.7 7.7 0 0 0 0-2l2-1.3-2-3.4-2.3 1a8 8 0 0 0-1.7-1L14.7 4h-4L10 6.3a8 8 0 0 0-1.7 1l-2.3-1-2 3.4L6 11a8 8 0 0 0 0 2l-2 1.3 2 3.4 2.3-1a8 8 0 0 0 1.7 1l.7 2.3h4l.3-2.3a8 8 0 0 0 1.7-1l2.3 1 2-3.4-2-1.3Z"/>',
  folder: '<path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  book: '<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15"/>'
};

const STROKE_SVG_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
const STAR_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><path fill="currentColor" d="M50 3 59.5 40.5 97 50 59.5 59.5 50 97 40.5 59.5 3 50 40.5 40.5Z"/></svg>';
const CALENDAR_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/></svg>';
const CLOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';

const SOCIALS = [
  { platform: "YouTube", handle: "@setuptheca", language: "en", icon: "youtube", url: "https://www.youtube.com/@setuptheca" },
  { platform: "YouTube", handle: "@настротека", language: "ru", icon: "youtube", url: "https://www.youtube.com/@%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D1%82%D0%B5%D0%BA%D0%B0" },
  { platform: "Telegram", handle: "@setuptheca", language: "en", icon: "telegram", url: "https://t.me/setuptheca" },
  { platform: "Telegram", handle: "@nastroteka", language: "ru", icon: "telegram", url: "https://t.me/nastroteka" },
  { platform: "RUTUBE", handle: "Настротека", language: "ru", icon: "rutube", url: "https://rutube.ru/channel/83173107/" },
  { platform: "VK", handle: "Настротека", language: "ru", icon: "vk", url: "https://vk.ru/nastroteka" },
  { platform: "Дзен", handle: "Настротека", language: "ru", icon: "dzen", url: "https://dzen.ru/id/6af8e65e7987140c761d5514" }
];

const COVERS_RU = {
  "cpp-vscode": "VS Code\nC / C++",
  "cmake-ninja": "CMake\n+ Ninja",
  "git-workflow": "Git\nВетки",
  "vscode-extensions": "VS Code\nПлагины",
  "windows-taskbar": "Windows\nПанель задач",
  "backup-strategy": "Резервные\nкопии",
  "ssh-github": "SSH\n+ GitHub",
  "syncthing-basics": "Syncthing\nСинхронизация",
  "nixos-config": "NixOS\nНастройки",
  "gdb-debugging": "GDB\nОтладка",
  "app-themes": "Тёмная\nтема",
  "browser-extension-safety": "Безопасность\nбраузера",
  "powershell-profile": "PowerShell\nПрофиль",
  "wsl-project-folders": "WSL\nПроекты",
  "obsidian-markdown": "Obsidian\nЗаметки",
  "remote-wsl": "Remote\nWSL",
  "syncthing-vpn": "VPN\n+ Sync",
  "terminal-prompt": "Терминал\nПод себя"
};

const page = document.body.dataset.page || "catalog";
const state = {
  locale: getStored("setuptheca.locale", "en") === "ru" ? "ru" : "en",
  theme: getStored("setuptheca.theme.v2", "dark") === "light" ? "light" : "dark",
  articles: [], query: "", selectedCategories: new Set(), sort: "newest", visible: 12, loadFailed: false
};

function getStored(key, fallback) {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

function setStored(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Browsing without storage still works. */ }
}

function pluralRu(n, forms) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

function t(key) { return DICTIONARY[state.locale][key]; }

function el(tag, className = "", text = null) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== null) node.textContent = text;
  return node;
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  setStored("setuptheca.theme.v2", theme);
  const button = document.getElementById("themeButton");
  const label = theme === "dark" ? t("themeToLight") : t("themeToDark");
  if (button) { button.setAttribute("aria-label", label); button.title = label; }
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#151C28" : "#F5F3ED");
}

function setLanguage(locale) {
  if (state.locale !== locale) state.selectedCategories.clear();
  state.locale = locale;
  document.documentElement.lang = locale;
  setStored("setuptheca.locale", locale);
  for (const element of document.querySelectorAll("[data-i18n]")) {
    const value = t(element.dataset.i18n);
    if (typeof value === "string") element.textContent = value;
  }
  for (const button of document.querySelectorAll(".language-button")) {
    button.setAttribute("aria-pressed", String(button.dataset.lang === locale));
  }
  document.querySelector(".language-switch")?.setAttribute("aria-label", locale === "ru" ? "Язык" : "Language");
  document.querySelector(".header-nav")?.setAttribute("aria-label", locale === "ru" ? "Главная навигация" : "Main navigation");
  document.querySelector(".brand")?.setAttribute("aria-label", `${t("brand")}, ${locale === "ru" ? "главная" : "home"}`);
  document.title = `${t("pageTitles")[page] || t("pageTitles").article} · ${t("brand")}`;
  const search = document.getElementById("searchInput");
  if (search) search.placeholder = t("searchPlaceholder");
  document.getElementById("categoryFilters")?.setAttribute("aria-label", locale === "ru" ? "Фильтр по категориям" : "Filter by category");
  document.getElementById("resetFilters")?.replaceChildren(document.createTextNode(t("resetFilters")));
  setTheme(state.theme);
  if (page === "catalog") { renderCategories(); renderCatalog(); }
  if (page === "socials") renderSocials();
}

function formatDate(iso) {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(state.locale === "ru" ? "ru-RU" : "en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC"
  }).format(date);
}

function visibleArticles() {
  return state.articles.filter(article => !article.language || article.language === "both" || article.language === state.locale);
}

function createCover(article, index = 0) {
  if (article.coverImage) {
    const media = el('div', 'card-media has-cover-image');
    const img = document.createElement('img');
    img.src = article.coverImage;
    img.alt = '';
    img.loading = 'lazy';
    media.append(img);
    return media;
  }
  const cover = el("div", `card-media variant-${["dark", "deep", "light", "paper"].includes(article.style) ? article.style : "dark"}`);
  cover.setAttribute("aria-hidden", "true");
  const top = el("div", "cover-top");
  top.append(el("span", "", "SETUPTHECA"), el("span", "cover-number", String(index + 1).padStart(3, "0")));
  const middle = el("div", "cover-middle");
  middle.append(el("span", "cover-title", state.locale === "ru" && COVERS_RU[article.id] ? COVERS_RU[article.id] : localize(article.cover, state.locale)));
  const icon = el("span", "cover-symbol");
  icon.innerHTML = `${STROKE_SVG_OPEN}${ICONS[article.icon] || ICONS.code}</svg>`;
  middle.append(icon);
  const bottom = el("div", "cover-bottom");
  bottom.append(el("span", "", `${articleCategories(article).join(" · ").toUpperCase()} / ${article.date.slice(0, 4)}`));
  const star = el("span", "cover-spark");
  star.innerHTML = STAR_SVG;
  bottom.append(star);
  cover.append(top, middle, bottom);
  return cover;
}

function createCard(article, index) {
  const card = el("article", "guide-card");
  const anchor = el("a");
  anchor.href = article.href;
  anchor.setAttribute("aria-label", localize(article.title, state.locale));
  anchor.append(createCover(article, index));
  const body = el("div", "card-body");
  body.append(el("p", "card-category", articleCategories(article).join(" · ")));
  body.append(el("h3", "card-title", localize(article.title, state.locale)));
  body.append(el("p", "card-description", localize(article.description, state.locale)));
  const meta = el("div", "card-meta");
  const date = el("span");
  date.innerHTML = CALENDAR_SVG;
  date.append(document.createTextNode(formatDate(article.date)));
  const time = el("span");
  time.innerHTML = CLOCK_SVG;
  time.append(document.createTextNode(t("minRead")(article.minutes || 5)));
  meta.append(date, time);
  body.append(meta);
  anchor.append(body);
  card.append(anchor);
  return card;
}

function renderCategories() {
  const filters = document.getElementById("categoryFilters");
  if (!filters) return;
  const categories = availableCategories(visibleArticles(), state.locale);
  for (const selected of state.selectedCategories) {
    if (!categories.includes(selected)) state.selectedCategories.delete(selected);
  }
  filters.hidden = categories.length === 0;
  if (!categories.length) { filters.replaceChildren(); return; }

  const all = el("button", "category-button", t("allCategories"));
  all.type = "button";
  all.setAttribute("aria-pressed", String(state.selectedCategories.size === 0));
  all.addEventListener("click", () => {
    state.selectedCategories.clear(); state.visible = 12;
    renderCategories(); renderCatalog();
  });
  const nodes = categories.map(category => {
    const button = el("button", "category-button", category);
    button.type = "button";
    button.setAttribute("aria-pressed", String(state.selectedCategories.has(category)));
    button.addEventListener("click", () => {
      if (state.selectedCategories.has(category)) state.selectedCategories.delete(category);
      else state.selectedCategories.add(category);
      state.visible = 12; renderCategories(); renderCatalog();
    });
    return button;
  });
  filters.replaceChildren(all, ...nodes);
}

function renderCatalog() {
  const grid = document.getElementById("cardsGrid");
  if (!grid) return;
  const available = visibleArticles();
  const matches = filterAndSortArticles(available, {
    query: state.query, categories: [...state.selectedCategories], sort: state.sort, locale: state.locale
  });
  document.getElementById("resultsCount").textContent = t("count")(matches.length, available.length);
  const empty = document.getElementById("emptyState");
  const more = document.getElementById("loadMoreWrap");
  empty.hidden = matches.length > 0 && !state.loadFailed;
  more.hidden = matches.length <= state.visible;
  const reset = document.getElementById("resetFilters");
  reset.hidden = !(state.query || state.selectedCategories.size > 0) || state.loadFailed;

  if (!empty.hidden) {
    const isNoGuides = !available.length && !state.loadFailed;
    const key = state.loadFailed ? "loadError" : (isNoGuides ? "noGuides" : "noMatches");
    document.getElementById("emptyTitle").textContent = t(`${key}Title`);
    document.getElementById("emptyDescription").textContent = t(`${key}Description`);
  }

  grid.replaceChildren(...matches.slice(0, state.visible).map((article, index) => createCard(article, index)));
}

function renderSocials() {
  const grid = document.getElementById("socialGrid");
  if (!grid) return;
  const cards = SOCIALS.filter(social => social.language === state.locale).map(social => {
    const link = el("a", "social-card");
    link.href = social.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `${social.platform}, ${social.handle}`);
    const logo = el("span", "social-logo");
    for (const theme of ["light", "dark"]) {
      const image = el("img", `social-logo-${theme}`);
      image.src = `./assets/socials/${social.icon}-${theme}.svg`;
      image.alt = "";
      image.width = 52;
      image.height = 52;
      image.setAttribute("aria-hidden", "true");
      logo.append(image);
    }
    link.append(logo);
    const body = el("span", "social-content");
    body.append(el("strong", "", social.platform), el("span", "", social.handle));
    link.append(body);
    const arrow = el("span", "social-arrow");
    arrow.innerHTML = `${STROKE_SVG_OPEN}<path d="M6 18 18 6M8 6h10v10"/></svg>`;
    link.append(arrow);
    return link;
  });
  grid.replaceChildren(...cards);
}

async function loadArticles() {
  try {
    const response = await fetch("./data/articles.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.articles = Array.isArray(data) ? data : (Array.isArray(data.articles) ? data.articles : []);
  } catch (error) {
    console.error("Could not load the article catalog:", error);
    state.loadFailed = true;
  }
  if (page === "catalog") { renderCategories(); renderCatalog(); }
}

function initialize() {
  document.getElementById("copyrightYear").textContent = new Date().getFullYear();
  document.getElementById("themeButton")?.addEventListener("click", () => setTheme(state.theme === "light" ? "dark" : "light"));
  for (const button of document.querySelectorAll(".language-button")) {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  }

  if (page === "catalog") {
    const search = document.getElementById("searchInput");
    search.addEventListener("input", () => { state.query = search.value; state.visible = 12; renderCatalog(); });
    document.getElementById("sortSelect").addEventListener("change", event => { state.sort = event.target.value; renderCatalog(); });
    document.getElementById("loadMoreButton").addEventListener("click", () => { state.visible += 9; renderCatalog(); });
    document.getElementById("resetFilters").addEventListener("click", () => {
      search.value = ""; state.query = ""; state.selectedCategories.clear(); state.visible = 12;
      renderCategories(); renderCatalog(); search.focus();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "/" && !event.ctrlKey && !event.metaKey && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
        event.preventDefault(); search.focus();
      }
      if (event.key === "Escape" && document.activeElement === search) {
        search.value = ""; state.query = ""; state.visible = 12; renderCatalog();
      }
    });
  }

  setLanguage(state.locale);
  if (page === "catalog") void loadArticles();
}

initialize();

