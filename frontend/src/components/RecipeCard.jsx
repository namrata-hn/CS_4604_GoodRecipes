export default function RecipeCard({ recipe, onEdit, onDelete }) {
  const { recipe_id, title, description, prep_time, cook_time, servings } = recipe;

  return (
    <div className="recipe-card">
      <div className="card-title">{title}</div>
      <div className="card-desc">{description || "No description provided."}</div>
      <div className="card-meta">
        {prep_time && <span>⏱ {prep_time}</span>}
        {cook_time && <span>🔥 {cook_time}</span>}
        {servings && <span>👥 {servings}</span>}
      </div>
      {(onEdit || onDelete) && (
        <div className="card-actions">
          {onEdit && <button className="btn-sm btn-edit" onClick={() => onEdit(recipe)}>Edit</button>}
          {onDelete && <button className="btn-sm btn-delete" onClick={() => onDelete(recipe_id)}>Delete</button>}
        </div>
      )}
    </div>
  );
}
