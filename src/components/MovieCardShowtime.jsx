import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MovieCardShowtime.css';

const MovieCardShowtime = ({ movie }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/movie/${movie.id}`, { state: { movie } });
    };

    return (
        <div className="movie-card-showtime" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <img src={movie.image} alt={movie.title} className="movie-image" />
            <div className="movie-details">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-meta">
                    {movie.genre} - {movie.duration} phút <span className="movie-type">{movie.type}</span>
                </p>
                <p className="censor">{movie.censor}</p>
                <div className="showtime-buttons">
                    {movie.showtimes.map((time, idx) => (
                        <button key={idx}>{time}</button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieCardShowtime;
