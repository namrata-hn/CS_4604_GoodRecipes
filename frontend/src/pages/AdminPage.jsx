import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../utils/api";
import { useUser } from "../context/UserContext";

const roleBadge = {
  admin: { background: "#FFF3CD", color: "#856404" },
  user:  { background: "#D1FAE5", color: "#065F46" },
};

export default function AdminPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // { user_id, username, role }
  const [editForm, setEditForm] = useState({ username: "", role: "user" });
  const [editErr, setEditErr] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const fetchUsers = async () => {
    setErr("");
    setLoading(true);
    const d = await API("/api/users");
    setLoading(false);
    if (d.success) setUsers(d.users);
    else setErr(d.error || "Failed to fetch users.");
  };

  useEffect(() => {
    if (user.role === "admin") fetchUsers();
  }, [user]);

  const openEdit = (u) => {
    setEditTarget(u);
    setEditForm({ username: u.username, role: u.role });
    setEditErr("");
  };

  const closeEdit = () => {
    setEditTarget(null);
    setEditErr("");
  };

  const saveEdit = async () => {
    setEditErr("");
    if (!editForm.username.trim()) { setEditErr("Username cannot be empty."); return; }
    setEditLoading(true);
    const d = await API(`/api/update_user/${editTarget.user_id}`, {
      method: "PUT",
      body: JSON.stringify({ username: editForm.username.trim(), role: editForm.role }),
    });
    setEditLoading(false);
    if (d.success) {
      setUsers(prev => prev.map(u =>
        u.user_id === editTarget.user_id ? { ...u, ...editForm } : u
      ));
      closeEdit();
    } else {
      setEditErr(d.error || "Failed to update user.");
    }
  };

  const deleteUser = async (uid) => {
    if (!confirm("Permanently delete this user?")) return;
    setErr("");
    const d = await API(`/api/delete_user/${uid}`, { method: "DELETE" });
    if (d.success) setUsers(prev => prev.filter(u => u.user_id !== uid));
    else setErr(d.error || "Failed to delete user.");
  };

  if (user.role !== "admin") {
    return (
      <div className="page" style={{ textAlign: "center", paddingTop: "5rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.4 }}>🔒</div>
        <h2 className="page-title">Access Denied</h2>
        <p className="page-sub">You don't have permission to view this page.</p>
        <button className="btn-accent" onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const adminCount = users.filter(u => u.role === "admin").length;
  const userCount  = users.filter(u => u.role !== "admin").length;

  return (
    <div className="page">
      <h1 className="page-title">Admin Panel</h1>
      <p className="page-sub">Manage user accounts and permissions.</p>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Users",   value: users.length },
          { label: "Admins",        value: adminCount   },
          { label: "Regular Users", value: userCount    },
        ].map(stat => (
          <div key={stat.label} className="form-card" style={{ padding: "1.25rem 1.5rem", marginBottom: 0, textAlign: "center" }}>
            <div style={{ fontSize: "1.9rem", fontWeight: 700, color: "var(--spice)", fontFamily: "'Playfair Display', serif" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.2rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Table card ── */}
      <div className="form-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <div className="section-title" style={{ margin: 0 }}>All Users</div>
          <button className="btn-accent" onClick={fetchUsers} disabled={loading}>
            {loading ? "Loading…" : "↻ Refresh"}
          </button>
        </div>

        {err && <div className="auth-error" style={{ padding: "0.75rem 1.5rem", textAlign: "left", margin: 0 }}>{err}</div>}

        {loading ? (
          <div className="loading" style={{ padding: "3rem" }}>Loading users…</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "var(--cream)", borderBottom: "1px solid var(--border)" }}>
                  {["ID", "Username", "Email", "Role", ""].map(h => (
                    <th key={h} style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontWeight: 500, color: "var(--muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.user_id}
                    style={{ borderBottom: i < users.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--cream)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--muted)", fontFamily: "monospace", fontSize: "0.78rem" }}>
                      {u.user_id}
                    </td>
                    <td style={{ padding: "1rem 1.5rem", fontWeight: 500, color: "var(--ink)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--spice)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 600, flexShrink: 0 }}>
                          {u.username?.[0]?.toUpperCase()}
                        </div>
                        {u.username}
                        {u.user_id === user.user_id && (
                          <span style={{ fontSize: "0.7rem", background: "var(--sage-light)", color: "var(--sage)", padding: "0.15rem 0.5rem", borderRadius: 10, fontWeight: 500 }}>you</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--muted)" }}>{u.email}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span style={{ ...(roleBadge[u.role] || roleBadge.user), fontSize: "0.75rem", padding: "0.2rem 0.65rem", borderRadius: 10, fontWeight: 500 }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <button className="btn-sm btn-edit" onClick={() => openEdit(u)}>
                          Edit
                        </button>
                        {u.user_id !== user.user_id && (
                          <button className="btn-sm btn-delete" onClick={() => deleteUser(u.user_id)}>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editTarget && (
        <div className="modal-backdrop" onClick={closeEdit}>
          <div className="modal" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginBottom: "1.75rem" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--spice)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 700, flexShrink: 0 }}>
                {editTarget.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="modal-title" style={{ margin: 0 }}>Edit User</div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", fontFamily: "monospace" }}>
                  ID: {editTarget.user_id}
                </div>
              </div>
            </div>

            {/* Username field */}
            <div className="form-field" style={{ marginBottom: "1.25rem" }}>
              <label>Username</label>
              <input
                type="text"
                value={editForm.username}
                onChange={e => setEditForm(p => ({ ...p, username: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && saveEdit()}
              />
            </div>

            {/* Role field */}
            <div className="form-field" style={{ marginBottom: "1.5rem" }}>
              <label>Role</label>
              <select
                value={editForm.role}
                onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}
                style={{ width: "100%", padding: "0.65rem 0.9rem", border: "1.5px solid var(--border)", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: "0.92rem", background: "var(--cream)", color: "var(--ink)", outline: "none" }}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>

            {/* Warning when promoting to admin */}
            {editForm.role === "admin" && editTarget.role !== "admin" && (
              <div style={{ background: "#FFF3CD", border: "1px solid #FFD97D", borderRadius: 8, padding: "0.65rem 0.9rem", fontSize: "0.82rem", color: "#856404", marginBottom: "1.25rem" }}>
                ⚠️ This will grant full admin access to this user.
              </div>
            )}

            {editErr && <div className="auth-error" style={{ marginBottom: "1rem" }}>{editErr}</div>}

            <div className="form-actions">
              <button className="btn-ghost" onClick={closeEdit}>Cancel</button>
              <button className="btn-accent" onClick={saveEdit} disabled={editLoading}>
                {editLoading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}