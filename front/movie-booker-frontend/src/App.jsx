import { useState } from "react";
import MovieList from "./components/MovieList";
import Navbar from "./components/NavBar";
import useAuth from "./hooks/useAuth";
import useMovies from "./hooks/useMovies";
import "./index.css";

const App = () => {
  const { isAuthenticated, logout } = useAuth();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(""); // Recherche
  const { movies, totalPages, loading, error } = useMovies(isAuthenticated, page, query);

  const handleSearch = (searchQuery) => {
    console.log("🔍 Recherche envoyée :", searchQuery); // Debugging
    setQuery(searchQuery);
    setPage(1); // Réinitialise la pagination
  };

  return (
    <div className="container">
      <Navbar isAuthenticated={isAuthenticated} onLogout={logout} onSearch={handleSearch} />
      <h1>Films Populaires 🎬</h1>

      {error && <p className="error-message">❌ {error}</p>}

      {loading ? <p className="loading">⏳ Chargement...</p> : isAuthenticated && <MovieList movies={movies} />}

      {isAuthenticated && !query && !loading && (
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            ⬅️ Précédent
          </button>
          <span> Page {page} / {totalPages} </span>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
            Suivant ➡️
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
