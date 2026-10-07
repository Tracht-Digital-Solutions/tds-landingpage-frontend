# Verification

## Scripts

```text
npm run type-check          # Astro/TypeScript correctness
npm run test:run            # Vitest unit and contract tests
npm run og:smoke            # render the default social card
npm run demos:sync          # re-harvest the demo sites; prints why each is hidden
npm run references:sync     # capture reference screenshots
npm run businesscard:sync   # recapture the business-card tile
npm run certificates:render # rebuild certificate images from committed PDFs
npm run studies:import      # write design-study WebPs
npm run images:variants     # regenerate committed pre-sized image copies
npm run build               # SSR build + release assembly/verification
npm run preview             # production-style local inspection
npm run audit:ux -- <url>   # overflow, targets, fixed chrome, focus, axe, deep links
npm run audit:geo -- <url>  # every sitemap page: title, description, H1, canonical, hreflang, OG image,
                            # JSON-LD (required AND refused types, @id resolution), Stand/author, sources,
                            # internal links, img alt, robots.txt, llms.txt
npm run audit:perf -- <url> # LCP median of 5 + the LCP ELEMENT, CLS, TTFB, bytes by type, decoded JS;
                            # 390 px and 1440 px, CPU ×4, cache off; budgets in scripts/perf-budget.json
npm run audit:contrast      # contrast checks axe leaves "incomplete" (glass, overlays)
npm run audit:chrome        # fixed chrome against content
npm run audit:prefetch      # prefetch behaviour
npm run audit:nav           # header/navigation checks
npm run indexnow -- --dry-run  # URLs IndexNow would be told about; manual, after a deploy
```

In Git Bash prefix `MSYS_NO_PATHCONV=1` for scripts taking `/` paths (e.g. `--paths=/`), or the argument becomes
a Windows path.

## `audit:perf` is the performance gate

Performance numbers used to be hand-taken Lighthouse readings nothing could reproduce. The most load-bearing check
is not a number: it **pins the LCP element to `h1#hero-heading`**. A per-word headline entrance once fragmented
the H1 so a paragraph became the largest paint, with no timing worse.

- Measure locally against locally; the local server doesn't compress and its first requests are cold.
- Restart the preview before measuring; a stale page cache can report 0 KB JS (a false green).

## Test environment

- The Vitest default environment is Node; opt a DOM test into jsdom in its file.
- `dist/`, `release/` and `var/` are generated and excluded. `.claude/worktrees/**` holds active worktrees.
- When judging a local render, a stale page cache can show old markup; clear it or disable it for the preview.

## Before hand-off

Verify at minimum: both locale trees, every service route, the pricing section, CMS fallbacks
(missing / partial / malformed / empty references), cache invalidation, sitemap and hreflang, JSON-LD, keyboard
focus and responsive layout (375 px, desktop, both themes, reduced motion).
