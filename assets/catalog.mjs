export const CATEGORIES = ["all", "development", "applications", "extensions", "systems", "security"];

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

export function filterAndSortArticles(articles, { query = "", category = "all", sort = "newest", locale = "en", categoryNames = {} } = {}) {
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
  const filtered = articles.filter(article => {
    if (category !== "all" && article.category !== category) return false;
    if (!words.length) return true;

    const searchable = normalizeSearch([
      localize(article.title, locale),
      localize(article.description, locale),
      localize(article.title, locale === "ru" ? "en" : "ru"),
      localize(article.description, locale === "ru" ? "en" : "ru"),
      categoryNames[article.category] || article.category,
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

