import React, { createContext, useState, useContext, ReactNode } from 'react';
import AuthContextType from "../types/UtilTypes";

// Provide a default value (optional)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loggedInUserType, setLoggedInUserType] = useState("");

    return (
        <AuthContext.Provider value={{ loggedInUserType, setLoggedInUserType }}>
            {children}
        </AuthContext.Provider>
    );
};
