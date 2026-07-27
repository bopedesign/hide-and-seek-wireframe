# Handoff: Hide and Seek Day Camp website

## Overview

A full replacement website for Hide and Seek Day Camp, a Christ rooted day camp for
kindergarten through fifth grade in Cherokee County, Georgia, run by the non profit
Seek Ministries. Three campuses (Hickory Flat, Ball Ground, Sixes), six weeks of
summer camp, one middle school week, plus a winter camp and two fundraisers.

The primary audience is new parents evaluating the camp. The single most important
action on every page is **Register for a session**. Secondary actions are donate,
apply to work at camp, and register for the 5K.

## About the design files

The files in this bundle are **design references created in HTML**. They are
prototypes showing intended structure, content, and behavior. They are not
production code to copy directly.

The task is to **recreate these designs in the target codebase's environment**
(React, Astro, WordPress, Next.js, whatever the project uses) following its
established patterns, routing, and component conventions. If no environment exists
yet, choose the most appropriate framework and implement there.

## Fidelity

**Low fidelity.** These are wireframes. They are black and white on purpose, with
crossed boxes standing in for photography and a handwritten display face standing in
for the real heading font. Use them as the source of truth for:

- Site structure and navigation
- Page-by-page section order and hierarchy
- Real copy (the text in the wireframes is the intended copy, not lorem ipsum)
- Where photography goes and what each photo should show

Do **not** treat the greys, the borders, the crossed image boxes, or the
Architects Daughter typeface as the intended visual design. Apply the project's real
brand system for color, typography, imagery treatment, and component styling.

## Files in this bundle

| File | What it is |
| --- | --- |
| `Hide and Seek Site Wireframe.dc.html` | The navigable wireframe site. Open it in a browser. Every nav item, breadcrumb, and inline link works. Start here. |
| `support.js` | Runtime needed by the HTML file above. Keep it beside the HTML. |
| `reference/Hide and Seek Wireframes -page catalog-.dc.html` | The same pages laid out side by side on one canvas, for reviewing all of them at once. Reference only. |

## Sitemap

```
Home
├── Explore Camp
│   ├── Summer Day Camp
│   ├── SEEK Adventure Middle School Camp
│   ├── Winter Camp
│   ├── Camp Experience
│   ├── Gallery
│   └── Locations
│       ├── Hickory Flat
│       ├── Ball Ground
│       └── Sixes
├── Parent Info
│   ├── Dates, Hours & Pricing
│   ├── Safety
│   ├── Parent Guide & FAQs
│   └── Scholarships          (external application)
├── About
│   ├── Seek Ministries
│   ├── Mission & Story
│   └── Leadership
├── Get Involved
│   ├── Work at Camp
│   ├── Apply                 (external application)
│   ├── Hickory FlatOut 5K
│   └── Annual Banquet
├── Contact
├── Donate                    (external link)
└── Register                  (external link, UltraCamp)
```

Explore Camp, Parent Info, About, Get Involved, and Contact are all real pages, not
menu-only parents. Donate and Register have no page of their own; they are buttons
in the header that leave the site.

---

## Global chrome

Three pieces repeat on every page: the announcement bar, the header, and the footer.

### Announcement bar

Sits **above** the header, full width, edge to edge, dark background with light text.
Single line, centered, small uppercase type with generous letter spacing. Contains a
short message and one link.

- Current content: "Join us for our 5K run" plus a link reading
  "Hickory FlatOut 5K, Labor Day morning" which routes to the 5K page.
- Build it as **content managed**: message text, link text, link target, and an
  on/off switch. The camp will want to swap this to "Registration opens March 1"
  in the spring and turn it off entirely at times.
- It scrolls away with the page. It is not sticky.
- If the bar is dismissible, remember dismissal in local storage per message, not
  globally, so a new message reappears.

### Header

Full width, white, one pixel bottom rule, horizontally padded. Three zones on one row:

1. **Left**: logo, links to Home.
2. **Center**: primary nav, five items in this order: Explore Camp, Parent Info,
   About, Get Involved, Contact. Explore Camp and Parent Info carry a downward
   caret. The other three do not.
