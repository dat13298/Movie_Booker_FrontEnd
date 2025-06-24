import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        accessToken: null,
        refreshToken: null,
    });

    const [isSessionExpired, setIsSessionExpired] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (accessToken && refreshToken) {
            setAuth({ accessToken, refreshToken });
        }
    }, []);

    useEffect(() => {
        if (window.isSessionExpired) {
            setIsSessionExpired(true);
        }
    }, []);

    const updateAuth = (data) => {
        if (!data) {
            setAuth({ accessToken: null, refreshToken: null });
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            return;
        }

        const { accessToken, refreshToken } = data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        window.isSessionExpired = false;
        setIsSessionExpired(false);
        setAuth({ accessToken, refreshToken });
    };

    const logout = () => {
        localStorage.clear();
        setAuth({ accessToken: null, refreshToken: null });
        window.isSessionExpired = false;
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ auth, updateAuth, logout, isSessionExpired }}>
            {children}
        </AuthContext.Provider>
    );
};
