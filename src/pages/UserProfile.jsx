import React, {useEffect, useState, useContext} from "react";
import {Typography, Divider, Table} from "antd";
import {AuthContext} from "../auth/AuthProvider.jsx";
import api from "@/api/axios.js";

const {Title, Text} = Typography;

const UserProfile = () => {
    const {auth, userInfo, updateAuth} = useContext(AuthContext);
    const [bookingHistory, setBookingHistory] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editableInfo, setEditableInfo] = useState({
        username: "",
        email: "",
        phone: "",
        gender: "",
        dob: "",
    });

    useEffect(() => {
        if (userInfo) {
            setEditableInfo({
                username: userInfo.username || "",
                email: userInfo.email || "",
                phone: userInfo.phone || "",
                gender: userInfo.gender || "",
                dob: userInfo.dob || "",
            });
        }

        const fetchBookingHistory = async () => {
            try {
                const response = await api.get("/bookings/my?page=0&size=100");

                const content = Array.isArray(response.data) ? response.data : response.data?.data ?? [];

                const mapped = content.map((item, index) => ({
                    key: index + 1,
                    movie: item.movieTitle,
                    theater: item.theaterName,
                    seatCodes: item.seatCodes ?? [],
                    time: item.showTime,
                    combos: item.combos ?? [],
                    total: item.totalAmount,
                    status: item.status,
                }));

                setBookingHistory(mapped);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        if (auth?.accessToken) {
            fetchBookingHistory();
        }
    }, [auth?.accessToken, userInfo]);

    const inputStyle = {
        background: "transparent",
        border: "none",
        borderBottom: "1px solid #E02828",
        color: "#fff",
        fontFamily: "monospace",
        outline: "none",
        width: "100%",
        padding: "4px 0",
    };

    const columns = [
        { title: "Phim", dataIndex: "movie" },
        { title: "Rạp", dataIndex: "theater" },
        {
            title: "Ghế",
            dataIndex: "seatCodes",
            render: (seats) => (
                <span style={{ color: "white", fontFamily: "monospace" }}>
                {Array.isArray(seats) && seats.length > 0
                    ? [...new Set(seats)].join(", ")
                    : "Chưa chọn"}
            </span>
            ),
        },
        {
            title: "Combo",
            dataIndex: "combos",
            render: (combos) =>
                combos.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: 16, color: "white", fontFamily: "monospace" }}>
                        {combos.map((c, idx) => (
                            <li key={idx}>
                                {c.quantity} x {c.name} ({c.unitPrice.toLocaleString()}đ)
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span style={{ color: "#999", fontStyle: "italic" }}>Không có</span>
                ),
        },
        {
            title: "Ngày giờ chiếu",
            dataIndex: "time",
            render: (time) => (
                <span style={{ color: "white", fontFamily: "monospace" }}>
                {new Date(time).toLocaleString("vi-VN")}
            </span>
            ),
        },
        {
            title: "Tổng tiền",
            dataIndex: "total",
            render: (amount) => (
                <span style={{ color: "#E02828", fontWeight: "bold", fontFamily: "monospace" }}>
                {amount.toLocaleString()}đ
            </span>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status) => (
                <span
                    style={{
                        color: status === "SUCCESS" ? "#52c41a" : "#faad14",
                        fontFamily: "monospace",
                        textTransform: "capitalize",
                    }}
                >
                {status}
            </span>
            ),
        },
    ];


    return (
        <div style={{backgroundColor: "#0e0e0e", minHeight: "100vh", padding: "20px 50px"}}>

            <Title level={2} style={{color: "#fff", marginBottom: 24}}>
                Thông tin cá nhân
            </Title>

            <div style={{marginBottom: 32}}>
                {[
                    {label: "Tên người dùng", field: "username"},
                    {label: "Email", field: "email"},
                    {label: "SĐT", field: "phone"},
                    {label: "Giới tính", field: "gender"},
                    {label: "Ngày sinh", field: "dob", type: "date"},
                ].map(({label, field, type}) => (
                    <p key={field}>
                        <Text strong style={{color: "#E02828"}}>{label}:</Text>{" "}
                        {isEditing ? (
                            field === "gender" ? (
                                <select
                                    value={editableInfo[field]}
                                    onChange={(e) =>
                                        setEditableInfo({...editableInfo, [field]: e.target.value})
                                    }
                                    style={{...inputStyle, width: "auto"}}
                                >
                                    <option value="">--</option>
                                    <option value="MALE">Nam</option>
                                    <option value="FEMALE">Nữ</option>
                                    <option value="OTHER">Khác</option>
                                </select>
                            ) : (
                                <input
                                    type={type || "text"}
                                    value={editableInfo[field]}
                                    onChange={(e) =>
                                        setEditableInfo({...editableInfo, [field]: e.target.value})
                                    }
                                    style={inputStyle}
                                />
                            )
                        ) : (
                            <Text style={{color: "white"}}>
                                {editableInfo[field] || "Chưa cập nhật"}
                            </Text>
                        )}
                    </p>
                ))}

                {/* Nút hành động */}
                <div style={{marginTop: 16}}>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{
                                backgroundColor: "#E02828",
                                color: "white",
                                padding: "6px 16px",
                                fontFamily: "monospace",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                            }}
                        >
                            Chỉnh sửa
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={async () => {
                                    try {
                                        await api.put("/users/me", editableInfo);
                                        updateAuth(auth, editableInfo);
                                        setIsEditing(false);
                                    } catch (err) {
                                        console.error(err);
                                        alert("Có lỗi khi cập nhật");
                                    }
                                }}
                                style={{
                                    backgroundColor: "#E02828",
                                    color: "white",
                                    padding: "6px 16px",
                                    fontFamily: "monospace",
                                    border: "none",
                                    borderRadius: 4,
                                    cursor: "pointer",
                                    marginRight: 12,
                                }}
                            >
                                Lưu
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditableInfo({
                                        username: userInfo?.username || "",
                                        email: userInfo?.email || "",
                                        phone: userInfo?.phone || "",
                                        gender: userInfo?.gender || "",
                                        dob: userInfo?.dob || "",
                                    });
                                }}
                                style={{
                                    backgroundColor: "transparent",
                                    color: "#E02828",
                                    border: "1px solid #E02828",
                                    padding: "6px 16px",
                                    margin: "6px 0",
                                    fontFamily: "monospace",
                                    borderRadius: 4,
                                    cursor: "pointer",
                                }}
                            >
                                Hủy
                            </button>
                        </>
                    )}
                </div>
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
