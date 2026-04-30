import { Routes, Route, Navigate } from "react-router-dom";  // remove BrowserRouter import
import { UserProvider } from "./context/UserProvider";
import { useUser } from "./context/UserContext";
import NavBar from "./components/NavBar";

import AuthPage      from "./pages/AuthPage";
import HomePage      from "./pages/HomePage";
import MyRecipesPage from "./pages/MyRecipesPage";
import BrowsePage    from "./pages/BrowsePage";
import CommunityPage from "./pages/CommunityPage";
import SearchPage    from "./pages/SearchPage";
import AdminPage     from "./pages/AdminPage";
import CollectionsPage    from "./pages/CollectionsPage";


import "./styles/reciply.css";

function RequireAuth({ children }) {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" replace />;
}

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
        <Route path="/admin"     element={<AdminPage />} />
        <Route path="/collections/:collectionId" element={<CollectionsPage />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function InnerApp() {
  const { user } = useUser();

  return (
    <Routes>  {/* ✅ No BrowserRouter here */}
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
  );
}

export default function App() {
  return (
    <UserProvider>
      <InnerApp />
    </UserProvider>
  );
}