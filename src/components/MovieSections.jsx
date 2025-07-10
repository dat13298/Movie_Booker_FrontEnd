import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../styles/homeSections.css';
import MovieCard from './MovieCard.jsx';
import api from "@/api/axios.js";

function Section({ title, data }) {
    return (
        <div className="section">
            <h2 className="section-title">{title}</h2>
            <Swiper
                spaceBetween={12}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000 }}
                modules={[Navigation, Pagination, Autoplay]}
                breakpoints={{
                    0: { slidesPerView: 1.2 },
                    480: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
            >
                {data.map((item) => (
                    <SwiperSlide key={item.id}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <MovieCard movie={item} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default function MovieSections() {
    const [nowShowing, setNowShowing] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const [otherCategories, setOtherCategories] = useState([]); // future use

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await api.get("/movies");
            const movies = res.data.content;

            const now = movies.filter(m => m.movieStatus === "NOW_SHOWING");
            const coming = movies.filter(m => m.movieStatus === "COMING_SOON");
            // bạn có thể thêm phân loại khác nếu backend có thêm

            setNowShowing(now);
            setComingSoon(coming);
        } catch (e) {
            console.error("Lỗi khi fetch movies: ", e);
        }
    };

    return (
        <div className="movie-sections">
            <Section title="Phim đang chiếu" data={nowShowing} />
            <Section title="Phim sắp chiếu" data={comingSoon} />
            {/* Bạn có thể thêm nhiều Section hơn nếu có phân loại khác */}
        </div>
    );
}
