import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBorrowedBooks } from "../api/books";

const BorrowedBooksList = () => {
  /** @type {[Array,  React.Dispatch<React.SetStateAction<Array>>]} */
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBorrowedBooks().then(setBorrowedBooks);
  }, []);

  if (!borrowedBooks || !borrowedBooks.length)
    return "Vous n'avez encore emprunté aucun livre";

  return (
    <table>
      <thead>
        <tr>
          <th>Livre</th>
          <th>Date d'emprunt</th>
          <th>Retour prévu</th>
          <th>Statut</th>
          <th>Détails</th>
        </tr>
      </thead>
      <tbody>
        {borrowedBooks.map((item) => (
          <tr key={item.id}>
            <td>{item.titre}</td>
            <td>{new Date(item.date_emprunt).toLocaleDateString()}</td>
            <td>{new Date(item.date_retour_prevue).toLocaleDateString()}</td>
            <td>
              {item.date_retour_effective
                ? "Rendu"
                : new Date(item.date_retour_prevue) < new Date()
                  ? "⚠️ En retard"
                  : "En cours"}
            </td>
            <td>
              <button onClick={() => navigate(`/book/${item.livre_id}`)}>
                Voir les détails
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BorrowedBooksList;
