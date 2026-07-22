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
