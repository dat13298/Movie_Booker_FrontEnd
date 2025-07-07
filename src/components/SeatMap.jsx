import React, { useEffect, useState, useMemo } from "react";
import { Button, Tag, Spin, message } from "antd";
import { Client } from "@stomp/stompjs";
import cls from "classnames";
import api from "@/api/axios";
import "./SeatMap.css";

export default function SeatMap({ showTimeId }) {
    const [seats, setSeats] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [cd, setCd] = useState(600);
    const [loading, setLoading] = useState(true);
    const [disabledSeats, setDisabledSeats] = useState(new Set());

    const getValidAccessToken = async () => {
        try {
            await api.get("/auth/ping");
        } catch (e) {
            console.log("checking token", e);
        }
        return localStorage.getItem("accessToken");
    };

    useEffect(() => {(async () => {
            try {
                await getValidAccessToken();
                const { data } = await api.get(`/show-times/${showTimeId}/seats`);
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
        let stompClient;

        const connectWebSocket = async () => {
            const token = await getValidAccessToken();

            stompClient = new Client({
                brokerURL: "ws://localhost:8080/ws/websocket",
                connectHeaders: { Authorization: `Bearer ${token}` },
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
                                return { ...s, status: newStatus };
                            })
                        );

                        if (evt.type === "LOCKED" || evt.type === "BOOKED") {
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
                await api.post("/seats/unlock", { seatId: seat.id, showTimeId });
                setSelected((p) => {
                    const n = new Set(p);
                    n.delete(seat.id);
                    return n;
                });
            } else if (seat.status === "AVAILABLE") {
                await api.post("/seats/lock", { seatId: seat.id, showTimeId });
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

    if (loading) return <Spin />;

    const colMax = Math.max(...seats.map((s) => s.colIdx));
    const chosenNames = [...selected]
        .map((id) => seats.find((s) => s.id === id)?.seatNumber)
        .filter(Boolean)
        .join(", ");

    return (
        <div className="booking-wrapper">
            <div className="booking-head">
        <span>
          Giờ chiếu: <b>22:25</b>
        </span>
                <div className="countdown">
                    Còn {mm}:{ss}
                </div>
            </div>

            <div className="screen" />

            <div
                className="seat-map"
                style={{ gridTemplateColumns: `repeat(${colMax}, 48px)` }}
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
                <Tag color="#374151">Thường</Tag>
                <Tag color="#f59e0b">VIP</Tag>
                <Tag color="#e11d48">Đôi</Tag>
            </div>

            <div style={{ color: "#fff", marginTop: 16 }}>
                Ghế đã chọn: {chosenNames || "—"}
                <br />
                Tổng tiền: {total.toLocaleString("vi-VN")} đ
            </div>

            <Button type="primary" disabled={!selected.size} style={{ marginTop: 12 }}>
                Thanh toán
            </Button>
        </div>
    );
}
