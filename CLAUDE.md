<!-- BOPE SITE RULES: synced from ~/agency-brain/site-rules/SITE-RULES.md, edit there -->
## Bope Design site rules (shared by every client site)

You are helping a Bope Design team member change a client's website. These rules come from Jeane Bope, who owns the
agency. They apply to every change, however small. When a rule and a request conflict, stop and ask the team member to
check with Jeane instead of working around the rule.

### How a change goes live
1. `git pull` first, so you start from the live version.
2. Make the change.
3. `npm run build`. The last line must read `0 errors`. The page checker inside the build blocks a deploy with errors.
   Fix the page, never the checker. Never switch `.page-check.json` from `"block"` to `"warn"`.
4. `npm run dev` and look at every page you touched on a computer-width window and at 390px wide (phone). Nothing may
   scroll sideways, no word may sit alone on the last line of a heading, and text must stay readable.
5. Commit with a plain message that says what changed ("Update summer prices for 2027") and `git push`. Pushing to `main`
   publishes the site in about a minute.

### Before adding anything new (a page, section, banner, pop-up or form), answer these in the chat first
1. Where does it appear: one page, some pages, or every page?
2. What does it add for search and AI tools? Anything on every page is a plain label, never a heading. A heading must not
   repeat another heading, label or title on the same page.
3. Whose words are these? Only the client's own words. If the words aren't given, ask for them.
4. Does it need tracking? Buttons and links that leave the site (register, donate, apply, call, email) carry a `data-ev`
   attribute so Analytics counts them. Keep the ones already there.
5. Does it work on a phone and with a keyboard? Real links and buttons, alt text on photos.

### Every page must have
- One H1 that says what the page is. No heading repeated on the same page.
- A real `<title>` and description (the page's Layout props).
- Alt text on every photo that says what the photo shows.
- Addresses that end in a slash (`/contact/`), and internal links written the same way.

### Words
- Use the client's words. Never make up facts: names, prices, dates, numbers, quotes, reviews or promises. If something
  is missing, leave it out and tell the team member what is needed.
- No em dashes (—). Use a comma, a period or parentheses.
- Plain, warm sentences, the way the client would say it out loud. Avoid these AI tells: delve, tapestry, testament,
  realm, journey, navigate, unlock, elevate, empower, seamless, robust, game-changer, "when it comes to", "at the end of
  the day", "it's worth noting", "moreover", "furthermore". No "It's not X, it's Y" lines, no one-word verdict sentences
  ("Simple."), no rhetorical question answered right away, no stacks of one-sentence paragraphs.
- Headings say the point plainly ("Where camp drop off happens"), never a slogan or a label like "The Bottom Line".
- No decorative extras the design doesn't have: no added taglines, codes, stats or eyebrow lines.

### Photos and branding
- Real photos of the client only, from the client. Never AI images or stock photos.
- Save photos as `.webp`, no wider than 1600px, in `public/img/`.
- Never redraw, trace or recreate a client logo. Use the files in `public/brand/`.

### Keep the design
Build new content from the parts the site already uses (its classes, cards, buttons and spacing). Don't introduce new
fonts, colors or styles. If a request needs a new kind of section, ask Jeane first.

### When more than one person works on the same site
- Everyone uses their own GitHub account, never a shared login, so every change shows who made it.
- `git pull` right before starting and again right before pushing. Keep each change small and push it the same session;
  don't leave work sitting unpushed overnight.
- One change per commit, with a plain message, so any single change can be undone on its own.
- Before a bigger job (a new page, a redesign of a section, anything that takes more than one sitting), tell the team in
  Slack which pages you're working on, and do it on a branch (`git checkout -b <short-name>`). Push the branch for a
  Vercel preview link, check it, then merge to `main`.
- If a push is rejected because someone else pushed first: `git pull`, keep both people's changes, build again, then
  push. If the same lines were changed by both people, stop and ask the other person (or Jeane) which version is right.
  Never pick one side without checking.
- Never `git push --force`, `git reset --hard` on `main`, rewrite history, or delete a branch someone else made.
- To undo a change that's already live, use `git revert <commit>` (it adds an undo commit). Never delete or rewrite commits.
- Never commit passwords, keys or `.env` files.
- Every push to `main` is live. After pushing, open the live page and check it.

### Ask Jeane before
Deleting a page, changing a page address, changing the header, footer or menus, adding a form, changing tracking or
search settings (the `<head>` in the Layout, `astro.config.mjs`, `vercel.json`), or anything you're unsure about.
<!-- END BOPE SITE RULES -->


## This site: Hide and Seek Day Camp

Astro site for Hide and Seek Day Camp (a program of Seek Ministries, Canton, GA). Rebuilt on 2026-10-20 from the
approved design, which is no longer edited anywhere else: this repo is the only source. Pushing `main` deploys to
Vercel (project `hide-and-seek-wireframe`, https://hide-and-seek-wireframe.vercel.app/).

### Where things are
- Each page is `src/pages/<address>/index.astro`. The address is the folder: `src/pages/parent-info/safety/index.astro`
  is `/parent-info/safety/`.
- The top of each page passes its title, description and photo banner to the Layout: `title` (browser tab and Google),
  `description` (Google snippet), and `banner` (`img`, `alt`, `eyebrow`, `title`, `intro`, and `h1`, which says whether
  the small eyebrow line or the big title is the page's H1).
- Shared pieces: `src/layouts/Layout.astro` (head, banner, tracking), `src/components/Header.astro` (menus, also the
  phone menu), `src/components/Footer.astro`, `src/components/Bar.astro` (the 5K bar at the top).
- Styles: `src/styles/base.css` is the design's own styles; `src/styles/site.css` holds the header, banner and phone
  layout. Most page styling is written on the elements themselves, as the design was.
- Photos: `public/img/` (camp photos, `.webp`). Logo: `public/brand/hs-logo-white.png`.
- Outside links (UltraCamp registration, donations, staff applications, the scholarship form) are listed in each link's
  `href`. If UltraCamp changes an address, search the repo for the old one and replace every copy.

### Still needed from the camp
- Camp directors' names, roles and photos: add them to the `directors` list at the top of
  `src/pages/about/leadership/index.astro` and the section appears.
- Cathy's founder bio (Leadership page, now "Bio to be written with the camp office").
- Links for buttons that don't go anywhere yet: the parent guide download (FAQs), the 5K race registration, sponsor
  packet and become a sponsor (5K), Save your seat (Banquet), the staff Time Off Request form (Apply), the gallery filter
  buttons and Load more (Gallery).
- The camp's Instagram address (the footer shows Facebook only until then).
- Before launch: a Google Analytics 4 property for the camp (set `PUBLIC_GA_ID` in Vercel), the domain, and setting
  `PUBLIC_ALLOW_INDEXING=true`. Until then every page is hidden from search engines. Jeane handles launch.
