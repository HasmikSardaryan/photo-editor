import React from 'react';
import { Link } from 'react-router-dom';
import useAuthContext from "../../hooks/useAuthContext";
import './Header.css';

function Header() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <header className="app-header">
      <div className="logo">📸 PhotoEditor</div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        {user ? <Link to="/logout"> Logout</Link> : <Link to="/login"> Login</Link>}
        {user && <Link to="/profile">Profile</Link>}
        {!user && <Link to="/register">Register</Link>}
      </nav>
    </header>
    
  );
}

export default Header;
