import { useState, useEffect } from "react";

const useUser = (userId) => {

  const BASE_URL = process.env.REACT_APP_API_URL;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    fetch(`${BASE_URL}/${userId}`)
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
