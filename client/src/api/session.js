const base = import.meta.env.VITE_BASE_URL || "/";

/**
 * @async
 * @returns {Promise<Object | null>}
 */
export const fetchSession = async () => {
  try {
    const res = await fetch(base + "api/session", {
      credentials: "include",
    });

    if (res.status !== 200 || !res.ok) throw new Error("Account not found");

    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error(err);
    return null;
  }
};
