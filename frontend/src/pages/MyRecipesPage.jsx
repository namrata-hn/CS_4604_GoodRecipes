import { useState, useEffect, useCallback } from "react";
import { API } from "../utils/api";
import { useUser } from "../context/UserContext";
import RecipeCard from "../components/RecipeCard";
import RecipeForm from "../components/RecipeForm";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

export default function MyRecipesPage() {
  const { user } = useUser();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, showToast] = useToast();

  const load = useCallback(() => {
    setLoading(true);
    API(`/api/recipes/${user.user_id}`)
      .then(d => { setRecipes(d.success ? d.recipes : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  useEffect(load, [load]);

  const add = async (f) => {
    const d = await API("/api/recipes", {
      method: "POST",
      body: JSON.stringify({ ...f, user_id: user.user_id }),
    });
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
    const d = await API(`/api/recipes/${editing.recipe_id}`, {
      method: "PUT",
      body: JSON.stringify(f),
    });
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
          <RecipeForm onSave={add} onCancel={() => setAdding(false)} submitLabel="Add Recipe" />
        </div>
      )}

      {loading ? (
        <p className="loading">Loading recipes…</p>
      ) : recipes.length === 0 ? (
        <EmptyState icon="📖" message="No recipes yet. Add your first one above!" />
      ) : (
        <div className="card-grid">
          {recipes.map(r => (
            <RecipeCard key={r.recipe_id} recipe={r} onEdit={setEditing} onDelete={del} />
          ))}
        </div>
      )}

      {editing && (
        <Modal title="Edit Recipe" onClose={() => setEditing(null)}>
          <RecipeForm initial={editing} onSave={update} onCancel={() => setEditing(null)} submitLabel="Save Changes" />
        </Modal>
      )}

      <Toast toast={toast} />
    </div>
  );
}
