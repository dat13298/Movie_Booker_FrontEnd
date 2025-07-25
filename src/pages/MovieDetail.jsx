import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Typography, Button, Tag, Divider, Modal } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import ShowtimeSelector from '../components/ShowtimeSelector';
import { getEmbedUrl } from '@/utils/youtube';
import api from "@/api/axios.js";

const { Title, Paragraph } = Typography;

export const MovieDetail = () => {
    const { state } = useLocation();
    const movie = state?.movie;

    const [isDescriptionVisible, setDescriptionVisible] = useState(false);
    const [isTrailerVisible, setTrailerVisible] = useState(false);
    const [iframeSrc, setIframeSrc] = useState('');

    const handleOpenTrailer = () => {
        setIframeSrc(getEmbedUrl(movie.trailerUrl));
        setTrailerVisible(true);
    };

    const handleCloseTrailer = () => {
        setTrailerVisible(false);
        setIframeSrc('');
    };

    const formatDate = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleDateString('vi-VN');
        } catch {
            return dateStr;
        }
    };

    if (!movie) {
        return <div style={{ padding: 40, color: '#fff' }}>Không tìm thấy phim.</div>;
    }

    return (
        <div
            style={{
                position: 'relative',
                backgroundImage: `url(${movie.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                color: '#fff',
                padding: '60px 40px',
            }}
        >
            {/* Overlay nền tối mờ */}
            <div
                style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 0,
                }}
            />

            <div
                style={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    borderRadius: 16,
                    padding: 32,
                    maxWidth: 1000,
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Row gutter={[32, 32]} align="middle">
                    <Col xs={24} md={8}>
                        <img
                            src={movie.imageUrl}
                            alt={movie.title}
                            style={{
                                width: '100%',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            }}
                        />
                    </Col>

                    <Col xs={24} md={16}>
                        <Title level={2} style={{ color: '#fff' }}>{movie.title}</Title>

                        <div style={{
                            marginBottom: 12,
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px'
                        }}>
                            <Tag color="cyan">{movie.movieType}</Tag>
                            <Tag color="gold">{movie.screenType}</Tag>
                            <Tag color="purple">{movie.duration} phút</Tag>
                            {movie.is18Plus && <Tag color="red">18+</Tag>}
                        </div>

                        <Paragraph style={{ marginTop: 12, color: '#ccc' }}>
                            Đạo diễn: {movie.director}
                        </Paragraph>
                        <Paragraph style={{ color: '#ccc' }}>
                            Diễn viên: {movie.actors}
                        </Paragraph>
                        <Paragraph style={{ marginBottom: 20, color: '#ccc' }}>
                            Khởi chiếu: {formatDate(movie.premiereDate)}
                        </Paragraph>

                        <Paragraph style={{ color: '#ccc' }}>
                            {movie.description?.slice(0, 160)}...
                        </Paragraph>

                        <Paragraph style={{ color: movie.is18Plus ? '#ff4d4f' : '#52c41a', fontWeight: 500 }}>
                            Kiểm duyệt: {movie.is18Plus ? 'T18 - Phim chỉ dành cho người từ 18 tuổi' : 'Tất cả độ tuổi'}
                        </Paragraph>

                        <div style={{
                            marginTop: 20,
                            display: 'flex',
                            gap: 16,
                            flexWrap: 'nowrap',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Button
                                icon={<PlayCircleOutlined />}
                                size="large"
                                style={{
                                    marginRight: 16,
                                    background: 'linear-gradient(90deg, #ff416c, #ff4b2b)',
                                    border: 'none',
                                    color: '#fff',
                                }}
                                onClick={handleOpenTrailer}
                            >
                                Xem trailer
                            </Button>
                            <Button
                                size="large"
                                style={{
                                    background: 'linear-gradient(90deg, #ff416c, #ff4b2b)',
                                    border: 'none',
                                    color: '#fff',
                                }}
                                onClick={() => setDescriptionVisible(true)}
                            >
                                Chi tiết nội dung
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Divider style={{ borderColor: '#333', marginTop: 40 }} />

                {/* Component lịch chiếu */}
                <ShowtimeSelector movieId={movie.id} />
            </div>

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
                                height: '100%',
                            }}
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
};
