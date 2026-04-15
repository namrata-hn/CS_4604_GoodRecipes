import { use, useEffect, useState } from "react";
import "./App.css";
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import ChangePass from './ChangePass.jsx'
import { Link, Routes, Route } from "react-router-dom";

export default function App() {

  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [user_id, setUserId] = useState(null); 
  const [form, setForm] = useState({
    title: "", description: "", instructions: "",
    prep_time: "", cook_time: "", servings: ""
  });
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [toast, setToast] = useState(null);

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
          setForm({ title: "", description: "", instructions: "", prep_time: "", cook_time: "", servings: "" });
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
          setForm({ title: "", description: "", instructions: "", prep_time: "", cook_time: "", servings: "" });
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
    if (user_id) fetchRecipes();
  }, [user_id]);


  if (!user_id) {
    return (
      <Routes>
        <Route path="/" element={<Login onLogin={setUserId} />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/ChangePass" element={<ChangePass />} />
      </Routes>
    );
  };

  return (
    <div>
      <div id="logout-link" style={{ position: "absolute", top: "1rem", right: "1rem" }}>
        <Link to="/" onClick={() => setUserId(null)}>
          Logout
        </Link>
      </div>
      <div className="recipeAddition" style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc", display: "flex"}}>
        <div style={{ flex: 1, marginRight: "1rem" }}>
        <h1>Add Recipe</h1>
        <input value={form.title} 
          onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} 
          placeholder="Title" /><br />

        <input value={form.description} 
          onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} 
          placeholder="Description" /><br />

        <input value={form.instructions} 
          onChange={e => setForm(prev => ({ ...prev, instructions: e.target.value }))} 
          placeholder="Instructions" /><br />

        <input value={form.prep_time} 
          onChange={e => setForm(prev => ({ ...prev, prep_time: e.target.value }))} 
          placeholder="Prep Time" /><br />

        <input value={form.cook_time} 
          onChange={e => setForm(prev => ({ ...prev, cook_time: e.target.value }))} 
          placeholder="Cook Time" /><br />

        <input value={form.servings} 
          onChange={e => setForm(prev => ({ ...prev, servings: e.target.value }))} 
          placeholder="Servings" /><br />

        <button onClick={() => insert_recipe({ user_id, ...form })}>
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