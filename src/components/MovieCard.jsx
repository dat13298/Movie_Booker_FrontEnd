import React from 'react';
import '../styles/MovieCard.css';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  return (
    <div className="movie-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="movie-card-img-wrapper">
        <img src={movie.image} alt={movie.title} className="movie-card-img" />
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        <p className="movie-card-meta">{movie.meta}</p>
      </div>
    </div>
  );
}


