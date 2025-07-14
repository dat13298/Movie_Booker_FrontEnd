import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form, Input, Select, Space, message } from "antd";
import api from "@/api/axios";

const { Option } = Select;

export default function ScreenCMS() {
    const [screens, setScreens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [editing, setEditing] = useState(null);
    const [theaters, setTheaters] = useState([]);
    const [theaterLoading, setTheaterLoading] = useState(false);

    const fetchScreens = async () => {
        setLoading(true);
        try {
            const res = await api.get("/screens");
            setScreens(res.data.content || []);
        } catch (err) {
            message.error("Lỗi khi tải danh sách phòng chiếu");
        } finally {
            setLoading(false);
        }
    };

    const fetchTheaters = async () => {
        setTheaterLoading(true);
        try {
            const res = await api.get("/theaters", {
                params: { size: 1000 },
            });
            const data = res.data?.content || [];
            setTheaters(data);
        } catch (err) {
            message.error("Không thể tải danh sách rạp");
            setTheaters([]);
        } finally {
            setTheaterLoading(false);
        }
    };


    useEffect(() => {
        fetchScreens();
        fetchTheaters();
    }, []);

    const handleEdit = (record) => {
        setEditing(record);
        form.setFieldsValue({
            name: record.name,
            theaterId: theaters.find(t => t.name === record.theaterName)?.id || null,
        });
        setOpen(true);
    };

    const handleAdd = () => {
        setEditing(null);
        form.resetFields();
        setOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/screens/${id}`);
            message.success("Xoá thành công");
            fetchScreens();
        } catch {
            message.error("Không thể xoá");
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editing) {
                await api.put(`/screens/${editing.id}`, values);
                message.success("Cập nhật thành công");
            } else {
                await api.post("/screens", values);
                message.success("Thêm mới thành công");
            }
            setOpen(false);
            form.resetFields();
            setEditing(null);
            fetchScreens();
        } catch (err) {
            message.error("Đã xảy ra lỗi khi lưu thông tin");
        }
    };

    const columns = [
        { title: "ID", dataIndex: "id" },
        { title: "Tên phòng chiếu", dataIndex: "name" },
        { title: "Rạp", dataIndex: "theaterName" },
        {
            title: "Hành động",
            render: (text, record) => (
                <Space>
                    <Button onClick={() => handleEdit(record)}>Sửa</Button>
                    <Button danger onClick={() => handleDelete(record.id)}>Xoá</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2>🎬 Quản lý Phòng chiếu</h2>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                Thêm phòng chiếu
            </Button>
            <Table
                columns={columns}
                dataSource={screens}
                rowKey="id"
                loading={loading}
                bordered
            />

            <Modal
                open={open}
                onCancel={() => {
                    setOpen(false);
                    form.resetFields();
                    setEditing(null);
                }}
                title={editing ? "Chỉnh sửa phòng chiếu" : "Thêm phòng chiếu"}
                onOk={handleSubmit}
                okText={editing ? "Cập nhật" : "Thêm mới"}
                cancelText="Huỷ"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên phòng chiếu"
                        rules={[{ required: true, min: 5, max: 50, message: "Tên phải từ 5 đến 50 ký tự" }]}
                    >
                        <Input placeholder="Nhập tên phòng chiếu" />
                    </Form.Item>

                    <Form.Item
                        name="theaterId"
                        label="Rạp"
                        rules={[{ required: true, message: "Vui lòng chọn rạp" }]}
                    >
                        <Select
                            placeholder="Chọn rạp"
                            loading={theaterLoading}
                            allowClear
                            showSearch
                            optionFilterProp="children"
                        >
                            {theaters.map((t) => (
                                <Option key={t.id} value={t.id}>
                                    {t.name} - {t.regionName}
                                </Option>
                            ))}
                        </Select>

                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
