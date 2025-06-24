import React, { useState, useContext } from 'react';
import { Row, Col, Select, Button, Grid, Menu, message, Dropdown, Space } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { AuthContext } from '../auth/AuthProvider.jsx';
import Login from './Login';
import Register from './Register';
import ForgotPassword from "@/components/ForgotPassword.jsx";

const { useBreakpoint } = Grid;

const HeaderBar = () => {
    const screens = useBreakpoint();
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [registerModalVisible, setRegisterModalVisible] = useState(false);
    const [isForgotOpen, setForgotOpen] = useState(false);

    const { auth, updateAuth, logout, userInfo } = useContext(AuthContext);
    const isLoggedIn = !!auth?.accessToken;

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        message.success("Đăng xuất thành công!");
        updateAuth(null);
    };

    const handleBackToLogin = () => {
        setForgotOpen(false);
        setLoginModalVisible(true);
    };

    const userDropdown = (
        <Dropdown
            menu={{
                items: [
                    {
                        key: 'logout',
                        label: <span onClick={handleLogout}><LogoutOutlined /> Đăng xuất</span>,
                    },
                ],
            }}
            trigger={['click']}
        >
      <span style={{ cursor: 'pointer' }}>
        <UserOutlined /> {userInfo?.username || "Tài khoản"} ▾
      </span>
        </Dropdown>
    );

    return (
        <>
            <div style={{
                background: '#16121A',
                padding: '12px 32px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <img
                        src="https://betacinemas.vn/Assets/Common/logo.png"
                        alt="logo"
                        height={36}
                    />
                </div>

                {/* Menu items */}
                <div style={{ display: 'flex', gap: 24 }}>
                    <div style={{ color: '#fff', cursor: 'pointer' }}>LỊCH CHIẾU</div>
                    <div style={{ color: '#fff', cursor: 'pointer' }}>PHIM</div>
                    <div style={{ color: '#fff', cursor: 'pointer' }}>RẠP</div>
                    <div style={{ color: '#fff', cursor: 'pointer' }}>GIÁ VÉ</div>
                    <div style={{ color: '#fff', cursor: 'pointer' }}>TIN MỚI & ƯU ĐÃI</div>
                </div>

                {/* Auth buttons or username dropdown */}
                <div>
                    {isLoggedIn ? (
                        userDropdown
                    ) : (
                        <Space>
                            <Button
                                style={{
                                    borderColor: '#fff',
                                    color: '#fff',
                                    background: 'transparent'
                                }}
                                onClick={() => setRegisterModalVisible(true)}
                            >
                                Đăng ký
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: '#E02828',
                                    borderColor: '#E02828',
                                    color: '#fff'
                                }}
                                onClick={() => setLoginModalVisible(true)}
                            >
                                Đăng nhập
                            </Button>
                        </Space>
                    )}
                </div>
            </div>

            {/* Modals */}
            <Login
                open={loginModalVisible}
                onClose={() => setLoginModalVisible(false)}
                onLoginSuccess={() => setLoginModalVisible(false)}
                onSwitchToRegister={() => {
                    setLoginModalVisible(false);
                    setRegisterModalVisible(true);
                }}
                onForgotPassword={() => {
                    setLoginModalVisible(false);
                    setForgotOpen(true);
                }}
            />

            <Register
                open={registerModalVisible}
                onClose={() => setRegisterModalVisible(false)}
                onSwitchToLogin={() => {
                    setRegisterModalVisible(false);
                    setLoginModalVisible(true);
                }}
            />

            <ForgotPassword
                open={isForgotOpen}
                onClose={() => {
                    setForgotOpen(false);
                    setLoginModalVisible(true);
                }}
                onBackToLogin={handleBackToLogin}
            />
        </>
    );
};

export default HeaderBar;
