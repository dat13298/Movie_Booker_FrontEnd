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
                    <Button danger onClick={() => onDelete(record.key)}>Xóa</Button>
                </Space>
            ),
        },
    ];

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
            regionId: matchedRegion?.value, // chọn sẵn khu vực nếu tìm thấy
        });
        setIsModalVisible(true);
    };


    const onDelete = (key) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa rạp này?",
            onOk: () => {
                setData(prev => prev.filter(item => item.key !== key));
            },
        });
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
            <Table columns={columns} dataSource={data} />

            <Modal
                title={editingRecord ? "Chỉnh sửa Rạp" : "Thêm Rạp"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                okText="Lưu"
                cancelText="Hủy"
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
