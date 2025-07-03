import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Tag, Button, Divider, Modal } from 'antd';
import ShowtimeSelector from '../components/ShowtimeSelector.jsx';

const { Title, Paragraph, Text } = Typography;

const MovieDetailMobile = () => {
    const { state: { movie } = {} } = useLocation();
    const [isDescriptionVisible, setDescriptionVisible] = useState(false);
    const [isTrailerVisible, setTrailerVisible] = useState(false);
    const [iframeSrc, setIframeSrc] = useState('');

    if (!movie) return <div style={{ padding: 20, color: '#fff' }}>Không tìm thấy phim.</div>;

    const handleOpenTrailer = () => {
        setIframeSrc(movie.trailer);
        setTrailerVisible(true);
    };

    const handleCloseTrailer = () => {
        setTrailerVisible(false);
        setIframeSrc('');
    };

    return (
        <div style={{
            backgroundImage: `url(${movie.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            padding: 0,
            margin: 0,
            color: '#fff',
            position: 'relative',
        }}>
            {/* Overlay tối nền */}
            <div style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.85), #000)',
                padding: 16,
                minHeight: '100vh'
            }}>
                {/* Thông tin phim */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                    <img
                        src={movie.image}
                        alt={movie.title}
                        style={{ width: 100, height: 140, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <div style={{ flex: 1 }}>
                        <Title level={5} style={{ color: '#fff', marginBottom: 4 }}>{movie.title}</Title>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                            <Tag color="volcano">{movie.genre}</Tag>
                            <Tag color="geekblue">{movie.type}</Tag>
                            <Tag color="purple">{movie.duration} phút</Tag>
                        </div>
                    </div>
                </div>

                {/* Diễn viên và ngày khởi chiếu */}
                <div style={{ marginBottom: 8 }}>
                    <Text style={{ color: '#ccc' }}><b>Diễn viên:</b> {movie.actors}</Text><br />
                    <Text style={{ color: '#ccc' }}><b>Khởi chiếu:</b> {movie.releaseDate}</Text>
                </div>

                {/* Mô tả + kiểm duyệt */}
                <Paragraph style={{ color: '#ccc', fontSize: 14 }}>
                    {movie.description?.slice(0, 150)}...
                </Paragraph>
                <Paragraph style={{ color: '#ff4d4f' }}>
                    Kiểm duyệt: T18 - Phim được phổ biến dành cho người xem từ đủ 18 tuổi
                </Paragraph>

                {/* Nút xem trailer & chi tiết */}
                <div style={{ display: 'flex', gap: 12, margin: '12px 0' }}>
                    <Button onClick={() => setDescriptionVisible(true)} block>
                        Chi tiết nội dung
                    </Button>
                    <Button type="primary" onClick={handleOpenTrailer} block>
                        Xem trailer
                    </Button>
                </div>

                <Divider style={{ borderColor: '#333' }} />

                {/* Chọn suất chiếu */}
                <ShowtimeSelector movieId={movie.id} mobile />

                {/* Modal chi tiết nội dung */}
                <Modal
                    title="Chi tiết nội dung phim"
                    open={isDescriptionVisible}
                    onCancel={() => setDescriptionVisible(false)}
                    footer={null}
                    centered
                >
                    <Paragraph>{movie.description}</Paragraph>
                </Modal>

                {/* Modal trailer */}
                <Modal
                    title="Trailer phim"
                    open={isTrailerVisible}
                    onCancel={handleCloseTrailer}
                    footer={null}
                    centered
                    width={800}
                >
                    <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                        {iframeSrc && (
                            <iframe
                                src={iframeSrc}
                                title="Trailer"
                                frameBorder="0"
                                allowFullScreen
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%'
                                }}
                            />
                        )}
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default MovieDetailMobile;
