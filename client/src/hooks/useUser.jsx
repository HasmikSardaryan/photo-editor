import { useState, useEffect } from "react";

const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3000/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setLoading(false);
      });
  }, [userId]);

  return { user, loading };
};

export default useUser;
