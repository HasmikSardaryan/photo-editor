import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const response = await fetch(`${BASE_URL}/logout`, {
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
