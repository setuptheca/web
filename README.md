# Setuptheca / Настротека

This repository contains the **built, static website** ready for GitHub Pages. The Astro project and editable article sources are maintained separately in the private project repository.

## Enable GitHub Pages

1. Open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`.
4. Click **Save**.

The project-site URL will be [https://setuptheca.github.io/web/](https://setuptheca.github.io/web/) once GitHub finishes publishing.

## Current content

- `index.html`: bilingual article catalog, initially empty
- `socials.html`: links to other platforms and projects
- `data/articles.json`: currently `{"articles":[]}`
- `assets/`: JavaScript, styles and graphics
- `sitemap.xml`: current public URLs

The website starts in dark mode, supports a light-mode switch, and uses the star favicon. No example articles or downloadable article files are published.

## Updating articles

Add the article's Markdown, images and downloadable files to the Astro source project, set `draft: false`, and rebuild with:

```bash
SITE_BASE=/web/ npm run build
npm run test
```

Copy **the contents of `dist/`** into the root of this repository, keeping `.nojekyll` and this README. Commit the updated site files and push to `main`.

Do not edit generated HTML to add articles: the source project creates matching RU/EN article pages and the JSON catalog automatically.
