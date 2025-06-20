// PaymentStatusListener.jsx
import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const PaymentStatusListener = ({ bookingId }) => {
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws"); // đổi nếu cổng backend khác
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected to WebSocket");

                stompClient.subscribe(`/topic/booking-status/${bookingId}`, (message) => {
                    const status = message.body;
                    console.log("Payment status:", status);

                    if (status === "SUCCESS") {
                        alert("🎉 Thanh toán thành công!");
                        // redirect hoặc load lại lịch sử đặt vé
                    } else if (status === "FAILED") {
                        alert("❌ Thanh toán thất bại. Vui lòng thử lại.");
                    }
                });
            },
        });

        stompClient.activate();

        return () => {
            if (stompClient.connected) stompClient.deactivate();
        };
    }, [bookingId]);

    return null;
};

export default PaymentStatusListener;
