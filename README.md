# satya.praneet.uk

Personal portfolio/site, built with Jekyll. Deployed via GitHub Actions to
[satya.praneet.uk](https://satya.praneet.uk).

Started from the [Millennial](https://github.com/LeNPaul/Millennial) Jekyll
theme, but most of the layouts/Sass are now custom — Millennial is being
phased out in favor of a bespoke design (see "Design philosophy" below).

## Structure

- `pages/` — top-level content: `who-i-am`, `art`, `no-fixed-point`,
  `interests`, `resume`, `contact`, plus `pages/log/` (an index page and one
  per-project index, e.g. `3d-printing.md`, `home-server.md`).
- `_log/` — a Jekyll collection, one file per dated log entry. Each entry
  sets `categories: [<project-slug>]` in front matter to associate it with a
  project index page in `pages/log/`.
- `_layouts/` — `default`, `page`, `post`, and the log-specific
  `log-entry` / `log-project` / `log-index`.
- `_includes/` — reusable partials, including a small toolkit of
  content-specific components: `figure.html`, `code-compare.html`,
  `sidenote.html`.
- `_sass/` — one partial per concern (`_header`, `_footer`, `_sidebar`,
  `_code`, `_sidenote`, `_model-viewer`, etc.), pulled together by
  `_-sections-dir.scss`.
- `_data/` — `settings.yml` (nav, social links) and `relationships.yml`
  (data-driven cross-links between pages, rendered in the sidebar).
- `assets/` — images, JS (including a Three.js-based STL model viewer), and
  3D models for the `/log` STL viewer.

## Local development

```sh
bundle install
bundle exec jekyll serve
```

Site will be available at `http://localhost:4000`.

## Deployment

Pushes to `main` trigger `.github/workflows/*.yml`, which builds the site
with `bundle exec jekyll build` and deploys the `_site/` output to GitHub
Pages. No manual deploy step.

## Design philosophy

This site is a **toolkit, not a template** — different content types get
different treatment (STL viewer for 3D-printed objects, syntax-highlighted
code, collages for art, sidenotes for technical asides, etc.), added only
when a specific piece of content needs them, not applied uniformly for
consistency's sake.

See `CLAUDE.md` for the fuller running log of design/content decisions and
implementation notes.
