import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './RegisterPage.css';

export default function Register() {
  const [step, setStep] = useState(1); 
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    setMessage('');
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Verification code sent! Check your email.');
        setStep(2);
      } else {
        setMessage('Invalid username or email');
      }
    } catch (err) {
      setMessage('Error connecting to server');
    }
  };

  const handleVerify = async () => {
    setMessage('');
    try {
      const response = await fetch('http://localhost:3000/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Account verified successfully! You can now log in.');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setMessage(data.error || 'Verification failed');
      }
    } catch (err) {
      setMessage('Error connecting to server');
    }
  };

  return (
    <div className="auth-container">
      {step === 1 && (
        <>
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
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password (min 8 chars)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="auth-input"
          />

          <button onClick={handleRegister} className="auth-btn">
            Create Account
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Verify Your Email</h2>
          <p className="subtitle">Enter the 4-digit code sent to {email}</p>

          <input
            type="text"
            placeholder="Verification code"
            value={code}
            onChange={e => setCode(e.target.value)}
            className="auth-input"
            maxLength={4}
          />

          <button onClick={handleVerify} className="auth-btn">
            Verify Account
          </button>
        </>
      )}

      {message && <p style={{ marginTop: '15px', color: '#b000b5' }}>{message}</p>}

      <p className="terms">
        By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
      </p>
    </div>
  );
}
