import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import NavBar from "./components/NavBar";

import AuthPage     from "./pages/AuthPage";
import HomePage     from "./pages/HomePage";
import MyRecipesPage from "./pages/MyRecipesPage";
import BrowsePage   from "./pages/BrowsePage";
import CommunityPage from "./pages/CommunityPage";
import SearchPage   from "./pages/SearchPage";

import "./styles/reciply.css";

// ─── Protected route wrapper ──────────────────────────────────────────────────
function RequireAuth({ children }) {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" replace />;
}

// ─── Layout (nav + outlet) ────────────────────────────────────────────────────
function AppLayout() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/recipes"   element={<MyRecipesPage />} />
        <Route path="/browse"    element={<BrowsePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/search"    element={<SearchPage />} />
        {/* Catch-all → home */}
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function InnerApp() {
  const { user } = useUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
        <Route
          path="/*"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <UserProvider>
      <InnerApp />
    </UserProvider>
  );
}
