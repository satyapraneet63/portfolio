---
layout: log-project
title: "Website"
category: website
permalink: /log/website/
---

This site is its own project. Not a container for the other logs — one of them.

I built it in Jekyll, mostly because GitHub Pages made that the path of least resistance, on top of a free theme (Millennial) that got something live fast. Right call for starting. Wrong call for staying — the theme did the thinking for me, and the site ended up looking like a template with my name on it rather than a decision.

What follows is the record of turning it into an actual decision.

## Timeline

| When | What happened |
|---|---|
| 2025-10 – 2026-01 | Site live on Millennial theme, GitHub Pages, minimal content |
| 2026-07-23 | Decided the skeleton: dated logs instead of living pages, a spine page instead of a flat "About" |
| 2026-07-23| Wrote the spine — realized the story wasn't "engineer becomes designer," it was two timelines running through the same five years |
| 2026-07-23 | Resume rewritten alongside it — same reframe, different document |
| 2026-07-21 | Diagnosed why every page felt cramped despite a palette and font I already liked: two hardcoded widths, independent of the actual page width |
| 2026-07-21 | Fixed both fluidly instead of flatly — `clamp()` and a real prose cap instead of one flat pixel value doing both jobs badly |
| 2026-07-27 | Built the sidebar system — one structure, four different jobs depending on page type |
| 2026-07-25 | Multimedia pass — syntax-highlighted code, captioned figures, a client-side STL viewer |
| 2026-07-27 | Named the site's actual design philosophy: a toolkit, not a template — different content gets different treatment on purpose, nothing applied uniformly for consistency's sake |
| 2026-07-27 | Piloted two new tools directly on this page: side-by-side code/explanation blocks, and Tufte-style margin sidenotes |
| 2026-07-27 | Found the sidenote had nowhere to actually breathe — did the box-model math and discovered the margin's hard ceiling is 240px at any screen width, wide monitor or not |
| 2026-07-27 | Rebuilt the sidenote to live in the same column as the page's cross-links instead of fighting it for space — position computed live, so it lines up with whatever paragraph it's attached to |

This table used to be mostly gaps — I hadn't logged the site's build day by day while it happened, and was reconstructing it after the fact from memory. The dates above are pulled straight from git history instead, which is a better record than my memory of "sometime in July." That gap is itself the argument for *dated entries* over *living pages*: a living page like this one can always be rewritten to sound like I had a plan. A dated entry, written the day something broke, can't lie about that — and neither can a commit timestamp.

## What was actually broken, and how I knew

The whole site read as a narrow column of text sitting in a mostly-empty page.{% include sidenote.html number="1" text="A separate bug hit the header that same day, 40 minutes earlier (01:03): growing the nav to 7 items plus 4 social icons broke .site-header's position: fixed plus a hardcoded min-height — once the nav wrapped to a second line it overflowed past that assumed height and covered every page's heading. Fixed by dropping position: fixed and flattening a padding-top hack to a plain 20px. Unrelated to the width problem below, just close in time." %} I liked my palette and font — this wasn't a taste problem, it was a **measurement** problem, and it turned out to be two separate hardcoded numbers stacked on top of each other, not one.

{% capture cc1_explanation %}
The theme had inherited a fixed prose width, and, independently, a fixed page container on top of that. Fine on a laptop. On a 2560px ultrawide, 600px is less than a quarter of the screen, and 1100px isn't much better.
{% endcapture %}
{% capture cc1_code %}
```scss
// before
.page-content {
  max-width: 600px;
}
```
```scss
// before
$container-width: 1100px;
```
{% endcapture %}
{% assign cc1_explanation_html = cc1_explanation | markdownify %}
{% assign cc1_code_html = cc1_code | markdownify %}
{% include code-compare.html explanation=cc1_explanation_html code=cc1_code_html %}

The fix wasn't "make it wider" — a flat wider number just moves the same problem to a different screen size. So the two numbers changed shape, not just value, and in different directions:

