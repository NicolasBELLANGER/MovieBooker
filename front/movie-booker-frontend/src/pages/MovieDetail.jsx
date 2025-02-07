import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetail.css";

const API_BASE_URL = "http://localhost:3000/movie";

const MovieDetail = () => {
  const { id } = useParams(); // Récupère l'ID du film
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 Requête envoyée :", `${API_BASE_URL}/${id}`); // Debug
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("Film introuvable");

        const data = await response.json();
        console.log("🎬 Détails du film :", data); // 🔍 Vérifie les données reçues
        setMovie(data);
      } catch (error) {
        console.error("Erreur :", error);
        navigate("/"); // Redirige vers l'accueil si erreur
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, navigate]);

  if (loading) return <p className="loading">⏳ Chargement...</p>;
  if (!movie) return <p className="error-message">❌ Film non trouvé</p>;

  return (
    <div className="movie-detail">
      <button onClick={() => navigate(-1)} className="back-button">⬅ Retour</button>
      <h1>{movie.title || "Titre indisponible"} ({movie.release_date?.substring(0, 4)})</h1>
      <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder.jpg"} alt={movie.title} />
      <p><strong>Langue :</strong> {movie.original_language}</p>
      <p><strong>Note :</strong> {movie.vote_average} / 10</p>
      <p><strong>Votes :</strong> {movie.vote_count}</p>
      <p><strong>Popularité :</strong> {movie.popularity}</p>
      <p><strong>Genres :</strong> {movie.genre_ids?.join(', ')}</p>
      <p><strong>Aperçu :</strong> {movie.overview}</p>
    </div>
  );
};

export default MovieDetail;
