import React, {useState, useContext} from 'react';
import {
    Button,
    Dropdown,
    Grid,
    Menu,
    message,
    Space
} from 'antd';
import {LogoutOutlined, UserOutlined, MenuOutlined} from '@ant-design/icons';
import {AuthContext} from '../auth/AuthProvider.jsx';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword.jsx';
import MobileDrawer from './MobileDrawer.jsx';
import {useLocation, useNavigate} from "react-router-dom";
import logo from '../assets/logo.png';

const {useBreakpoint} = Grid;

const HeaderBar = () => {
    const screens = useBreakpoint();
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [registerModalVisible, setRegisterModalVisible] = useState(false);
    const [isForgotOpen, setForgotOpen] = useState(false);
    const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const {auth, updateAuth, userInfo} = useContext(AuthContext);
    const isLoggedIn = auth?.accessToken && auth.accessToken.length > 10;

    const menuItems = [
        {path: '/', label: 'TRANG CHỦ'},
        {path: '/show-time', label: 'LỊCH CHIẾU'},
        // {path: '/theaters', label: 'RẠP'},
        {path: '/ticket-price', label: 'GIÁ VÉ'},
        {path: '/about', label: 'GIỚI THIỆU'},
        {path: '/coupons', label: 'ĐỔI ĐIỂM'},
    ];

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        updateAuth(null);
        message.success('Đăng xuất thành công!');
    };

    const handleBackToLogin = () => {
        setForgotOpen(false);
        setLoginModalVisible(true);
    };

    console.log("accessToken in localStorage:", localStorage.getItem("accessToken"));
    console.log("auth.accessToken:", auth.accessToken);
    console.log("isLoggedIn:", isLoggedIn);
    console.log("userInfo:", userInfo);

    const userDropdown = (
        <Dropdown
            menu={{
                items: [
                    {
                        key: 'profile',
                        label: (
                            <span onClick={() => navigate('/profile')}>
              <UserOutlined/> Thông tin cá nhân
            </span>
                        ),
                    },
                    {
                        key: 'logout',
                        label: (
                            <span onClick={handleLogout}>
                <LogoutOutlined/> Đăng xuất
              </span>
                        ),
                    },
                ],
            }}
            trigger={['click']}
        >
      <span style={{cursor: 'pointer'}}>
        <UserOutlined/> {userInfo?.username || 'Tài khoản'} ▾
      </span>
        </Dropdown>
    );

    return (
        <>
            <div
                style={{
                    background: '#16121A',
                    padding: '12px 32px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {/* Logo */}
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                    <img
                        src={logo}
                        alt="logo"
                        height={50}
                        style={{cursor: 'pointer'}}
                        onClick={() => navigate('/')}  // quay về trang chủ khi click
                    />
                </div>

                {/* Menu items */}
                {screens.md ? (
                    <div style={{display: 'flex', gap: 24}}>
                        {menuItems.map((item) => (
                            <div
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '6px 12px',
                                    borderRadius: 4,
                                    color: '#fff',
                                    background: location.pathname === item.path
                                        ? 'linear-gradient(90deg, #ff416c, #ff4b2b)'
                                        : 'transparent',
                                    transition: '0.3s',
                                }}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                ) : (
                    <MenuOutlined
                        style={{fontSize: 20, color: '#fff', cursor: 'pointer'}}
                        onClick={() => setMobileDrawerVisible(true)}
                    />
                )}

                {/* Auth buttons or username dropdown */}
                {screens.md ? (
                    <div>
                        {isLoggedIn ? (
                            userDropdown
                        ) : (
                            <Space>
                                <Button
                                    style={{
                                        borderColor: '#fff',
                                        color: '#fff',
                                        background: 'transparent',
                                    }}
                                    onClick={() => setRegisterModalVisible(true)}
                                >
                                    Đăng ký
                                </Button>
                                <Button
                                    style={{
                                        backgroundColor: '#E02828',
                                        borderColor: '#E02828',
                                        color: '#fff',
                                    }}
                                    onClick={() => setLoginModalVisible(true)}
                                >
                                    Đăng nhập
                                </Button>
                            </Space>
                        )}
                    </div>
                ) : null}
            </div>

            {/* Modal: Login */}
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

            {/* Modal: Register */}
            <Register
                open={registerModalVisible}
                onClose={() => setRegisterModalVisible(false)}
                onSwitchToLogin={() => {
                    setRegisterModalVisible(false);
                    setLoginModalVisible(true);
                }}
            />

            {/* Modal: Forgot Password */}
            <ForgotPassword
                open={isForgotOpen}
                onClose={() => {
                    setForgotOpen(false);
                    setLoginModalVisible(true);
                }}
                onBackToLogin={handleBackToLogin}
            />

            {/* Mobile Drawer */}
            <MobileDrawer
                visible={mobileDrawerVisible}
                onClose={() => setMobileDrawerVisible(false)}
                onLoginClick={(type) => {
                    setMobileDrawerVisible(false);
                    if (type === 'login') {
                        setLoginModalVisible(true);
                    } else if (type === 'register') {
                        setRegisterModalVisible(true);
                    }
                }}
                onLogout={handleLogout}
            />

        </>
    );
};

export default HeaderBar;
