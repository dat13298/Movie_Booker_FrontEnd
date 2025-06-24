import React, { useState } from "react";
import { Modal, Form, Input, Button, Typography, message } from "antd";
import api from "../api/axios";
import "../index.css";

const { Title, Text } = Typography;

export default function ForgotPassword({ open, onClose, onBackToLogin }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [requestId, setRequestId] = useState("");
    const [formStep1] = Form.useForm();
    const [formStep2] = Form.useForm();

    const handleSendEmail = async ({ email }) => {
        try {
            const res = await api.post("/reset-password/request-reset-password", { email });
            setEmail(email);
            setRequestId(res.data.data?.idRequestResetPassword);
            message.success("Mã OTP đã được gửi đến email");
            setStep(2);
        } catch (err) {
            message.error(err.response?.data?.message || "Không thể gửi mã OTP");
        }
    };

    const handleResetPassword = async ({ otp, newPassword }) => {
        try {
            await api.post("/reset-password/update-new-password", {
                email,
                otp,
                newPassword,
                idRequestResetPassword: requestId
            });
            message.success("Đặt lại mật khẩu thành công");
            formStep1.resetFields();
            formStep2.resetFields();
            setStep(1);
            onClose();
            onBackToLogin?.();
        } catch (err) {
            message.error(err.response?.data?.message || "Đặt lại mật khẩu thất bại");
        }
    };

    const handleClose = () => {
        formStep1.resetFields();
        formStep2.resetFields();
        setStep(1);
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            centered
            closable
            className="custom-login-modal"
        >
            <Form
                form={step === 1 ? formStep1 : formStep2}
                onFinish={step === 1 ? handleSendEmail : handleResetPassword}
                layout="vertical"
                className="login-form"
            >
                <Title level={4} className="login-title">
                    {step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
                </Title>

                {step === 1 && (
                    <>
                        <Form.Item
                            name="email"
                            label="Email"
                            className="login-input"
                            rules={[
                                { required: true, message: "Vui lòng nhập email" },
                                { type: "email", message: "Email không hợp lệ" },
                            ]}
                        >
                            <Input placeholder="Nhập email đã đăng ký" size="large" />
                        </Form.Item>

                        <Button htmlType="submit" size="large" className="login-submit" block>
                            Gửi mã xác thực
                        </Button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Form.Item
                            name="otp"
                            label="Mã OTP"
                            className="login-input"
                            rules={[{ required: true, message: "Vui lòng nhập mã OTP" }]}
                        >
                            <Input placeholder="Nhập mã OTP" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="newPassword"
                            label="Mật khẩu mới"
                            className="login-input"
                            rules={[
                                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                                { min: 8, message: "Ít nhất 8 ký tự" },
                            ]}
                        >
                            <Input.Password placeholder="Mật khẩu mới" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu"
                            className="login-input"
                            dependencies={["newPassword"]}
                            rules={[
                                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        return value === getFieldValue("newPassword")
                                            ? Promise.resolve()
                                            : Promise.reject("Mật khẩu xác nhận không khớp");
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Nhập lại mật khẩu" size="large" />
                        </Form.Item>

                        <Button htmlType="submit" size="large" className="login-submit" block>
                            Đặt lại mật khẩu
                        </Button>

                        <Button type="link" block onClick={() => { formStep2.resetFields(); setStep(1); }}>
                            Quay lại bước nhập email
                        </Button>
                    </>
                )}
            </Form>
        </Modal>
    );
}
