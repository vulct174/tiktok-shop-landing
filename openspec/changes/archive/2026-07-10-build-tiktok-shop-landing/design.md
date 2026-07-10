## Context

Greenfield project. The only inputs are the reference mockups in `des-refer/` (seven ~374×950px mobile screenshots representing the seven scroll sections of ONE complete product page, plus `_view/` product/thumbnail images). No image-rendering tool works in this environment, so the design system was extracted programmatically (PIL/cv2/numpy): background `#f0f0f0`, accent/CTA `#f01848`, dark section `#181818`, mobile-first single column. One real product cover was fetched from a TikTok share link and saved to `assets/products/den-nlmt-2000w-cover.jpg`.

The deliverable runs paid ads, so the overriding constraints are Core Web Vitals (fast LCP, minimal JS) and reliable tracking-pixel firing. A single config file must be the only thing a non-developer edits.

## Goals / Non-Goals

**Goals:**
- Static-output generator: `node build.js` → one standalone HTML per product + an index, from a single `src/template.html`.
- One editable ES-module config (`site`, `tracking`, `products`) driving all content, images, and tracking.
- Faithful 7-section mobile-first page matching the extracted palette.
- Config-driven Meta/TikTok/GA4/GTM injection with a unified `trackEvent()` fan-out.
- Build-time related-products resolution that always excludes the current product.
- Zero browser runtime dependencies; minimal hand-written vanilla JS.

**Non-Goals:**
- No cart/checkout backend, no payments — CTA fires tracking events and can deep-link out (placeholder URL).
- No CMS, no server runtime — output is static files.
- No pixel-perfect reproduction of every mockup glyph (fonts/exact copy are placeholder; layout & palette match).
- No SSR framework, no TypeScript build chain.

## Decisions

**D1 — Static site generator via plain Node, no framework.**
Chosen over React/Next/Astro. Rationale: an ads landing page benefits most from tiny payloads and pixels firing on first paint; a framework runtime adds hydration delay and pixel double-fire risk. Node built-ins (`fs`, `path`, dynamic `import()` of the ES-module config) are sufficient. Alternative considered: a template engine (Handlebars/EJS) — rejected to avoid a dependency; a small string-replace/`${}` template renderer over `src/template.html` is enough.

**D2 — Config as ES module (`config/products.js`), imported by the build.**
Chosen over JSON so the user can add comments and computed values, and so the build can `import()` it directly. `package.json` sets `"type": "module"` so both `build.js` and the config use ESM.

**D3 — Template rendering strategy.**
`src/template.html` holds the page skeleton with placeholder tokens and marked section regions. `build.js` renders per-product HTML fragments (gallery, price, variants, USP, detail, related) as strings and substitutes them, then writes `dist/<slug>.html`. Keeping section-render functions small and pure makes each of the 7 sections independently testable and avoids stubs.

**D4 — Asset handling.**
`build.js` copies `src/styles.css`, `src/main.js`, and `assets/` into `dist/` and references them with relative paths, so `dist/` is self-contained and servable by any static host. Image `src` = `${imageBaseDir}/${file}` resolved relative to page location.

**D5 — Tracking injection.**
Per provider, a snippet template with an `%%ID%%` placeholder. `build.js` includes a provider's snippet only when its ID is non-empty. GTM also emits the `<noscript>` iframe right after `<body>`. Client `main.js` defines `trackEvent(name, params)` that calls `fbq('track', …)`, `ttq.track(…)`, and pushes to `dataLayer`/`gtag(…)` — each guarded by a typeof check so a missing global is skipped, never thrown. Standard event names (`ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`) map across providers. GTM is recommended as the primary container so tags can change without code edits.

**D6 — Related-products exclusion at build time.**
For product P: `list = P.relatedIds?.length ? P.relatedIds.map(id→product) : allProducts`; then `list.filter(x => x && x.id !== P.id)`; unknown ids resolve to undefined and are filtered out. Doing this at build time means zero client JS for the related grid.

**D7 — Placeholder assets.**
Product #1 uses the real fetched cover + real name. Products #2–6 use generated placeholder images so the build produces no 404s before the user supplies real assets. A tiny script (or committed placeholder files) provides these; image references in config always point at files that exist.

## Risks / Trade-offs

- **[Windows path handling in Node build]** → use `path.join`/`path.posix` for emitted URLs (forward slashes) vs filesystem paths; test the build on the actual Windows environment.
- **[ESM dynamic import of config on Windows]** → import via a `file://` URL (`pathToFileURL`) to avoid drive-letter/backslash import failures.
- **[Pixel snippets are third-party code]** → injected only when the user opts in via a non-empty ID; empty by default, so no tracking ships unconfigured (privacy-safe default).
- **[No real product data/images yet]** → placeholders are clearly labeled and isolated in config so replacement is a pure content edit, not a code change.
- **[Sticky CTA overlapping content]** → reserve bottom padding on the page body equal to the CTA bar height so the last content isn't hidden.
- **[Design fidelity without visual tooling]** → palette/structure derived from band analysis; exact spacing is a best-effort match and easily tuned in `styles.css` later.

## Migration Plan

Not applicable (greenfield). Deploy = serve the `dist/` directory on any static host/CDN. Rollback = redeploy previous `dist/`. To go live with tracking: fill IDs in `config/products.js` and re-run `npm run build`.

## Open Questions

- None blocking. CTA destination URL (deep link to TikTok Shop vs. lead form) is a config value the user can set later; defaults to a placeholder `#` anchor that still fires the tracking event.
