import React, {useEffect, useState} from "react";
import {
    Modal,
    Input,
    Button,
    Typography,
    Row,
    Col,
    Select,
    DatePicker,
    Form,
    message
} from "antd";
import api from "../api/axios.js";
import "../index.css";

const { Title, Text } = Typography;
const { Option } = Select;

export default function Register({ open, onClose, onSwitchToLogin }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        form.resetFields();
    }, [open]);

    if (!open) return null;



    const handleSubmit = async (values) => {
        setLoading(true);
        const payload = {
            ...values,
            DoB: values.DoB.format("YYYY-MM-DD"),
        };
        console.log(payload);

        try {
            await api.post("/users/register", payload).then((res) => {
                console.log(res);
            });
            message.success("Đăng ký thành công!");
            onClose();
            onSwitchToLogin?.();
        } catch (err) {
            const errorData = err.response?.data;

            const msg = errorData?.message;

            message.error(msg || "Đăng ký thất bại!");
        } finally {
            setLoading(false);
        }


    };

    return open ? (
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
                <Title level={4} className="login-title">
                    Đăng ký
                </Title>

                <Form.Item
                    name="username"
                    label="Tên tài khoản"
                    className="login-input"
                    rules={[
                        { required: true, message: "Vui lòng nhập tên tài khoản" },
                        { min: 5, max: 50, message: "Từ 5 đến 50 ký tự" },
                    ]}
                >
                    <Input size="large" placeholder="Tên tài khoản" />
                </Form.Item>

                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item
                            name="phoneNumber"
                            label="Số điện thoại"
                            className="login-input"
                            rules={[
                                { required: true, message: "Vui lòng nhập số điện thoại" },
                                {
                                    pattern: /^0[1-9][0-9]{8}$/,
                                    message: "SĐT phải có 10 chữ số và bắt đầu bằng 0",
                                },
                            ]}
                        >
                            <Input size="large" placeholder="Số điện thoại" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            className="login-input"
                            rules={[
                                { required: true, message: "Vui lòng nhập email" },
                                { type: "email", message: "Email không hợp lệ" },
                            ]}
                        >
                            <Input size="large" placeholder="Email" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item
                            name="gender"
                            label="Giới tính"
                            className="login-input"
                            initialValue="MALE"
                            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                        >
                            <Select size="large">
                                <Option value="MALE">Nam</Option>
                                <Option value="FEMALE">Nữ</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="DoB"
                            label="Ngày sinh"
                            className="login-input"
                            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
                        >
                            <DatePicker
                                size="large"
                                format="YYYY-MM-DD"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            className="login-input"
                            rules={[
                                { required: true, message: "Vui lòng nhập mật khẩu" },
                                { min: 8, max: 15, message: "Từ 8 đến 15 ký tự" },
                            ]}
                        >
                            <Input.Password size="large" placeholder="Mật khẩu" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu"
                            className="login-input"
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("Mật khẩu xác nhận không khớp")
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password size="large" placeholder="Xác nhận mật khẩu" />
                        </Form.Item>
                    </Col>
                </Row>

                <Button
                    htmlType="submit"
                    size="large"
                    className="login-submit"
                    loading={loading}
                    block
                >
                    Đăng ký
                </Button>

                <div className="login-footer">
                    <Text>Bạn đã có tài khoản? </Text>
                    <a
                        onClick={() => {
                            onClose();
                            onSwitchToLogin?.();
                        }}
                    >
                        Đăng nhập
                    </a>
                </div>
            </Form>
        </Modal>
    ) : null;
}
