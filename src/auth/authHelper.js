import emitter from "./eventBus";

export function updateAuthTokens(accessToken, refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
    }
    emitter.emit("refreshToken", refreshToken);
}

