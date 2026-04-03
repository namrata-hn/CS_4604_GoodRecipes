import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const NAV_LINKS = [
  { to: "/",          label: "Home"      },
  { to: "/recipes",   label: "My Recipes" },
  { to: "/browse",    label: "Browse"    },
  { to: "/community", label: "Community" },
  { to: "/search",    label: "Search"    },
];

export default function NavBar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const handleSearch = e => {
    if (e.key === "Enter" && q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setQ("");
    }
  };

  return (
    <nav className="topnav">
      <NavLink to="/" className="nav-logo">🍽 Reciply</NavLink>

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
      </div>

      <div className="nav-search">
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>🔍</span>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search recipes…"
        />
      </div>

      <div className="nav-user">
        <span>{user?.username}</span>
        <button className="btn-logout" onClick={() => { setUser(null); navigate("/login"); }}>
          Sign out
        </button>
      </div>
    </nav>
  );
}
