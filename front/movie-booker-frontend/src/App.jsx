import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MovieList from "./components/MovieList";

const API_BASE_URL = "http://localhost:3000/movie"; // URL du backend

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Vérifie si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirection vers login si pas de token
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Déconnexion de l'utilisateur
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  // Récupérer les films depuis le backend
  const fetchMovies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Erreur lors du chargement des films :", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMovies();
    }
  }, [page, isAuthenticated]);

  return (
    <div className="container">
      <nav>
        <Link to="/">Accueil</Link>
        {isAuthenticated ? (
          <>
            <button onClick={handleLogout}>Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        )}
      </nav>

      <h1>Bienvenue sur Movie Booker 🎬</h1>

      {/* Affichage des films */}
      {isAuthenticated && <MovieList movies={movies} />}

      {/* Pagination */}
      {isAuthenticated && (
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
