import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/db-status")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch(() => {
        setStatus({ connected: false, error: "Could not reach server" });
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Checking connection...</p>;

  return (
    <div>
      {status.connected ? (
        <p style={{ color: "green" }}>
          Database connected! Connected to {status.database}.
        </p>
      ) : (
        <p style={{ color: "red" }}>
          ❌ Connection failed: {status.error}
        </p>
      )}
    </div>
  );
}