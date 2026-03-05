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
