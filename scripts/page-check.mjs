#!/usr/bin/env node
// Bope OS page checker (2026-10-09, Jeane: "make this not happen again"). Every page on every site must pass before
// it ships. Master copy: ~/agency-brain/page-check/page-check.mjs; each site carries a copy at scripts/page-check.mjs
// (sync with `node page-check.mjs --sync`) and runs it after `astro build`. No dependencies.
//   node page-check.mjs dist <dir>                      check every built page (build gate; exit 1 on errors when mode=block)
//   node page-check.mjs sitemap <https://site/> [--render]  check every live page in the sitemap; --render loads each in
//                                                          Chrome first so embeds (Termageddon, forms) are checked too
// Site settings: .page-check.json in the repo root: { "ga": "G-XXXX", "mode": "warn"|"block", "skip": ["/qr/"], "allow": ["/disclaimer/: heading \"disclaimer\""] }
import fs from 'node:fs';
import path from 'node:path';

const strip = (h) => h.replace(/<(script|style|svg|noscript|template)\b[\s\S]*?<\/\1>/gi, '').replace(/<!--[\s\S]*?-->/g, '')
  // content marked hidden (e.g. the blog grid's copy of the featured post, shown only when filtering) is not read by visitors,
  // screen readers or search engines as page content
  .replace(/<(article|div|section|li|aside)\b[^>]*\shidden(?:=["'][^"']*["'])?(?=[\s>])[^>]*>[\s\S]*?<\/\1>/gi, '');
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;|&#x27;/g, "'").replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const norm = (s) => text(s).toLowerCase().replace(/[.!?:;,'"’“”]+/g, '').trim();
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i')); return m ? (m[2] ?? m[3]) : null; };

