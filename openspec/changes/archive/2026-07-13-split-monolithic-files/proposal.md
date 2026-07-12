## Why

Three monolithic source files (main.js 1640 lines, build.js 1372 lines, styles.css 2990 lines) have grown too large for effective maintenance. Finding, editing, or reviewing a specific section requires scrolling through thousands of lines. Splitting into smaller, focused modules improves developer experience and reduces merge conflicts when multiple features are developed in parallel.

## What Changes

- Split `src/main.js` into 10 individual JS files under `src/js/`, one per IIFE section
- Split `src/styles.css` into 16 individual CSS files under `src/css/`, one per section
- Split `build.js` into a slim entry point plus ES module files under `build/` directory
- Update build process to concatenate split files back into single `dist/main.js` and `dist/styles.css`
- Remove original monolithic `src/main.js` and `src/styles.css` after split
- **dist/ output remains identical** — no behavior change

## Capabilities

### New Capabilities
- `modular-source-structure`: Organize source code into small, focused module files with a concatenation-based build step that produces identical dist output

### Modified Capabilities
<!-- None — this is a pure structural refactor with zero behavior change -->

## Impact

- **Files created**: ~30 new source files (10 JS, 16 CSS, ~6 build modules)
- **Files removed**: `src/main.js`, `src/styles.css`, original `build.js` content replaced
- **Build process**: Changes from file copy to file concatenation for JS/CSS
- **dist/ output**: No change — identical concatenated output
- **Dependencies**: None added (stays zero-dep)
- **Runtime behavior**: Zero change — same HTML, same JS, same CSS delivered to browser
