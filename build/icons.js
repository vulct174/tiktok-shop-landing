// ── Inline SVG icon helpers ─────────────────────────────────
export function iconArrowLeft() {
  return '<svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="m20.24 24 13.17-13.17a1 1 0 0 0 0-1.42L30.6 6.6a1 1 0 0 0-1.42 0L12.82 22.94a1.5 1.5 0 0 0 0 2.12l16.35 16.35a1 1 0 0 0 1.42 0l2.82-2.82a1 1 0 0 0 0-1.42L20.24 24Z"/></svg>';
}

export function iconSearch() {
  return '<svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.83 7.5a14.34 14.34 0 1 1 0 28.68 14.34 14.34 0 0 1 0-28.68Zm0-4a18.33 18.33 0 1 0 11.48 32.64l8.9 8.9a1 1 0 0 0 1.42 0l1.4-1.41a1 1 0 0 0 0-1.42l-8.89-8.9A18.34 18.34 0 0 0 21.83 3.5Z"/></svg>';
}

export function iconPerson() {
  return '<svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="M24 3a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 4a6 6 0 1 0 0 12.00A6 6 0 0 0 24 7Zm0 19c10.3 0 16.67 6.99 17 17 .02.55-.43 1-1 1h-2c-.54 0-.98-.45-1-1-.3-7.84-4.9-13-13-13s-12.7 5.16-13 13c-.02.55-.46 1-1.02 1h-2c-.55 0-1-.45-.98-1 .33-10.01 6.7-17 17-17Z"/></svg>';
}

export function iconChevronRight() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';
}

// Narrow chevron matching TikTok reference: viewBox 0 0 24 48 (1:2 aspect).
// At font-size 16px on the container, width="0.5em"=8px, height="1em"=16px.
export function iconChevronRightNarrow() {
  return '<svg viewBox="0 0 24 48" width="0.5em" height="1em" fill="currentColor" aria-hidden="true"><path d="M16.73 24 2.7 9.98a1 1 0 0 1 0-1.41l1.13-1.13a1 1 0 0 1 1.41 0L21.11 23.3a1 1 0 0 1 0 1.41L5.25 40.57a1 1 0 0 1-1.41 0L2.7 39.44a1 1 0 0 1 0-1.42L16.73 24Z"></path></svg>';
}

export function iconChevronDown() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>';
}

export function iconStar() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="var(--star-gold)" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
}

export function iconStarEmpty() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
}

// Single solid black star (TikTok 48×48 path) — used in Section 3 rating row only.
// Do NOT use for the reviews section (which uses the gold iconStar helper).
export function iconStarSolid() {
  return '<svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="M24 4l5.09 10.31L41 15.64l-8.5 8.28 2 11.67L24 30.27l-10.5 5.32 2-11.67L7 15.64l11.91-1.33z"/></svg>';
}

export function iconCheck() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
}

export function iconTruck() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zM18 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>';
}

export function iconGift() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>';
}

// Flame icon for Flash sale label (Material "whatshot").
export function iconFlame() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>';
}

// Shopping cart / trolley — clean outline (stroke) matching TikTok bottom-bar style.
export function iconCart() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M2.5 4H5l1.9 11.4a1 1 0 0 0 1 .85h8.75a1 1 0 0 0 .98-.8L20.5 8H6.2"/></svg>';
}

// Shopping bag — clean outline (stroke) matching TikTok bottom-bar style.
export function iconShop() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.2 8h13.6l-1 11.4a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9L5.2 8Z"/><path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8"/></svg>';
}

// Speech-bubble / chat — clean outline (stroke) matching TikTok bottom-bar style.
export function iconChat() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9.5L5 19.5V16h-.5A1.5 1.5 0 0 1 4 14.5v-9A1.5 1.5 0 0 1 5.5 4Z"/></svg>';
}

/**
 * iconLocationPin()
 * Inline SVG: location / map-pin for address sheet.
 */
export function iconLocationPin() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
}

/**
 * iconCOD()
 * Cash on delivery icon (wallet/cash outline).
 */
export function iconCOD() {
  return '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 10v4m-2-2h4"/></svg>';
}

/**
 * iconPayLater()
 * TikTok PayLater icon (clock with coin).
 */
export function iconPayLater() {
  return '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>';
}

/**
 * iconCard()
 * Credit/debit card icon.
 */
export function iconCard() {
  return '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>';
}
