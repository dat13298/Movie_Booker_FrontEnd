// src/pages/TestPaymentPage.jsx
import React from "react";
import PaymentStatusListener from "../components/PaymentStatusListener";

const TestPaymentPage = () => {
    const bookingId = "1";

    return (
        <div>
            <h2>🧪 Đang nghe trạng thái thanh toán cho Booking: {bookingId}</h2>
            <PaymentStatusListener bookingId={bookingId} />
        </div>
    );
};

export default TestPaymentPage;
