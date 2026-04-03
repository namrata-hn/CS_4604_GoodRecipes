import { useState } from "react";

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
    </div>
  );
}