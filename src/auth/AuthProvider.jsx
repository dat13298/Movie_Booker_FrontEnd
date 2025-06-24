import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        accessToken: null,
        refreshToken: null,
    });

    const parseJwt = (token) => {
        try {
            const base64Payload = token.split('.')[1];
            const payload = atob(base64Payload);
            return JSON.parse(payload);
        } catch {
            return null;
        }
    };

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (accessToken && refreshToken) {
            setAuth({ accessToken, refreshToken });
            setUserInfo(parseJwt(accessToken)); // Lưu username, role, etc.
        }
    }, []);


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
            setUserInfo(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            return;
        }

        const { accessToken, refreshToken } = data;
        setAuth({ accessToken, refreshToken });
        setUserInfo(parseJwt(accessToken));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    };


    const logout = () => {
        localStorage.clear();
        setAuth({ accessToken: null, refreshToken: null });
        window.isSessionExpired = false;
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ auth, updateAuth, logout, isSessionExpired, userInfo }}>
            {children}
        </AuthContext.Provider>
    );
};
