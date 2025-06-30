import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";

export default function TheaterCMS() {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

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

    const onAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const onEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
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

    const onFinish = (values) => {
        if (editingRecord) {
            setData(prev => prev.map(item =>
                item.key === editingRecord.key ? { ...editingRecord, ...values } : item
            ));
        } else {
            setData(prev => [...prev, { ...values, key: Date.now().toString() }]);
        }
        setIsModalVisible(false);
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
                </Form>
            </Modal>
        </div>
    );
}
