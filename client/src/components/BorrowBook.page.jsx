import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const base = import.meta.env.VITE_BASE_URL || "/";

const BorrowBookPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [bookForm, setBookForm] = useState({
    returnDate: "",
  });
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookForm((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);

    try {
      const response = await fetch(`/api/books/borrow/${bookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookForm),
        credentials: "include",
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/books"), 2000); // Redirect after 2 seconds
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || ["Une erreur est survenue"]);
      }
    } catch (error) {
      setErrors([error.message]);
    }
  };

  return (
    <div className="container">
      {success && <p>Le livre a été emprunté avec succès.</p>}

      {errors.length > 0 && (
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="returnDate">Date du retour prevue :</label>
        <input
          type="date"
          name="returnDate"
          value={bookForm.returnDate}
          onChange={handleChange}
          required
        />

        <br />

        <button type="submit">Emprunter le Livre</button>
      </form>
    </div>
  );
};

export default BorrowBookPage;
