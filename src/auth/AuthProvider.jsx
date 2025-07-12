import React, {createContext, useMemo, useState, useEffect} from "react";
import emitter from "./eventBus";

export const AuthContext = createContext();

const LS_ACCESS  = "accessToken";
const LS_REFRESH = "refreshToken";

const parseJwt = (t) => {
    try { return JSON.parse(atob(t.split(".")[1])); } catch { return null; }
};

export const AuthProvider = ({children}) => {
    /* ─── 1. Khởi tạo từ localStorage ─── */
    const [auth, setAuth] = useState(() => {
        const access = localStorage.getItem(LS_ACCESS);
        const refresh = localStorage.getItem(LS_REFRESH);

        return {
            accessToken: access || null,
            refreshToken: refresh || null,
        };
    });


    /* 2. Giải mã userInfo khi accessToken thay đổi */
    const userInfo = useMemo(
        () => (auth.accessToken ? parseJwt(auth.accessToken) : null),
        [auth.accessToken]
    );

    /* 3. Lắng nghe refresh-token thành công từ axios */
    useEffect(() => {
        const handler = (newAcc) =>
            setAuth((s) => ({ ...s, accessToken: newAcc }));
        emitter.on("tokenUpdated", handler);
        emitter.on("logout", () => updateAuth());          // clear toàn cục
        return () => {
            emitter.off("tokenUpdated", handler);
            emitter.off("logout");
        };
    }, []);

    /* 4. Hàm cập nhật / xoá token */
    const updateAuth = (tokens) => {
        if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
            localStorage.removeItem(LS_ACCESS);
            localStorage.removeItem(LS_REFRESH);
            setAuth({ accessToken: null, refreshToken: null });
            return;
        }

        const { accessToken, refreshToken } = tokens;
        localStorage.setItem(LS_ACCESS, accessToken);
        localStorage.setItem(LS_REFRESH, refreshToken);
        setAuth({ accessToken, refreshToken });
    };



    const logout = () => {
        updateAuth();
        window.location.replace("/login");
    };

    return (
        <AuthContext.Provider value={{auth, userInfo, updateAuth, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
