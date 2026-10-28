import { defineConfig } from 'astro/config';
// Address set to the vercel.app preview until the camp's domain moves here; change `site` on launch day.
export default defineConfig({ site: 'https://www.hideandseekdaycamp.net', trailingSlash: 'always', build: { format: 'directory' } });
