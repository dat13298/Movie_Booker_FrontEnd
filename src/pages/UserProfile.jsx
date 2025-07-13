import React, {useEffect, useState, useContext} from "react";
import {Typography, Divider, Table} from "antd";
import {AuthContext} from "../auth/AuthProvider.jsx";

const {Title, Text} = Typography;

const UserProfile = () => {
    const {auth, userInfo} = useContext(AuthContext);
    const [bookingHistory, setBookingHistory] = useState([]);

    useEffect(() => {
        const fetchBookingHistory = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/bookings/my?page=0&size=100", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${auth?.accessToken}`,
                    },
                });

                if (!response.ok) throw new Error("Lỗi khi lấy lịch sử đặt vé");

                const result = await response.json();

                const mapped = result.content.map((item, index) => ({
                    key: index + 1,
                    movie: item.movieTitle,
                    theater: item.theaterName,
                    seat: item.seatCodes,
                    time: item.showTime,
                }));
                console.log("seat code", mapped);
                setBookingHistory(mapped);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        if (auth?.accessToken) {
            fetchBookingHistory();
        }
    }, [auth?.accessToken]);

    const columns = [
        {title: "Phim", dataIndex: "movie"},
        {title: "Rạp", dataIndex: "theater"},
        {
            title: "Ghế",
            dataIndex: "seat",
            render: (seats) =>
                <span style={{color: "white", fontFamily: "monospace"}}>
                {Array.isArray(seats) ? seats.join(", ") : seats}
            </span>
        },
        {title: "Ngày giờ chiếu", dataIndex: "time"},
    ];

    return (
        <div style={{backgroundColor: "#0e0e0e", minHeight: "100vh", padding: 20}}>
            <Title level={2} style={{color: "#fff", marginBottom: 24}}>
                Thông tin cá nhân
            </Title>

            <div style={{marginBottom: 32}}>
                <p>
                    <Text strong style={{color: "#E02828"}}>Tên người dùng:</Text>{" "}
                    <Text style={{color: "white"}}>{userInfo?.username}</Text>
                </p>
                <p>
                    <Text strong style={{color: "#E02828"}}>Email:</Text>{" "}
                    <Text style={{color: "white"}}>{userInfo?.email}</Text>
                </p>
                <p>
                    <Text strong style={{color: "#E02828"}}>SĐT:</Text>{" "}
                    <Text style={{color: "white"}}>{userInfo?.phone || "Chưa cập nhật"}</Text>
                </p>
                <p>
                    <Text strong style={{color: "#E02828"}}>Giới tính:</Text>{" "}
                    <Text style={{color: "white"}}>{userInfo?.gender || "Chưa rõ"}</Text>
                </p>
                <p>
                    <Text strong style={{color: "#E02828"}}>Ngày sinh:</Text>{" "}
                    <Text style={{color: "white"}}>{userInfo?.dob || "Chưa cập nhật"}</Text>
                </p>
            </div>

            <Divider style={{borderColor: "#444"}}/>

            <Title level={3} style={{color: "#fff", marginBottom: 16}}>
                Lịch sử đặt vé
            </Title>

            {bookingHistory.length === 0 ? (
                <Text style={{color: "#999", fontStyle: "italic", fontSize: 16}}>
                    Bạn chưa đặt phim nào.
                </Text>
            ) : (
                <div
                    style={{
                        backgroundColor: "transparent",
                        overflow: "hidden",
                    }}
                >
                    <Table
                        columns={columns.map(col => ({
                            ...col,
                            render: col.render || ((text) => (
                                <span style={{color: "white", fontFamily: "monospace"}}>{text}</span>
                            )),
                            title: (
                                <span style={{color: "#E02828", fontFamily: "monospace"}}>{col.title}</span>
                            ),
                        }))}
                        dataSource={bookingHistory}
                        pagination={false}
                        bordered
                        className="retro-table"
                    />
                </div>
            )}
        </div>
    );
};

export default UserProfile;
