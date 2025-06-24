import React, { useContext } from 'react';
import { Drawer, Menu } from 'antd';
import { AuthContext } from '../auth/AuthProvider.jsx';
import '../index.css';

const MobileDrawer = ({ visible, onClose, onLoginClick, onLogout }) => {
    const { auth } = useContext(AuthContext);
    const isLoggedIn = !!auth?.accessToken;

    const menuItems = [
        { key: 'lich-chieu', label: 'LỊCH CHIẾU' },
        { key: 'phim', label: 'PHIM' },
        { key: 'rap', label: 'RẠP' },
        { key: 'gia-ve', label: 'GIÁ VÉ' },
        { key: 'uu-dai', label: 'TIN MỚI & ƯU ĐÃI' },
    ];

    return (
        <Drawer
            placement="right"
            open={visible}
            onClose={onClose}
            closable={false}
            width="75%"
            className="custom-mobile-drawer"
            styles={{
                body: {
                    padding: 0,
                    backgroundColor: '#16121A',
                    color: 'white',
                },
            }}
        >

        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Menu list */}
                <Menu
                    mode="vertical"
                    items={menuItems}
                    style={{
                        background: 'transparent',
                        borderRight: 'none',
                    }}
                    theme="dark"
                    className="mobile-menu"
                />

                {/* Auth buttons */}
                <div style={{ padding: 16, display: 'flex', justifyContent: 'center', gap: 12 }}>
                    {isLoggedIn ? (
                        <button
                            style={{
                                backgroundColor: '#E02828',
                                border: 'none',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: 4,
                            }}
                            onClick={() => {
                                onClose();
                                onLogout?.();
                            }}
                        >
                            Đăng xuất
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    onClose();
                                    onLoginClick?.('register');
                                }}
                                style={{
                                    border: '1px solid white',
                                    background: 'transparent',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: 4,
                                }}
                            >
                                Đăng ký
                            </button>
                            <button
                                onClick={() => {
                                    onClose();
                                    onLoginClick?.('login');
                                }}
                                style={{
                                    border: 'none',
                                    background: '#E02828',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: 4,
                                }}
                            >
                                Đăng nhập
                            </button>
                        </>
                    )}
                </div>
            </div>
        </Drawer>
    );
};

export default MobileDrawer;
