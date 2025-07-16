import React, {useContext, useEffect, useState} from 'react';
import { Tag, Button, Typography, Spin, message } from 'antd';
import '../styles/ShowtimeSelector.css';
import api from "@/api/axios.js";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/auth/AuthProvider.jsx';

const { Paragraph } = Typography;

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Format ngày: "Thứ Sáu 10/7"
const formatDateLabel = (date) => {
    const weekday = date.toLocaleDateString('vi-VN', { weekday: 'long' });
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${capitalize(weekday)} ${day}/${month}`;
};

// Format giờ: "14:00"
const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

const ShowtimeSelector = ({ movieId }) => {
    const [loading, setLoading] = useState(true);
    const [groupedShowtimes, setGroupedShowtimes] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();
    const { userInfo } = useContext(AuthContext);


    useEffect(() => {
        if (movieId) {
            setLoading(true);
            api.get(`/show-times/movie/${movieId}/upcoming`)
                .then(res => {
                    const data = res.data;

                    // Group by date string "yyyy-mm-dd"
                    const grouped = {};
                    data.forEach((st) => {
                        const dateKey = new Date(st.startTime).toISOString().split('T')[0]; // yyyy-mm-dd
                        if (!grouped[dateKey]) grouped[dateKey] = [];
                        grouped[dateKey].push(st);
                    });

                    setGroupedShowtimes(grouped);
                    setSelectedDate(Object.keys(grouped)[0] || null);
                })
                .catch(err => {
                    console.error("Lỗi khi tải suất chiếu:", err);
                })
                .finally(() => setLoading(false));
        }
    }, [movieId]);

    const handleSelectDate = (dateKey) => {
        setSelectedDate(dateKey);
    };

    if (loading) return <Spin style={{ display: 'block', margin: '24px auto' }} />;
    if (!Object.keys(groupedShowtimes).length) return <Paragraph>Không có lịch chiếu.</Paragraph>;

    const dates = Object.keys(groupedShowtimes);

    return (
        <div>
            {/* Danh sách ngày */}
            <div className="showtime-scroll" style={{ marginBottom: 12 }}>
                {dates.map((dateKey) => {
                    const label = formatDateLabel(new Date(dateKey));
                    const active = dateKey === selectedDate;
                    return (
                        <Tag
                            key={dateKey}
                            color={active ? 'red' : 'default'}
                            onClick={() => handleSelectDate(dateKey)}
                            style={{
                                cursor: 'pointer',
                                marginRight: 8,
                                padding: '8px 12px',
                                fontSize: 14,
                                minWidth: 110,
                                height: 60,
                                display: 'inline-flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            {label}
                        </Tag>
                    );
                })}
            </div>

            {/* Danh sách suất chiếu theo ngày */}
            <div className="showtime-scroll">
                {groupedShowtimes[selectedDate]?.map((st) => (
                    <Button
                        key={st.id}
                        shape="round"
                        style={{
                            background: 'linear-gradient(90deg, #ff416c, #ff4b2b)',
                            border: 'none',
                            color: '#fff',
                            marginRight: 8,
                            whiteSpace: 'nowrap',
                        }}
                        onClick={() => {
                            if (!userInfo) {
                                message.warning("Vui lòng đăng nhập để tiếp tục đặt vé.");
                                return;
                            }

                            navigate(`/show-time/${st.id}/booking`, { state: { showtime: st } });
                        }}

                    >
                        {formatTime(st.startTime)} – Phòng {st.screenId}
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
