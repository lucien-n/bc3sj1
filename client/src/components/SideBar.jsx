import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchBorrowedBooks } from "../api/books";
import { fetchSession } from "../api/session";
import "./../styles/sidebar.css";

const Sidebar = ({ userT }) => {
  const [user, setUser] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSession().then(setUser);
    fetchBorrowedBooks().then(setBorrowedBooks);
  }, []);

  const unreturnedBooks = borrowedBooks.filter(
    (item) => new Date(item.date_retour_prevue) < new Date(),
  );

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
            <li>
              <p>Bonjour {user.email}</p>
              {unreturnedBooks.length ? (
                <button
                  title="Vous avez des livres non rendus"
                  onClick={() => navigate("/profile")}
                >
                  ⚠ Non rendus
                </button>
              ) : null}
            </li>
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
