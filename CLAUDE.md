## Working arrangement

You are the **Workshop** — Claude Sonnet 5 running in Claude Code on this repo.
The **Studio** is a claude.ai Project (Claude Fable 5) where Satya curates
content, organizes personal memories/data, and makes voice, structure, and
design decisions for this site.

### Your role
- Satya writes most code and content himself. You review, explain, debug,
  and suggest approaches. Do NOT edit or create files unless explicitly asked.
- Jekyll (Millennial theme), SCSS, HTML/Liquid, some JS for animations.
- You are allowed to make suggestions regarding the tech stack for good results.
  Deployed via GitHub Actions to satya.praneet.uk.

### Conventions
- Notes prefixed `[From Studio]` are decisions made in the Studio. Treat them
  as settled *what/why* — don't relitigate them too much; help implement them.
- When Satya asks you to record something for the Studio, format it as a
  short `[From Workshop]` note he can paste there: implementation status,
  technical constraints, or questions that affect content decisions.
- Decisions worth persisting get summarized here in CLAUDE.md, not left
  in session memory alone.

## [From Studio] Sitemap (2026-07-23)

New spine, replacing the Millennial demo structure:
- `/who-i-am` — replaces old "Who Am I" post. Links out to Log, Art, No Fixed Point, Interests.
- `/log/` — index + per-project pages: `3d-printing`, `home-server` (existing content,
  reused as index/synthesis copy), `electronics`, `creative-robotics`, `ventures` (new,
  placeholders — no drafted copy yet).
- `/art` — reframed self-taught-artist page (content migrated from old `painting` post,
  not yet reorganized to the new framing).
- `/no-fixed-point`, `/interests` — new, empty shells, content pending (Satya/Studio voice work).
- `/resume`, `/contact` — unchanged.
- Nav is conventional top nav for now; no tags/graph view until Log has real entries.
- Millennial theme's layouts/SCSS are being discarded eventually — no rush, avoid
  investing further in the old theme structure.

### [From Workshop] Implementation status

- Added a `log` Jekyll collection (`_log/`, currently empty) — one file per dated entry,
  `categories: [<project-slug>]` in front matter, permalink
  `/log/:categories/:year-:month-:day-:title/`. Defaults to `layout: log-entry`.
- Added layouts: `log-entry.html` (single entry), `log-project.html` (per-project index +
  its entries, matches `page.category` against `entry.categories`), `log-index.html`
  (`/log/` root + recent entries across all projects).
- Migrated `_posts/2025-10-06-3d-printer.md` → `pages/log/3d-printing.md` and
  `_posts/2025-10-06-home-server.md` → `pages/log/home-server.md` as index/synthesis
  content. Migrated `_posts/2025-10-06-painting.md` → `pages/art.md` and
  `_posts/2025-10-05-who-am-i.md` → `pages/who-i-am.md` (marked as placeholder pending
  the Studio rewrite) to avoid stale duplicate content at old URLs. All four old posts
  were then deleted — `_posts/` is now empty.
- **Known gap**: `_layouts/home.html` paginates `site.posts` for the homepage feed.
  With `_posts/` empty, the homepage currently renders no posts. Needs a decision on
  what the homepage should show once the Log model is the primary content source —
  not fixed yet, flagging for whenever theme work starts.
- Nav updated in `_data/settings.yml` to add Who I Am / Log / Art / No Fixed Point /
  Interests ahead of Resumé / Contact.
