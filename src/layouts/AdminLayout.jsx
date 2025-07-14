// src/pages/admin/AdminLayout.jsx
import { Layout, Menu } from 'antd';
import { Outlet, Link } from 'react-router-dom';
import logo from "@/assets/logo.png";
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import { AuthContext } from '@/auth/AuthProvider.jsx';
import { useContext } from 'react';
import { message } from 'antd';


const { Header, Content, Sider } = Layout;

export default function AdminLayout() {

    const navigate = useNavigate();
    const { updateAuth } = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        updateAuth(null);
        message.success("Đăng xuất thành công");
        navigate("/admin/login");
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider>
                <div
                    style={{
                        height: 64,
                        margin: "16px 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                    />
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    items={[
                        {
                            key: 'movies',
                            label: <Link to="/admin/movies">Quản lý phim</Link>,
                        },
                        {
                            key: 'combos',
                            label: <Link to="/admin/combos">Quản lý combo</Link>,
                        },
                        {
                            key: 'theater-cms',
                            label: <Link to="/admin/theater-cms">Quản lý rạp</Link>,
                        },
                        {
                            key: 'screens',
                            label: <Link to="/admin/screens">Quản lý phòng chiếu</Link>,
                        },
                        {
                            key: 'show-times',
                            label: <Link to="/admin/show-times">Quản lý suất chiếu</Link>,
                        },
                        {
                            key: 'regions',
                            label: <Link to="/admin/regions">Quản lý vùng</Link>,
                        },
                        {
                            key: 'user-cms',
                            label: <Link to="/admin/user-cms">Quản lý người dùng</Link>,
                        },
                        {
                            type: 'divider',
                        },
                        {
                            key: 'logout',
                            icon: <LogoutOutlined />,
                            label: <span onClick={handleLogout}>Đăng xuất</span>,
                            danger: true,
                        },
                    ]}
                />

            </Sider>
            <Layout>
                <Header style={{ color: '#fff' }}>CMS Admin</Header>
                <Content style={{ margin: '16px' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
