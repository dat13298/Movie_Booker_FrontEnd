import React from "react";
import { Row, Col, Card } from "antd";
import Banner from "../components/Banner.jsx";
import MovieSlider from "../components/MovieSlider.jsx";
import MovieCard from "../components/MovieCard.jsx";
import MovieSections from '../components/MovieSections.jsx';

const { Meta } = Card;

const Home = () => {
  return (
    <div style={{ backgroundColor: "#0e0e0e", minHeight: "100vh", padding: "20px" }}>
        <Banner />
        <MovieSlider />
        <MovieSections />

    </div>
  );
};

export default Home;
