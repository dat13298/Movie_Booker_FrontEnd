import axios from "axios";
import {updateAuthTokens} from "@/auth/authHelper.js";
import emitter from "@/auth/eventBus.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,               // đừng hard-code
    timeout: 10000,
});

// ────────────────── REQUEST ──────────────────
api.interceptors.request.use((cfg) => {
    const token = localStorage.getItem("accessToken");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

// ─────────────── RESPONSE (refresh) ───────────
let refreshing = false;
let queue = [];

const replayQueue = (err, token) => {
    queue.forEach(({ resolve, reject }) => {
        err ? reject(err) : resolve(token);
    });
    queue = [];
};

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const orig = err.config;

        // chỉ refresh cho 401 từ API (loại trừ /auth/refresh)
        if (err.response?.status === 401 && !orig._retry && !orig.url.includes("/auth/refresh")) {
            orig._retry = true;

            // Đang refresh? → chờ
            if (refreshing) {
                return new Promise((resolve, reject) => {
                    queue.push({ resolve, reject });
                }).then((token) => {
                    orig.headers.Authorization = `Bearer ${token}`;
                    return api(orig);
                });
            }

            refreshing = true;
            const refreshToken = localStorage.getItem("refreshToken");

            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_BASE}/auth/refresh`,
                    { refreshToken }
                );

                const newAccess = data.accessToken || data;
                updateAuthTokens(newAccess, refreshToken);         // ghi LS + phát sự kiện
                replayQueue(null, newAccess);

                orig.headers.Authorization = `Bearer ${newAccess}`;
                return api(orig);                                   // gửi lại request cũ
            } catch (e) {
                replayQueue(e, null);
                emitter.emit("logout");                             // thông báo toàn app logout
                return Promise.reject(e);
            } finally {
                refreshing = false;
            }
        }
        return Promise.reject(err);
    }
);

export default api;
