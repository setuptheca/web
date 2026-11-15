# Setuptheca website

Static, bilingual Setuptheca / Настротека website for GitHub Pages.

## Preview locally

Run a static HTTP server in this directory, for example:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. Opening `index.html` directly from the file system will not load the JSON catalog in most browsers.

## Content

`data/articles.json` contains the catalog. It currently includes **18 illustrative demo articles** so the layout, scrolling, language switching, search, sorting, category filtering, and load-more control can be tested. The linked article pages are explicitly labeled as previews, not published guides.

Before going live with real articles:

1. Replace the demo entries with actual article metadata, or change `"demo": true` to `false` when every entry has a real destination.
2. For each real article, provide its `id`, `date` (ISO `YYYY-MM-DD`), `category`, `minutes`, localized `title` and `description`, and optional `tags`, `cover`, `icon`, and `style`.
3. Update the card URL handling in `assets/app.js` when actual guide pages are available. Demo cards currently open `article.html?id=...`.

All public pages are deliberately static and require no server, database, or paid API. The only persisted state is the visitor's optional language and color-theme preference in local storage.

## GitHub Pages

Under the repository's **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`. The canonical project-site path will normally be `https://setuptheca.github.io/web/` unless a custom domain is configured.

Use relative paths (`./assets/…`) so the pages work in the `/web/` subpath.

Brand assets `logo-light.svg`, `logo-dark.svg`, and `star.svg` are adapted from the project's existing private brand files. The color tokens match the project's Paper Blue design system.
