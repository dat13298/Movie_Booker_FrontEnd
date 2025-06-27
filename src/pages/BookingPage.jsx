// BookingPage.jsx
import { useParams } from "react-router-dom";
import { movies } from "../data/fakeMovies";
import { slugify } from "../utils/slugify";

export default function BookingPage() {
    const { slug } = useParams();
    const movie = movies.find((m) => slugify(m.name) === slug);

    if (!movie) return <h2>Không tìm thấy phim!</h2>;
    return <h1>Đặt vé cho: {movie.name}</h1>;
}
