## Context

The TikTok Shop landing page generator currently uses three monolithic source files:
- `src/main.js` (1640 lines) — 10 IIFEs handling all client-side interactivity
- `src/styles.css` (2990 lines) — 15 visual sections plus responsive rules
- `build.js` (1372 lines) — helpers, icons, 14 render functions, assembly, and build orchestration

All code already has clear `SECTION` markers with numbered headers. The split follows these natural boundaries exactly.

The project uses zero runtime dependencies and ESM (`"type": "module"` in package.json). Build output goes to `dist/` as static files (HTML + single CSS + single JS).

## Goals / Non-Goals

**Goals:**
- Split each monolithic file into focused, single-responsibility modules
- Keep dist/ output byte-identical (pure refactor, zero behavior change)
- Maintain zero-dependency build (Node built-ins only)
- Use file-system ordering (numeric prefixes) for concatenation — no config needed

**Non-Goals:**
- No bundler/toolchain introduction (no webpack, vite, rollup, esbuild)
- No ES module imports in client-side JS (stays as concatenated IIFEs)
- No CSS preprocessing (no SASS/PostCSS/etc)
- No code changes within the split files (content stays identical)
- No test framework setup (verified by build output comparison)

## Decisions

### 1. Concatenation strategy for client JS/CSS
**Decision**: Read all files from `src/js/*.js` and `src/css/*.css` sorted by filename, join with `\n`, write to dist.
**Why**: Numeric prefixes (01-, 02-, etc.) guarantee correct ordering. No config file needed. Adding a new section = adding a file with the right prefix number.
**Alternatives considered**: (a) Explicit file list in config — rejected: extra maintenance, defeats the purpose. (b) ES imports in client code — rejected: requires bundler.

### 2. Build module organization
**Decision**: `build/` directory with `helpers.js`, `icons.js`, `assemble.js`, and `sections/<name>.js` for each render function.
**Why**: Each render function is already self-contained (pure function → HTML string). They import helpers/icons as needed. The `sections/` subdirectory prevents a flat directory with 20+ files.
**Alternatives considered**: (a) Keep build.js monolithic — rejected: same problem we're solving. (b) Single `renderers.js` file — rejected: still too large at ~800 lines.

### 3. File naming convention
**Decision**: Numeric prefix matching original section numbers (01-nav, 02-carousel, etc.) with gaps preserved (no 03 in JS because Section 3 has no interactivity).
**Why**: Direct traceability to original section markers. Gaps communicate intentionality — developers know Section 3 has no JS file because it's CSS-only.

### 4. Handling shared state (window.__processOrderItem exposure)
**Decision**: The `13-checkout.js` file assigns `window.__processOrderItem` at its end. The `15-admin.js` file reads it. Since files are concatenated in order (13 before 15), this works identically to the current monolithic file.
**Why**: These two IIFEs already communicate via window globals. No change needed.

## Risks / Trade-offs

- **[Risk] File boundary newlines could differ from original** → Mitigation: Join files with `\n` (single newline). The original file has single newlines between sections. Verify with byte comparison during development.
- **[Risk] Sort order varies by OS locale** → Mitigation: Use explicit numeric sort on filenames (not locale-dependent `fs.readdirSync` default). Parse leading digits and sort numerically.
- **[Risk] Developer adds file without prefix** → Mitigation: Build step warns if any file in src/js/ or src/css/ lacks a numeric prefix. Non-prefixed files are appended last with a console warning.
