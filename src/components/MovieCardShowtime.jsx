import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MovieCardShowtime.css';
import dayjs from 'dayjs';

const MovieCardShowtime = ({ showtime }) => {
    const navigate = useNavigate();
    const movie = showtime.movie;

    const handleClick = () => {
        navigate(`/movie/${movie.id}`, { state: { movie } });
    };

    return (
        <div className="movie-card-showtime" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <img src={movie.imageUrl} alt={movie.title} className="movie-image" />
            <div className="movie-details">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-meta">
                    {movie.movieType} - {movie.duration} phút
                    <span className="movie-type"> - {movie.screenType}</span>
                </p>
                <p className="censor">{movie.is18Plus ? '18+' : 'P'}</p>

                <div className="showtime-buttons">
                    <button>
                        {dayjs(showtime.startTime).format('HH:mm')} - {showtime.presentation}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieCardShowtime;
