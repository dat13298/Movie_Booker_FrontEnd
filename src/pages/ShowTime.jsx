import React, { useEffect, useState } from "react";
import { Row, Col, Button, message, Spin } from "antd";
import MovieCardShowtime from "../components/MovieCardShowtime";
import "../styles/ShowTime.css";
import api from "@/api/axios.js";
import dayjs from "dayjs";

const ShowTime = () => {
    const [loading, setLoading] = useState(false);
    const [groupedData, setGroupedData] = useState({}); // { date: [movieShowtime, ...] }
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get("/show-times", { params: { page: 0, size: 1000 } });
            const content = res.data.content || [];

            // ✅ group by date (yyyy-MM-dd) from startTime
            const grouped = {};
            for (const item of content) {
                const date = dayjs(item.startTime).format("YYYY-MM-DD");
                if (!grouped[date]) grouped[date] = [];
                grouped[date].push(item);
            }

            setGroupedData(grouped);

            // ✅ Set selectedDate to the first available date
            const dates = Object.keys(grouped).sort();
            if (dates.length > 0) setSelectedDate(dates[0]);
        } catch (err) {
            message.error("Không thể tải danh sách suất chiếu.");
        } finally {
            setLoading(false);
        }
    };

    const dates = Object.keys(groupedData).sort();
    const movies = selectedDate ? groupedData[selectedDate] : [];

    return (
        <div className="showtime-container">
            <div className="showtime-header">
                <h3>
                    <span className="status-dot"></span>
                    Phim đang chiếu
                </h3>
                <div className="date-buttons">
                    {dates.map((date) => (
                        <Button
                            key={date}
                            size="small"
                            className={date === selectedDate ? "active" : ""}
                            onClick={() => setSelectedDate(date)}
                        >
                            {new Date(date).toLocaleDateString("vi-VN")}
                        </Button>
                    ))}
                </div>
                <p className="note">
                    <strong>Lưu ý:</strong> Khán giả dưới 13 tuổi chỉ chọn suất chiếu kết thúc trước 22h và dưới 16 tuổi trước 23h.
                </p>
            </div>

            {loading ? (
                <Spin />
            ) : (
                <Row justify="center" gutter={[10, 16]}>
                    {movies.map((showtime) => (
                        <Col key={showtime.id} xs={24} sm={12} md={10} lg={10}>
                            <MovieCardShowtime showtime={showtime} />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default ShowTime;
