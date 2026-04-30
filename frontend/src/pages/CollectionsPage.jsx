import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { API } from "../utils/api";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

export default function CollectionPage() {
    const { collectionId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { user } = useUser();
    const collection = state?.collection;

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recipesLoading, setRecipesLoading] = useState(false);
    const [error, setError] = useState(null);
    const [addingRecipe, setAddingRecipe] = useState(false);
    const [userRecipes, setUserRecipes] = useState([]);
    const [toast, showToast] = useToast();

    const loadRecipes = () => {
        setLoading(true);
        fetch(`/api/collection_recipe/${collectionId}/recipes`)
        .then(r => r.json())
        .then(data => {
            if (data.success) setRecipes(data.recipes || []);
            else setError(data.error || "Failed to load recipes.");
        })
        .catch(err => setError(`Could not reach the server: ${err.message}`))
        .finally(() => setLoading(false));
    };

    useEffect(loadRecipes, [collectionId]);

    const openAddModal = () => {
        setAddingRecipe(true);
        setRecipesLoading(true);
        fetch(`/api/recipes`)
            .then(r => r.json())
            .then(data => {
            if (data.success) setUserRecipes(data.recipes || []);
            else showToast(data.error, "error");
            })
            .catch(() => showToast("Could not load your recipes.", "error"))
            .finally(() => setRecipesLoading(false));
    };

    const addRecipe = async (recipeId) => {
        const d = await API("/api/collection_recipe", {
        method: "POST",
        body: JSON.stringify({ collection_id: Number(collectionId), recipe_id: recipeId }),
        });
        if (d.success) { showToast("Recipe added!"); setAddingRecipe(false); loadRecipes(); }
        else showToast(d.error, "error");
    };

    const removeRecipe = async (recipeId) => {
        if (!confirm("Remove this recipe from the collection?")) return;
        const d = await API(`/api/collection_recipe/${collectionId}/${recipeId}`, { method: "DELETE" });
        if (d.success) { showToast("Recipe removed"); loadRecipes(); }
        else showToast(d.error, "error");
    };

    // Filter out recipes already in the collection
    const available = userRecipes.filter(r => !recipes.some(cr => cr.recipe_id === r.recipe_id));

    return (
        <div className="page">
        <button className="btn-ghost" style={{ marginBottom: "1.5rem" }} onClick={() => navigate(-1)}>
            ← Back
        </button>

        {loading ? (
            <p className="loading">Loading collection…</p>
        ) : error ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
            <p style={{ color: "#C0392B", fontSize: "0.95rem" }}>{error}</p>
            </div>
        ) : (
            <>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.4rem", width: "100%" }}>
                <h1 className="page-title" style={{ margin: 0, flex: 1, minWidth: 0 }}>
                📂 {collection?.title ?? "Collection"}
                </h1>
                <button className="btn-accent" style={{ flexShrink: 0 }} onClick={openAddModal}>
                + Add Recipe
                </button>
            </div>
            {collection?.description && <p className="page-sub">{collection.description}</p>}
            <div className={`privacy-badge ${collection?.privacy_status === "public" ? "privacy-public" : "privacy-private"}`}
                style={{ marginBottom: "2rem" }}>
                {collection?.privacy_status === "public" ? "🌐 Public" : "🔒 Private"}
            </div>

            {recipes.length === 0 ? (
                <EmptyState icon="🍽️" message="No recipes in this collection yet." />
            ) : (
                <div className="card-grid">
                {recipes.map(r => (
                    <div className="recipe-card" key={r.recipe_id}>
                    <div className="card-title">{r.title}</div>
                    {r.description && <div className="card-desc">{r.description}</div>}
                    <div className="card-meta">
                        {r.prep_time && <span>⏱ {r.prep_time} min</span>}
                        {r.servings && <span>🍽 {r.servings} servings</span>}
                    </div>
                    <div className="card-actions">
                        <button className="btn-sm btn-delete" onClick={() => removeRecipe(r.recipe_id)}>Remove</button>
                    </div>
                    </div>
                ))}
                </div>
            )}
            </>
        )}

        {addingRecipe && (
            <Modal title="Add Recipe to Collection" onClose={() => setAddingRecipe(false)}>
                {recipesLoading ? (
                    <p className="loading">Loading recipes…</p>
                ) : available.length === 0 ? (
                    <EmptyState icon="📖" message="All your recipes are already in this collection." />
                ) : (
                    <div className="lookup-list">
                    {available.map(r => (
                        <div className="lookup-item" key={r.recipe_id}>
                        <div className="lookup-item-info">
                            <div className="lookup-item-name">{r.title}</div>
                            {r.description && <div className="lookup-item-desc">{r.description}</div>}
                        </div>
                        <button className="btn-sm btn-edit" onClick={() => addRecipe(r.recipe_id)}>Add</button>
                        </div>
                    ))}
                    </div>
                )}
            </Modal>
        )}

        <Toast toast={toast} />
        </div>
    );
}