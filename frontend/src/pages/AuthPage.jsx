import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../utils/api";
import { useUser } from "../context/UserContext";

export default function AuthPage() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [f, setF] = useState({ username: "", email: "", password: "", role: "user" });
  const [err, setErr] = useState("");

  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    setErr("");
    if (tab === "login") {
      const d = await API("/api/login", {
        method: "POST",
        body: JSON.stringify({ username: f.username, password: f.password }),
      });
      if (d.success) {
        setUser({ user_id: d.user_id, username: f.username });
        navigate("/");
      } else {
        setErr(d.error || "Invalid username or password.");
      }
    } else {
      if (!f.username || !f.email || !f.password) { setErr("All fields required."); return; }

      const d = await API("/api/signup", {
        method: "POST",
        body: JSON.stringify({ username: f.username, email: f.email, password: f.password }),
      });

      if (d.success) { setTab("login"); setErr("Account created! Please sign in."); }
      else setErr(d.error || "Could not create account.");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-panel">
        <div className="auth-logo">🍽 GoodRecipes</div>
        <div className="auth-tagline">Discover, create & share recipes you love.</div>

        <div className="auth-tab-row">
          <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setErr(""); }}>
            Sign In
          </button>
          <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setErr(""); }}>
            Create Account
          </button>
        </div>

        <div className="auth-field">
          <label>Username</label>
          <input value={f.username} onChange={set("username")} placeholder="your_username" onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        {tab === "signup" && (
          <div className="auth-field">
            <label>Email</label>
            <input type="email" value={f.email} onChange={set("email")} placeholder="you@example.com" />
          </div>
        )}
        <div className="auth-field">
          <label>Password</label>
          <input type="password" value={f.password} onChange={set("password")} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        {tab === "signup" && (
          <div className="auth-field">
            <label>Role</label>
            <select value={f.role} onChange={set("role")}>
              <option value="user">User</option>
              {/* <option value="admin">Admin</option> */}
            </select>
          </div>
        )}

        {err && <div className="auth-error">{err}</div>}
        <button className="btn-primary" onClick={submit}>
          {tab === "login" ? "Sign In" : "Create Account"}
        </button>
      </div>
    </div>
  );
}
