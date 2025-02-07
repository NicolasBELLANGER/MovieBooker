import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetail.css";

const API_BASE_URL = "https://moviebooker-back.onrender.com/movie";
const RESERVATION_API = "https://moviebooker-back.onrender.com/reservation"; // ✅ API de réservation

const MovieDetail = () => {
  const { id } = useParams(); 
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservationDate, setReservationDate] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        console.log("🔍 Requête envoyée :", `${API_BASE_URL}/${id}`);
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("Film introuvable");

        const data = await response.json();
        console.log("🎬 Détails du film :", data);
        setMovie(data);
      } catch (error) {
        console.error("Erreur :", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // ✅ Fonction pour soumettre la réservation
  const handleReservation = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!reservationDate) {
      setMessage("❌ Veuillez choisir une date.");
      return;
    }

    try {
      const response = await fetch(RESERVATION_API, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({
          userId: 1, // ⚠️ Remplace avec l'ID utilisateur stocké
          movieId: movie.id,
          movieName: movie.title,
          date: reservationDate,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Réservation effectuée avec succès !");
      } else {
        setMessage(`❌ Erreur : ${data.message}`);
      }
    } catch (error) {
      console.error("Erreur :", error);
      setMessage("❌ Une erreur est survenue.");
    }
  };

  if (loading) return <p className="loading">⏳ Chargement...</p>;
  if (error) return <p className="error-message">❌ {error}</p>;
  if (!movie) return <p className="error-message">❌ Film non trouvé</p>;

  return (
    <div className="movie-detail">
      <button onClick={() => navigate(-1)} className="back-button">⬅ Retour</button>
      <img 
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder.jpg"} 
          alt={movie.title} 
      />
      <div className="detail-data">
          <h1>{movie.title || "Titre indisponible"} ({movie.release_date?.substring(0, 4)})</h1>
          <p><strong>Synopsis :</strong> {movie.overview}</p>
          <p><strong>Langue :</strong> {movie.original_language}</p>
          <p><strong>Note :</strong> {movie.vote_average} / 10</p>
          <p><strong>Votes :</strong> {movie.vote_count}</p>
          <p><strong>Popularité :</strong> {movie.popularity}</p>

          {/* 📅 FORMULAIRE DE RÉSERVATION */}
          <div className="reservation-container">
            <h2>🎟️ Réserver une séance</h2>
            <form onSubmit={handleReservation}>
              <input 
                type="datetime-local"
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                required
              />
              <button type="submit" className="reserve-button">Réserver</button>
            </form>
            {message && <p className="reservation-message">{message}</p>}
          </div>
      </div>
    </div>
  );
};

export default MovieDetail;
