import axios from "axios";
import {updateAuthTokens} from "@/auth/authHelper.js";
import emitter from "@/auth/eventBus.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    timeout: 10000,
});

api.interceptors.request.use((cfg) => {
    const token = localStorage.getItem("accessToken");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

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

        if (err.response?.data?.code === 4001 && !orig._retry && !orig.url.includes("/auth/refresh")) {
            orig._retry = true;

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
                    {},
                    {
                        headers: {
                            'X-Refresh-Token': refreshToken,
                        },
                    }
                );

                const newAccess = data;
                console.log("refresh", newAccess);
                updateAuthTokens(newAccess, refreshToken);
                replayQueue(null, newAccess);

                orig.headers.Authorization = `Bearer ${newAccess}`;
                return api(orig);
            } catch (e) {
                replayQueue(e, null);
                emitter.emit("logout");
                return Promise.reject(e);
            } finally {
                refreshing = false;
            }
        }
        return Promise.reject(err);
    }
);

export default api;
