# AGENTS.md

Static HTML/CSS/JS prototype for a Montessori lesson-planning site. No build step, no package manager — pages are opened directly in a browser.

## Project context

- Read [PROPOSAL.md](PROPOSAL.md) and [PRD.md](PRD.md) first — they define the audience (pre-school teachers), required pages, filters, and style direction. Treat them as the source of truth for feature/design decisions.
- The site is a standard static layout at the repo root: [index.html](index.html) is the homepage and styles live in [css/style.css](css/style.css). New pages go in the root as plain `.html` files (no framework); new stylesheets go in `css/`.
- `docs/` holds planning materials only (hand-drawn/AI-assisted layout sketches referenced from PROPOSAL.md) — not website assets. Real lesson photos don't exist yet, so lesson cards use [Lorem Picsum](https://picsum.photos) placeholder photo URLs (`https://picsum.photos/seed/<slug>/400/300`); swap these for real photos in an `images/` folder once available.

## Styling conventions

- All colors, fonts, spacing, radius, and shadow values must come from the CSS custom properties defined in the `:root` block of [css/style.css](css/style.css). Do not hardcode new color/size values in markup or CSS — add a new custom property to `:root` instead, and if a needed value doesn't exist, ask before inventing one.
- Layout is mobile-first: base styles target small screens, with `@media (min-width: ...)` used to progressively enhance for larger viewports (existing breakpoints are 480px and 640px).
- One accent color (`--accent`) is used sparingly; the extended palette (`--terracotta`, `--peach`, `--dusty-pink`, `--soft-yellow`, `--sage`) is for category/decorative accents only.

## Interactive elements

- Filters, search, and save/favorite controls must be wired to actual working JS (see the `<script>` block at the bottom of [index.html](index.html) for the pattern: filter state read from selects/pressed buttons, applied via a single `applyFilters()` pass over `.lesson-card` elements using `data-*` attributes). Don't add buttons/dropdowns that only toggle their own visual state without affecting results.
- Never nest a `<button>` inside an `<a>` (or vice versa) — e.g. the save/heart button sits as a sibling to the card's link, not inside it, so it doesn't trigger navigation.

## Verifying changes

There's no test suite or lint config. After editing a page, open it with the browser tools (`open_browser_page` / `screenshot_page`) at a mobile viewport size (~390px wide) to visually verify layout and click through interactive elements (filters, search, save button) to confirm they work before reporting completion.
