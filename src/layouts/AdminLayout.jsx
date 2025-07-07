// src/pages/admin/AdminLayout.jsx
import { Layout, Menu } from 'antd';
import { Outlet, Link } from 'react-router-dom';
import logo from "@/assets/logo.png";

const { Header, Content, Sider } = Layout;

export default function AdminLayout() {
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
                <Menu theme="dark" mode="inline">
                    <Menu.Item key="movies">
                        <Link to="/admin/movies">Quản lý phim</Link>
                    </Menu.Item>
                    <Menu.Item key="theaters">
                        <Link to="/admin/theaters">Quản lý rạp</Link>
                    </Menu.Item>
                    <Menu.Item key="screens">
                        <Link to="/admin/screens">Quản lý phòng chiếu</Link>
                    </Menu.Item>
                    <Menu.Item key="show-times">
                        <Link to="/admin/show-times">Quản xuất chiếu</Link>
                    </Menu.Item>
                    <Menu.Item key="regions">
                        <Link to="/admin/regions">Quản lý vùng</Link>
                    </Menu.Item>
                </Menu>
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
