import React, {useEffect, useState, useMemo} from "react";
import {Button, Tag, Spin, message, Modal} from "antd";
import {Client} from "@stomp/stompjs";
import cls from "classnames";
import api from "@/api/axios";
import "./SeatMap.css";
import {useLocation} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/auth/AuthProvider.jsx";
import "@/index.css";
export default function SeatMap({showTimeId}) {
    const [seats, setSeats] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [cd, setCd] = useState(600);
    const [loading, setLoading] = useState(true);
    const [disabledSeats, setDisabledSeats] = useState(new Set());
    const location = useLocation();
    const showtime = location.state?.showtime;
    const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
    const [selectedCombos, setSelectedCombos] = useState({});
    const [combos, setCombos] = useState([]);
    const { userInfo } = useContext(AuthContext);
    const currentUsername = userInfo?.username;
    const [isProcessing, setIsProcessing] = useState(false);

    if (!showtime) {
        return <div>Không tìm thấy suất chiếu.</div>;
    }

    const totalCombo = useMemo(() => {
        return Object.entries(selectedCombos).reduce((sum, [id, qty]) => {
            const combo = combos.find((c) => c.id === parseInt(id));
            return sum + (combo?.price || 0) * qty;
        }, 0);
    }, [selectedCombos]);


    const getValidAccessToken = async () => {
        try {
            await api.get("/auth/ping");
        } catch (e) {
            console.log("checking token", e);
        }
        return localStorage.getItem("accessToken");
    };

    useEffect(() => {
        (async () => {
            try {
                await getValidAccessToken();
                const {data} = await api.get(`/show-times/${showTimeId}/seats`);
                setSeats(
                    data.map(s => ({
                        ...s,
                        status:
                            s.status === "RELEASED"
                                ? "AVAILABLE"
                                : s.status,
                    }))
                );
                console.log(data)
            } catch {
                message.error("Không tải được ghế!");
            } finally {
                setLoading(false);
            }
        })();
    }, [showTimeId]);

    useEffect(() => {
        const listener = (e) => {
            if (e.key === "seat-selected") {
                setSelected(new Set(JSON.parse(e.newValue)));
            }
        };
        window.addEventListener("storage", listener);
        return () => window.removeEventListener("storage", listener);
    }, []);

    useEffect(() => {
        localStorage.setItem("seat-selected", JSON.stringify([...selected]));
    }, [selected]);


    useEffect(() => {
        const fetchCombos = async () => {
            try {
                const { data } = await api.get("/combos");
                setCombos(data);
            } catch (err) {
                console.error("Lỗi khi tải combos:", err);
                message.error("Không thể tải danh sách combo");
            }
        };

        fetchCombos();
    }, []);

    useEffect(() => {
        let stompClient;

        const connectWebSocket = async () => {
            const token = await getValidAccessToken();

            stompClient = new Client({
                brokerURL: "ws://localhost:8080/ws/websocket",
                connectHeaders: {Authorization: `Bearer ${token}`},
                // debug: (msg) => console.log("[STOMP]", msg),
                // onWebSocketError: (err) => console.error("[STOMP ERROR]", err),
                // onStompError: (frame) => console.error("[STOMP BROKER ERROR]", frame),
                onConnect: () => {
                    console.log("[STOMP] connected");
                    stompClient.subscribe(`/topic/showtime/${showTimeId}`, (msg) => {
                        const evt = JSON.parse(msg.body);
                        console.log("[STOMP] Received event:", evt);

                        setSeats((prev) =>
                            prev.map((s) => {
                                if (s.id !== evt.seatId) return s;
                                const newStatus = evt.type === "RELEASED" ? "AVAILABLE" : evt.type;
                                return {...s, status: newStatus};
                            })
                        );

                        if ((evt.type === "LOCKED" || evt.type === "BOOKED") && evt.username !== currentUsername) {
                            setSelected((p) => {
                                const n = new Set(p);
                                n.delete(evt.seatId);
                                return n;
                            });
                        }
                    });
                },
            });

            stompClient.activate();
        };

        connectWebSocket();
        return () => stompClient?.deactivate();
    }, [showTimeId]);


    // 3. Countdown
    useEffect(() => {
        const id = setInterval(() => setCd((t) => Math.max(t - 1, 0)), 1000);
        return () => clearInterval(id);
    }, []);

    const mm = String(Math.floor(cd / 60)).padStart(2, "0");
    const ss = String(cd % 60).padStart(2, "0");

    const handleClick = async (seat) => {
        if (seat.status === "BOOKED" || disabledSeats.has(seat.id)) return;

        setDisabledSeats((p) => new Set(p).add(seat.id));

        try {
            if (selected.has(seat.id)) {
                await api.post("/seats/unlock", {seatId: seat.id, showTimeId});
                setSelected((p) => {
                    const n = new Set(p);
                    n.delete(seat.id);
                    return n;
                });
            } else if (seat.status === "AVAILABLE") {
                await api.post("/seats/lock", {seatId: seat.id, showTimeId});
                setSelected((p) => new Set(p).add(seat.id));
            }
        } catch {
            message.error("Lỗi thao tác ghế");
        } finally {
            setDisabledSeats((p) => {
                const n = new Set(p);
                n.delete(seat.id);
                return n;
            });
        }
    };

    const total = useMemo(
        () =>
            seats
                .filter((s) => selected.has(s.id))
                .reduce((sum, s) => sum + (s.price || 0), 0),
        [selected, seats]
    );

    if (loading) return <Spin/>;

    const colMax = Math.max(...seats.map((s) => s.colIdx));
    const chosenNames = [...selected]
        .map((id) => seats.find((s) => s.id === id)?.seatNumber)
        .filter(Boolean)
        .join(", ");

    const checkBookingStatus = async (bookingId, maxAttempts = 10, intervalMs = 1000) => {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const { data } = await api.get(`/bookings/status/${bookingId}`);
                if (typeof data === "string" && data.includes("CONFIRMED")) {
                    return true;
                }
            } catch (e) {
                console.warn("Error checking booking status:", e);
            }

            await new Promise((r) => setTimeout(r, intervalMs));
        }
        return false;
    };

    const handlePayment = async () => {
        const seatIds = [...selected];
        if (!seatIds.length) return;
        setIsProcessing(true);
        try {
            const comboList = Object.entries(selectedCombos)
                .filter(([_, qty]) => qty > 0)
                .map(([comboId, quantity]) => ({
                    comboId: parseInt(comboId),
                    quantity,
                }));

            const bookingRes = await api.post("/bookings/create", {
                showTimeId: parseInt(showTimeId),
                seatIds,
                comboItems: comboList,
            });


            const { bookingId, amount } = bookingRes.data;

            const isConfirmed = await checkBookingStatus(bookingId);
            if (!isConfirmed) {
                message.error("Đặt vé thất bại. Vui lòng thử lại sau.");
                return;
            }

            const paymentRes = await api.post("/payment/create", {
                bookingId,
                returnUrl: `${window.location.origin}/vnpay-return`
            });

            const { paymentUrl } = paymentRes.data;

            window.location.href = paymentUrl;

        } catch (e) {
            console.error("Lỗi khi thanh toán:", e);
            message.error("Không thể thanh toán. Vui lòng thử lại.");
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <div className="booking-wrapper">
            <div className="booking-head">
                <div>
                    <div style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
                        {showtime.movie?.title}
                    </div>
                    <div>
                        Giờ chiếu: <b>{new Date(showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</b>
                    </div>
                </div>
                {/*<div className="countdown">*/}
                {/*    Còn {mm}:{ss}*/}
                {/*</div>*/}
            </div>
            <div className="screen"/>
            <div
                className="seat-map"
                style={{ gridTemplateColumns: `repeat(${colMax + 1}, 48px)` }}
            >
                {seats.map((seat) => (
                    <div
                        key={seat.id}
                        className={cls(
                            "seat",
                            seat.seatType?.toLowerCase(),
                            seat.status?.toLowerCase(),
                            selected.has(seat.id) && "selected"
                        )}
                        onClick={() => handleClick(seat)}
                    >
                        {seat.seatNumber}
                    </div>
                ))}
            </div>

            <div className="legend">
                <Tag color="#4b5563">Đã đặt</Tag>
                <Tag color="#60a5fa">Bạn chọn</Tag>
                <Tag color="#2563eb">Thường</Tag>

                <Tag color="#f59e0b">VIP</Tag>
                <Tag color="#e11d48">Đôi</Tag>
                <Tag color="#22c55e">Trẻ em</Tag>
                <Tag color="#a855f7">Người già</Tag>

            </div>

            <div style={{ color: "#fff", marginTop: 16, fontSize: 16 }}>
                <div><b>Ghế đã chọn:</b> {chosenNames || "—"}</div>
                <div><b>Tổng tiền ghế:</b> {total.toLocaleString("vi-VN")} đ</div>
                <div><b>Tổng tiền combo:</b> {totalCombo.toLocaleString("vi-VN")} đ</div>
                <div style={{ marginTop: 8, fontSize: 18 }}>
                    <b style={{ color: "#00e676" }}>Tổng cộng:</b> {(total + totalCombo).toLocaleString("vi-VN")} đ
                </div>
            </div>

            <Button
                className="custom-cancel-btn"
                onClick={() => setIsFoodModalOpen(true)}
            >
                Chọn combo
            </Button>
            <Button
                type="primary"
                className="login-submit"
                disabled={!selected.size}
                style={{ marginTop: 12 }}
                onClick={handlePayment}
                loading={isProcessing}
            >
                Thanh toán
            </Button>

            <Modal
                className="custom-login-modal"
                open={isFoodModalOpen}
                footer={
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button
                            className="custom-cancel-btn"
                            onClick={() => setIsFoodModalOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            className="login-submit"
                            onClick={() => setIsFoodModalOpen(false)}
                        >
                            Xác nhận
                        </Button>
                    </div>
                }

                onCancel={() => setIsFoodModalOpen(false)}
            >
                <h2>Chọn đồ ăn & combo</h2>
                {combos.map((combo) => (
                    <div key={combo.id} style={{ display: "flex", marginBottom: 16, gap: 12 }}>
                        <img
                            src={combo.imageUrl}
                            alt={combo.name}
                            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500 }}>{combo.name}</div>
                            <div style={{ marginBottom: 8 }}>{combo.description}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span>{combo.price.toLocaleString("vi-VN")} đ</span>
                                <Button
                                    onClick={() =>
                                        setSelectedCombos((prev) => ({
                                            ...prev,
                                            [combo.id]: Math.max((prev[combo.id] || 0) - 1, 0),
                                        }))
                                    }
                                >-</Button>
                                <span>{selectedCombos[combo.id] || 0}</span>
                                <Button
                                    onClick={() =>
                                        setSelectedCombos((prev) => ({
                                            ...prev,
                                            [combo.id]: (prev[combo.id] || 0) + 1,
                                        }))
                                    }
                                >+</Button>
                            </div>
                        </div>
                    </div>
                ))}

                <div style={{ marginTop: 16, fontWeight: 500 }}>
                    Tổng tiền combo: {totalCombo.toLocaleString("vi-VN")} đ
                </div>
            </Modal>


        </div>
    );
}
