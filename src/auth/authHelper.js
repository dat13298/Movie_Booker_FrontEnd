import emitter from "./eventBus";

export const updateAuthTokens = (access, refresh) => {
    localStorage.setItem("accessToken", access);
    if (refresh) localStorage.setItem("refreshToken", refresh);
    emitter.emit("tokenUpdated", access);
};
