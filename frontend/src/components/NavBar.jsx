import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { API } from "../utils/api";

const NAV_LINKS = [
  { to: "/",          label: "Home"       },
  { to: "/recipes",   label: "My Recipes" },
  { to: "/browse",    label: "Browse"     },
  { to: "/community", label: "Community"  },
  { to: "/search",    label: "Search"     },
];

export default function NavBar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwForm, setPwForm] = useState({ new_password: "", confirm: "" });
  const [pwErr, setPwErr] = useState("");
  const [pwOk, setPwOk] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = e => {
    if (e.key === "Enter" && q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setQ("");
    }
  };

  const handleChangePassword = async () => {
    setPwErr(""); setPwOk("");
    if (!pwForm.new_password || !pwForm.confirm) { setPwErr("All fields required."); return; }
    if (pwForm.new_password !== pwForm.confirm) { setPwErr("Passwords do not match."); return; }
    const d = await API("/api/change_password", {
      method: "POST",
      body: JSON.stringify({ username: user.username, new_password: pwForm.new_password }),
    });
    if (d.success) {
      setPwOk("Password changed successfully.");
      setPwForm({ new_password: "", confirm: "" });
    } else {
      setPwErr(d.error || "Failed to change password.");
    }
  };

  return (
    <>
      <nav className="topnav">
        <NavLink to="/" className="nav-logo">🍽 GoodRecipes</NavLink>

        <div className="nav-links">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              {label}
            </NavLink>
          ))}
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-link admin-link${isActive ? " active" : ""}`}
            >
              Admin
            </NavLink>
          )}
        </div>

        <div className="nav-user">
          <div className="nav-dropdown-wrap" ref={dropdownRef}>
            <button className="nav-username-btn" onClick={() => setDropdownOpen(o => !o)}>
              <span className="nav-avatar">{user?.username?.[0]?.toUpperCase()}</span>
              {user?.username}
              <span className="nav-chevron">{dropdownOpen ? "▴" : "▾"}</span>
            </button>

            {dropdownOpen && (
              <div className="nav-dropdown">
                <button className="nav-dropdown-item" onClick={() => { setShowProfileModal(true); setDropdownOpen(false); }}>
                  👤 View Profile
                </button>
                <button className="nav-dropdown-item" onClick={() => { setShowPasswordModal(true); setDropdownOpen(false); }}>
                  🔒 Change Password
                </button>
                {user?.role === "admin" && (
                  <button className="nav-dropdown-item" onClick={() => { navigate("/admin"); setDropdownOpen(false); }}>
                    ⚙️ Admin Panel
                  </button>
                )}
                <div className="nav-dropdown-divider" />
                <button className="nav-dropdown-item danger" onClick={() => { setUser(null); navigate("/login"); }}>
                  ⬡ Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Profile Modal ── */}
      {showProfileModal && (
        <div className="modal-backdrop" onClick={() => setShowProfileModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">My Profile</div>
            <div className="profile-avatar-lg">{user?.username?.[0]?.toUpperCase()}</div>
            <div className="profile-info-row"><span className="profile-label">Username</span><span>{user?.username}</span></div>
            <div className="profile-info-row"><span className="profile-label">User ID</span><span className="profile-id">{user?.user_id}</span></div>
            <div className="form-actions" style={{ marginTop: "1.5rem" }}>
              <button className="btn-ghost" onClick={() => setShowProfileModal(false)}>Close</button>
              <button className="btn-accent" onClick={() => { setShowProfileModal(false); setShowPasswordModal(true); }}>Change Password</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Change Password Modal ── */}
      {showPasswordModal && (
        <div className="modal-backdrop" onClick={() => { setShowPasswordModal(false); setPwErr(""); setPwOk(""); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Change Password</div>
            <div className="form-field" style={{ marginBottom: "1rem" }}>
              <label>New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={pwForm.new_password}
                onChange={e => setPwForm(p => ({ ...p, new_password: e.target.value }))}
              />
            </div>
            <div className="form-field" style={{ marginBottom: "1rem" }}>
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={pwForm.confirm}
                onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
              />
            </div>
            {pwErr && <div className="auth-error">{pwErr}</div>}
            {pwOk  && <div style={{ color: "var(--sage)", fontSize: "0.85rem", textAlign: "center", marginTop: "0.5rem" }}>{pwOk}</div>}
            <div className="form-actions" style={{ marginTop: "1.5rem" }}>
              <button className="btn-ghost" onClick={() => { setShowPasswordModal(false); setPwErr(""); setPwOk(""); }}>Cancel</button>
              <button className="btn-accent" onClick={handleChangePassword}>Update Password</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}