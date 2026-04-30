import { useState, useCallback, useEffect } from "react";
import { API } from "../utils/api";
import { useUser } from "../context/UserContext";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

// ─── LookupPanel ──────────────────────────────────────────────────────────────
function LookupPanel({ endpoint, label, fields, showToast }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const add = async () => {
    if (!form.name) return;
    const d = await API(`/api/${endpoint}`, { method: "POST", body: JSON.stringify(form) });
    if (d.success) { showToast(`${label} added!`); setForm({}); setAdding(false); fetchItems(); }
    else showToast(d.error, "error");
  };

  const fetchItems = () => {
    setLoading(true);
    fetch(`/api/${endpoint}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setItems(data[endpoint]);
        else showToast(data.error, "error");
      })
      .catch(() => showToast("Could not reach the server.", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

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
              <input
                value={form[f.key] || ""}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder || f.label}
              />
            </div>
          ))}
          <div className="form-actions">
            <button className="btn-accent" onClick={add}>Add {label}</button>
            <button className="btn-ghost" onClick={() => { setAdding(false); setForm({}); }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : items.length === 0 ? (
        <EmptyState icon="🗂" message={`No ${label.toLowerCase()} records found. Add some above!`} />
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
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", privacy_status: "private" });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const fetchCollections = () => {
    setLoading(true);
    fetch(`/api/collections?user_id=${user.user_id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setCols(data.collections);
        else showToast(data.error, "error");
      })
      .catch(() => showToast("Could not reach the server.", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const add = async () => {
    if (!form.title) return;
    const d = await API("/api/collections", {
      method: "POST",
      body: JSON.stringify({ ...form, user_id: user.user_id }),
    });
    if (d.success) {
      showToast("Collection created!");
      setCols(p => [...p, { ...form, collection_id: d.collection_id }]);
      setAdding(false);
      setForm({ title: "", description: "", privacy_status: "private" });
    } else showToast(d.error, "error");
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
        <button className="btn-accent" onClick={() => setAdding(v => !v)}>
          {adding ? "✕ Cancel" : "+ New Collection"}
        </button>
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
            <select
              value={form.privacy_status}
              onChange={set("privacy_status")}
              style={{ width: "100%", padding: "0.65rem 0.9rem", border: "1.5px solid var(--border)", borderRadius: "8px", fontFamily: "DM Sans, sans-serif", fontSize: "0.92rem", background: "var(--cream)" }}
            >
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

      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : cols.length === 0 ? (
        <EmptyState icon="📁" message="No collections yet. Create one to organize your favorite recipes!" />
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
const TABS = [
  { key: "ingredients",    label: "🥕 Ingredients"    },
  { key: "cuisines",       label: "🌍 Cuisines"        },
  { key: "dietary-flags",  label: "🌿 Dietary Flags"   },
  { key: "collections",    label: "📁 My Collections"  },
];

export default function BrowsePage() {
  const { user } = useUser();
  const [tab, setTab] = useState("ingredients");
  const [toast, showToast] = useToast();

  return (
    <div className="page">
      <h1 className="page-title">Browse</h1>
      <p className="page-sub">Explore ingredients, cuisines, dietary options, and your saved collections.</p>

      <div className="sub-nav">
        {TABS.map(t => (
          <button key={t.key} className={`sub-tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "ingredients" && (
        <LookupPanel endpoint="ingredients" label="Ingredient" fields={[
          { key: "name", label: "Name", placeholder: "e.g. Garlic" },
          { key: "description", label: "Description", placeholder: "Optional description" },
        ]} showToast={showToast} />
      )}
      {tab === "cuisines" && (
        <LookupPanel endpoint="cuisines" label="Cuisine" fields={[
          { key: "name", label: "Name", placeholder: "e.g. Italian" },
          { key: "description", label: "Description", placeholder: "Optional description" },
        ]} showToast={showToast} />
      )}
      {tab === "dietary-flags" && (
        <LookupPanel endpoint="dietary-flags" label="Dietary Flag" fields={[
          { key: "name", label: "Name", placeholder: "e.g. Vegan" },
          { key: "description", label: "Description", placeholder: "Optional description" },
        ]} showToast={showToast} />
      )}
      {tab === "collections" && <Collections user={user} showToast={showToast} />}

      <Toast toast={toast} />
    </div>
  );
}