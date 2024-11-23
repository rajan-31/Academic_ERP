import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context type
interface AuthContextType {
    loggedInUserType: string;
    setLoggedInUserType: (value: string) => void;
}

// Provide a default value (optional)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loggedInUserType, setLoggedInUserType] = useState("");

    return (
        <AuthContext.Provider value={{ loggedInUserType, setLoggedInUserType }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook for Context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
