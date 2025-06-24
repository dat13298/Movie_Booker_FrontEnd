import React from 'react';
import { FacebookFilled, YoutubeFilled } from '@ant-design/icons';

const Footer = () => {
    return (
        <div style={{ background: '#16121A', color: 'white', padding: '40px 16px', textAlign: 'center' }}>
            {/* Menu Links */}
            <div style={{ marginBottom: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
                <span>Chính sách</span>
                <span>Lịch chiếu</span>
                {/*<span>Tin tức</span>*/}
                <span>Giá vé</span>
                <span>Hỏi đáp</span>
                <span>Liên hệ</span>
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
