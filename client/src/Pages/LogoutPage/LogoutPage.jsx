import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const response = await fetch('photo-editor-haas.onrender.com0/logout', {
                    method: 'POST',
                    credentials: 'include',
                });
                if (response.ok) {
                    localStorage.removeItem('token');
                    navigate('/');
                } else {
                    alert('Logout failed');
                }
            } catch (error) {
                alert('Error connecting to server during logout');
            }
        };

        handleLogout();
    }, []);
}