export function checkHtml(raw, where, cfg = {}) {
  const E = [], W = [], err = (m) => E.push(m), warn = (m) => W.push(m);
  const noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(raw);
  if (/http-equiv=["']refresh["']/i.test(raw)) return { E, W, redirect: true };
  const html = strip(raw);
  const title = (raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  const desc = attr((raw.match(/<meta[^>]+name=["']description["'][^>]*>/i) || [''])[0], 'content');
  const canon = attr((raw.match(/<link[^>]+rel=["']canonical["'][^>]*>/i) || [''])[0], 'href');
  const h = [...html.matchAll(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ lvl: +m[1], t: text(m[3]), n: norm(m[3]) }));
  const h1 = h.filter((x) => x.lvl === 1);
  if (!title || !text(title)) err('no <title>');
  if (h1.length === 0) err('no H1');
  if (h1.length > 1) err(`${h1.length} H1s: ${h1.map((x) => `"${x.t}"`).join(', ')} (one per page)`);
  // the same words used for more than one heading on the page (e.g. H1 "Disclaimer." and H2 "Disclaimer")
  const seen = {};
  for (const x of h.filter((x) => x.lvl <= 3 && x.n)) (seen[x.n] = seen[x.n] || []).push(`H${x.lvl}`);
  for (const [n, lv] of Object.entries(seen)) if (lv.length > 1) err(`heading "${n}" is used ${lv.length} times (${lv.join(', ')})`);
  // a small label right above the H1 that just repeats it
  for (const m of html.matchAll(/<[^>]+class=["'][^"']*(eyebrow|kicker|overline)[^"']*["'][^>]*>([\s\S]*?)<\/[a-z0-9]+>/gi))
    if (!/^<h1\b/i.test(m[0]) && h1[0] && norm(m[2]) && norm(m[2]) === h1[0].n) err(`label above the H1 repeats it ("${text(m[2])}")`);
  if (h1[0] && title && norm(title).split('|')[0].trim() === h1[0].n && norm(title).split('|')[0].trim().split(' ').length < 2) warn(`title and H1 are the same single word ("${h1[0].t}")`);
  if (!noindex && canon && cfg.selfUrl) { try { const c = new URL(canon), u = new URL(cfg.selfUrl, c);
    if (c.pathname !== u.pathname) err(`canonical points to ${c.pathname}, not this page's own address ${u.pathname}`); } catch {} }
  if (!noindex) {
    if (!desc) err('no meta description'); else if (desc.length < 70 || desc.length > 165) warn(`meta description is ${desc.length} characters (aim for 70-160)`);
    if (!canon) err('no canonical link');
    if (title && text(title).length > 65) warn(`title is ${text(title).length} characters (Google shows about 60)`);
    if (!/application\/ld\+json/i.test(raw)) warn('no structured data (JSON-LD)');
  }
  // alt="" (or a bare `alt`, how Preact writes it) marks a decorative image and is correct; only a missing alt is an error
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) if (attr(m[0], 'alt') === null && !/\salt(?=[\s/>])/i.test(m[0])) err(`image without alt text: ${(attr(m[0], 'src') || '').slice(0, 80)}`);
  if (cfg.ga && !raw.includes(cfg.ga)) err(`Google Analytics tag ${cfg.ga} missing`);
  // one address per page (Kalkare audit, 2026-10-09): internal links must use the site's form with the ending slash, so no
  // link goes through a redirect and Google never sees two versions of a page
  if (cfg.trailingSlash !== false) {
    const bad = new Set();
    for (const m of html.matchAll(/<a\b[^>]*\shref=["'](\/[^"'#?]*)([?#][^"']*)?["']/gi)) {
      const p = m[1];
      if (p !== '/' && !p.endsWith('/') && !/\.[a-z0-9]{2,5}$/i.test(p) && !p.startsWith('/api/') && !p.startsWith('/_')) bad.add(p);
    }
    if (bad.size) err(`links without the ending slash (each goes through a redirect): ${[...bad].slice(0, 6).join(', ')}${bad.size > 6 ? ` and ${bad.size - 6} more` : ''}`);
  }
  // skipped heading levels (H2 straight to H4) confuse screen readers and outline parsers
  for (let i = 1; i < h.length; i++) if (h[i].lvl > h[i - 1].lvl + 1) { warn(`heading jumps from H${h[i - 1].lvl} to H${h[i].lvl} ("${h[i].t.slice(0, 50)}")`); break; }
  return { E, W, noindex, title: title && text(title), desc, heads: [...new Set(h.filter((x) => x.n).map((x) => x.n))] };
}

function siteDupes(results) {
  const out = [];
  // a heading on (nearly) every page comes from a shared piece (header, footer, pop-up, banner): shared pieces must use
  // plain labels, or every page's outline gets the same extra headings (the Kalkare holiday pop-up, 2026-10-09)
  const pages = results.filter((r) => r.heads), cnt = {};
  for (const r of pages) for (const n of r.heads) cnt[n] = (cnt[n] || 0) + 1;
  // reported as a note (warn) not an error: a shared real section (reviews band, call to action) correctly keeps its heading;
  // menu-style labels (footer columns) and pop-up titles should not be headings. Decide per piece; approved ones go in `allow`.
  if (pages.length >= 5) for (const [n, c] of Object.entries(cnt)) if (c / pages.length >= 0.6) out.push({ warn: true, m: `heading "${n}" is on ${c} of ${pages.length} pages (shared piece): fine for a real section like reviews or a call to action; menu labels and pop-up titles should be plain labels` });
  const by = (k) => { const m = {}; for (const r of results) if (!r.noindex && r[k]) (m[r[k]] = m[r[k]] || []).push(r.where); return m; };
  for (const [k, label] of [['title', 'title'], ['desc', 'meta description']]) for (const [v, ws] of Object.entries(by(k))) if (ws.length > 1) out.push(`same ${label} on ${ws.length} pages ("${v.slice(0, 60)}"): ${ws.join(', ')}`);
  return out;
}
function report(results, cfg) {
  // allow: exceptions Jeane approved, as text matched against "<page>: <error>" (e.g. '/disclaimer/: heading "disclaimer"')
  const ok = (w, m) => (cfg.allow || []).some((a) => `${w}: ${m}`.includes(a));
  for (const r of results) { const kept = r.E.filter((m) => !ok(r.where, m)); if (kept.length < r.E.length) r.W.push(...r.E.filter((m) => ok(r.where, m)).map((m) => `allowed by Jeane: ${m}`)); r.E = kept; }
  let errors = 0, warns = 0; const lines = [];
  for (const r of results) { if (!r.E.length && !r.W.length) continue; errors += r.E.length; warns += r.W.length;
    lines.push(`\n${r.where}`); r.E.forEach((m) => lines.push(`  ERROR  ${m}`)); r.W.forEach((m) => lines.push(`  warn   ${m}`)); }
  const d = siteDupes(results).filter((x) => !(cfg.allow || []).some((a) => (x.m || x).includes(a)));
  d.forEach((x) => { if (x.warn) { warns++; lines.push(`\nSITE  warn   ${x.m}`); } else { errors++; lines.push(`\nSITE  ERROR  ${x}`); } });
  lines.push(`\npage-check: ${results.length} pages, ${errors} errors, ${warns} warnings`);
  return { errors, warns, text: lines.join('\n') };
}
const loadCfg = (dir) => { try { return JSON.parse(fs.readFileSync(path.join(dir, '.page-check.json'), 'utf8')); } catch { return {}; } };

async function main() {
  const [mode, target, ...rest] = process.argv.slice(2);
  if (mode === '--sync') {   // copy this master into each site repo
    for (const repo of ['/Users/allenbope/Desktop/Claude Paper Folder/bope-design-astro', '/Users/allenbope/Desktop/Claude Paper Folder/blosm-design', '/Users/allenbope/Desktop/kalkare-site']) {
      fs.mkdirSync(path.join(repo, 'scripts'), { recursive: true }); fs.copyFileSync(fileURLToPath(import.meta.url), path.join(repo, 'scripts/page-check.mjs')); console.log('synced', repo); }
    return;
  }
  if (mode === 'dist') {
    const cfg = loadCfg(process.cwd()), root = path.resolve(target || 'dist'), files = [];
    if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') delete cfg.ga;   // analytics only loads on production builds
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.html') && !e.name.startsWith('._')) files.push(p); });  // ._ files: macOS junk copies on external drives
    walk(root);
    const skip = ['404.html', ...(cfg.skip || [])];
    const results = files.filter((f) => !skip.some((s) => f.includes(s))).map((f) => ({ where: '/' + path.relative(root, f).replace(/(^|\/)index\.html$/, '$1').replace(/^client\//, ''), ...checkHtml(fs.readFileSync(f, 'utf8'), f, { ...cfg, selfUrl: '/' + path.relative(root, f).replace(/^client\//, '').replace(/(^|\/)index\.html$/, '$1') }) })).filter((r) => !r.redirect);
    const r = report(results, cfg); console.log(r.text);
    if (r.errors && cfg.mode === 'block') { console.error('page-check: errors above block this deploy (fix them, never switch mode to warn to get around it)'); process.exit(1); }
    return;
  }
  if (mode === 'sitemap') {
    const base = target.replace(/\/?$/, '/'), cfg = JSON.parse(rest.find((a) => a.startsWith('{')) || '{}'), render = rest.includes('--render');
    const idx = await (await fetch(base + 'sitemap-index.xml')).text();
    const maps = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const urls = [];
    for (const m of maps.length ? maps : [base + 'sitemap.xml']) urls.push(...[...(await (await fetch(m)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]));
    let get = async (u) => (await fetch(u, { headers: { 'User-Agent': 'BopeOS-page-check' } })).text(), browser;
    if (render) {
      const { chromium } = await import('/Users/allenbope/agency-brain/ad-maker/node_modules/playwright-core/index.mjs');
      browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
      const pg = await browser.newPage();
      get = async (u) => { await pg.goto(u, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {}); await pg.waitForTimeout(1500); return pg.content(); };
    }
    const results = [];
    for (const u of urls) { if ((cfg.skip || []).some((s) => u.includes(s))) continue;
      const r = { where: u.replace(base, '/'), ...checkHtml(await get(u), u, { ...cfg, selfUrl: u }) };
      if (r.noindex) r.E.push('listed in the sitemap but marked noindex: take it out of the sitemap (or index it)');
      // the other form of the address must forward permanently, in one hop, to this one
      const alt = u.endsWith('/') ? u.replace(/\/$/, '') : u + '/';
      if (new URL(u).pathname !== '/') { const res = await fetch(alt, { redirect: 'manual', headers: { 'User-Agent': 'BopeOS-page-check' } }).catch(() => null);
        const loc = res && res.headers.get('location'), to = loc && new URL(loc, alt).href;
        if (res && res.status === 200) r.E.push(`works at two addresses: ${alt} also loads (should forward permanently to ${u})`);
        else if (res && [301, 308].includes(res.status) && to !== u) r.E.push(`${alt} forwards to ${to}, not straight to ${u}`);
        else if (res && [302, 307].includes(res.status)) r.E.push(`${alt} forwards with a temporary redirect (${res.status}); use a permanent one`); }
      results.push(r); await new Promise((res) => setTimeout(res, 600)); }
    if (browser) await browser.close();
    const r = report(results.filter((x) => !x.redirect), cfg); console.log(r.text); process.exitCode = r.errors ? 2 : 0;
    return;
  }
  console.log('usage: page-check.mjs dist <dir> | sitemap <https://site/> [--render] [json-config] | --sync');
}
import { fileURLToPath } from 'node:url';
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
