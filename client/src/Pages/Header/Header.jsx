import React from 'react';
import { Link, useLocation} from 'react-router-dom';
import useAuthContext from "../../hooks/useAuthContext";
import './header.css';

function Header() {

  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <header className="app-header">
      <div className="logo">📸 PhotoEditor</div>
      <nav className="nav-links">
        {console.log(user)}
        {user ? <Link to="/logout"> Logout</Link> : <Link to="/login"> Login</Link>}
        {user && !isProfilePage && <Link to="/profile">Profile</Link>}
        {isProfilePage && <Link to="/">Home</Link>}
        {!user && <Link to="/register">Register</Link>}
      </nav>
    </header>
    
  );
}

export default Header;
