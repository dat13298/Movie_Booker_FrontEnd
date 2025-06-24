import React, { useContext } from 'react';
import { Drawer, Menu } from 'antd';
import { AuthContext } from '../auth/AuthProvider.jsx';

const MobileDrawer = ({ visible, onClose, onLoginClick, onLogout }) => {
    const { auth } = useContext(AuthContext);
    const isLoggedIn = !!auth?.accessToken;

    const menuItems = [
        { key: 'lich-chieu', label: 'LỊCH CHIẾU' },
        { key: 'phim', label: 'PHIM' },
        { key: 'rap', label: 'RẠP' },
        { key: 'gia-ve', label: 'GIÁ VÉ' },
        { key: 'uu-dai', label: 'TIN MỚI & ƯU ĐÃI' },
        isLoggedIn
            ? {
                key: 'dang-xuat',
                label: (
                    <span
                        style={{ color: 'red' }}
                        onClick={() => {
                            onClose();
                            onLogout?.();
                        }}
                    >
                        ĐĂNG XUẤT
                    </span>
                )
            }
            : {
                key: 'dang-nhap',
                label: (
                    <span onClick={() => {
                        onClose();
                        onLoginClick?.();
                    }}>
                        ĐĂNG NHẬP
                    </span>
                )
            }
    ];

    return (
        <Drawer title="Danh mục" placement="right" onClose={onClose} open={visible}>
            <Menu mode="vertical" items={menuItems} />
        </Drawer>
    );
};

export default MobileDrawer;
