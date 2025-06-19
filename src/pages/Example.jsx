import {useEffect, useState} from "react";
import api from "../api/axios";
import {Link} from "react-router-dom";

export default function Example() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);


    // fetch api example
    useEffect(() => {
        api.get("/movies")
            .then(res => {
                setMovies(res.data.content);
                console.log(res.data.content);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch movie:", err);
                setLoading(false);
            });
    }, []);


    return (
        <div>
            <h1>All Movies</h1>
            <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Duration</th>
                    <th>Rating</th>
                    <th>Detail</th>
                </tr>
                </thead>
                <tbody>
                {movies.map(movie => (
                    <tr key={movie.id}>
                        <td>{movie.id}</td>
                        <td>
                            <img src={movie.imageUrl} alt={movie.title} style={{ width: "80px" }} />
                        </td>
                        <td>{movie.title}</td>
                        <td>{movie.duration} min</td>
                        <td>{movie.rating}</td>
                        <td><Link to={`/movie/${movie.id}`}>View</Link></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
