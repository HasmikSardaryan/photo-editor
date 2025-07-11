import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './EmailContinue.css';

function EmailContinue() {

  const BASE_URL = process.env.REACT_APP_API_URL;

  const [input, setInput] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError("Please enter your email or username.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }
  
    setError(null);
    setLoading(true);
  
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          emailOrUsername: input.trim(),
          password: password.trim()
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Logged in successfully');
        navigate('/');
      } else {
        setError("Wrong username or password."); 
        setLoading(false); 
      }
    } catch (err) {
      setError("Error connecting to server."); 
      setLoading(false);
    }
  };
  

  return (
    <div className="email-continue-container">
      <h2> Enter your credentials to login.</h2>
      <label className="input-label" htmlFor="email">
        Email or username
      </label>
      <input
        id="email"
        type="text"
        placeholder="Email or username"
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={loading}
      />

      <label className="input-label" htmlFor="password" style={{ marginTop: '12px' }}>
        Password
      </label>
      <input
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={loading}
      />

      {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}

      <div className="button-group" style={{ marginTop: '15px' }}>
        <button className="continue-button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default EmailContinue;
