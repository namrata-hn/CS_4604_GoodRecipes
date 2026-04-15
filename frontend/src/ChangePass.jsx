import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ChangePass() {
    const [username, setUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChangePassword = () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        fetch("/api/change_password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, new_password: newPassword })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSuccess("Password changed successfully!");
                    navigate("/");
                } else {
                    setError("Failed to change password.\n" + data.error);
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
            <h1>Change Password</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "250px" }}
            />
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "250px" }}
            />
            <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "250px" }}
            />
            <button onClick={handleChangePassword} disabled={loading}>
                {loading ? "Changing..." : "Change Password"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <button onClick={backToLogin} style={{ marginTop: "1rem" }}>
                Back to Login
            </button>
        </div>
    );
}
