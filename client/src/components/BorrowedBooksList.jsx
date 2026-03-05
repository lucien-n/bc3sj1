import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmBookReturn, fetchBorrowedBooks } from "../api/books";

const BorrowedBooksList = () => {
  /** @type {[Array,  React.Dispatch<React.SetStateAction<Array>>]} */
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBorrowedBooks().then(setBorrowedBooks);
  }, []);

  /** @param {string} bookId */
  const handleReturn = async (bookId) => {
    if (!window.confirm("Vous confirmez avoir retourné le livre ?")) return;

    try {
      await confirmBookReturn(bookId);
      navigate(0);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

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
          <th></th>
        </tr>
      </thead>
      <tbody>
        {borrowedBooks.map((item) => {
          const isBorrowed = !item.date_retour_effective;

          return (
            <tr key={item.id}>
              <td>{item.titre}</td>
              <td>{new Date(item.date_emprunt).toLocaleDateString()}</td>
              <td>{new Date(item.date_retour_prevue).toLocaleDateString()}</td>
              <td>
                {!isBorrowed
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
              <td>
                {isBorrowed && (
                  <button onClick={() => handleReturn(item.livre_id)}>
                    Rendu
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default BorrowedBooksList;
