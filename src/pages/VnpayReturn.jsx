import { useEffect, useState } from "react";
import {Button, Result, Spin} from "antd";
import {useNavigate} from "react-router-dom";

export default function VnpayReturn() {
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        fetch(`http://localhost:8080/api/payment/vnpay-return?${params.toString()}`)
            .then((res) => res.text())
            .then(async (msg) => {
                setStatus(msg);
                console.log("Kết quả thanh toán:", msg);
            })
            .catch(() => setStatus("An error occurred while confirming the payment."));
    }, []);


    if (!status) {
        return (
            <div style={{ textAlign: "center", marginTop: 100 }}>
                <Spin size="large" tip="Processing transaction..." />
            </div>
        );
    }

    const params = new URLSearchParams(window.location.search);
    const responseCode = params.get("vnp_ResponseCode");
    const isSuccess = responseCode === "00";


    return (
        <div style={{ marginTop: 100, textAlign: "center" }}>
            <Result
                style={{ color: "#ffffff" }}
                status={isSuccess ? "success" : "error"}
                title={
                    <span style={{ color: "#ffffff" }}>
            {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
        </span>
                }
                subTitle={<span style={{ color: "#cccccc" }}>{status}</span>}
                extra={[
                    <Button
                        key="home"
                        type="primary"
                        onClick={() => navigate("/")}
                        style={{ width: "fit-content", padding: "0 12px", fontSize: 13 }}
                    >
                        Trang chủ
                    </Button>,
                    isSuccess && (
                        <Button
                            key="mybookings"
                            onClick={() => navigate("/profile")}
                            style={{ width: "fit-content", padding: "0 12px", fontSize: 13 }}
                        >
                            Vé của tôi
                        </Button>
                    )
                ]}
            />

        </div>
    );
}
