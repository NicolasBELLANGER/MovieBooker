import { useEffect, useState } from "react";

const API_BASE_URL = "https://moviebooker-back.onrender.com/movie";

const useMovies = (isAuthenticated, page, query) => {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); // Loader
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = query
          ? `${API_BASE_URL}/search?name=${query}`
          : `${API_BASE_URL}?page=${page}`;

        console.log("🔍 Requête envoyée :", url); // Debugging

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("Erreur lors du chargement des films");

        const data = await response.json();
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [isAuthenticated, page, query]);

  return { movies, totalPages, loading, error };
};

export default useMovies;
