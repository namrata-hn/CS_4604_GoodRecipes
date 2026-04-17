import { useState } from "react";

export default function RecipeForm({ initial = {}, onSave, onCancel, submitLabel = "Save" }) {
  const [f, setF] = useState({
    title: "", description: "", instructions: "",
    prep_time: "", cook_time: "", servings: "",
    ...initial,
  });
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
          <textarea rows={2} value={f.description} onChange={set("description")} placeholder="Brief description…" />
        </div>
        <div className="form-field full">
          <label>Instructions</label>
          <textarea rows={4} value={f.instructions} onChange={set("instructions")} placeholder="Step-by-step instructions…" />
        </div>
        <div className="form-field">
          <label>Prep Time</label>
          <input value={f.prep_time} onChange={set("prep_time")} placeholder="e.g. 20 mins" />
        </div>
        <div className="form-field">
          <label>Cook Time</label>
          <input value={f.cook_time} onChange={set("cook_time")} placeholder="e.g. 45 mins" />
        </div>
        <div className="form-field">
          <label>Servings</label>
          <input value={f.servings} onChange={set("servings")} placeholder="e.g. 4" />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn-accent" onClick={() => onSave(f)}>{submitLabel}</button>
        {onCancel && <button className="btn-ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}
