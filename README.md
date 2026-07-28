# Hide and Seek Day Camp — Website

The Hide and Seek Day Camp site (Seek Ministries, Cherokee County, GA), synced from the Claude Design project. This is now the **full visual design** (Poppins type, warm cream / gold / teal palette, rounded cards), not the earlier black-and-white wireframe.

## View it

Open `index.html` in a browser, or visit the deployed link. All nav items, mega menus, breadcrumbs, and inline links work.

- `index.html` — the navigable site (start here)
- `support.js` — runtime for the design (keep it beside the HTML)
- `assets/` — logo and hero art
- `HANDOFF.md` — structure, sitemap, and page-by-page notes (written at the wireframe stage; copy and section order still apply)
- `reference/` — older wireframe page-catalog, reference only

## Images are placeholders right now

The design references ~60 camp photos (`img/a01–a60.jpg`) plus a hero image. Those binaries can't be pulled through the Claude Design file API (it truncates files over ~192KB), so they currently render as warm-tinted placeholder boxes. The layout holds because every photo slot has a fixed height. To drop in the real images, export the design bundle from Claude Design as a zip (it includes the `img/` and `assets/` folders intact) and add those folders here.

## External links

Camp actions leave the site to their real destinations, in a new tab:

- Donate → UltraCamp donation page
- Register (header + all camp/campus buttons) → UltraCamp client login
- Staff Apply chooser buttons → UltraCamp upcoming sessions
- Scholarship application → Google Form
- Email / Call the office → `mailto:` / `tel:`

Left inert on purpose: the 5K "Register for the race" (separate race registration) and the Apply page "Time Off Request" (its own Google Form, URL still needed from the camp). A "Log in" link is not in the current design; add it back if returning families need it.
