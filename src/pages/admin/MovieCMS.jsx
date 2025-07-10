import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message, Tag, Input } from "antd";
import dayjs from "dayjs";
import api from "@/api/axios";
import MovieFormModal from "@/components/admin/MovieFormModal";

const { Search } = Input;

export default function MovieCMS() {
    const [movies, setMovies] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [filter, setFilter] = useState({
        screenType: null,
        is18Plus: null,
        status: null,
    });

    const fetchMovies = useCallback(
        async (page = 1, size = 10, kw = "", f = {}) => {
            setLoading(true);
            try {
                const res = await api.get("/movies", {
                    params: {
                        page: page - 1, // backend 0‑based
                        size,
                        keyword: kw,
                        screenType: f.screenType ?? undefined,
                        is18Plus: f.is18Plus ?? undefined,
                        status: f.status ?? undefined,
                    },
                });

                const data = res.data;
                setMovies(data.content);
                setPagination({
                    current: data.number + 1,
                    pageSize: data.size,
                    total: data.totalElements,
                });
            } catch {
                message.error("Lỗi khi tải danh sách phim");
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /* initial load */
    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    /* ─────────── table change (paging + filter) ─────────── */
    const handleTableChange = (pag, filters) => {
        const newFilter = {
            screenType: filters.screenType?.[0] ?? null,
            is18Plus: filters.is18Plus ? filters.is18Plus[0] === "true" : null,
            status: filters.movieStatus?.[0] ?? null,
        };
        setFilter(newFilter);
        fetchMovies(pag.current, pag.pageSize, keyword, newFilter);
    };

    /* ─────────── search ─────────── */
    const onSearch = (value) => {
        const kw = value.trim();
        setKeyword(kw);
        fetchMovies(1, pagination.pageSize, kw, filter); // luôn về trang 1
    };

    /* ─────────── add / update ─────────── */
    const handleSubmit = async (formData) => {
        try {
            if (editingMovie) {
                const file = formData.get("image");
                if (!(file instanceof File)) formData.delete("image");

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

            fetchMovies(pagination.current, pagination.pageSize, keyword, filter);
            setModalVisible(false);
            setEditingMovie(null);
        } catch {
            message.error("Lỗi khi lưu phim");
        }
    };

    /* ─────────── delete ─────────── */
    const handleDelete = async (id) => {
        try {
            await api.delete(`/movies/${id}`);
            message.success("Xóa phim thành công");
            fetchMovies(pagination.current, pagination.pageSize, keyword, filter);
        } catch {
            message.error("Lỗi khi xóa phim");
        }
    };

    /* ─────────── table columns ─────────── */
    const columns = [
        {
            title: "Poster",
            dataIndex: "imageUrl",
            width: 80,
            fixed: "left",
            render: (url) => <img src={url} alt="poster" style={{ width: 60, height: 90, objectFit: "cover" }} />,
        },
        { title: "Tên phim", dataIndex: "title", width: 160, fixed: "left" },
        { title: "Mã", dataIndex: "movieCode", width: 90 },
        { title: "Thể loại", dataIndex: "movieType" },
        { title: "Đạo diễn", dataIndex: "director" },
        { title: "Diễn viên", dataIndex: "actors" },
        { title: "Ngôn ngữ", dataIndex: "language", width: 100 },
        { title: "Thời lượng", dataIndex: "duration", width: 90, render: (v) => `${v}′` },
        { title: "Xếp hạng", dataIndex: "rating", width: 90 },
        {
            title: "Khởi chiếu",
            dataIndex: "premiereDate",
            width: 120,
            render: (d) => dayjs(d).format("DD/MM/YYYY"),
        },
        {
            title: "Phát hành",
            dataIndex: "releaseDate",
            width: 120,
            render: (d) => dayjs(d).format("DD/MM/YYYY"),
        },
        {
            title: "Loại màn",
            dataIndex: "screenType",
            width: 90,
            filters: [
                { text: "2D", value: "2D" },
                { text: "3D", value: "3D" },
                { text: "IMAX", value: "IMAX" },
            ],
            filteredValue: filter.screenType ? [filter.screenType] : null,
            onFilter: () => true,
        },
        {
            title: "18+",
            dataIndex: "is18Plus",
            width: 80,
            align: "center",
            render: (flag) =>
                flag ? <Tag color="red" style={{ fontWeight: 600 }}>18+</Tag> : <Tag color="green">P</Tag>,
            filters: [
                { text: "18+", value: true },
                { text: "P", value: false },
            ],
            filteredValue: filter.is18Plus !== null ? [String(filter.is18Plus)] : null,
            onFilter: () => true,
        },
        {
            title: "Trạng thái",
            dataIndex: "movieStatus",
            width: 140,
            filters: [
                { text: "COMING_SOON", value: "COMING_SOON" },
                { text: "NOW_SHOWING", value: "NOW_SHOWING" },
                { text: "ENDED", value: "ENDED" },
            ],
            filteredValue: filter.status ? [filter.status] : null,
            onFilter: () => true,
        },
        {
            title: "Thao tác",
            key: "action",
            fixed: "right",
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button onClick={() => { setEditingMovie(record); setModalVisible(true); }}>Sửa</Button>
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

    /* ─────────── render ─────────── */
    return (
        <>
            <h2>🎬 Quản lý Phim</h2>

            <Space style={{ marginBottom: 16 }}>
                <Search
                    allowClear
                    placeholder="Tìm theo tên, mã, diễn viên..."
                    onSearch={onSearch}
                    enterButton
                    style={{ width: 300 }}
                />
                <Button type="primary" onClick={() => { setEditingMovie(null); setModalVisible(true); }}>
                    Thêm phim
                </Button>
            </Space>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={movies}
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                scroll={{ x: 1300 }}
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
