import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Space,
    Popconfirm,
    notification,
} from "antd";
import dayjs from "dayjs";
import api from "@/api/axios.js";

const RegionsCMS = () => {
    const [regions, setRegions] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRegion, setEditingRegion] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData(1, pagination.pageSize);
    }, []);

    const fetchData = async (page, size) => {
        setLoading(true);
        try {
            const res = await api.get(`/regions?page=${page - 1}&size=${size}`);
            setRegions(res.data.content);
            setPagination({
                current: page,
                pageSize: size,
                total: res.data.totalElements,
            });
        } catch {
            notification.error({ message: "Lỗi tải dữ liệu" });
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination) => {
        fetchData(pagination.current, pagination.pageSize);
    };

    const handleAdd = () => {
        setEditingRegion(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (region) => {
        setEditingRegion(region);
        form.setFieldsValue({ name: region.name });
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/regions/${id}`);
            notification.success({ message: "Xoá thành công" });
            fetchData(pagination.current, pagination.pageSize);
        } catch {
            notification.error({ message: "Xoá thất bại" });
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingRegion) {
                await api.put(`/regions/${editingRegion.id}`, { name: values.name });
                notification.success({ message: "Cập nhật thành công" });
            } else {
                await api.post("/regions", { name: values.name });
                notification.success({ message: "Thêm mới thành công" });
            }
            setModalVisible(false);
            fetchData(pagination.current, pagination.pageSize);
        } catch {
            notification.error({ message: "Lưu thất bại" });
        }
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Tên vùng", dataIndex: "name", key: "name" },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            render: (value) => value ? dayjs(value).format("DD/MM/YYYY HH:mm:ss") : "",
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            render: (value) => value ? dayjs(value).format("DD/MM/YYYY HH:mm:ss") : "",
        },
        { title: "Tạo bởi", dataIndex: "createdBy", key: "createdBy" },
        { title: "Cập nhật bởi", dataIndex: "updatedBy", key: "updatedBy" },
        {
            title: "Thao tác",
            render: (_, record) => (
                <Space>
                    <Button onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xoá?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger>Xoá</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h2>🎬 Quản lý Vùng</h2>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                Thêm Vùng
            </Button>
            <Table
                columns={columns}
                dataSource={regions}
                rowKey="id"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
            />

            <Modal
                open={modalVisible}
                title={editingRegion ? "Sửa Vùng" : "Thêm Vùng"}
                onCancel={() => setModalVisible(false)}
                destroyOnClose
                footer={
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button onClick={() => setModalVisible(false)}>Hủy</Button>
                        <Button type="primary" onClick={handleOk}>
                            Lưu
                        </Button>
                    </div>
                }
            >

            <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên vùng"
                        rules={[{ required: true, message: "Tên vùng không được bỏ trống" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RegionsCMS;
