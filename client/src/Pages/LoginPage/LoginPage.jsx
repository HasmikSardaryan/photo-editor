import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

function Login() {  
  const navigate = useNavigate();

  const handleRegister = async () => {
    navigate('/loginemail');
  };
  
  return (
    <div className="auth-container">
      <h2>Get started with PhotoEditor</h2>
      <p className="subtitle">Take your designs to the next level.</p>

      <button className="auth-btn google">
        <img src="https://img.icons8.com/color/24/google-logo.png" alt="Google" />
        Continue with Google
      </button>
      <button className="auth-btn email" onClick={handleRegister}>
        <img src="https://img.icons8.com/ios-glyphs/24/new-post.png" alt="Email" />
        Continue with email
      </button>

      <p className="terms">
        By continuing, you agree to our <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
      </p>
    </div>
  );
}


export default Login;

