import { useEffect, useState } from "react";
import { Result, Spin } from "antd";

export default function VnpayReturn() {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        fetch(`http://localhost:8080/api/payment/vnpay-return?${params.toString()}`)
            .then((res) => res.text())
            .then((msg) => setStatus(msg))
            .catch(() => setStatus("An error occurred while confirming the payment."));
    }, []);

    if (!status) {
        return (
            <div style={{ textAlign: "center", marginTop: 100 }}>
                <Spin size="large" tip="Processing transaction..." />
            </div>
        );
    }

    const isSuccess = status.toLowerCase().includes("success");

    return (
        <div style={{ marginTop: 100, textAlign: "center" }}>
            <Result
                status={isSuccess ? "success" : "error"}
                title={isSuccess ? "Payment Successful!" : "Payment Failed!"}
                subTitle={status}
            />
        </div>
    );
}
