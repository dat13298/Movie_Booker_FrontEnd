import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message, Tooltip } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    AppstoreOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import api from "@/api/axios";
import ShowTimeFormModal from "@/components/admin/ShowTimeFormModal.jsx";
import SeatMapModal from "@/components/admin/SeatMapModal.jsx";

export const ShowTimeCMS = () => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [editingShowTime, setEditingShowTime] = useState(null);
    const [movieOptions, setMovieOptions] = useState([]);
    const [roomOptions, setRoomOptions] = useState([]);
    const [seatModalShowTime, setSeatModalShowTime] = useState(null);

    const fetchData = async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const res = await api.get(`/show-times?page=${page - 1}&size=${size}`);
            setData(res.data.content || []);
            setPagination({
                current: res.data.number + 1,
                pageSize: res.data.size,
                total: res.data.totalElements,
            });
            console.log("res", data);
        } catch (err) {
            message.error("Không thể tải danh sách suất chiếu.");
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const [moviesRes, roomsRes] = await Promise.all([
                api.get("/movies"),
                api.get("/screens"),
            ]);
            setMovieOptions(moviesRes.data.content);
            setRoomOptions(roomsRes.data.content);
        } catch {
            message.error("Không thể tải danh sách phim hoặc phòng.");
        }
    };

    useEffect(() => {
        fetchData();
        fetchDropdownData();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            if (editingShowTime?.id) {
                await api.put(`/show-times/${editingShowTime.id}`, formData);
                message.success("Cập nhật suất chiếu thành công!");
            } else {
                await api.post("/show-times", formData);
                message.success("Thêm suất chiếu thành công!");
            }
            setEditingShowTime(null);
            fetchData();
        } catch {
            message.error("Lưu suất chiếu thất bại.");
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: "Xác nhận xoá",
            content: "Bạn có chắc chắn muốn xoá suất chiếu này?",
            okText: "Xoá",
            okType: "danger",
            cancelText: "Huỷ",
            onOk: async () => {
                try {
                    await api.delete(`/show-times/${id}`);
                    message.success("Đã xoá suất chiếu.");
                    fetchData();
                } catch (err) {
                    message.error("Xoá thất bại.");
                }
            },
        });
    };

    const handleOpenSeatMap = (showTime) => {
        setSeatModalShowTime(showTime);
    };

    const columns = [
        {
            title: "Phim",
            dataIndex: ["movie", "title"],
            key: "movie",
        },
        {
            title: "Phòng chiếu",
            key: "screen",
            render: (_, record) =>
                record.screen
                    ? `${record.screen.name} - ${record.screen.theaterName}`
                    : "N/A",
        },
        {
            title: "Giờ bắt đầu",
            dataIndex: "startTime",
            key: "startTime",
            render: (val) => new Date(val).toLocaleString("vi-VN"),
        },
        {
            title: "Giờ kết thúc",
            dataIndex: "endTime",
            key: "endTime",
            render: (val) => new Date(val).toLocaleString("vi-VN"),
        },
        {
            title: "Trình chiếu",
            dataIndex: "presentation",
            key: "presentation",
        },
        {
            title: "Số lượng ghế",
            dataIndex: "seatCount",
            key: "seatCount",
            align: "center",
            render: (count) => (
                <span style={{ color: count === 0 ? "red" : "inherit", fontWeight: 500 }}>
            {count}
        </span>
            ),
        },
        {
            title: "Chức năng",
            key: "actions",
            render: (_, record) => (
                <div style={{ display: "flex", gap: 8 }}>
                    <Tooltip title="Sửa">
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => setEditingShowTime(record)}
                        />
                    </Tooltip>

                    <Tooltip title="Xoá">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>

                    <Tooltip title="Sơ đồ ghế">
                        <Button
                            icon={<AppstoreOutlined />}
                            size="small"
                            onClick={() => handleOpenSeatMap(record)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h2>Quản lý suất chiếu</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setEditingShowTime({})}
                >
                    Thêm suất chiếu
                </Button>
            </div>

            <Table
                rowKey="id"
                dataSource={data}
                columns={columns}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: (page, size) => fetchData(page, size),
                }}
            />

            <ShowTimeFormModal
                open={editingShowTime !== null}
                initialValues={editingShowTime || {}}
                onCancel={() => setEditingShowTime(null)}
                onSubmit={handleSubmit}
                movieOptions={movieOptions}
                roomOptions={roomOptions}
            />

            <SeatMapModal
                showTime={seatModalShowTime}
                open={seatModalShowTime !== null}
                onClose={() => setSeatModalShowTime(null)}
                onSaved={  () => {
                     fetchData();
                    setSeatModalShowTime(null);
                }}
            />
        </div>
    );
};
