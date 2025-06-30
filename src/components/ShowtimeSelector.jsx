import React, { useEffect, useState } from 'react';
import { Tag, Button, Typography, Spin } from 'antd';
import '../styles/ShowtimeSelector.css';

const { Paragraph } = Typography;

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const weekday = date.toLocaleDateString('vi-VN', { weekday: 'long' }); // ví dụ: "thứ sáu"
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return {
        label: `${capitalize(weekday)} ${day}/${month}`,
        raw: dateStr
    };
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const ShowtimeSelector = ({ movieId }) => {
    const [loading, setLoading] = useState(true);
    const [showtimeData, setShowtimeData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [times, setTimes] = useState([]);

    useEffect(() => {
        fetch('/showtimes.json')
            .then((res) => res.json())
            .then((data) => {
                const arr = data[movieId.toString()] || [];
                setShowtimeData(arr);
                if (arr.length) {
                    setSelectedDate(arr[0].date);
                    setTimes(arr[0].times);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [movieId]);

    const handleSelectDate = (date) => {
        setSelectedDate(date);
        const day = showtimeData.find((i) => i.date === date);
        setTimes(day?.times || []);
    };

    if (loading) return <Spin style={{ display: 'block', margin: '24px auto' }} />;
    if (!showtimeData.length) return <Paragraph>Không có lịch chiếu.</Paragraph>;

    return (
        <div>
            <div className="showtime-scroll" style={{ marginBottom: 12 }}>
                {showtimeData.map(({ date }) => {
                    const { label } = formatDate(date);
                    const active = date === selectedDate;
                    return (
                        <Tag
                            key={date}
                            color={active ? 'red' : 'default'}
                            onClick={() => handleSelectDate(date)}
                            style={{
                                cursor: 'pointer',
                                marginRight: 8,
                                padding: '8px 12px',
                                fontSize: 14,
                                lineHeight: 1.4,
                                textAlign: 'center',
                                minWidth: 110,
                                display: 'inline-flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 60,
                                whiteSpace: 'normal'
                            }}
                        >
                            {label}
                        </Tag>
                    );
                })}
            </div>

            <div className="showtime-scroll">
                {times.map((time) => (
                    <Button
                        key={time}
                        shape="round"
                        style={{
                            background: 'linear-gradient(90deg, #ff416c, #ff4b2b)',
                            border: 'none',
                            color: '#fff',
                            marginRight: 8,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {time}
                    </Button>
                ))}
            </div>

            <Paragraph style={{ color: '#ff4d4f', marginTop: 16 }}>
                Lưu ý: Khán giả dưới 13 tuổi chỉ chọn suất chiếu kết thúc trước 22h và dưới 16 tuổi trước 23h.
            </Paragraph>
        </div>
    );
};

export default ShowtimeSelector;
