import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Header from "../Header/Header";
import "./ProfilePage.css";

function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/get_user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Fetch user failed:", err);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <div className="profile-banner">
      </div>

      <div className="profile-wrapper">
        <div className="profile-content">
          <div className="avatar-box">
            {user.photo ? (
              <img src={user.photo} alt="avatar" className="avatar-img" />
            ) : (
              <div className="no-avatar">No Avatar</div>
            )}
          </div>

          <div className="user-details">
            <h2>@{user.username}</h2>
            <p>0 followers • 1 following</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        <Link to="/collections">Collection</Link>
      </div>
    </>
  );
}

export default ProfilePage;

