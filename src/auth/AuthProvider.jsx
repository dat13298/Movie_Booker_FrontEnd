import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        return { accessToken, refreshToken };
    });

    const updateAuth = (accessToken, refreshToken) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setAuth({ accessToken, refreshToken });
    };

    const logout = () => {
        localStorage.clear();
        setAuth({ accessToken: null, refreshToken: null });
    };

    return (
        <AuthContext.Provider value={{ auth, updateAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
