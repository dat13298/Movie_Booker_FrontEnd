import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Space,
    Popconfirm,
    message,
    Tag,
    Input,
    Image,
} from "antd";
import api from "@/api/axios";
import ComboFormModal from "@/components/admin/ComboFormModal";

const { Search } = Input;

export default function ComboCMS() {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCombo, setEditingCombo] = useState(null);
    const [keyword, setKeyword] = useState("");

    // Fetch once when mounted
    useEffect(() => {
        fetchCombos();
    }, []);

    const fetchCombos = async () => {
        setLoading(true);
        try {
            const res = await api.get("/combos");
            setCombos(res.data || []);
        } catch (e) {
            console.error(e);
            message.error("Lỗi khi tải danh sách combo");
        } finally {
            setLoading(false);
        }
    };

    const onSearch = (value) => {
        const kw = value.trim().toLowerCase();
        setKeyword(kw);
    };

    const handleSubmit = async (formData) => {
        try {
            const file = formData.get("image");
            if (!(file instanceof File)) {
                formData.delete("image");
            }

            if (editingCombo) {
                await api.put(`/combos/${editingCombo.id}`, formData);
                message.success("Cập nhật combo thành công");
            } else {
                await api.post("/combos", formData);
                message.success("Thêm combo thành công");
            }

            setModalVisible(false);
            setEditingCombo(null);
            fetchCombos();
        } catch (err) {
            console.error(err);
            message.error("Lỗi khi lưu combo");
        }
    };


    const handleDelete = async (id) => {
        try {
            await api.delete(`/combos/${id}`);
            message.success("Xóa combo thành công");
            fetchCombos();
        } catch {
            message.error("Lỗi khi xóa combo");
        }
    };

    const filteredCombos = (combos ?? []).filter((c) =>
        c.name.toLowerCase().includes(keyword)
    );

    const columns = [
        {
            title: "Ảnh",
            dataIndex: "imageUrl",
            width: 100,
            render: (url) => (
                <Image
                    width={60}
                    height={60}
                    src={url}
                    fallback="/fallback.jpg"
                    alt="combo"
                />
            ),
        },
        { title: "Tên combo", dataIndex: "name", width: 180 },
        { title: "Mô tả", dataIndex: "description" },
        {
            title: "Giá",
            dataIndex: "price",
            width: 100,
            render: (v) => `${v.toLocaleString("vi-VN")} đ`,
        },
        {
            title: "Loại",
            dataIndex: "foodType",
            width: 100,
            render: (t) => t?.toUpperCase(),
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            width: 100,
            render: (active) =>
                active ? <Tag color="green">Hiển thị</Tag> : <Tag color="red">Ẩn</Tag>,
        },
        {
            title: "Thao tác",
            key: "action",
            fixed: "right",
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button
                        onClick={() => {
                            setEditingCombo(record);
                            setModalVisible(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xác nhận xoá combo này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xoá"
                        cancelText="Hủy"
                    >
                        <Button danger>Xoá</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    console.log(combos);
    return (
        <>
            <h2>🍿 Quản lý Combo</h2>

            <Space style={{ marginBottom: 16 }}>
                <Search
                    allowClear
                    placeholder="Tìm theo tên combo..."
                    onSearch={onSearch}
                    enterButton
                    style={{ width: 300 }}
                />
                <Button type="primary" onClick={() => {
                    setEditingCombo(null);
                    setModalVisible(true);
                }}>
                    Thêm combo
                </Button>
            </Space>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredCombos}
                loading={loading}
                scroll={{ x: 800 }}
            />

            <ComboFormModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSubmit}
                initialValues={editingCombo}
            />
        </>
    );

}
