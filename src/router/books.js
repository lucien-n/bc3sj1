const express = require("express");
const router = express.Router();
const db = require("../services/database");
const { authenticateToken } = require("../middlewares/auth");
const {
  borrowBook,
  getBorrowedBooksByUser: getBorrowedBooks,
  returnBook,
} = require("../services/books.service");

router

  .get("/", (_, res) => {
    const sql = "SELECT * FROM livres";
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  })

  .get("/user-borrowed", authenticateToken, async (req, res) => {
    const userId = req.user.id;

    await getBorrowedBooks(userId, (err, books) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur interne" });
      }

      return res.status(200).json({ books });
    });
  })

  .post("/return/:bookId", authenticateToken, async (req, res) => {
    const bookId = req.params.bookId;

    await returnBook(bookId, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur interne" });
      }

      return res.sendStatus(200);
    });
  })

  .post("/", authenticateToken, (req, res) => {
    const {
      title,
      author,
      date_publication,
      isbn,
      description,
      status,
      cover,
    } = req.body;
    const sql =
      "INSERT INTO livres (titre, auteur, date_publication, isbn, description, statut, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [
        title,
        author,
        date_publication,
        isbn,
        description,
        status || "disponible",
        cover,
      ],
      (err) => {
        if (err) res.status(400).send("Erreur d'envoi");
        res.status(204).send("Livre ajouté");
      },
    );
  })

  .get("/:id", (req, res) => {
    const sql = "SELECT * FROM livres WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  })

  .put("/:id", (req, res) => {
    const {
      title,
      author,
      published_date,
      isbn,
      description,
      status,
      photo_url,
    } = req.body;
    const sql =
      "UPDATE livres SET titre = ?, auteur = ?, date_publication = ?, isbn = ?, description = ?, statut = ?, photo_url = ? WHERE id = ?";
    db.query(
      sql,
      [
        title,
        author,
        published_date,
        isbn,
        description,
        status,
        photo_url,
        req.params.id,
      ],
      (err, result) => {
        if (err) throw err;
        res.send("Livre mis à jour");
      },
    );
  })

  .delete("/:id", (req, res) => {
    const sql = "DELETE FROM livres WHERE id = ?";
    db.query(sql, [req.params.id], (err) => {
      if (err) throw err;
      res.send("Livre supprimé");
    });
  })

  /**
   * @param {import("Express").Request} req
   * @param {import("Express").Response} res
   */
  .post("/borrow/:id", authenticateToken, async (req, res) => {
    const bookId = req.params.id;
    if (!bookId)
      return res.status(422).json({ message: "Id du livre manquant" });

    const { returnDate } = req.body;
    if (
      !returnDate ||
      new Date(returnDate) > new Date().getTime() + 30 * 24 * 3600 * 1000 ||
      new Date(returnDate) < new Date()
    )
      return res
        .status(422)
        .json({ message: "Date de retour du livre manquante ou invalide" });

    await borrowBook(req.user.id, bookId, returnDate, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur interne" });
      }

      return res.sendStatus(200);
    });
  });

module.exports = router;
