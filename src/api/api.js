import axios from "axios";
import emitter from "./eventBus";
import {updateAuthTokens} from "./authHelper";

const api = axios.create({
    baseURL : import.meta.env.VITE_API_BASE,
    timeout : 10000,
});

/* Request: gắn accessToken */
api.interceptors.request.use(cfg => {
    const tk = localStorage.getItem("accessToken");
    if (tk) cfg.headers.Authorization = `Bearer ${tk}`;
    return cfg;
});

/* Response: tự refresh khi 401 */
let refreshing = false;
let queue = [];

const replay = (err, token) => {
    queue.forEach(({resolve, reject}) => err ? reject(err) : resolve(token));
    queue = [];
};

api.interceptors.response.use(
    res => res,
    async err => {
        const orig = err.config;
        if (err.response?.status === 401 && !orig._retry && !orig.url.includes("/auth/refresh")) {
            orig._retry = true;

            /* Đang refresh → chờ */
            if (refreshing) {
                return new Promise((resolve, reject) => queue.push({resolve, reject}))
                    .then((tk) => {
                        orig.headers.Authorization = `Bearer ${tk}`;
                        return api(orig);
                    });
            }

            refreshing = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const {data} = await axios.post(`${import.meta.env.VITE_API_BASE}/auth/refresh`, {refreshToken});
                const newAcc = data.accessToken || data;
                updateAuthTokens(newAcc, refreshToken);   // ghi LS + phát "tokenUpdated"
                replay(null, newAcc);
                orig.headers.Authorization = `Bearer ${newAcc}`;
                return api(orig);
            } catch (e) {
                replay(e);
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
