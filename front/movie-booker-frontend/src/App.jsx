import { useEffect, useState } from "react";
import MovieList from "./components/MovieList";

const API_BASE_URL = "http://localhost:3000/movie";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Ajout du token JWT
      });
      const data = await response.json();
      console.log("Données reçues du backend :", data); // Debug
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Erreur lors du chargement des films :", error);
    }
};

  useEffect(() => {
    fetchMovies();
  }, [page]);

  return (
    <div>
      <h1>Films Populaires 🎬</h1>
      <MovieList movies={movies} />
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          ⬅️ Précédent
        </button>
        <span> Page {page} / {totalPages} </span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          Suivant ➡️
        </button>
      </div>
    </div>
  );
};

export default App;
