import React, { useState } from "react";
import './RegisterPage.css'; // make sure the file exists

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Account created!');
      } else {
        setMessage(data.error || 'Something went wrong');
      }
    } catch (err) {
      setMessage('Error connecting to server');
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Your Account</h2>
      <p className="subtitle">Sign up to start editing your photos</p>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="auth-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="auth-input"
      />

      <button onClick={handleRegister} className="auth-btn">
        Create Account
      </button>

      {message && <p style={{ marginTop: '15px', color: '#b000b5' }}>{message}</p>}

      <p className="terms">
        By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
      </p>
    </div>
  );
}
