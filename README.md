# Yassine Ait Elhrdouf | Portfolio

Personal portfolio built with **Vite**, **Three.js**, **GSAP** and **Lenis**.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the build
```

## Deploy / SEO checklist

1. Set your real domain in `.env` → `VITE_SITE_URL=https://your-domain.com` (no trailing slash).
   It is used for the canonical URL, Open Graph tags, JSON-LD, `robots.txt` and `sitemap.xml`.
2. Deploy `dist/` (Vercel / Netlify / Firebase: build command `npm run build`, output `dist`).
3. Add the site to [Google Search Console](https://search.google.com/search-console), then submit
   `https://your-domain.com/sitemap.xml`.

## Structure

- `index.html`: all content is static HTML, so it's indexable without JavaScript
- `src/main.js`: smooth scroll, parallax, reveals, nav, cursor, music
- `src/three/scenes.js`: lazy-loaded 3D (procedural laptop hero, PC + brain models)
- `static/`: optimised public assets (Meshopt/WebP models, WebP screenshots, icons)
- `public/`, `musics/`, `libs/`, `font/`: legacy assets from the old version, not shipped in the build
