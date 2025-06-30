import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import Banner        from "../components/Banner.jsx";
import MovieSlider   from "../components/MovieSlider.jsx";
import MovieSections from "../components/MovieSections.jsx";

const Home = () => {
    const navigate = useNavigate();

    // ID suất chiếu “demo” – đổi tùy ý
    const demoShowTimeId = 1;

    return (
        <div style={{ backgroundColor: "#0e0e0e", minHeight: "100vh", padding: 20 }}>
            {/* Nút test điều hướng */}
            <Button
                type="primary"
                style={{ marginBottom: 24 }}
                onClick={() => navigate(`/show-time/${demoShowTimeId}/booking`)}
            >
                Đặt vé (test)
            </Button>

            <Banner />
            <MovieSlider />
            <MovieSections />
        </div>
    );
};

export default Home;
