import React, {useEffect, useState, useContext} from "react";
import {Typography, Divider, Table} from "antd";
import {AuthContext} from "../auth/AuthProvider.jsx";

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
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
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
                                        const res = await fetch("http://localhost:8080/api/users/me", {
                                            method: "PUT",
                                            headers: {
                                                "Content-Type": "application/json",
                                                Authorization: `Bearer ${auth?.accessToken}`,
                                            },
                                            body: JSON.stringify(editableInfo),
                                        });
                                        if (!res.ok) throw new Error("Cập nhật thất bại");
                                        alert("Cập nhật thành công!");
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
