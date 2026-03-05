const base = import.meta.env.VITE_BASE_URL || "/";

/**
 * @async
 * @returns {Promise<any[]>}
 */
export const fetchBorrowedBooks = async () => {
  try {
    const res = await fetch(base + "api/books/user-borrowed", {
      credentials: "include",
    });

    if (res.status !== 200 || !res.ok) return [];

    const data = await res.json();
    return data.books;
  } catch (err) {
    console.error(err);
  }

  return [];
};

/**
 * @async
 * @param {string} bookId
 */
export const confirmBookReturn = async (bookId) => {
  try {
    const res = await fetch(base + "api/books/return/" + bookId, {
      credentials: "include",
      method: "POST",
    });

    if (res.status !== 200 || !res.ok)
      throw new Error(res.statusText ?? "Erreur lors du retour");
  } catch (err) {
    console.error(err);
  }
};
