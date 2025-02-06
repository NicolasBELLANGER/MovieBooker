const MovieList = ({ movies }) => {
    if (!movies || movies.length === 0) {
      return <p>Aucun film disponible.</p>;
    }
  
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
          </div>
        ))}
      </div>
    );
  };
  
  export default MovieList;
  