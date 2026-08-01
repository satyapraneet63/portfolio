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

## [From Studio] Multimedia & interactivity round (2026-07-26)

Design rule for visual/interactive elements going forward: real artifacts only —
everything rendered must be something Satya actually made (his configs, his meshes,
his data). No decorative widgets; Spotify/API embeds and word clouds were killed in
review. Four items approved in build order: code snippet styling, figure/caption
treatment, and a `/log/website` category scaffold (build now — all three below); an
STL viewer (flagship — proposal first, build after Studio reacts, not built yet).
Parked, second wave, don't build or design around yet: a Pi-fed telemetry/status panel,
a dual-track Who I Am timeline.

### [From Workshop] Implementation status (2026-07-26)

- **Code snippets**: `_sass/_code.scss` rewritten to map Rouge's token classes onto the
  site's existing Monokai palette variables (`_home.scss`) instead of a separate
  hardcoded theme — same greens/pinks/purples as the rest of the UI. Removed a stray
  `code, pre { color: $code-font-color; }` rule from `assets/css/main.scss` that
  pre-dated this and would've fought Rouge's per-token spans. Checked WCAG contrast of
  every token color against the new `$code-background` (`#49483e`, a distinct-but-related
  panel shade, not `$post-background`); the operator/tag color (`$brand-color`, pink) and
  the number color (`$post-title-color`, purple) were too low (2.4:1 / 3.2:1), so those
  two use `lighten()` variants (same pattern already used for hover states in
  `_home.scss`) — now 4.1:1 and 5.1:1. Comment color is intentionally low-contrast
  (~1.9:1) — that's stock Monokai's own convention for de-emphasizing comments, not a gap.
  Inline code (`` `like this` ``) and unspecified-language fences share the same styling
  automatically, since kramdown routes both through Rouge's plaintext lexer.
  **Finding for Satya**: Rouge has no G-code/Klipper lexer — a fenced block tagged
  ` ```gcode ` silently falls back to a bare, unhighlighted `<pre><code>` (verified via
  test build). `ini` is the closest existing lexer for `.cfg`-style sections; for
  macro/G-code listings, leaving the language tag off (plain fence) is probably better
  than a wrong/absent language tag, since both get the same styled dark treatment.
- **Figure/caption**: new `_includes/figure.html` (`{% include figure.html src=".."
  alt=".." caption=".." %}`) emits `<figure class="post-figure"><img><figcaption>`.
  Styled in new `_sass/_figure.scss`: image stays full-width (existing wide-media rule
  on `.post-content`/`.page-content img` already covers the nested `<img>`), caption
  text is pulled back to the 900px narrow-prose column and de-emphasized — reuses the
  existing wide-media/narrow-prose split rather than introducing a new one.
- **`/log/website`**: scaffolded `pages/log/website.md` (layout `log-project`, category
  `website`) with a placeholder line matching the existing convention (see `ventures.md`,
  `electronics.md`) — copy is Satya's to write. Added to the nav list in
  `pages/log/index.md`. No `_log` entries yet, so it won't appear in the homepage
  teaser or recent-entries lists until he writes one — the jump-list/log-index sidebar
  (built in the sidebar round) picks it up automatically either way, no template changes
  needed.
- STL viewer: approved as proposed (2026-07-26), with one note for later — once the
  flagship (speaker cabinet, Satya's own design) ships, `model_attribution` should read
  as a design credit ("Designed by Satya, 2025") rather than a license line; the field
  is generic caption text, not license-specific, so this needs no template change, just
  different copy per entry.

## [From Studio] Design toolkit principle (2026-07-27)

Standing design rule: this site uses a **toolkit, not a template** — different content
types get different treatment, deliberately, rather than one layout applied uniformly.
A tool earns its place on a specific page because that page's content needs it, never
applied site-wide for consistency's sake. This is also why the site won't feel
templated — no two entries are structurally identical. Current mapping, not exhaustive
— new tools get added as content demands them, not preemptively:

- STL viewer — 3D printing / physical-object entries where a model exists.
- Code snippets, syntax-highlighted — anywhere code/config is discussed.
- Collages — Art entries.
- Photos — personal/narrative pages (Who I Am, No Fixed Point).
- GIFs/video/links — process documentation, examples, demonstrations.
- Tufte-style margin sidenotes — technical entries with genuine asides (specs, dated
  corrections, tangents).
- Side-by-side code + explanation — build-log entries walking through a decision.
- Horizontal image/comparison strips — before/after, build sequences.

Parked, log for later reminder — not blocking anything now: subtle scroll-triggered
fade/slide-in on entry elements (`IntersectionObserver` + CSS transition), respecting
`prefers-reduced-motion`. Genuinely feasible on this stack, just not urgent — revisit
once there's enough real content that entries feel static without it, rather than
adding motion to placeholder-thin pages.

### [From Workshop] Toolkit pilot shipped: code-compare + sidenote (2026-07-27)

Piloted on `/log/website`, now approved and confirmed working in-browser (Satya
checked in Zen). Both are general-purpose includes, available for any future Log
entry or page per the toolkit principle above — not scoped to that one page.

- **`{% include code-compare.html %}`** (`_includes/code-compare.html`,
  `_sass/_code-compare.scss`) — side-by-side explanation/code, flex two-column,
  collapses to stacked below `$container-breakpoint` (1100px). Usage: build each side
  as markdown via `{% capture %}` + `{% assign ... | markdownify %}`, then pass the
  resulting HTML strings in as `explanation=`/`code=` params — this lets fenced code
  blocks go through the normal Rouge/kramdown pipeline before landing in the include.
  Not scoped to the 900px narrow-prose column (same wide-media treatment as figures).
- **`{% include sidenote.html number="N" text="..." %}`** (`_includes/sidenote.html`,
  `_sass/_sidenote.scss`, `assets/js/sidenotes.js`) — Tufte-style margin note, authored
  inline in a paragraph. Went through two design revisions before landing: an initial
  version floated directly out of the prose column, but the prose cap (900px) plus the
  sidebar (220px) plus $container-width's clamped max (1440px) leaves at most ~240px of
  slack for that to work with, at any viewport, however wide — genuinely never enough
  room, not just a sizing bug. Redesigned to merge into the *shared sidebar rail*
  instead: the note authors inline as before, but a small dependency-free script
  (`assets/js/sidenotes.js`) measures its trigger paragraph's position and absolutely
  positions it into the same column as the page's existing sidebar content (cross-
  links, stats, etc.), clamped to never overlap that static content or other sidenotes
  above it. No-JS default is a plain in-flow block right where it's authored — safe,
  correct, zero layout risk, same fallback-first principle as the STL viewer. Only
  activates at the same breakpoint the sidebar itself uses (1100px) — below that,
  `.content-layout` is already stacked, so there's no separate rail to position into.
  Script loads conditionally (`{% if content contains 'sidenote-marker' %}` in
  `_layouts/default.html`) — zero extra bytes on pages that don't use one.
  The clamping/collision logic (multiple sidenotes stacking against each other and
  against static sidebar content) was verified with a standalone logic test against
  mocked DOM geometry, not just eyeballed — real layout/rendering was then confirmed
  separately in-browser.

## [From Studio] Sass deprecation backlog (2026-07-27)

Two separate items surfaced in `jekyll serve` build output, both warnings-only against
a future Dart Sass version — current build unaffected, neither is urgent, but sized
honestly rather than lumped as one cleanup pass:

- **`lighten()` → `color.adjust()`/`color.scale()`**: small, mechanical. 6 call sites —
  `_sass/_code.scss` (3) and `assets/css/main.scss` (3). Swap `lighten($x, N%)` for
  `color.adjust($x, $lightness: N%)` (Dart Sass's own suggested equivalent), no design
  decisions involved. Fine to batch whenever convenient.
- **`@import` → `@use`/`@forward`**: real structural work, not a syntax swap. `@import`
  shares one implicit global scope across every partial, which is exactly why
  9 of the 13 files under `_sass/` (`_base`, `_code`, `_code-compare`, `_default`,
  `_footer`, `_header`, `_post`, `_sidebar`, `_sidenote`) can reference variables like
  `$container-width`/`$brand-color` with zero setup — they're all just relying on
  `main.scss`'s definitions being globally visible. `@use` is explicitly scoped, so this
  means extracting those variables into their own forwarded partial and adding a
  correctly-namespaced `@use` to each of those 9 files, not a one-line change per file.
  Worth scoping as its own task when it's picked up, not folded into the `lighten()` swap.

### [From Workshop] Sass backlog resolved (2026-07-27, confirmed 2026-07-29)

Both items above are done — commit `0d80f5a` ("Ship code-compare/sidenote toolkit
pilot; migrate Sass to @use/@forward"). All 6 `lighten()` call sites now use
`color.adjust($x, $lightness: N%)`; every `_sass/` partial uses `@use`/`@forward`
instead of `@import`, with shared variables extracted into `_sass/_variables.scss`
and forwarded via `_-sections-dir.scss`. No `@import` remains anywhere in `_sass/`
or `assets/css/main.scss`. This backlog is closed.

### [From Workshop] STL viewer implementation status (2026-07-26)

- Built per the approved proposal: `three@0.185.1` pinned via a native ES-module
  `importmap` (version confirmed current against unpkg's package.json), loaded only
  inside the `{% if page.model %}` block in `log-entry.html` — pages without a
  declared model carry zero extra bytes, not even the inert importmap.
  `assets/js/model-viewer.js` is a plain, cacheable module (not Liquid-templated) that
  auto-initializes any `.model-viewer` element it finds via `data-model`/`data-preview`
  attributes: WebGLRenderer + OrbitControls (damped, auto-rotate unless
  `prefers-reduced-motion`), STLLoader loads the mesh, centers/scales it to fit,
  rotates -90° on X (STLs from slicers/CAD are Z-up; Three.js is Y-up). Falls back to
  the static preview image — via `showFallback()` — on WebGL init failure or a failed
  mesh fetch, same path as the `<noscript>` case.
- Front matter, one filename convention with the site's existing `image:` field (bare
  filename, template fills in the directory) rather than the full paths in the original
  proposal text: `model: 3dbenchy.stl` → `/assets/models/`, `model_preview: name.png` →
  `/assets/img/` (reused, no new directory). `model_attribution` is plain caption text,
  no forced "License:" wording, so it doubles as a design credit later per the note
  above.
  ```yaml
  model: 3dbenchy.stl
  model_attribution: "3DBenchy by CreativeTools.se, CC BY-ND 4.0"
  model_preview: 3dbenchy-render.png
  ```
- CSS (`_sass/_model-viewer.scss`) reuses `$code-background` for the canvas panel
  rather than introducing a third dark shade.
- No browser tooling was available in the session that built this (Claude in Chrome
  wasn't connected, machine has no node/chromium for a headless check), so the initial
  pass only verified the pipeline mechanically — correct URLs, CDN importmap, 200s from
  `jekyll serve` for the JS/mesh, compiled CSS — not actual WebGL rendering. Satya then
  added the real `assets/models/3dbenchy.stl` (11.3MB, 225,786 triangles — a valid
  binary STL despite the cosmetic `solid Shape0` text at the header; well above the
  ~5MB soft budget, likely a high-res export, fine for a one-off pipeline test but
  worth watching if the flagship model runs similarly heavy) plus a reference entry,
  `_log/2026-07-26-stl-viewer-pipeline-test.md` (`categories: [website]`), and confirmed
  in his own browser via `jekyll serve` that it renders and rotates. Rendering/rotation
  now confirmed working end-to-end, not just the pipeline around it.