3. **Right**: two buttons, Donate (outline, secondary) and Register (solid, primary).
   Register is the most emphasized element in the header on every page.

The nav item for the current section shows an underline. Hovering any nav item shows
the same underline.

The header is a good candidate for sticky on scroll so Register stays reachable, but
the wireframe does not assume it. Decide with the camp.

### Footer

Dark, full width, five columns:

1. Logo plus the office address (1894 Lower Union Hill Rd, Canton, GA 30115)
2. Explore Camp: all six child links
3. Parent Info: all four child links
4. About: Seek Ministries, Mission & Story, Leadership, Contact
5. Get Involved: Work at Camp, Hickory FlatOut 5K, Annual Banquet, Donate, plus a
   newsletter button

---

## Mega menu

Two of the five nav items open a mega menu: **Explore Camp** and **Parent Info**.
About, Get Involved, and Contact navigate directly with no menu.

### Geometry

- The panel is **full viewport width**, anchored to the bottom edge of the header,
  not to the nav item. It spans edge to edge, drops down over the page content, and
  casts a soft shadow onto the content below.
- One pixel bottom rule so the panel reads as an extension of the header.
- Same horizontal padding as the header, so the first column lines up with the logo.
- Internal layout: a four column grid. Three columns of grouped links, plus a
  fourth promotional column holding one image and one line of supporting text.
- Each link column has a small uppercase group label, then a vertical stack of
  links. Links are left aligned, one per line, with a hover underline.
- Panel sits above page content in stacking order.

### Contents

**Explore Camp**

| Column | Label | Links |
| --- | --- | --- |
| 1 | Camp Programs | Summer Day Camp · SEEK Adventure Middle School Camp · Winter Camp |
| 2 | See Camp | Camp Experience · Gallery |
| 3 | Locations | All locations · Hickory Flat · Ball Ground · Sixes |
| 4 | promo | Photo of campers on the zipline, caption "Registration opens March 1" |

**Parent Info**

| Column | Label | Links |
| --- | --- | --- |
| 1 | Plan the summer | Dates, Hours & Pricing |
| 2 | Prepare | Safety · Parent Guide & FAQs |
| 3 | Help paying | Scholarships |
| 4 | promo | Photo of the carpool line, caption "Camp runs 9 a.m. to 3 p.m." |

The promo column is the reason to use a mega menu instead of a plain dropdown. Keep
it. Make the image and caption content managed so the camp can swap the seasonal
message.

### Behavior

- **Open on hover** of the trigger, with roughly a 100ms intent delay so a mouse
  crossing the nav does not flash panels open.
- Moving from one trigger to the other **swaps** the panel contents with no close
  and reopen animation. Only one panel is ever open.
- **Close** when the pointer leaves the combined region of the header and the open
  panel, when the user presses Escape, when a link inside is activated, or when the
  route changes.
- **Clicking the trigger itself navigates** to that section's landing page
  (Explore Camp and Parent Info are real pages). It does not toggle the menu open.
  On touch devices, where hover does not exist, the first tap opens the panel and a
  second tap on the same trigger navigates.
- Open and close with a short fade plus a few pixels of downward travel, around
  150ms to 200ms, ease out. Respect `prefers-reduced-motion` and skip the travel.

### Accessibility

- The trigger is a real link to the section page, with an adjacent disclosure
  control carrying `aria-expanded` and `aria-controls` pointing at the panel.
- The panel is a `<nav>` with an accessible name matching the section.
- Keyboard: Tab reaches the trigger; Enter follows the link; Down Arrow or the
  disclosure control opens the panel and moves focus to its first link; Tab moves
  through panel links in reading order; Escape closes and returns focus to the
  trigger.
- Never trap focus. Never open on focus alone.

### Mobile

Below the tablet breakpoint, the header collapses to logo, Register, and a menu
button. The mega menu becomes a full screen panel with the same groups presented as
an accordion: five top level rows, and tapping Explore Camp or Parent Info expands
its grouped links in place. Donate and Register pin to the bottom of that panel.
Drop the promo image on mobile.

