// Every page's address, built from the files in src/pages, so a new page is listed automatically. Empty while the site
// is hidden from search (before launch), since hidden pages must not be listed.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const indexable = import.meta.env.PUBLIC_ALLOW_INDEXING === 'true';
  const paths = !indexable ? [] : Object.keys(import.meta.glob('./**/index.astro'))
    .map((f) => f.replace(/^\.\//, '/').replace(/index\.astro$/, ''))
    .sort();
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`)
    .join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
