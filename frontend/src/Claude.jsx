import { useState, useEffect, useCallback } from "react";

// ─── CSS Injection ───────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #FAF7F2;
    --warm-white: #FFFDF9;
    --ink: #1A1208;
    --bark: #4A3728;
    --spice: #C4521A;
    --spice-light: #E8784A;
    --sage: #6B7F5E;
    --sage-light: #A8BF9A;
    --gold: #D4A843;
    --muted: #8A7060;
    --border: #E8E0D4;
    --card-bg: #FFFDF9;
    --shadow: 0 2px 20px rgba(26,18,8,0.08);
    --shadow-hover: 0 8px 40px rgba(26,18,8,0.15);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); }

  /* ── Auth ── */
  .auth-wrap {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--ink);
    background-image: radial-gradient(ellipse at 20% 50%, rgba(196,82,26,0.15) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(107,127,94,0.1) 0%, transparent 50%);
  }
  .auth-panel {
    background: var(--warm-white); border-radius: 16px; padding: 3rem;
    width: 100%; max-width: 420px; box-shadow: 0 40px 80px rgba(0,0,0,0.4);
  }
  .auth-logo { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: var(--spice); letter-spacing: -0.5px; margin-bottom: 0.25rem; }
  .auth-tagline { font-size: 0.85rem; color: var(--muted); margin-bottom: 2.5rem; }
  .auth-tab-row { display: flex; gap: 0; margin-bottom: 2rem; border-bottom: 2px solid var(--border); }
  .auth-tab {
    flex: 1; padding: 0.65rem; background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: var(--muted);
    border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s;
  }
  .auth-tab.active { color: var(--spice); border-bottom-color: var(--spice); font-weight: 500; }
  .auth-field { margin-bottom: 1.1rem; }
  .auth-field label { display: block; font-size: 0.78rem; font-weight: 500; color: var(--bark); margin-bottom: 0.4rem; letter-spacing: 0.05em; text-transform: uppercase; }
  .auth-field input {
    width: 100%; padding: 0.75rem 1rem; border: 1.5px solid var(--border); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem; background: var(--cream);
    color: var(--ink); transition: border-color 0.2s; outline: none;
  }
  .auth-field input:focus { border-color: var(--spice); background: var(--warm-white); }
  .auth-field select {
    width: 100%; padding: 0.75rem 1rem; border: 1.5px solid var(--border); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem; background: var(--cream); color: var(--ink);
  }
  .btn-primary {
    width: 100%; padding: 0.85rem; background: var(--spice); color: #fff; border: none;
    border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 500;
    cursor: pointer; transition: background 0.2s, transform 0.1s; margin-top: 0.5rem;
  }
  .btn-primary:hover { background: var(--spice-light); }
  .btn-primary:active { transform: scale(0.99); }
  .auth-error { color: #C0392B; font-size: 0.82rem; margin-top: 0.75rem; text-align: center; }

  /* ── Nav ── */
  .topnav {
    position: sticky; top: 0; z-index: 100; background: var(--ink);
    display: flex; align-items: center; padding: 0 2rem; height: 60px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.3);
  }
  .nav-logo { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--spice); margin-right: 3rem; cursor: pointer; }
  .nav-links { display: flex; gap: 0.25rem; flex: 1; }
  .nav-link {
    padding: 0.5rem 0.9rem; border-radius: 6px; border: none; background: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: rgba(255,255,255,0.65);
    transition: all 0.2s; letter-spacing: 0.02em;
  }
  .nav-link:hover { color: #fff; background: rgba(255,255,255,0.08); }
  .nav-link.active { color: var(--gold); font-weight: 500; }
  .nav-search {
    display: flex; align-items: center; background: rgba(255,255,255,0.1); border-radius: 8px;
    padding: 0.4rem 0.8rem; gap: 0.5rem; margin: 0 1rem;
  }
  .nav-search input {
    background: none; border: none; outline: none; color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem; width: 180px;
  }
  .nav-search input::placeholder { color: rgba(255,255,255,0.4); }
  .nav-user {
    display: flex; align-items: center; gap: 0.75rem;
    font-size: 0.85rem; color: rgba(255,255,255,0.7);
  }
  .btn-logout {
    padding: 0.4rem 0.9rem; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px;
    background: none; color: rgba(255,255,255,0.7); cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; transition: all 0.2s;
  }
  .btn-logout:hover { border-color: var(--spice); color: var(--spice); }

  /* ── Page Shell ── */
  .page { max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem; }
  .page-title { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--ink); margin-bottom: 0.4rem; }
  .page-sub { color: var(--muted); font-size: 0.9rem; margin-bottom: 2rem; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; margin-bottom: 1.25rem; color: var(--bark); }

  /* ── Cards ── */
  .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
  .recipe-card {
    background: var(--card-bg); border-radius: 12px; padding: 1.5rem;
    box-shadow: var(--shadow); border: 1px solid var(--border);
    transition: box-shadow 0.25s, transform 0.25s;
  }
  .recipe-card:hover { box-shadow: var(--shadow-hover); transform: translateY(-2px); }
  .card-title { font-family: 'Playfair Display', serif; font-size: 1.15rem; margin-bottom: 0.4rem; color: var(--ink); }
  .card-desc { font-size: 0.85rem; color: var(--muted); line-height: 1.5; margin-bottom: 0.75rem; }
  .card-meta { display: flex; gap: 1rem; font-size: 0.78rem; color: var(--sage); margin-bottom: 1rem; }
  .card-meta span { display: flex; align-items: center; gap: 0.3rem; }
  .card-actions { display: flex; gap: 0.5rem; }
  .btn-sm {
    padding: 0.4rem 0.9rem; border-radius: 6px; font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem; cursor: pointer; transition: all 0.2s; font-weight: 500;
  }
  .btn-edit { background: var(--cream); border: 1px solid var(--border); color: var(--bark); }
  .btn-edit:hover { border-color: var(--bark); background: var(--bark); color: #fff; }
  .btn-delete { background: #FEF0EE; border: 1px solid #FBCBC5; color: #C0392B; }
  .btn-delete:hover { background: #C0392B; color: #fff; }
  .btn-ghost {
    padding: 0.5rem 1.2rem; border-radius: 8px; border: 1.5px solid var(--border); background: none;
    color: var(--bark); cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
    transition: all 0.2s; font-weight: 500;
  }
  .btn-ghost:hover { border-color: var(--spice); color: var(--spice); }
  .btn-accent {
    padding: 0.55rem 1.4rem; border-radius: 8px; border: none; background: var(--spice); color: #fff;
    cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500;
    transition: background 0.2s;
  }
  .btn-accent:hover { background: var(--spice-light); }

  /* ── Form ── */
  .form-card {
    background: var(--card-bg); border-radius: 12px; padding: 2rem;
    box-shadow: var(--shadow); border: 1px solid var(--border); margin-bottom: 2rem;
  }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-field { margin-bottom: 0; }
  .form-field.full { grid-column: 1 / -1; }
  .form-field label { display: block; font-size: 0.78rem; font-weight: 500; color: var(--bark); margin-bottom: 0.35rem; letter-spacing: 0.05em; text-transform: uppercase; }
  .form-field input, .form-field textarea {
    width: 100%; padding: 0.65rem 0.9rem; border: 1.5px solid var(--border); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 0.92rem; background: var(--cream); color: var(--ink);
    transition: border-color 0.2s; outline: none; resize: vertical;
  }
  .form-field input:focus, .form-field textarea:focus { border-color: var(--spice); background: #fff; }
  .form-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
  .empty-state { text-align: center; padding: 3rem 1rem; color: var(--muted); }
  .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
  .empty-state p { font-size: 0.95rem; margin-bottom: 1.5rem; }

  /* ── Modal ── */
  .modal-backdrop {
    position: fixed; inset: 0; background: rgba(26,18,8,0.55); z-index: 200;
    display: flex; align-items: center; justify-content: center; padding: 1rem;
  }
  .modal {
    background: var(--warm-white); border-radius: 14px; padding: 2rem;
    width: 100%; max-width: 540px; box-shadow: 0 30px 60px rgba(0,0,0,0.3);
    max-height: 90vh; overflow-y: auto;
  }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 1.5rem; }

  /* ── Browse sub-nav ── */
  .sub-nav { display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
  .sub-tab {
    padding: 0.5rem 1.2rem; border-radius: 20px; border: 1.5px solid var(--border);
    background: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    color: var(--muted); transition: all 0.2s;
  }
  .sub-tab.active { background: var(--spice); border-color: var(--spice); color: #fff; }
  .sub-tab:hover:not(.active) { border-color: var(--bark); color: var(--bark); }

  /* ── Lookup table ── */
  .lookup-list { display: flex; flex-direction: column; gap: 0.75rem; }
  .lookup-item {
    background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px;
    padding: 1rem 1.25rem; display: flex; align-items: center; gap: 1rem;
  }
  .lookup-item-info { flex: 1; }
  .lookup-item-name { font-weight: 500; color: var(--ink); margin-bottom: 0.15rem; }
  .lookup-item-desc { font-size: 0.8rem; color: var(--muted); }
  .badge {
    display: inline-block; padding: 0.2rem 0.6rem; border-radius: 12px;
    font-size: 0.72rem; font-weight: 500; background: var(--sage-light); color: var(--sage);
  }

  /* ── Collections ── */
  .folder-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; }
  .folder-card {
    background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px;
    padding: 1.5rem; cursor: pointer; transition: all 0.25s; box-shadow: var(--shadow);
  }
  .folder-card:hover { box-shadow: var(--shadow-hover); transform: translateY(-2px); }
  .folder-icon { font-size: 2rem; margin-bottom: 0.75rem; }
  .folder-name { font-family: 'Playfair Display', serif; font-size: 1.05rem; margin-bottom: 0.3rem; }
  .folder-meta { font-size: 0.78rem; color: var(--muted); }
  .privacy-badge {
    display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.72rem;
    padding: 0.2rem 0.6rem; border-radius: 10px; margin-top: 0.5rem;
  }
  .privacy-private { background: #FFF3CD; color: #856404; }
  .privacy-public { background: #D1FAE5; color: #065F46; }

  /* ── Reviews ── */
  .review-card {
    background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px;
    padding: 1.5rem; box-shadow: var(--shadow); margin-bottom: 1rem;
  }
  .review-stars { color: var(--gold); font-size: 1rem; margin-bottom: 0.5rem; }
  .review-comment { font-size: 0.92rem; color: var(--ink); line-height: 1.6; margin-bottom: 0.5rem; }
  .review-meta { font-size: 0.78rem; color: var(--muted); }

  /* ── Search ── */
  .search-bar-big {
    display: flex; gap: 0.75rem; margin-bottom: 2rem;
  }
  .search-bar-big input {
    flex: 1; padding: 0.85rem 1.25rem; border: 2px solid var(--border); border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 1rem; background: var(--card-bg); outline: none;
    transition: border-color 0.2s; color: var(--ink);
  }
  .search-bar-big input:focus { border-color: var(--spice); }

  /* ── Home ── */
  .hero {
    background: var(--ink); border-radius: 16px; padding: 3rem; margin-bottom: 2.5rem;
    background-image: radial-gradient(ellipse at 0% 100%, rgba(196,82,26,0.25) 0%, transparent 60%);
  }
  .hero-title { font-family: 'Playfair Display', serif; font-size: 2.4rem; color: #fff; margin-bottom: 0.5rem; }
  .hero-title em { color: var(--gold); font-style: italic; }
  .hero-sub { color: rgba(255,255,255,0.6); font-size: 0.95rem; }

  /* ── Toast ── */
  .toast {
    position: fixed; bottom: 2rem; right: 2rem; padding: 0.85rem 1.5rem;
    border-radius: 10px; font-size: 0.88rem; z-index: 300; box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    animation: slideUp 0.3s ease;
  }
  .toast.success { background: var(--sage); color: #fff; }
  .toast.error { background: #C0392B; color: #fff; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  .divider { height: 1px; background: var(--border); margin: 2rem 0; }
  .loading { color: var(--muted); font-size: 0.9rem; padding: 2rem; text-align: center; }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const API = (path, opts = {}) =>
  fetch(path, { headers: { "Content-Type": "application/json" }, ...opts }).then(r => r.json());

const Stars = ({ n }) => "★".repeat(Math.min(5, Math.max(0, n))) + "☆".repeat(5 - Math.min(5, Math.max(0, n)));

// ─── Toast ───────────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return [toast, show];
}

// ─── RecipeForm ───────────────────────────────────────────────────────────────
function RecipeForm({ initial = {}, onSave, onCancel, title }) {
  const [f, setF] = useState({ title: "", description: "", instructions: "", prep_time: "", cook_time: "", servings: "", ...initial });
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  return (
    <div>
      <div className="form-grid">
        <div className="form-field full">
          <label>Recipe Title</label>
          <input value={f.title} onChange={set("title")} placeholder="e.g. Lemon Herb Roasted Chicken" />
        </div>
        <div className="form-field full">
          <label>Description</label>
          <textarea rows={2} value={f.description} onChange={set("description")} placeholder="Brief description..." />
        </div>
        <div className="form-field full">
          <label>Instructions</label>
          <textarea rows={4} value={f.instructions} onChange={set("instructions")} placeholder="Step-by-step instructions..." />
        </div>
        <div className="form-field"><label>Prep Time</label><input value={f.prep_time} onChange={set("prep_time")} placeholder="e.g. 20 mins" /></div>
        <div className="form-field"><label>Cook Time</label><input value={f.cook_time} onChange={set("cook_time")} placeholder="e.g. 45 mins" /></div>
        <div className="form-field"><label>Servings</label><input value={f.servings} onChange={set("servings")} placeholder="e.g. 4" /></div>
      </div>
      <div className="form-actions">
        <button className="btn-accent" onClick={() => onSave(f)}>{title || "Save"}</button>
        {onCancel && <button className="btn-ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}

// ─── MyRecipes Page ───────────────────────────────────────────────────────────
function MyRecipes({ user, showToast }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    API(`/api/recipes/${user.user_id}`).then(d => {
      setRecipes(d.success ? d.recipes : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);
  useEffect(load, [load]);

  const add = async (f) => {
    const d = await API("/api/recipes", { method: "POST", body: JSON.stringify({ ...f, user_id: user.user_id }) });
    if (d.success) { showToast("Recipe added!"); setAdding(false); load(); }
    else showToast(d.error, "error");
  };

  const del = async (id) => {
    if (!confirm("Delete this recipe?")) return;
    const d = await API(`/api/recipes/${id}`, { method: "DELETE" });
    if (d.success) { showToast("Recipe deleted"); load(); }
    else showToast(d.error, "error");
  };

  const update = async (f) => {
    const d = await API(`/api/recipes/${editing.recipe_id}`, { method: "PUT", body: JSON.stringify(f) });
    if (d.success) { showToast("Recipe updated!"); setEditing(null); load(); }
    else showToast(d.error, "error");
  };

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
        <h1 className="page-title">My Recipes</h1>
        <button className="btn-accent" onClick={() => setAdding(v => !v)}>
          {adding ? "✕ Cancel" : "+ New Recipe"}
        </button>
      </div>
      <p className="page-sub">Recipes you've created and shared.</p>

      {adding && (
        <div className="form-card">
          <div className="section-title">New Recipe</div>
          <RecipeForm onSave={add} onCancel={() => setAdding(false)} title="Add Recipe" />
        </div>
      )}

      {loading ? <p className="loading">Loading recipes…</p> : recipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <p>No recipes yet. Add your first one above!</p>
        </div>
      ) : (
        <div className="card-grid">
          {recipes.map(r => (
            <div className="recipe-card" key={r.recipe_id}>
              <div className="card-title">{r.title}</div>
              <div className="card-desc">{r.description || "No description provided."}</div>
              <div className="card-meta">
                {r.prep_time && <span>⏱ {r.prep_time}</span>}
                {r.cook_time && <span>🔥 {r.cook_time}</span>}
                {r.servings && <span>👥 {r.servings}</span>}
              </div>
              <div className="card-actions">
                <button className="btn-sm btn-edit" onClick={() => setEditing(r)}>Edit</button>
                <button className="btn-sm btn-delete" onClick={() => del(r.recipe_id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-title">Edit Recipe</div>
            <RecipeForm initial={editing} onSave={update} onCancel={() => setEditing(null)} title="Save Changes" />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Lookup Panel (for Ingredients / Cuisines / Dietary Flags) ────────────────
function LookupPanel({ endpoint, label, fields, showToast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const [adding, setAdding] = useState(false);

  const load = useCallback(() => {
    // No GET endpoint on these; show empty with add form
    setItems([]);
  }, [endpoint]);
  useEffect(load, [load, endpoint]);

  const add = async () => {
    if (!form.name) return;
    const d = await API(`/api/${endpoint}`, { method: "POST", body: JSON.stringify(form) });
    if (d.success) { showToast(`${label} added!`); setForm({}); setAdding(false); }
    else showToast(d.error, "error");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div className="section-title" style={{ margin: 0 }}>{label}</div>
        <button className="btn-accent" onClick={() => setAdding(v => !v)}>
          {adding ? "✕ Cancel" : `+ Add ${label}`}
        </button>
      </div>

      {adding && (
        <div className="form-card">
          {fields.map(f => (
            <div className="form-field" key={f.key} style={{ marginBottom: "1rem" }}>
              <label>{f.label}</label>
              <input value={form[f.key] || ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder || f.label} />
            </div>
          ))}
          <div className="form-actions">
            <button className="btn-accent" onClick={add}>Add {label}</button>
            <button className="btn-ghost" onClick={() => { setAdding(false); setForm({}); }}>Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗂</div>
          <p>No {label.toLowerCase()} records found. Add some above!</p>
        </div>
      ) : (
        <div className="lookup-list">
          {items.map((item, i) => (
            <div className="lookup-item" key={i}>
              <div className="lookup-item-info">
                <div className="lookup-item-name">{item.name}</div>
                {item.description && <div className="lookup-item-desc">{item.description}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Collections ──────────────────────────────────────────────────────────────
function Collections({ user, showToast }) {
  const [cols, setCols] = useState([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", privacy_status: "private" });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const add = async () => {
    if (!form.title) return;
    const d = await API("/api/collections", { method: "POST", body: JSON.stringify({ ...form, user_id: user.user_id }) });
    if (d.success) { showToast("Collection created!"); setCols(p => [...p, { ...form, collection_id: d.collection_id }]); setAdding(false); setForm({ title: "", description: "", privacy_status: "private" }); }
    else showToast(d.error, "error");
  };

  const del = async (id) => {
    if (!confirm("Delete this collection?")) return;
    const d = await API(`/api/collections/${id}`, { method: "DELETE" });
    if (d.success) { showToast("Collection deleted"); setCols(p => p.filter(c => c.collection_id !== id)); }
    else showToast(d.error, "error");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div className="section-title" style={{ margin: 0 }}>My Collections</div>
        <button className="btn-accent" onClick={() => setAdding(v => !v)}>{adding ? "✕ Cancel" : "+ New Collection"}</button>
      </div>

      {adding && (
        <div className="form-card">
          <div className="form-field" style={{ marginBottom: "1rem" }}>
            <label>Collection Name</label>
            <input value={form.title} onChange={set("title")} placeholder="e.g. Weekend Brunch Ideas" />
          </div>
          <div className="form-field" style={{ marginBottom: "1rem" }}>
            <label>Description</label>
            <input value={form.description} onChange={set("description")} placeholder="What's in this collection?" />
          </div>
          <div className="form-field" style={{ marginBottom: "1rem" }}>
            <label>Privacy</label>
            <select value={form.privacy_status} onChange={set("privacy_status")} style={{ width: "100%", padding: "0.65rem 0.9rem", border: "1.5px solid var(--border)", borderRadius: "8px", fontFamily: "DM Sans, sans-serif", fontSize: "0.92rem", background: "var(--cream)" }}>
              <option value="private">🔒 Private</option>
              <option value="public">🌐 Public</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="btn-accent" onClick={add}>Create Collection</button>
            <button className="btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      {cols.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <p>No collections yet. Create one to organize your favorite recipes!</p>
        </div>
      ) : (
        <div className="folder-grid">
          {cols.map(c => (
            <div className="folder-card" key={c.collection_id}>
              <div className="folder-icon">📂</div>
              <div className="folder-name">{c.title}</div>
              <div className="folder-meta">{c.description || "No description"}</div>
              <div className={`privacy-badge ${c.privacy_status === "public" ? "privacy-public" : "privacy-private"}`}>
                {c.privacy_status === "public" ? "🌐 Public" : "🔒 Private"}
              </div>
              <div style={{ marginTop: "1rem" }}>
                <button className="btn-sm btn-delete" onClick={() => del(c.collection_id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Browse Page ──────────────────────────────────────────────────────────────
function Browse({ user, showToast }) {
  const [tab, setTab] = useState("ingredients");
  const tabs = [
    { key: "ingredients", label: "🥕 Ingredients" },
    { key: "cuisines", label: "🌍 Cuisines" },
    { key: "dietary-flags", label: "🌿 Dietary Flags" },
    { key: "collections", label: "📁 My Collections" },
  ];

  return (
    <div className="page">
      <h1 className="page-title">Browse</h1>
      <p className="page-sub">Explore ingredients, cuisines, dietary options, and your saved collections.</p>
      <div className="sub-nav">
        {tabs.map(t => (
          <button key={t.key} className={`sub-tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {tab === "ingredients" && (
        <LookupPanel endpoint="ingredients" label="Ingredient" fields={[
          { key: "name", label: "Name", placeholder: "e.g. Garlic" },
          { key: "description", label: "Description", placeholder: "Optional description" }
        ]} showToast={showToast} />
      )}
      {tab === "cuisines" && (
        <LookupPanel endpoint="cuisines" label="Cuisine" fields={[
          { key: "name", label: "Name", placeholder: "e.g. Italian" },
          { key: "description", label: "Description", placeholder: "Optional description" }
        ]} showToast={showToast} />
      )}
      {tab === "dietary-flags" && (
        <LookupPanel endpoint="dietary-flags" label="Dietary Flag" fields={[
          { key: "name", label: "Name", placeholder: "e.g. Vegan" },
          { key: "description", label: "Description", placeholder: "Optional description" }
        ]} showToast={showToast} />
      )}
      {tab === "collections" && <Collections user={user} showToast={showToast} />}
    </div>
  );
}

// ─── Community / Reviews Page ─────────────────────────────────────────────────
function Community({ user, showToast }) {
  const [reviews, setReviews] = useState([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ recipe_id: "", comment: "", rating: 5 });
  const [editing, setEditing] = useState(null);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const add = async () => {
    if (!form.recipe_id) return;
    const d = await API("/api/reviews", { method: "POST", body: JSON.stringify({ ...form, user_id: user.user_id, rating: Number(form.rating) }) });
    if (d.success) {
      showToast("Review posted!");
      setReviews(p => [{ ...form, review_id: d.review_id, rating: Number(form.rating) }, ...p]);
      setAdding(false); setForm({ recipe_id: "", comment: "", rating: 5 });
    } else showToast(d.error, "error");
  };

  const del = async (id) => {
    if (!confirm("Delete this review?")) return;
    const d = await API(`/api/reviews/${id}`, { method: "DELETE" });
    if (d.success) { showToast("Review deleted"); setReviews(p => p.filter(r => r.review_id !== id)); }
    else showToast(d.error, "error");
  };

  const saveEdit = async () => {
    const d = await API(`/api/reviews/${editing.review_id}`, { method: "PUT", body: JSON.stringify({ comment: editing.comment, rating: Number(editing.rating) }) });
    if (d.success) { showToast("Review updated!"); setReviews(p => p.map(r => r.review_id === editing.review_id ? { ...r, ...editing } : r)); setEditing(null); }
    else showToast(d.error, "error");
  };

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
        <h1 className="page-title">Community</h1>
        <button className="btn-accent" onClick={() => setAdding(v => !v)}>{adding ? "✕ Cancel" : "+ Post Review"}</button>
      </div>
      <p className="page-sub">Share your thoughts and ratings on recipes.</p>

      {adding && (
        <div className="form-card">
          <div className="section-title">New Review</div>
          <div className="form-field" style={{ marginBottom: "1rem" }}>
            <label>Recipe ID</label>
            <input value={form.recipe_id} onChange={set("recipe_id")} placeholder="Enter recipe ID" />
          </div>
          <div className="form-field" style={{ marginBottom: "1rem" }}>
            <label>Rating (1–5)</label>
            <input type="number" min="1" max="5" value={form.rating} onChange={set("rating")} />
          </div>
          <div className="form-field" style={{ marginBottom: "1rem" }}>
            <label>Comment</label>
            <textarea rows={3} value={form.comment} onChange={set("comment")} placeholder="Share your thoughts…" />
          </div>
          <div className="form-actions">
            <button className="btn-accent" onClick={add}>Post Review</button>
            <button className="btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <p>No reviews yet. Post your first one!</p>
        </div>
      ) : (
        reviews.map(r => (
          <div className="review-card" key={r.review_id}>
            <div className="review-stars"><Stars n={Number(r.rating)} /> ({r.rating}/5)</div>
            <div className="review-comment">{r.comment || "No comment."}</div>
            <div className="review-meta">Recipe #{r.recipe_id}</div>
            <div className="card-actions" style={{ marginTop: "0.75rem" }}>
              <button className="btn-sm btn-edit" onClick={() => setEditing({ ...r })}>Edit</button>
              <button className="btn-sm btn-delete" onClick={() => del(r.review_id)}>Delete</button>
            </div>
          </div>
        ))
      )}

      {editing && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-title">Edit Review</div>
            <div className="form-field" style={{ marginBottom: "1rem" }}>
              <label>Rating</label>
              <input type="number" min="1" max="5" value={editing.rating} onChange={e => setEditing(p => ({ ...p, rating: e.target.value }))} />
            </div>
            <div className="form-field" style={{ marginBottom: "1rem" }}>
              <label>Comment</label>
              <textarea rows={3} value={editing.comment} onChange={e => setEditing(p => ({ ...p, comment: e.target.value }))} />
            </div>
            <div className="form-actions">
              <button className="btn-accent" onClick={saveEdit}>Save</button>
              <button className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Search Page ──────────────────────────────────────────────────────────────
function Search({ user, showToast }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const doSearch = async () => {
    if (!q.trim()) return;
    // Query via the raw SQL endpoint, filtering by title LIKE
    const d = await API("/api/query", { method: "POST", body: JSON.stringify({ query: `SELECT * FROM RECIPE WHERE title LIKE '%${q.replace(/'/g, "''")}%' LIMIT 20` }) });
    if (d.success && d.columns) {
      const cols = d.columns;
      const mapped = d.rows.map(row => Object.fromEntries(cols.map((c, i) => [c, row[i]])));
      setResults(mapped);
    } else {
      setResults([]);
    }
    setSearched(true);
  };

  return (
    <div className="page">
      <h1 className="page-title">Search Recipes</h1>
      <p className="page-sub">Find recipes by title.</p>
      <div className="search-bar-big">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search recipes…" onKeyDown={e => e.key === "Enter" && doSearch()} />
        <button className="btn-accent" onClick={doSearch}>Search</button>
      </div>
      {searched && results.length === 0 && (
        <div className="empty-state"><div className="empty-icon">🔍</div><p>No recipes found for "{q}".</p></div>
      )}
      {results.length > 0 && (
        <div className="card-grid">
          {results.map(r => (
            <div className="recipe-card" key={r.recipe_id}>
              <div className="card-title">{r.title}</div>
              <div className="card-desc">{r.description || "No description."}</div>
              <div className="card-meta">
                {r.prep_time && <span>⏱ {r.prep_time}</span>}
                {r.cook_time && <span>🔥 {r.cook_time}</span>}
                {r.servings && <span>👥 {r.servings}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function Home({ user }) {
  return (
    <div className="page">
      <div className="hero">
        <div className="hero-title">Welcome back, <em>{user.username}</em>.</div>
        <div className="hero-sub">Discover, create, and share recipes with the community.</div>
      </div>
      <div className="section-title">Quick Actions</div>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {[["📖", "My Recipes", "View and manage your recipes"], ["🌍", "Browse", "Explore ingredients & cuisines"], ["💬", "Community", "Share reviews & feedback"], ["🔍", "Search", "Find any recipe instantly"]].map(([icon, title, desc]) => (
          <div key={title} className="recipe-card" style={{ minWidth: "200px", flex: "1" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{icon}</div>
            <div className="card-title">{title}</div>
            <div className="card-desc">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
function Auth({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [f, setF] = useState({ username: "", email: "", password: "", role: "user" });
  const [err, setErr] = useState("");
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    setErr("");
    if (tab === "login") {
      // Simulate login via query
      const d = await API("/api/query", { method: "POST", body: JSON.stringify({ query: `SELECT * FROM USER WHERE username='${f.username.replace(/'/g, "''")}' AND password='${f.password.replace(/'/g, "''")}' LIMIT 1` }) });
      if (d.success && d.rows?.length) {
        const cols = d.columns;
        const user = Object.fromEntries(cols.map((c, i) => [c, d.rows[0][i]]));
        onLogin(user);
      } else { setErr("Invalid username or password."); }
    } else {
      if (!f.username || !f.email || !f.password) { setErr("All fields required."); return; }
      const d = await API("/api/users", { method: "POST", body: JSON.stringify(f) });
      if (d.success) { setTab("login"); setErr("Account created! Please log in."); }
      else setErr(d.error || "Could not create account.");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-panel">
        <div className="auth-logo">🍽 Reciply</div>
        <div className="auth-tagline">Discover, create & share recipes you love.</div>
        <div className="auth-tab-row">
          <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setErr(""); }}>Sign In</button>
          <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setErr(""); }}>Create Account</button>
        </div>
        <div className="auth-field"><label>Username</label><input value={f.username} onChange={set("username")} placeholder="your_username" onKeyDown={e => e.key === "Enter" && submit()} /></div>
        {tab === "signup" && <div className="auth-field"><label>Email</label><input type="email" value={f.email} onChange={set("email")} placeholder="you@example.com" /></div>}
        <div className="auth-field"><label>Password</label><input type="password" value={f.password} onChange={set("password")} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && submit()} /></div>
        {tab === "signup" && (
          <div className="auth-field">
            <label>Role</label>
            <select value={f.role} onChange={set("role")}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}
        {err && <div className="auth-error">{err}</div>}
        <button className="btn-primary" onClick={submit}>{tab === "login" ? "Sign In" : "Create Account"}</button>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [searchQ, setSearchQ] = useState("");
  const [toast, showToast] = useToast();

  const navLinks = [
    { key: "home", label: "Home" },
    { key: "recipes", label: "My Recipes" },
    { key: "browse", label: "Browse" },
    { key: "community", label: "Community" },
    { key: "search", label: "Search" },
  ];

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQ.trim()) { setPage("search"); }
  };

  if (!user) return (
    <>
      <style>{css}</style>
      <Auth onLogin={setUser} />
    </>
  );

  return (
    <>
      <style>{css}</style>
      <nav className="topnav">
        <div className="nav-logo" onClick={() => setPage("home")}>🍽 Reciply</div>
        <div className="nav-links">
          {navLinks.map(l => (
            <button key={l.key} className={`nav-link ${page === l.key ? "active" : ""}`} onClick={() => setPage(l.key)}>
              {l.label}
            </button>
          ))}
        </div>
        <div className="nav-search">
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>🔍</span>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={handleSearch} placeholder="Search recipes…" />
        </div>
        <div className="nav-user">
          <span>{user.username}</span>
          <button className="btn-logout" onClick={() => setUser(null)}>Sign out</button>
        </div>
      </nav>

      {page === "home" && <Home user={user} />}
      {page === "recipes" && <MyRecipes user={user} showToast={showToast} />}
      {page === "browse" && <Browse user={user} showToast={showToast} />}
      {page === "community" && <Community user={user} showToast={showToast} />}
      {page === "search" && <Search user={user} showToast={showToast} />}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}