{% capture cc2_explanation %}
The prose itself is pinned at a fixed 900px no matter what — that part didn't need to flex, reading gets worse past a certain line length regardless of screen size. What needed to flex was the page around it: never narrower than 1000px (protects small screens), never wider than 1440px (protects large ones from an absurdly wide container), and in between, scale with 72% of the viewport. Two rules doing two different jobs, and together they hold at 1440px, 1920px, and 2560px without a single media query.
{% endcapture %}
{% capture cc2_code %}
```scss
// after
.page-content {
  max-width: 100%;
}
// prose elements (paragraphs, headings, lists, quotes) keep a fixed,
// readable line length regardless of how wide the container gets
.page-content > article > p,
.page-content > article > h2,
/* ...and so on for h3/h4/ul/ol/dl/blockquote */ {
  max-width: 900px;
}

$container-width: clamp(1000px, 72vw, 1440px);
```
{% endcapture %}
{% assign cc2_explanation_html = cc2_explanation | markdownify %}
{% assign cc2_code_html = cc2_code | markdownify %}
{% include code-compare.html explanation=cc2_explanation_html code=cc2_code_html %}

Same commit, same evening: the homepage stopped being a dead pagination loop over an empty posts collection and became a plain list of links to the actual pages — Who I Am, Log, Art, No Fixed Point, Interests, Resumé, Contact. Not a redesign, just the first version of the homepage that pointed anywhere.

## Building in the open, with someone else in the loop

I didn't write this CSS alone. I work with two Claude instances split by role — one (this one, "Studio") for editorial and design judgment, one ("Workshop," in the terminal via Claude Code) for implementation, sitting in the actual repo. The division mattered more than I expected: Studio never touches the codebase, Workshop never invents content. Decisions get handed across in short, dated notes — `[From Studio]`, `[From Workshop]` — which is, not coincidentally, the same discipline as the dated-log structure I chose for the rest of the site. The website turned out to be documenting its own process for free, just by how I chose to build it.

## Building the toolkit, on this very page

Two of the entries in the timeline above happened on this page, about this page — which means if you're reading this on a wide enough screen, you're probably already looking at the result. The boxes to the right of this section, and the two-column blocks further up showing the CSS before and after, aren't illustrations. They're the actual first uses of the patterns being described.

That wasn't the plan going in. I asked for a way to use more of the screen's width — closer to how [Amelia Wattenberger's site](https://wattenberger.com/) or [Bartosz Ciechanowski's](https://ciechanow.ski/) feel dense without feeling cluttered — and the cheapest way to test whether a new layout pattern actually works is to build it against real content that already exists, rather than invent a demo for it. This page had both: code changes worth comparing side by side, and a tangent (a header bug, unrelated to the main fix) that was exactly the kind of aside a margin note exists for.

The sidenote took two tries. The first version floated directly out of the text column, and it looked cramped on every screen I checked, including a 2560px monitor where I expected it to have room to spare. The actual constraint turned out to be simpler and more permanent than a sizing mistake: once you account for the prose column's own cap and the container's absolute maximum width, the space left over for a margin note tops out at 240px — on *any* screen, because the container itself stops growing past a certain point on purpose, to keep the text readable. No screen was ever going to be wide enough to fix that version. The fix wasn't a bigger number. It was giving the sidenote a different address entirely — the same column that already holds the page's cross-links, rather than a separate patch of margin that was never big enough to begin with.
## What I stole, and from whom

None of this happened in a vacuum. Some of it is directly traceable:

- **[Josh Comeau](https://www.joshwcomeau.com/)** — interactivity as a gift the reader can decline, never a toll they have to pay to keep reading. This is why the STL viewer has a static image fallback and why nothing on this site requires JavaScript to be understood.
- **[Maggie Appleton](https://maggieappleton.com/)** and **[Amelia Wattenberger](https://wattenberger.com/)** — proof that dense, idea-rich pages can still feel inviting rather than cluttered, and that a personal site can be *outward-looking* — teaching something, not only describing its author.
- **[Fabien Sanglard](https://fabiensanglard.net/)** — the discomfort of recognizing this site's old aesthetic in his was actually the more useful lesson: dense and monospace is fine, but only once there's something being explained, not just someone being introduced.
- **[Bartosz Ciechanowski](https://ciechanow.ski/)** — the version of "interactive" I decided *against*. Beautiful work, but it asks the reader to operate the page to understand it. I wanted the opposite: understand first, play if you want to.

## What's still not built

A telemetry panel fed by a small script on my home server, so the site can show something like "last print finished 3 hours ago" without needing me to update anything by hand. A dual-track timeline on the [Who I Am](/who-i-am) page, visualizing the two-timelines structure that page argues in prose. Both are waiting on other things landing first — content, mostly, not code.

---

*The dated entries below are the specific record: the decisions, the things that didn't work the first time, the parts I'd do differently now.*
