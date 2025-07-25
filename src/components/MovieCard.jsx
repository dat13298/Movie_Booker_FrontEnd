import React from 'react';
import '../styles/MovieCard.css';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/movie/${movie.id}`, { state: { movie } });
    };

    const metaInfo = [
        movie.duration ? `${movie.duration} phút` : null,
        movie.screenType,
        movie.rating ? `Rated ${movie.rating}` : null
    ].filter(Boolean).join(' • ');

    return (
        <div className="movie-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <div className="movie-card-img-wrapper">
                <img src={movie.imageUrl || movie.image} alt={movie.title} className="movie-card-img" />
            </div>
            <div className="movie-card-info">
                <h3 className="movie-card-title">{movie.title}</h3>
                <p className="movie-card-meta">{metaInfo}</p>
            </div>
        </div>
    );
}
