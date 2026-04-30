import { useState } from "react";
import { API, Stars } from "../utils/api";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

export default function CommunityPage() {
  const { user } = useUser();
  const [reviews, setReviews] = useState([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ recipe_id: "", comment: "", rating: 5 });
  const [editing, setEditing] = useState(null);
  const [toast, showToast] = useToast();
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const add = async () => {
    if (!form.recipe_id) return;
    const d = await API("/api/reviews", {
      method: "POST",
      body: JSON.stringify({ ...form, user_id: user.user_id, rating: Number(form.rating) }),
    });
    if (d.success) {
      showToast("Review posted!");
      setReviews(p => [{ ...form, review_id: d.review_id, rating: Number(form.rating) }, ...p]);
      setAdding(false);
      setForm({ recipe_id: "", comment: "", rating: 5 });
    } else showToast(d.error, "error");
  };

  const del = async (id) => {
    if (!confirm("Delete this review?")) return;
    const d = await API(`/api/reviews/${id}`, { method: "DELETE" });
    if (d.success) { showToast("Review deleted"); setReviews(p => p.filter(r => r.review_id !== id)); }
    else showToast(d.error, "error");
  };

  const saveEdit = async () => {
    const d = await API(`/api/reviews/${editing.review_id}`, {
      method: "PUT",
      body: JSON.stringify({ comment: editing.comment, rating: Number(editing.rating) }),
    });
    if (d.success) {
      showToast("Review updated!");
      setReviews(p => p.map(r => r.review_id === editing.review_id ? { ...r, ...editing } : r));
      setEditing(null);
    } else showToast(d.error, "error");
  };

  const fetchReviews = async () => {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    if (data.success) {
      setReviews(data.reviews);
    }
    else {
      console.error("Failed to fetch reviews:", data.error);
      showToast("Failed to load reviews", "error");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="page">
      <div style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <h1 className="page-title">Community</h1>
      </div>
      <p className="page-sub">See other users' thoughts and ratings on recipes.</p>

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
        <EmptyState icon="💬" message="No reviews yet. Post your first one!" />
      ) : (
        reviews.map(r => (
          <div className="review-card" key={r.review_id}>
            <div className="review-stars"><Stars n={Number(r.rating)} /> ({r.rating}/5)</div>
            <div className="review-comment">{r.comment || "No comment."}</div>
            <div className="review-meta">{r.title}</div>
            {user?.role === "admin" && (
              <div className="card-actions" style={{ marginTop: "0.75rem" }}>
                <button className="btn-sm btn-edit" onClick={() => setEditing({ ...r })}>Edit</button>
                <button className="btn-sm btn-delete" onClick={() => del(r.review_id)}>Delete</button>
              </div>
            )}
          </div>
        ))
      )}

      {editing && (
        <Modal title="Edit Review" onClose={() => setEditing(null)}>
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
        </Modal>
      )}

      <Toast toast={toast} />
    </div>
  );
}
