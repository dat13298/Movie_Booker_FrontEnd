import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const MovieSlider = () => {
  const movies = [/* danh sách phim */];

  return (
    <Swiper
      modules={[Navigation]}
      navigation
      slidesPerView={4}
      spaceBetween={20}
      loop={true}
    >
      {movies.map((movie, index) => (
        <SwiperSlide key={index}>
          <img src={movie.image} alt={movie.title} />
          <p>{movie.title}</p>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MovieSlider;
