import { useState, useEffect, useMemo } from 'react';

const useAuthContext = () => {
    const BASE_URL = process.env.REACT_APP_API_URL;

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const checkUserAuthentication = async () => {
            try {
                const response = await fetch(`${BASE_URL}/get_user`, {
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setUser(data.user);
                } else if (response.status === 401) {
                    setUser(null);
                } else {
                    console.error('Unexpected response status:', response.status);
                }
            } catch (error) {
                console.error('Error checking user authentication:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkUserAuthentication();
    }, []);

    return {user, isLoading};
};

export default useAuthContext;