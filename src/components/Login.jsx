import React, {useContext} from "react";
import { Modal, Input, Button, Typography, Form, message } from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import api from "../api/axios";
import 'antd/dist/reset.css';
import "../index.css";
import {AuthContext} from "@/auth/AuthProvider.jsx";

const { Title, Text } = Typography;

export default function Login({ open, onClose, onLoginSuccess, onSwitchToRegister }) {
    const { updateAuth } = useContext(AuthContext);
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            const res = await api.post("/auth/login", {
                username: values.username,
                password: values.password,
            });
            const { accessToken, refreshToken } = res.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            updateAuth({ accessToken, refreshToken }); // cập nhật context

            message.success("Đăng nhập thành công!");
            onLoginSuccess?.();
            onClose();

        } catch (err) {
            message.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            closable
            className="custom-login-modal"
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                className="login-form"
            >
                <Title level={4} className="login-title">Đăng nhập</Title>

                <Form.Item
                    name="username"
                    label="Tên tài khoản"
                    className="login-input"
                    rules={[
                        { required: true, message: "Vui lòng nhập tên tài khoản" },
                        { type: "username", message: "Tên tài khoản không hợp lệ" },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Tên tài khoản"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    className="login-input"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Mật khẩu"
                        size="large"
                    />
                </Form.Item>

                <div className="login-actions">
                    <Text type="danger" className="forgot-password">Quên mật khẩu?</Text>
                </div>

                <Button
                    htmlType="submit"
                    size="large"
                    className="login-submit"
                    block
                >
                    Đăng nhập
                </Button>

                <div className="login-footer">
                    <Text>Bạn chưa có tài khoản? </Text>
                    <a
                        onClick={() => {
                            onClose();
                            onSwitchToRegister?.();
                        }}
                    >
                        Đăng ký
                    </a>
                </div>
            </Form>
        </Modal>
    );
}
