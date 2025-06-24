import React, { useState, useContext } from 'react';
import {Row, Col, Select, Button, Grid, Menu, message} from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import MobileDrawer from './MobileDrawer';
import Login from './Login';
import Register from './Register';
import {AuthContext} from '../auth/AuthProvider.jsx';
import ForgotPassword from "@/components/ForgotPassword.jsx";

const { useBreakpoint } = Grid;

const HeaderBar = () => {
    const screens = useBreakpoint();
    const [visible, setVisible] = useState(false);
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const { auth, updateAuth } = useContext(AuthContext);
    const [registerModalVisible, setRegisterModalVisible] = useState(false);
    const [isForgotOpen, setForgotOpen] = useState(false);

    const handleDrawer = () => setVisible(true);
    const handleClose = () => setVisible(false);
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        message.success("Đăng xuất thành công!");
        updateAuth(null); // reset context
    };
    const isLoggedIn = !!auth?.accessToken;

    const handleBackToLogin = () => {
        setForgotOpen(false);
        setLoginModalVisible(true);
    };
    return (
        <>
            <div style={{ background: '#fff', padding: '12px 16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <Row align="middle" justify="space-between">
                    <Col>
                        <img src="https://betacinemas.vn/Assets/Common/logo.png" alt="logo" height={30} />
                    </Col>
                    <Col flex="auto" style={{ paddingLeft: 16 }}>
                        <Select defaultValue="Beta Thái Nguyên" style={{ width: '100%', maxWidth: 200 }}>
                            <Select.Option value="thai-nguyen">Beta Thái Nguyên</Select.Option>
                            <Select.Option value="hanoi">Beta Hà Nội</Select.Option>
                        </Select>
                    </Col>

                    {/* Mobile Button */}
                    {!screens.md && (
                        <Col>
                            <Button icon={<MenuOutlined />} onClick={handleDrawer} />
                        </Col>
                    )}

                    {/* Desktop Menu */}
                    {screens.md && (
                        <Col>
                            <Menu
                                mode="horizontal"
                                items={[
                                    { key: 'lich-chieu', label: 'LỊCH CHIẾU' },
                                    { key: 'phim', label: 'PHIM' },
                                    { key: 'rap', label: 'RẠP' },
                                    { key: 'gia-ve', label: 'GIÁ VÉ' },
                                    { key: 'uu-dai', label: 'TIN MỚI & ƯU ĐÃI' },
                                    isLoggedIn
                                        ? {
                                            key: 'dang-xuat',
                                            label: (
                                                <Button type="link" danger onClick={handleLogout}>
                                                    ĐĂNG XUẤT
                                                </Button>
                                            )
                                        }
                                        : {
                                            key: 'dang-nhap',
                                            label: (
                                                <Button type="link" onClick={() => setLoginModalVisible(true)}>
                                                    ĐĂNG NHẬP
                                                </Button>
                                            )
                                        }
                                ]}
                            />
                        </Col>
                    )}
                </Row>
            </div>

            {/* Mobile Menu */}
            <MobileDrawer
                visible={visible}
                onClose={handleClose}
                onLoginClick={() => setLoginModalVisible(true)}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
            />



            {/* Login Modal */}
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
