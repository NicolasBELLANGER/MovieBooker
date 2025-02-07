import { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input 
        type="text" 
        placeholder="Rechercher un film..." 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <button type="submit">🔍</button>
    </form>
  );
};

export default SearchBar;
