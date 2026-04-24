import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { API } from "../utils/api";
import RecipeCard from "../components/RecipeCard";
import EmptyState from "../components/EmptyState";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const doSearch = async (term = q) => {
    if (!term.trim()) return;
    const d = await API(`/api/recipes/search?title=${encodeURIComponent(term)}`);
    if (d.success) {
      setResults(d.recipes);
    } else {
      setResults([]);
    }
    setSearched(true);
  };

  // Auto-search if navigated here via the nav search bar
  useEffect(() => {
    const param = searchParams.get("q");
    if (param) { setQ(param); doSearch(param); }
  }, []);

  const handleKey = e => {
    if (e.key === "Enter") { setSearchParams({ q }); doSearch(); }
  };

  return (
    <div className="page">
      <h1 className="page-title">Search Recipes</h1>
      <p className="page-sub">Find recipes by title.</p>

      <div className="search-bar-big">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search recipes…"
          onKeyDown={handleKey}
        />
        <button className="btn-accent" onClick={() => { setSearchParams({ q }); doSearch(); }}>
          Search
        </button>
      </div>

      {searched && results.length === 0 && (
        <EmptyState icon="🔍" message={`No recipes found for "${q}".`} />
      )}

      {results.length > 0 && (
        <div className="card-grid">
          {results.map(r => (
            <RecipeCard key={r.recipe_id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
