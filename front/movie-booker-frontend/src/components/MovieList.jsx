const MovieList = ({ movies }) => {
    return (
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title} 
              className="movie-poster"
            />
            <h3>{movie.title} ({movie.release_date.substring(0, 4)})</h3>
            <p><strong>Langue :</strong> {movie.original_language}</p>
            <p><strong>Note :</strong> {movie.vote_average} / 10</p>
            <p><strong>Votes :</strong> {movie.vote_count}</p>
            <p><strong>Popularité :</strong> {movie.popularity}</p>
            <p><strong>Genres :</strong> {movie.genre_ids.join(', ')}</p>
            <p><strong>Aperçu :</strong> {movie.overview}</p>
            <p><strong>Vidéo :</strong> {movie.video ? "Oui" : "Non"}</p>
            <p><strong>Adulte :</strong> {movie.adult ? "Oui" : "Non"}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default MovieList;
  