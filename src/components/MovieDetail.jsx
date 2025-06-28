import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Typography, Button, Tag, Divider, Modal } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text, Link } = Typography;

export const MovieDetail = () => {
  const { state: { movie } } = useLocation();
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);
  const [isTrailerVisible, setTrailerVisible] = useState(false);

  if (!movie) return <div style={{ padding: 40, color: '#fff' }}>Không tìm thấy phim.</div>;

  return (
    <div
      style={{
        position: 'relative',
        backgroundImage: `url(${movie.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        color: '#fff',
        padding: '60px 40px',
      }}
    >
      <div style={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 16, padding: 32, maxWidth: 1000, margin: '0 auto' }}>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={8}>
            <img
              src={movie.image}
              alt={movie.title}
              style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
            />
          </Col>

          <Col xs={24} md={16}>
            <Title level={2} style={{ color: '#fff' }}>{movie.title}</Title>

            <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Tag color="cyan">{movie.genre}</Tag>
              <Tag color="gold">{movie.type}</Tag>
              <Tag color="purple">{movie.duration} phút</Tag>
            </div>

            <Paragraph style={{ marginTop: 12, color: '#fff' }}>
            Diễn viên: {movie.actors}
            </Paragraph>
            <Paragraph style={{ marginBottom: 20, color: '#fff' }}>
            Khởi chiếu: {movie.releaseDate}
            </Paragraph>

            <Paragraph style={{ marginTop: 20, color: '#ccc' }}>{movie.description?.slice(0, 160)}...</Paragraph>

            <Paragraph style={{ color: '#ff4d4f', fontWeight: 500 }}>
              Kiểm duyệt: T18 - Phim được phổ biến dành cho người xem từ đủ 18 tuổi
            </Paragraph>

            <div style={{ marginTop: 20 }}>
              <Button
                icon={<PlayCircleOutlined />}
                type="primary"
                size="large"
                style={{ marginRight: 16 }}
                onClick={() => setTrailerVisible(true)}
              >
                Xem trailer
              </Button>
              <Button type="default" size="large" onClick={() => setDescriptionVisible(true)}>
                Chi tiết nội dung
              </Button>
            </div>
          </Col>
        </Row>

        <Divider style={{ borderColor: '#333', marginTop: 40 }} />

        <div style={{ textAlign: 'center' }}>
          <Title level={4} style={{ color: '#fff' }}>Lịch chiếu</Title>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: 20 }}>
            {['26', '27', '28'].map((day, index) => (
              <Tag key={index} color={index === 2 ? 'red' : 'default'} style={{ padding: '6px 16px', fontSize: 16 }}>
                Th.06 {day}
              </Tag>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
            {['09:45', '12:00', '14:15', '16:30', '18:45', '21:00', '23:15'].map((time, index) => (
              <Button key={index} shape="round">{time}</Button>
            ))}
          </div>

          <Paragraph style={{ color: '#ff4d4f', marginTop: 16 }}>
            Lưu ý: Khán giả dưới 13 tuổi chỉ chọn suất chiếu kết thúc trước 22h và dưới 16 tuổi kết thúc trước 23h.
          </Paragraph>
        </div>
      </div>

      {/* Mô tả chi tiết popup */}
      <Modal
        title="Chi tiết nội dung phim"
        open={isDescriptionVisible}
        onCancel={() => setDescriptionVisible(false)}
        footer={null}
        centered
      >
        <Paragraph>{movie.description}</Paragraph>
      </Modal>

      {/* Trailer popup */}
      <Modal
        title="Trailer phim"
        open={isTrailerVisible}
        onCancel={() => setTrailerVisible(false)}
        footer={null}
        centered
        width={800}
      >
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <iframe
            src={movie.trailer}
            title="Trailer"
            frameBorder="0"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </div>
      </Modal>
    </div>
  );
};
