import {Table, Button, Space, Popconfirm, message, Tag} from 'antd';
import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import MovieFormModal from "@/components/admin/MovieFormModal.jsx";
import dayjs from "dayjs";

export default function MovieCMS() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const res = await api.get('/movies');
            setMovies(res.data.content || res.data);
            console.log(res.data.content);
        } catch (err) {
            message.error('Lỗi khi tải danh sách phim');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            if (editingMovie) {
                const file = formData.get("image");

                if (!(file instanceof File)) {
                    formData.delete("image");
                }

                await api.put(`/movies/${editingMovie.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                message.success("Cập nhật phim thành công");
            } else {
                await api.post("/movies", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                message.success("Thêm phim thành công");
            }

            await fetchMovies();
            setModalVisible(false);
            setEditingMovie(null);
        } catch (err) {
            console.error(err);
            message.error("Lỗi khi lưu phim");
        }
    };


    const handleDelete = async (id) => {
        try {
            await api.delete(`/movies/${id}`);
            message.success('Xóa phim thành công');
            fetchMovies();
        } catch (err) {
            message.error('Lỗi khi xóa phim');
        }
    };

    const columns = [
        /* Ảnh poster thu nhỏ */
        {
            title: "Poster",
            dataIndex: "imageUrl",
            render: (url) => (
                <img src={url} alt="poster" style={{ width: 60, height: 90, objectFit: "cover" }} />
            ),
            width: 80,
            fixed: "left",
        },

        { title: "Tên phim", dataIndex: "title", width: 160, fixed: "left" },
        { title: "Mã", dataIndex: "movieCode", width: 90 },

        { title: "Thể loại", dataIndex: "movieType" },
        { title: "Đạo diễn", dataIndex: "director" },
        { title: "Diễn viên", dataIndex: "actors" },

        { title: "Ngôn ngữ", dataIndex: "language", width: 100 },
        {
            title: "Thời lượng",
            dataIndex: "duration",
            render: (v) => `${v}′`,
            width: 90,
        },
        { title: "Xếp hạng", dataIndex: "rating", width: 90 },

        {
            title: "Khởi chiếu",
            dataIndex: "premiereDate",
            render: (d) => dayjs(d).format("DD/MM/YYYY"),
            width: 120,
        },
        {
            title: "Phát hành",
            dataIndex: "releaseDate",
            render: (d) => dayjs(d).format("DD/MM/YYYY"),
            width: 120,
        },
        { title: "Loại màn", dataIndex: "screenType", width: 90 },
        {
            title: "18+",
            dataIndex: "is18Plus",
            width: 80,
            align: "center",
            render: (flag) =>
                flag ? (
                    <Tag color="red" style={{ fontWeight: 600 }}>18+</Tag>
                ) : (
                    <Tag color="green">P</Tag>
                ),
        },
        { title: "Trạng thái", dataIndex: "movieStatus", width: 120 },

        /* Trailing actions */
        {
            title: "Thao tác",
            key: "action",
            fixed: "right",
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button onClick={() => { setEditingMovie(record); setModalVisible(true); }}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa phim này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    return (
        <>
            <h2>🎬 Quản lý Phim</h2>
            <Button type="primary" onClick={() => {
                setEditingMovie(null);
                setModalVisible(true);
            }}>
                Thêm phim
            </Button>

            <Table
                dataSource={movies}
                columns={columns}
                rowKey="id"
                loading={loading}
                style={{ marginTop: 20 }}
            />

            <MovieFormModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSubmit}
                initialValues={editingMovie}
            />
        </>
    );
}
