import React from 'react';
import { FacebookFilled, YoutubeFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div style={{ background: '#16121A', color: 'white', padding: '40px 16px', textAlign: 'center' }}>
            {/* Menu Links */}
            <div style={{ marginBottom: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
                <Link to="/policy" style={{ color: 'white' }}>Chính sách</Link>
                <Link to="/show-time" style={{ color: 'white' }}>Lịch chiếu</Link>
                <Link to="/ticket-price" style={{ color: 'white' }}>Giá vé</Link>
                <Link to="/faq" style={{ color: 'white' }}>Hỏi đáp</Link>
                <Link to="/contact" style={{ color: 'white' }}>Liên hệ</Link>
            </div>

            {/* Social Icons */}
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center', gap: 24 }}>
                <FacebookFilled style={{ fontSize: 24 }} />
                <YoutubeFilled style={{ fontSize: 24 }} />
            </div>

            {/* Text */}
            <div style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 600, margin: 'auto' }}>
                <p>Bản quyền thuộc Movie Booker Aptech.</p>
                <p>Địa chỉ: 285 Đội Cấn, Quận Ba Đình, Tp. Hà Nội - Điện thoại: 0123.45678</p>
                <p>Copyright 2025. Aptech Aprotrain <br />Dev Nhom 1</p>
            </div>
        </div>
    );
};

export default Footer;
