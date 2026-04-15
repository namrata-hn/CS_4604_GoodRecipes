import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setError(null);
    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) onLogin(data.user_id);
        else setError(data.error);
        setLoading(false);
      })
      .catch(() => { setError("Could not reach the server."); setLoading(false); });
  };

  return (
    <div>
      <div id="signup-link" style={{ position: "absolute", top: "1rem", right: "1rem" }}>
        <Link to="/Signup">Don't have an account? Sign Up</Link>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "5rem" }}>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "250px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "250px" }}
        />
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div id="change-pass-link" style={{ marginTop: "1rem" }}>
          <Link to="/ChangePass">Change Password</Link>
        </div>
      </div>
    </div>

  );
}