// ─── API Helper ───────────────────────────────────────────────────────────────
export const API = (path, opts = {}) =>
  fetch(path, { headers: { "Content-Type": "application/json" }, ...opts }).then(r => r.json());

// ─── Stars helper ─────────────────────────────────────────────────────────────
export const Stars = ({ n }) =>
  "★".repeat(Math.min(5, Math.max(0, n))) + "☆".repeat(5 - Math.min(5, Math.max(0, n)));
