import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'node:path';

// Generates robots.txt + sitemap.xml at build time from VITE_SITE_URL,
// so the canonical domain lives in exactly one place (.env).
function seoFiles(siteUrl) {
  const base = siteUrl.replace(/\/+$/, '');
  const today = new Date().toISOString().slice(0, 10);
  return {
    name: 'seo-files',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: /thanks.html\n\nSitemap: ${base}/sitemap.xml\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `  <url>\n    <loc>${base}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n` +
          `</urlset>\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // The legacy `public/` folder holds the old 35 MB of unoptimised assets;
    // only the optimised copies in `static/` are shipped.
    publicDir: 'static',
    plugins: [seoFiles(env.VITE_SITE_URL || 'https://elhrdouf-cv.vercel.app')],
    build: {
      target: 'es2020',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          thanks: resolve(__dirname, 'thanks.html'),
        },
        output: {
          manualChunks: { three: ['three'] },
        },
      },
    },
  };
});
