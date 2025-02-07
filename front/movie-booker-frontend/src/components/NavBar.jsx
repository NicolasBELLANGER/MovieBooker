import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import "./NavBar.css";

const Navbar = ({ isAuthenticated, onLogout, onSearch }) => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">Accueil</Link>
      </div>

      {isAuthenticated && <SearchBar onSearch={onSearch} />}

      <div className="nav-right">
        {isAuthenticated ? (
          <button onClick={onLogout}>Déconnexion</button>
        ) : (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
