import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const res = await axios.get(`http://localhost:5001/api/user/profile/${userId}`);
                    if (res.status === 200) {
                        setUser(res.data);
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
        };

        // Fetch user profile when the app initializes
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
