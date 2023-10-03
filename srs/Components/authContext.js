import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();
   

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {

        SecureStore.getItemAsync('userToken').then(token => {
            if (token) {
                setIsAuthenticated(true);
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};
