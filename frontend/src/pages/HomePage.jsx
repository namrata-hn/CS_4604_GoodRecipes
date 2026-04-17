import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const QUICK_ACTIONS = [
  { icon: "📖", label: "My Recipes",  desc: "View and manage your recipes",        to: "/recipes"   },
  { icon: "🌍", label: "Browse",      desc: "Explore ingredients & cuisines",       to: "/browse"    },
  { icon: "💬", label: "Community",   desc: "Share reviews & feedback",             to: "/community" },
  { icon: "🔍", label: "Search",      desc: "Find any recipe instantly",            to: "/search"    },
];

export default function HomePage() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="hero">
        <div className="hero-title">
          Welcome back, <em>{user?.username}</em>.
        </div>
        <div className="hero-sub">Discover, create, and share recipes with the community.</div>
      </div>

      <div className="section-title">Quick Actions</div>
      <div className="card-grid">
        {QUICK_ACTIONS.map(({ icon, label, desc, to }) => (
          <div key={label} className="recipe-card" style={{ cursor: "pointer" }} onClick={() => navigate(to)}>
            <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{icon}</div>
            <div className="card-title">{label}</div>
            <div className="card-desc">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
