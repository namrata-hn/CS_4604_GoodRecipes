import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

export default function RecipeCard({ recipe, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const { user } = useUser();

  const { recipe_id, title, description, prep_time, cook_time, servings } = recipe;

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews/${recipe_id}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      } else {
        console.error("Failed to fetch reviews:", data.error);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    if (expanded) {
      fetchReviews();
    }
  }, [expanded, recipe_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) return;
    const res = await fetch(`/api/recipes/${recipe_id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment, user_id: user.user_id }), 
    });
    if (res.ok) {
      const newReview = await res.json();
      setReviews((prev) => [...prev, newReview]);
      setRating("");
      setComment("");
      fetchReviews();
    } else {
      console.error("Failed to submit review");
    }
  };

  return (
    <div className="recipe-card" onClick={toggleExpanded}>
      <div className="card-title">{title}</div>

      <div className="card-desc">
        {description || "No description provided."}
      </div>

      <div className="card-meta">
        {prep_time && <span>⏱ {prep_time}</span>}
        {cook_time && <span>🔥 {cook_time}</span>}
        {servings && <span>👥 {servings}</span>}
      </div>

      {expanded && (
        <>

          {/* Reviews Section */}
          <div onClick={(e) => e.stopPropagation()}>
            <div className="section-title">Reviews</div>

            {reviews.length === 0 ? (
              <div className="empty-state">
                <p>No reviews yet.</p>
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.review_id} className="review-card">
                  <div className="review-stars">
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </div>
                  <div className="review-comment">{r.comment}</div>
                </div>
              ))
            )}

            {/* Add Review Form */}
            <div className="form-card" style={{ marginTop: "1rem" }}>
              <form onSubmit={handleSubmit}>
                <div className="form-field">
                  <label>Rating</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Comment</label>
                  <textarea
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-accent">
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {(onEdit || onDelete) && (
        <div
          className="card-actions"
          onClick={(e) => e.stopPropagation()} // prevents toggle when clicking buttons
        >
          {onEdit && (
            <button className="btn-sm btn-edit" onClick={() => onEdit(recipe)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className="btn-sm btn-delete" onClick={() => onDelete(recipe_id)}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}