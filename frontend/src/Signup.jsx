import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSuccess("Account created successfully!");
                    navigate("/");
                } else {
                    setError(data.error);
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Could not reach the server.");
                setLoading(false);
            });
    };

    const backToLogin = () => {
        navigate("/");
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "5rem" }}>
            <h1>Sign Up</h1>
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "250px" }}
            />
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
            <button onClick={handleSignup} disabled={loading}>
                {loading ? "Signing up..." : "Sign Up"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <button onClick={backToLogin} style={{ marginTop: "1rem" }}>
                Back to Login
            </button>
        </div>
    );
}