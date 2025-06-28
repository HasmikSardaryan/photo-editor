import React from "react";
import { useState } from "react";
export default function Reset() {

    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
  
    const handleResetRequest = async () => {
      try {
        const response = await fetch('http://localhost:3000/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setMessage('Reset email sent! Check your inbox.');
        } else {
          setMessage(data.error || 'Failed to send reset email');
        }
      } catch (err) {
        setMessage('Server error sending reset email');
      }
    };
    
    return (
        
        <div>
            <h2>Reset your password</h2>
            <span>
                Username:
                <input type="text" onChange={e => setUsername(e.target.value)}/>
            </span>
            <button onClick={handleResetRequest} >Send reset email</button>
            {message && <p>{message}</p>}
        </div>
    )
}