---

## Pages

Every page below uses the global chrome. Sub pages open with a breadcrumb line
directly under the header. Section landing pages do not have a breadcrumb.

### Home

Purpose: convince a new parent this camp is safe and worth their summer, then get
them to Register.

Sections in order:

1. **Hero.** Two columns, text left and a large image right. Eyebrow
   "Canton, Georgia, 18th summer", headline "A safe, loving place to spend the
   summer outdoors", one paragraph of positioning copy, then two buttons: Register
   for a session (primary) and See dates and pricing (secondary). The image slot is
   the largest on the site and can hold a short muted video loop instead of a still.
2. **Quick camp details.** Four equal cards on a tinted band: who it is for, when,
   where, and how long the camp has run.
3. **The camp experience.** Section heading, one paragraph, then three image-topped
   columns: outdoor adventure, friendship and belonging, Bible teaching. Ends with a
   secondary button to the Camp Experience page.
4. **Camp options.** Three bordered cards, one per program, each with an image, a
   title, a short description carrying grade range, hours, and price, and a
   Learn more link.
5. **Why parents choose Hide and Seek.** Tinted band, image collage on the left and
   a two by two grid of short cards on the right: safe, cared for, affordable,
   Christ rooted.
6. **Camp locations.** Three image-topped columns with addresses and a link each,
   followed by a full width map.
7. **Photos and testimonial.** A four across photo row, a link to the gallery, then
   a single large pull quote from a parent.
8. **Final registration CTA.** Dark full bleed band. Heading, one line about
   registration opening March 1, then Register plus a scholarship link.

### Explore Camp

Section landing. Full bleed banner image, an intro block, three program cards, a
tinted band with two wide cards (Camp Experience and Gallery), then a three across
locations row.

### Summer Day Camp

Two column hero, then a tinted four-stat band (grades, hours, cost, campuses), a
day-at-camp section pairing the hour by hour schedule with a photo strip, an eight
tile activities grid, a tinted Bible teaching section, and a dark Register band.

### SEEK Adventure Middle School Camp

Breadcrumb, full bleed banner, intro with eyebrow "Finished 6th, 7th, and 8th grade",
tinted four-stat band, a two column section pairing the curriculum description with a
two by two photo grid, and a logo slot for the SEEK Adventure mark.

### Winter Camp

Two column hero, tinted three-stat band (dates, hours, campus), and a three across
photo row.

### Camp Experience

The deepest content page. Full bleed banner, intro, tinted daily rhythm section
(schedule beside a two by two photo grid), an eight tile activities list, a tinted
two-up section covering Thursday water day and Friday open woods, then a Bible
teaching section.

### Gallery

Intro plus a filter row (All, Hickory Flat, Ball Ground, Sixes, Winter Camp, 5K),
then a four column grid where two tiles span double width to break the rhythm, then
Load more. Clicking a photo opens a lightbox with keyboard navigation.

### Locations

Intro, a full bleed map with three pins, then three bordered cards, one per campus,
each with photo, address, a one line description of the property, and a details link.

### Hickory Flat, Ball Ground, Sixes

The three campus pages share one template: breadcrumb, full bleed banner photo, a
two column intro pairing description and a Register button with a facts card
(address, programs offered, hours), a tinted drop off and pick up section with two
cards (normal and rainy day) plus a carpool map, then a three across photo row.

Hickory Flat is the only one with real drop off copy so far. Ball Ground and Sixes
directions are marked as pending from the camp office.

### Parent Info

Section landing. Intro, four wide cards in a two by two grid (one per child page,
each with a thumbnail), then a dark band with a Contact the camp office button.

### Dates, Hours & Pricing

The highest traffic parent page. Intro, a tinted four card pricing row, a session
table with a campus switcher above it (Hickory Flat, Ball Ground, Sixes as a
segmented control), a tinted daily hours section, and a dark Register band with a
scholarship link.

The table has four columns: session number, dates, notes, status. Status values are
Open, Filling, and Full. No-camp weeks appear as muted rows with no session number.
Pull this from UltraCamp if the integration allows; otherwise it is editable content.

