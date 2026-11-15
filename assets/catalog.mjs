export function localize(value, locale = "en") {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  return value[locale] || value.en || value.ru || "";
}

export function normalizeSearch(value) {
  return String(value || "")
    .toLocaleLowerCase()
    .replace(/ё/g, "е")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function articleCategories(article) {
  const categories = Array.isArray(article.categories) ? article.categories : (article.category ? [article.category] : []);
  return [...new Set(categories.filter(value => typeof value === "string").map(value => value.trim()).filter(Boolean))];
}

export function availableCategories(articles, locale = "en") {
  return [...new Set(articles.flatMap(articleCategories))].sort((a, b) => a.localeCompare(b, locale));
}

export function filterAndSortArticles(articles, { query = "", categories = [], sort = "newest", locale = "en" } = {}) {
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
  const selected = new Set(categories);
  const filtered = articles.filter(article => {
    const articleCategoryNames = articleCategories(article);
    if (selected.size > 0 && !articleCategoryNames.some(category => selected.has(category))) return false;
    if (!words.length) return true;

    const searchable = normalizeSearch([
      localize(article.title, locale),
      localize(article.description, locale),
      localize(article.title, locale === "ru" ? "en" : "ru"),
      localize(article.description, locale === "ru" ? "en" : "ru"),
      ...articleCategoryNames,
      ...(Array.isArray(article.tags) ? article.tags : [])
    ].join(" "));

    return words.every(word => searchable.includes(word));
  });

  return filtered.sort((left, right) => {
    if (sort === "title") return localize(left.title, locale).localeCompare(localize(right.title, locale), locale);
    const dateComparison = String(right.date || "").localeCompare(String(left.date || ""));
    return sort === "oldest" ? -dateComparison : dateComparison;
  });
}

