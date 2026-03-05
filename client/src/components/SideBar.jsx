import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSession } from "../api/session";
import "./../styles/sidebar.css";

const Sidebar = ({ userT }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchSession().then(setUser);
  }, []);

  const handleLogout = () => {
    fetch(base + "api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(() => {
      setUser(null);
      window.location.href = "/";
    });
  };

  return (
    <nav id="sidebar">
      <ul>
        {user?.role ? (
          <>
            <li>Bonjour {user.email}</li>
            <li style={{ textAlign: "right" }}>
              <i>{user.role}</i>
            </li>
            <li>
              <Link to="/books">Voir la liste des livres</Link>
            </li>
            <li>
              <Link to="/profile">Mon profil</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Déconnexion</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Connexion</Link>
            </li>
            <li>
              <Link to="/register">Inscription</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;
