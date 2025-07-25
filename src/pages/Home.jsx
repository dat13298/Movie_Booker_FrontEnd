import React from "react";

import Banner        from "../components/Banner.jsx";
import MovieSlider   from "../components/MovieSlider.jsx";
import MovieSections from "../components/MovieSections.jsx";

const Home = () => {
    return (
        <div style={{ backgroundColor: "#0e0e0e", minHeight: "100vh", padding: 20 }}>
            <Banner />
            {/*<MovieSlider />*/}
            <MovieSections />
        </div>
    );
};

export default Home;
