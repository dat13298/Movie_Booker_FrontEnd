// movieService.js
import api from "@/api/axios.js";

export async function getAllMovies() {
    const res = await api.get("/movies", {
        params: {
            page: 0,
            size: 1000,
        },
    });
    return res.data.content || [];
}
