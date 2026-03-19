import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [queryLoading, setQueryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

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

  const runQuery = () => {
    setQueryLoading(true);
    setError(null);
    setResult(null);

    fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setResult(data);
        else setError(data.error);
        setQueryLoading(false);
      })
      .catch(() => {
        setError("Could not reach the server.");
        setQueryLoading(false);
      });
  };

  return (
    <div>
      {loading ? (<p>Checking connection...</p>) : status.connected ? (
        <p style={{ color: "green" }}>
          Database connected! Connected to {status.database}.
        </p>
      ) : (
        <p style={{ color: "red" }}>
          Connection failed: {status.error}
        </p>
      )}

      <textarea
        className="query-box"
        rows={5}
        placeholder="Enter your SQL query... e.g. SELECT * FROM user;"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button className="run-btn" onClick={runQuery} disabled={queryLoading}>
        {queryLoading ? "Running..." : "Run Query"}
      </button>

      {error && <p className="error">{error}</p>}
      {result?.message && <p className="success">{result.message}</p>}

      {result?.rows && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {result.columns.map(col => <th key={col}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => <td key={j}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}