### Safety

Two column intro, a tinted two by two grid of screening and training cards, a three
card day to day row, and a three across photo row. Every claim here comes from the
camp and should not be edited without them.

### Parent Guide & FAQs

Intro plus a download button for the printable guide, a tinted four card packing
list, then a two column section with a photo on the left and the FAQ accordion on
the right. First item open by default. Ends with a dark Contact band.

### Scholarships

Two column intro ending in Start the application, a tinted four step process row,
then a two column closing section pointing at the camp office. The application is
hosted outside the site and opens in a new tab.

### About

Section landing. Full bleed staff photo, intro, three cards for the child pages,
then a tinted four stat band (18 summers, 3 campuses, 6 weeks, 1 middle school week).

### Seek Ministries

Two column intro led by the Seek Ministries logo and the mission line
"To create environments to show the supremacy of God", then a three card row for
what the ministry runs (camp, 5K, banquet), then a dark Donate band.

Note from the camp: the ministry may want to read as a distinct area of the site
rather than another camp page. Worth revisiting in visual design.

### Mission & Story

Breadcrumb, full bleed archival photo, intro, a tinted two-up of the two verses the
camp is named after, a four across timeline of photos, and a tinted closing section
on being Christ rooted and open to everyone.

### Leadership

Intro, a tinted founder feature (portrait beside bio), a four across director grid
with portraits, then a full width summer staff photo and a Work at camp button.

### Get Involved

Section landing. Full bleed banner, intro, four wide cards in a two by two grid, then
a dark Donate band.

### Work at Camp

Recruiting page. Two column hero ending in Apply now, a tinted three card roles row,
a two column training and screening section, a four across photo row, and a dark band
noting applications open in the winter.

### Apply

Short handoff page. Two column intro with Open the application and Read about the
roles, then a tinted four card list of what to have ready. The application is hosted
outside the site.

### Hickory FlatOut 5K

Full bleed start line banner, then a two column intro led by the 5K logo with a facts
card (when, where, races, timing), a tinted course section with a map and a photo, a
sponsors section with a logo row and a sponsor packet link, and a four across race
photo row.

### Annual Banquet

Two column intro, a tinted three card section describing the evening, then a three
across photo row. No ticketing. Giving happens around the event, not during it.

### Contact

Intro, then a two column section: a contact form on the left (name, email, topic
select, message, send) and the office details plus a photo on the right. Then a
tinted campuses section with three address cards and a map, and a closing social row.

---

## Content notes

The copy in the wireframes is real and camp approved except where marked. These
items are still outstanding:

- Ball Ground and Sixes drop off and pick up directions
- Office phone number and email address
- Leadership bios and director names
- The parent testimonial quote and attribution
- Timeline dates on the Mission & Story page
- Winter camp exact dates each year

Two copy rules the camp asked for: no em dashes anywhere in the site copy, and date
and time ranges are written with the word "to" rather than a dash.

## Integrations

- **Register**: UltraCamp, currently an external handoff. The camp has asked whether
  registration can be integrated into the site itself. If that happens, Register
  becomes a real page and the sitemap gains a node. Decide before visual design.
- **Scholarship application**: external form.
- **Staff application**: external form. Confirm whether it should be embedded.
- **Donate**: external giving page for Seek Ministries.
- **5K registration**: external race registration.

## Assets the camp has

Two Hide and Seek logo variations, a Seek Ministries logo, a Hickory FlatOut 5K logo,
and a SEEK Adventure logo. A full catalog of camp photography. Flyers. Parent quotes
still need to be gathered.

Photography is central to this site. Every image slot in the wireframe carries a
caption describing what the photo should show. Follow those captions when sourcing
from the camp's catalog.

## Responsive

The wireframes are desktop only. Suggested behavior:

- Four column grids collapse to two, then one.
- Three column grids collapse to one below tablet.
- Two column hero and feature sections stack, image below text.
- The session table becomes horizontally scrollable or reflows to stacked cards.
- The mega menu becomes the mobile accordion panel described above.
