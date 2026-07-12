import fs from 'fs';
import path from 'path';
import { iconStar, iconStarEmpty } from './icons.js';

// ── HTML-escape helper ───────────────────────────────────────
export function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// ── Format price with thousands separator ───────────────────
export function formatPrice(num) {
  return Number(num).toLocaleString('vi-VN');
}

// ── Derive discount percent ──────────────────────────────────
export function discountPct(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round((1 - price / originalPrice) * 100);
}

// ── Gold star string helper ──────────────────────────────────
export function goldStars(count) {
  const n = Math.max(0, Math.min(5, Math.round(count)));
  let out = '';
  for (let i = 0; i < n; i++) out += iconStar();
  for (let i = n; i < 5; i++) out += iconStarEmpty();
  return out;
}

// ── Asset copy helper ────────────────────────────────────────
export function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// ── Config validation ────────────────────────────────────────
export function validateConfig(site, tracking, products) {
  const errors = [];

  if (!site)     errors.push('config/products.js is missing the `site` export.');
  if (!tracking) errors.push('config/products.js is missing the `tracking` export.');
  if (!products) errors.push('config/products.js is missing the `products` export.');

  if (errors.length) {
    throw new Error('Config validation failed:\n' + errors.join('\n'));
  }

  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('`products` must be a non-empty array.');
  }

  // Required fields per product
  const required = ['id', 'slug', 'name', 'price'];
  const seen = {};
  products.forEach((p, i) => {
    const label = `products[${i}] (id: "${p.id || '?'}", slug: "${p.slug || '?'}")`;
    required.forEach(field => {
      if (p[field] == null || p[field] === '') {
        errors.push(`${label} is missing required field: "${field}".`);
      }
    });
    // Slug duplicate check
    if (p.slug) {
      if (seen[p.slug]) {
        errors.push(`Duplicate slug "${p.slug}" found in ${label} and products[${seen[p.slug]}].`);
      } else {
        seen[p.slug] = i;
      }
    }
  });

  if (errors.length) {
    throw new Error('Config validation failed:\n' + errors.join('\n'));
  }
}
