const db = require("./database");

/**
 * @async
 * @param {string} userId
 * @param {string} bookId
 * @param {Date} returnDate
 * @param {(err: Error | null) => void} callback
 *
 * @returns {Promise<boolean>}
 * */
const borrowBook = async (userId, bookId, returnDate, callback) => {
  db.query(
    "SELECT statut FROM livres WHERE id = ?",
    [bookId],
    (err, results) => {
      if (err) return callback(err);

      if (results.length === 0) {
        return callback(new Error("Livre introuvable"));
      }

      if (results[0].statut !== "disponible") {
        return callback(new Error(`Le livre "${bookId}" est déjà emprunté`));
      }

      db.beginTransaction((err) => {
        if (err) return callback(err);

        db.query(
          "INSERT INTO emprunts (utilisateur_id, livre_id, date_retour_prevue) VALUES (?, ?, ?)",
          [userId, bookId, returnDate],
          (err) => {
            if (err) return db.rollback(() => callback(err));

            db.query(
              "UPDATE livres SET statut = ? WHERE id = ?",
              ["emprunté", bookId],
              (err) => {
                if (err) return db.rollback(() => callback(err));

                db.commit((err) => {
                  callback(err ?? null);
                });
              },
            );
          },
        );
      });
    },
  );
};

/**
 * @async
 * @param {string} userId
 * @param {(err: Error | null, books: any[]) => void} callback
 */
const getBorrowedBooksByUser = async (userId, callback) => {
  db.query(
    `
    SELECT e.*, l.titre, l.statut
    FROM emprunts e
    JOIN livres l ON e.livre_id = l.id
    WHERE e.utilisateur_id = ?
    ORDER BY e.date_emprunt DESC;
    `,
    [userId],
    (err, result) => {
      if (err) return callback(err, []);

      callback(null, result);
    },
  );
};

/**
 * @async
 * @param {string} bookId
 * @param {(err: Error | null) => void} callback
 * @returns {Promise}
 */
const returnBook = (bookId, callback) => {
  db.beginTransaction((err) => {
    if (err) return callback(err);

    db.query(
      `
      UPDATE emprunts 
      SET date_retour_effective = CURRENT_TIMESTAMP 
      WHERE livre_id = ? AND date_retour_effective IS NULL
      `,
      [bookId],
      (err, result) => {
        if (err || !result.affectedRows)
          return db.rollback(() =>
            callback(err || new Error("Aucun emprunt actif trouvé")),
          );

        db.query(
          "UPDATE livres SET statut = 'disponible' WHERE id = ?",
          [bookId],
          (err) => {
            if (err) return db.rollback(() => callback(err));

            db.commit((err) => {
              if (err) return db.rollback(() => callback(err));

              callback(null);
            });
          },
        );
      },
    );
  });
};

module.exports = {
  borrowBook,
  getBorrowedBooksByUser,
  returnBook,
};
