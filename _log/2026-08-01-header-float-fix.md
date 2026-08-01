---
title: "Header nav float squeezing every page below it"
categories: [website]
date: 2026-08-01
---

Found via a screenshot on my own laptop: pages rendering as absurdly tall, narrow columns — one `<p>` reaching 4,066px, the whole `/log/website` page over 34,000px. Not a caching issue, not zoom, not the container-width fix from July — a separate bug, in the header.

`.site-title` and `.menu-list` in `_header.scss` are floated (`float: left`/`float: right`) to sit side by side, and `.site-header` was never given a clearfix. That was survivable while the nav fit on one line. Once it grew to 7 links + 4 social icons, it started wrapping to two lines on narrower viewports — and an uncleared float that overflows its parent squeezes the width of every block that comes after it in the document, for that float's entire height, not just where it visually overlaps. `.content-layout` was measuring in at 206px wide instead of ~1074px, and everything inside it wrapped accordingly.

Took this long to notice because it only triggers once the nav actually wraps, which depends on CSS pixel width, not physical screen size. My laptop runs at 166% display scaling, so a 2560px monitor only gives the browser ~1542 CSS px to lay out in — just narrow enough to wrap the nav. A normal, unscaled display never hits it.

Fix was a standard clearfix: `.site-header::after { content: ""; display: table; clear: both; }`, not `overflow: hidden` — that would've clipped the mobile dropdown menu, which also lives inside `.site-header` and needs to escape via `position: absolute`.
