import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSession } from "../api/session";
import BorrowedBooksList from "./BorrowedBooksList";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSession().then(setUser);
  }, []);

  if (!user) {
    return navigate("/");
  }

  return (
    <div className="container">
      {user && <p>{user.email}</p>}

      <hr />

      {user && <BorrowedBooksList />}
    </div>
  );
};

export default ProfilePage;
