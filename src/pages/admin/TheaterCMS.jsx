import React, { useState } from "react";
import {Table, Button, Modal, Form, Input, Space, Select} from "antd";
import api from "@/api/axios.js";
import { useEffect } from "react";

export default function TheaterCMS() {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [regions, setRegions] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const columns = [
        {
            title: "Tên rạp",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Khu vực",
            dataIndex: "regionName",
            key: "regionName",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button onClick={() => onEdit(record)}>Sửa</Button>
                    <Button danger onClick={() => onDelete(record.id)}>Xóa</Button>
                </Space>
            ),
        }
    ];

    useEffect(() => {
        fetchTheaters(pagination.current, pagination.pageSize);
    }, []);

    const fetchTheaters = async (page = 1, pageSize = 10) => {
        try {
            const res = await api.get("/theaters", {
                params: {
                    page: page - 1,
                    size: pageSize,
                },
            });

            setData(res.data.content || []);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: res.data.totalElements,
            });
        } catch (err) {
            console.error("Lỗi khi tải danh sách rạp:", err);
        }
    };
    const handleTableChange = (pagination) => {
        fetchTheaters(pagination.current, pagination.pageSize);
    };


    const onDelete = (id) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa rạp này?",
            onOk: async () => {
                try {
                    await api.delete(`/theaters/${id}`);
                    setData(prev => prev.filter(item => item.id !== id));
                } catch (err) {
                    console.error("Lỗi khi xoá:", err);
                }
            },
        });
    };

    useEffect(() => {
        api.get("/regions?page=0&size=100")
            .then(res => {
                const items = res.data?.content || res.data;
                setRegions(items.map(r => ({ label: r.name, value: r.id })));
            })
            .catch(err => {
                console.error("Lỗi khi tải khu vực:", err);
            });
    }, []);
console.log(data)

    const onAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const onEdit = (record) => {
        const matchedRegion = regions.find(r => r.label === record.regionName);

        setEditingRecord(record);
        form.setFieldsValue({
            ...record,
            regionId: matchedRegion?.value,
        });
        setIsModalVisible(true);
    };

    const onFinish = async (values) => {
        try {
            if (editingRecord && editingRecord.id) {
                const res = await api.put(`/theaters/${editingRecord.id}`, values);
                setData(prev =>
                    prev.map(item =>
                        item.id === editingRecord.id ? res.data : item
                    )
                );
            } else {
                const res = await api.post("/theaters", values);
                setData(prev => [...prev, res.data]);
            }
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error("Lỗi khi lưu rạp:", error);
        }
    };


    return (
        <div style={{ padding: 24 }}>
            <h2>Quản lý Rạp Chiếu</h2>
            <Button type="primary" onClick={onAdd} style={{ marginBottom: 16 }}>
                Thêm Rạp
            </Button>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={pagination}
                onChange={handleTableChange}
            />
            <Modal
                title={editingRecord ? "Chỉnh sửa Rạp" : "Thêm Rạp"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setEditingRecord(null);
                }}
                footer={
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button onClick={() => {
                            setIsModalVisible(false);
                            form.resetFields();
                            setEditingRecord(null);
                        }}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => form.submit()}
                            style={{ padding: "0 16px", height: 32 }}
                        >
                            Lưu
                        </Button>
                    </div>
                }
            >

            <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="name" label="Tên rạp" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="regionId"
                        label="Khu vực"
                        rules={[{ required: true, message: "Vui lòng chọn khu vực" }]}
                    >
                        <Select options={regions} placeholder="Chọn khu vực" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
