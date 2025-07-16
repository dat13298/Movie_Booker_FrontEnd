// MobileDrawer.jsx (updated)
import React, {useContext} from 'react';
import {Drawer} from 'antd';
import {AuthContext} from '../auth/AuthProvider.jsx';
import {useNavigate, useLocation} from 'react-router-dom';

const MobileDrawer = ({visible, onClose, onLoginClick, onLogout}) => {
    const {auth} = useContext(AuthContext);
    const isLoggedIn = !!auth?.accessToken;
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {path: '/', label: 'TRANG CHỦ'},
        {path: '/show-time', label: 'LỊCH CHIẾU'},
        {path: '/movies', label: 'PHIM'},
        {path: '/theaters', label: 'RẠP'},
        {path: '/ticket-price', label: 'GIÁ VÉ'},
        {path: '/coupons', label: 'ĐỔI ĐIỂM'},
        {path: '/profile', label: 'THÔNG TIN CÁ NHÂN'}
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
            <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                {/* Menu list */}
                <div style={{display: 'flex', flexDirection: 'column', padding: '16px'}}>
                    {menuItems.map((item) => (
                        <div
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                                onClose();
                            }}
                            style={{
                                padding: '12px 16px',
                                color: '#fff',
                                marginBottom: 8,
                                borderRadius: 6,
                                cursor: 'pointer',
                                background:
                                    location.pathname === item.path
                                        ? 'linear-gradient(90deg, #ff416c, #ff4b2b)'
                                        : 'transparent',
                                transition: '0.3s',
                            }}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>

                {/* Auth buttons */}
                <div style={{padding: 16, display: 'flex', justifyContent: 'center', gap: 12}}>
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
