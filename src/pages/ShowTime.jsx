import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import MovieCardShowtime from '../components/MovieCardShowtime';
import '../styles/ShowTime.css';

const mockData = {
    '2025-07-06': [
        {
            id: 1,
            title: 'THẾ GIỚI KHỦNG LONG: TÁI SINH - T13',
            image: 'https://chieuphimquocgia.com.vn/_next/image?url=http%3A%2F%2Fapiv2.chieuphimquocgia.com.vn%2FContent%2FImages%2F0018733_0.jpg&w=256&q=75',
            genre: 'Hành động',
            duration: 134,
            type: '2D',
            country: 'Mỹ',
            releaseDate: '04/07/2025',
            censor: 'T13 - Phim được phổ biến đến người xem từ đủ 13 tuổi trở lên (13+)',
            showtimes: ['08:55', '09:50', '10:20', '11:20', '12:15']
        },
        {
            id: 2,
            title: 'TỐ ĐỘI GẤU NHÍ: DU HÍ 4 PHƯƠNG - P',
            image: 'https://chieuphimquocgia.com.vn/_next/image?url=http%3A%2F%2Fapiv2.chieuphimquocgia.com.vn%2FContent%2FImages%2F0018822_0.jpg&w=256&q=75',
            genre: 'Hoạt hình',
            duration: 87,
            type: '2D',
            country: 'Nga',
            releaseDate: '04/07/2025',
            censor: 'P - Phim được phép phổ biến đến người xem ở mọi độ tuổi.',
            showtimes: ['09:00', '10:40', '12:20']
        }
    ],
    '2025-07-07': [
        {
            id: 1,
            title: 'THẾ GIỚI KHỦNG LONG: TÁI SINH - T13',
            image: 'https://chieuphimquocgia.com.vn/_next/image?url=http%3A%2F%2Fapiv2.chieuphimquocgia.com.vn%2FContent%2FImages%2F0018733_0.jpg&w=256&q=75',
            genre: 'Hành động',
            duration: 134,
            type: '2D',
            country: 'Mỹ',
            releaseDate: '04/07/2025',
            censor: 'T13 - Phim được phổ biến đến người xem từ đủ 13 tuổi trở lên (13+)',
            showtimes: ['14:00', '15:30', '17:00']
        },
        {
            id: 2,
            title: 'TỐ ĐỘI GẤU NHÍ: DU HÍ 4 PHƯƠNG - P',
            image: 'https://chieuphimquocgia.com.vn/_next/image?url=http%3A%2F%2Fapiv2.chieuphimquocgia.com.vn%2FContent%2FImages%2F0018822_0.jpg&w=256&q=75',
            genre: 'Hoạt hình',
            duration: 87,
            type: '2D',
            country: 'Nga',
            releaseDate: '04/07/2025',
            censor: 'P - Phim được phép phổ biến đến người xem ở mọi độ tuổi.',
            showtimes: ['16:00', '18:00']
        }
    ]
};

const ShowTime = () => {
    const dates = Object.keys(mockData);
    const [selectedDate, setSelectedDate] = useState(dates[0]);
    const movies = mockData[selectedDate];

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
                            className={date === selectedDate ? 'active' : ''}
                            onClick={() => setSelectedDate(date)}
                        >
                            {new Date(date).toLocaleDateString('vi-VN')}
                        </Button>
                    ))}
                </div>
                <p className="note">
                    <strong>Lưu ý:</strong> Khán giả dưới 13 tuổi chỉ chọn suất chiếu kết thúc trước 22h và dưới 16 tuổi trước 23h.
                </p>
            </div>

            <Row justify="center" gutter={[10, 16]}>
                {movies.map((movie) => (
                    <Col key={movie.id} xs={24} sm={12} md={10} lg={8}>
                        <MovieCardShowtime movie={movie} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ShowTime;
