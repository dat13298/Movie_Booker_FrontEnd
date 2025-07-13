import React, { useEffect, useState, useContext } from "react";
import { Typography, Divider, Table } from "antd";
import { AuthContext } from "../auth/AuthProvider.jsx";

const { Title, Text } = Typography;

const UserProfile = () => {
    const { auth, userInfo } = useContext(AuthContext);
    const [bookingHistory, setBookingHistory] = useState([]);

    useEffect(() => {
        console.log(userInfo);
        const dummy = [
            {
                key: "1",
                movie: "Avengers: Endgame",
                theater: "CGV Vincom",
                seat: "H8, H9",
                date: "05/07/2025",
                time: "19:30",
            },
        ];
        setBookingHistory(dummy);
    }, [auth?.accessToken]);

    const columns = [
        { title: "Phim", dataIndex: "movie" },
        { title: "Rạp", dataIndex: "theater" },
        { title: "Ghế", dataIndex: "seat" },
        { title: "Ngày", dataIndex: "date" },
        { title: "Giờ", dataIndex: "time" },
    ];

    return (
        <div style={{ backgroundColor: "#0e0e0e", minHeight: "100vh", padding: 20 }}>
            <Title level={2} style={{ color: "#fff", marginBottom: 24 }}>
                Thông tin cá nhân
            </Title>

            <div style={{ marginBottom: 32 }}>
                <p>
                    <Text strong style={{ color: "#E02828" }}>Tên người dùng:</Text>{" "}
                    <Text style={{ color: "white" }}>{userInfo?.username}</Text>
                </p>
                <p>
                    <Text strong style={{ color: "#E02828" }}>Email:</Text>{" "}
                    <Text style={{ color: "white" }}>{userInfo?.email}</Text>
                </p>
                <p>
                    <Text strong style={{ color: "#E02828" }}>SĐT:</Text>{" "}
                    <Text style={{ color: "white" }}>{userInfo?.phone || "Chưa cập nhật"}</Text>
                </p>
                <p>
                    <Text strong style={{ color: "#E02828" }}>Giới tính:</Text>{" "}
                    <Text style={{ color: "white" }}>{userInfo?.gender || "Chưa rõ"}</Text>
                </p>
                <p>
                    <Text strong style={{ color: "#E02828" }}>Ngày sinh:</Text>{" "}
                    <Text style={{ color: "white" }}>{userInfo?.dob || "Chưa cập nhật"}</Text>
                </p>
            </div>

            <Divider style={{ borderColor: "#444" }} />

            <Title level={3} style={{ color: "#fff", marginBottom: 16 }}>
                Lịch sử đặt vé
            </Title>

            <div
                style={{
                    backgroundColor: "transparent",
                    overflow: "hidden",
                }}
            >
                <Table
                    columns={columns.map(col => ({
                        ...col,
                        render: (text) => <span style={{ color: "white", fontFamily: "monospace" }}>{text}</span>,
                        title: <span style={{ color: "#E02828", fontFamily: "monospace" }}>{col.title}</span>,
                    }))}
                    dataSource={bookingHistory}
                    pagination={false}
                    bordered
                    className="retro-table"
                />
            </div>
        </div>
    );
};

export default UserProfile;