- Verified via local build: all pages resolve, nav renders, collection/permalink/entry
  pipeline works end-to-end (tested with `log-project.html`'s category filter).

### [From Studio] Homepage confirmation (2026-07-23)

Custom-theme work is still pending — homepage doesn't need visual polish yet, just
get the links/structure right. Applies to the still-open homepage gap noted above.

### [From Workshop] Bug fix: header overlapping content (2026-07-23)

Adding 5 nav items (7 total + 4 social icons) broke `_sass/_header.scss`: `.site-header`
was `position: fixed` with a hardcoded `min-height: 56px`, and `_default.scss` offset
`.content-wrapper` by a matching magic-number `padding-top`. Once the nav no longer fit
on one line, the floated (uncleared) nav overflowed past that assumed height and
visually covered every page's heading.

Fix: removed `position: fixed` from `.site-header` so it sits in normal document flow;
removed the `$header-thickness`-based padding-top hack from `.content-wrapper` in favor
of a plain `20px`. Content now always starts after however tall the header actually
renders — robust to nav growing further (e.g. the tag system planned for later). This
was a correctness fix, not the deferred visual polish — header may still look
cramped/plain, that's expected until the custom theme lands.

Still open: the homepage-content decision noted above (now confirmed low-priority on
looks, just needs the right links wired in whenever that's picked up).

### [From Workshop] Content landed (2026-07-23)

who-i-am, interests, and no-fixed-point now have real Studio-drafted content, pasted
directly into the page files (front matter left as scaffolded). This supersedes the
"placeholder"/"empty shell" notes above for these three pages.

## [From Studio] Sidebar/marginalia (2026-07-26)

Approved (Workshop's proposal, two adjustments): build `page.html` cross-links now,
data-driven from the start (not hardcoded — site's small enough that the setup cost is
low and doing it twice would cost more overall); reserve the pulled-quotes slot in the
layout but leave it unpopulated (Who I Am/Art/No Fixed Point still mid-rewrite, nothing
stable to pull from); build the homepage "recent log entries" teaser first, as the
highest-value piece of this round. `log-entry`/`log-project`/`log-index` sidebars
built exactly as proposed, no changes.

### [From Workshop] Implementation status (2026-07-26)

- `.content-layout` (flex row, `.page-content`/`.post-content` + `<aside class="sidebar">`,
  collapses to stacked below `$container-breakpoint`) now wraps `page.html`,
  `log-entry.html`, `log-project.html`, `log-index.html`. Shared rules in new
  `_sass/_sidebar.scss`, registered in `_-sections-dir.scss`.
- Cross-link relationship map is data-driven: `_data/relationships.yml` maps a page's
  `key` front-matter value to a list of related `key`s (hub-and-spoke — who-i-am links
  out to log/art/no-fixed-point/interests, each of those links back to who-i-am; resume/
  contact have none). Added `key:` to who-i-am, art, no-fixed-point, interests, resume,
  contact, and `pages/log/index.md`. To add a new cross-linked page: give it a `key` and
  add an entry to the yml — no template changes needed.
- `page.html` sidebar: cross-links section (hidden via `:empty` CSS when a page has none,
  e.g. resume/contact) plus an empty reserved `.pulled-quotes` section — present in markup,
  invisible until populated, per the "reserve but don't populate" call above.
- Removed the hardcoded "More: Log · Art · No Fixed Point · Interests" line from the end
  of who-i-am.md — that's now the dynamic sidebar's job; leaving both would've duplicated it.
- `log-entry.html` sidebar: date, categories, back-link to the parent project index
  (matched via `page.category` on `site.pages`, same field `log-project.html` already
  used), prev/next entry within the same category (computed via a single Liquid pass
  over the category's entries sorted by date — no built-in `index_of` filter to lean on).
- `log-project.html` sidebar: entry count + date range (from the already-computed
  category-filtered `entries`), back-link to `/log/`.
- `log-index.html` sidebar: alphabetical jump-list of all project pages
  (`site.pages | where: "layout", "log-project"`) — doubles as sitewide log nav per the
  proposal.
- Homepage teaser (`_layouts/home.html`): last 5 `site.log` entries, newest first, with a
  "See the full log" link; reuses the same Liquid pattern as `log-index.html`. Renders
  nothing while `_log` is empty — verified by temporarily adding two dummy `_log` entries
  locally, confirming teaser population, prev/next, and back-links all work, then
  removing them (not committed).
- Verified via local `bundle exec jekyll build`: all five touched layouts compile and
  render correctly, sidebar gracefully empty/hidden where there's no data yet (e.g.
  0-entry project stats, no-relations pages).
