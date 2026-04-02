import { use, useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [queryLoading, setQueryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [user_id, setUserId] = useState(1337); // Placeholder user ID for recipe insertion
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prep_time, setPrepTime] = useState("");
  const [cook_time, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch("/api/db-status")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch(() => {
        setStatus({ connected: false, error: "Could not reach server" });
        setLoading(false);
      });
  }, []);

  const panelTitle = {
    users: "Users", recipes: "Recipes", ingredients: "Ingredients",
    reviews: "Reviews", categories: "Categories", dietary: "Dietary flags",
    cuisines: "Cuisines", collections: "Recipe collections",
    recipe_ingredient: "Recipe ingredients",
  };

  const panelSub = {
    users: "Insert, update, or delete user accounts.",
    recipes: "Manage recipe records.",
    ingredients: "Manage the ingredient lookup table.",
    reviews: "Add, edit, or remove recipe reviews.",
    categories: "Manage recipe category lookup values.",
    dietary: "Manage dietary flag values (e.g. Vegan, Gluten-Free).",
    cuisines: "Manage cuisine lookup values.",
    collections: "Manage user-created recipe collections.",
    recipe_ingredient: "Link ingredients to recipes with quantity and unit.",
  };

  const runQuery = () => {
    setQueryLoading(true);
    setError(null);
    setResult(null);
    fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setResult(data);
        else setError(data.error);
        setQueryLoading(false);
      })
      .catch(() => { setError("Could not reach the server."); setQueryLoading(false); });
  };

  const insert_recipe = (recipe) => {
    setError(null);
    setResult(null);

    fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipe)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setResult(data);
          fetchRecipes(); // Refresh the recipe list after insertion
        } 
        else setError(data.error);
      })
      .catch(() => {
        setError("Could not reach the server.");
      });
  };

  const delete_recipe = (recipe_id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }
    setError(null);
    setResult(null);
    fetch(`/api/recipes/${recipe_id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setResult(data);
          if (recipes.length === 1) {
            setRecipes([]);
          } else {
            fetchRecipes(); // Refresh the recipe list after deletion
          }
          // Case where the last recipe was deleted and we need to clear the list manually
        }
        else setError(data.error);
      })
      .catch(() => {
        setError("Could not reach the server.");
      });
  };

  const update_recipe = (recipe_id, updatedFields) => {
    setError(null);
    setResult(null);
    fetch(`/api/recipes/${recipe_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setResult(data);
          fetchRecipes(); // Refresh the recipe list after update
          setEditingRecipe(null); // Close the edit modal
        }
        else setError(data.error);
      })
      .catch(() => {
        setError("Could not reach the server.");
      });
  };

  const fetchRecipes = () => {
    fetch(`/api/recipes/${user_id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setRecipes(data.recipes);
        else setError(data.error);
      })
      .catch(() => {
        setError("Could not reach the server.");
      });
  };

  useEffect(() => {
    fetchRecipes();
  }, [user_id]);


  return (
    <div>
      {loading ? (<p>Checking connection...</p>) : status.connected ? (
        <p style={{ color: "green" }}>
          Database connected! Connected to {status.database}.
        </p>
      ) : (
        <p style={{ color: "red" }}>
          Connection failed: {status.error}
        </p>
      )}

      <div>
        <textarea
          className="query-box"
          rows={5}
          placeholder="Enter your SQL query... e.g. SELECT * FROM user;"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className="run-btn" onClick={runQuery} disabled={queryLoading}>
          {queryLoading ? "Running..." : "Run Query"}
        </button>
      </div>

      <div classname="recipeAddition" style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc", display: "flex"}}>
        <div style={{ flex: 1, marginRight: "1rem" }}>
        <h1>Add Recipe</h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title" />
          <br />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description" />
          <br />
        <input
          type="text"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Instructions" />
          <br />
        <input
          type="text"
          value={prep_time}
          onChange={(e) => setPrepTime(e.target.value)}
          placeholder="Prep Time" />
          <br />
        <input
          type="text"
          value={cook_time}
          onChange={(e) => setCookTime(e.target.value)}
          placeholder="Cook Time" />
          <br />
        <input
          type="text"
          value={servings}
          onChange={(e) => setServings(e.target.value)}
          placeholder="Servings" />
          <br />
        <button onClick={() => insert_recipe({ user_id, title, description, instructions, prep_time, cook_time, servings })}>
          Add Recipe
        </button>
        </div>
        <div style={{ flex: 1, marginLeft: "1rem", padding: "1rem", borderRadius: "8px" }}>
          <h1>Your Recipes</h1>
          {recipes.length === 0 ? (
            <p>No recipes yet.</p>
          ) : (
            recipes.map(recipe => (
              <div key={recipe.recipe_id} style={{ borderBottom: "1px solid #ccc", marginBottom: "0.5rem" }}>
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
                <small>Prep: {recipe.prep_time} | Cook: {recipe.cook_time} | Serves: {recipe.servings}</small>
                <div id="editAndDeleteButtons">
                  <button style={{ marginRight: "0.5rem" }} onClick={() => setEditingRecipe({ ...recipe })}>Edit</button>
                  <button onClick={() => delete_recipe(recipe.recipe_id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingRecipe && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ background: "grey", padding: "2rem", borderRadius: "8px", minWidth: "400px" }}>
            <h2>Edit Recipe</h2>
            {["title", "description", "instructions", "prep_time", "cook_time", "servings"].map(field => (
              <div key={field}>
                <input
                  type="text"
                  value={editingRecipe[field] || ""}
                  onChange={(e) => setEditingRecipe(prev => ({ ...prev, [field]: e.target.value }))}
                  placeholder={field}
                  style={{ width: "100%", marginBottom: "0.5rem" }}
                />
              </div>
            ))}
            <button onClick={() => update_recipe(editingRecipe.recipe_id, editingRecipe)}>Save</button>
            <button onClick={() => setEditingRecipe(null)} style={{ marginLeft: "0.5rem" }}>Cancel</button>
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {result?.message && <p className="success">{result.message}</p>}

      {result?.rows && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {result.columns.map(col => <th key={col}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => <td key={j}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Toast */}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}