// build.js – TikTok Shop Landing Page Generator
// Concatenates src/js/*.js → dist/main.js, src/css/*.css → dist/styles.css,
// then generates product pages + catalog index from config/products.js.

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { copyRecursive, validateConfig } from './build/helpers.js';
import { assemblePage } from './build/assemble.js';
import { renderCatalogIndex } from './build/sections/catalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const ROOT      = __dirname;
const DIST      = path.join(ROOT, 'dist');
const SRC       = path.join(ROOT, 'src');
const ASSETS    = path.join(ROOT, 'assets');
const CONFIG    = path.join(ROOT, 'config', 'products.js');
const TEMPLATE  = path.join(SRC, 'template.html');

function numericSort(files) {
  return files.slice().sort((a, b) => {
    const na = parseInt(a.match(/^(\d+)/)?.[1] || '9999', 10);
    const nb = parseInt(b.match(/^(\d+)/)?.[1] || '9999', 10);
    if (na !== nb) return na - nb;
    return a.localeCompare(b);
  });
}

function concatFiles(dir, outFile) {
  const files = fs.readdirSync(dir);
  const sorted = numericSort(files);
  for (const f of sorted) {
    if (!/^\d+/.test(f)) {
      console.warn(`  ⚠ File without numeric prefix: ${f} (appended last)`);
    }
  }
  const content = sorted.map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('');
  fs.writeFileSync(outFile, content, 'utf8');
}

async function build() {
  console.log('Building TikTok Shop landing pages…\n');

  const configUrl = pathToFileURL(CONFIG).href;
  let site, tracking, products, sellerShelf, checkout, admin;
  try {
    const config = await import(configUrl);
    site        = config.site;
    tracking    = config.tracking;
    products    = config.products;
    sellerShelf = config.sellerShelf;
    checkout    = config.checkout || {};
    admin       = config.admin || {};
  } catch (err) {
    console.error('Failed to import config:', err.message);
    process.exit(1);
  }

  try { validateConfig(site, tracking, products); }
  catch (err) { console.error(err.message); process.exit(1); }

  let templateHtml;
  try { templateHtml = fs.readFileSync(TEMPLATE, 'utf8'); }
  catch (err) { console.error('Cannot read template:', err.message); process.exit(1); }

  fs.mkdirSync(DIST, { recursive: true });

  console.log('Copying assets…');
  concatFiles(path.join(SRC, 'css'), path.join(DIST, 'styles.css'));
  concatFiles(path.join(SRC, 'js'), path.join(DIST, 'main.js'));
  if (fs.existsSync(ASSETS)) {
    copyRecursive(ASSETS, path.join(DIST, 'assets'));
  }

  const generatedFiles = [];
  for (const product of products) {
    const html    = assemblePage(product, products, site, tracking, templateHtml, sellerShelf, checkout, admin);
    const outFile = path.join(DIST, `${product.slug}.html`);
    fs.writeFileSync(outFile, html, 'utf8');
    generatedFiles.push(`${product.slug}.html`);
    console.log(`  ✓ dist/${product.slug}.html`);
  }

  const indexHtml = renderCatalogIndex(products, site);
  fs.writeFileSync(path.join(DIST, 'index.html'), indexHtml, 'utf8');
  console.log('  ✓ dist/index.html');

  console.log(`\nBuild complete. ${generatedFiles.length} product pages + index.html generated in dist/\n`);
}

build().catch(err => { console.error('Build error:', err); process.exit(1); });
