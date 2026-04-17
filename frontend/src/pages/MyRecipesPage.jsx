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
  const [loadError, setLoadError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, showToast] = useToast();

  const load = useCallback(() => {
    if (!user?.user_id) {
      setLoadError("No user ID found — please sign out and log in again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    API(`/api/recipes/${user.user_id}`)
      .then(d => {
        if (d.success) {
          setRecipes(d.recipes || []);
        } else {
          setLoadError(d.error || "Failed to load recipes.");
          setRecipes([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoadError(`Could not reach the server: ${err.message}`);
        setLoading(false);
      });
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

  // Capture recipe_id immediately so closing the modal mid-async can't crash
  const update = async (f) => {
    if (!editing) return;
    const recipeId = editing.recipe_id;
    setEditing(null);
    const d = await API(`/api/recipes/${recipeId}`, {
      method: "PUT",
      body: JSON.stringify(f),
    });
    if (d.success) { showToast("Recipe updated!"); load(); }
    else showToast(d.error, "error");
  };

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
        <h1 className="page-title">My Recipes</h1>
        <button className="btn-accent" onClick={() => setAdding(true)}>
          + New Recipe
        </button>
      </div>
      <p className="page-sub">Recipes you've created and shared.</p>

      {loading ? (
        <p className="loading">Loading recipes…</p>
      ) : loadError ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
          <p style={{ color: "#C0392B", fontSize: "0.95rem", marginBottom: "1rem" }}>{loadError}</p>
          <button className="btn-ghost" onClick={load}>Try again</button>
        </div>
      ) : recipes.length === 0 ? (
        <EmptyState icon="📖" message="No recipes yet. Add your first one above!" />
      ) : (
        <div className="card-grid">
          {recipes.map(r => (
            <RecipeCard key={r.recipe_id} recipe={r} onEdit={setEditing} onDelete={del} />
          ))}
        </div>
      )}

      {adding && (
        <Modal title="New Recipe" onClose={() => setAdding(false)}>
          <RecipeForm onSave={add} onCancel={() => setAdding(false)} submitLabel="Add Recipe" />
        </Modal>
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
