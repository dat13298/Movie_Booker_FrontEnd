import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import api from "@/api/axios";
import { useContext } from "react";
import {AuthContext} from "@/auth/AuthProvider.jsx";

export default function AdminLogin() {
    const navigate = useNavigate();
    const { updateAuth } = useContext(AuthContext);

    const handleSubmit = async (values) => {
        try {
            const res = await api.post("/auth/login", values);

            // response đúng rồi, extract tokens
            updateAuth({
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
            });

            message.success("Đăng nhập thành công!");
            navigate("/admin/movies");
        } catch (err) {
            message.error("Sai tài khoản hoặc mật khẩu");
        }
    };


    return (
        <div style={{
            maxWidth: 400,
            margin: "100px auto",
            padding: "2rem",
            borderRadius: "12px",
            backgroundColor: "#1f1f1f",
            boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            color: "white"
        }}>
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Đăng nhập quản trị</h2>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="username"
                    label={<span style={{ color: "white" }}>Tên đăng nhập</span>}
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label={<span style={{ color: "white" }}>Mật khẩu</span>}
                    rules={[{ required: true }]}
                >
                    <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Đăng nhập
                </Button>
            </Form>
        </div>
    );
}
