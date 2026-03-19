import { useState, useEffect } from "react";

function App() {
  const [dbStatus, setDbStatus] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/db-status")
      .then(res => res.json())
      .then(data => setDbStatus(data));
  }, []);

  return (
    <div>
      {dbStatus === null && <p>Checking database...</p>}
      {dbStatus?.connected && <p>✅ Database connected: {dbStatus.database[0][0]}</p>}
      {dbStatus?.connected === false && <p>❌ Database error: {dbStatus.error}</p>}
    </div>
  );
}

export default App;