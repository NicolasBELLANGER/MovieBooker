import { Link } from "react-router-dom";
import "./MovieList.css";
const MovieList = ({ movies }) => {
  console.log("🎬 Films reçus :", movies); // Debug

  return (
    <div className="movie-list">
      {movies.length > 0 ? (
        movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <Link to={`/movie/${movie.id}`} className="movie-link">
              <img 
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder.jpg"} 
                alt={movie.title || "Aucun titre"} 
                className="movie-poster"
              />
              <h3>{movie.title ? movie.title : "Titre indisponible"}</h3>
            </Link>
          </div>
        ))
      ) : (
        <p className="no-results">Aucun film trouvé.</p>
      )}
    </div>
  );
};

export default MovieList;
