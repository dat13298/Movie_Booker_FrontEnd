import React, { useEffect, useState } from "react";
import {
    Layout,
    Tabs,
    Card,
    Row,
    Col,
    Empty,
    Spin,
    message,
    Tag, Modal, QRCode, Button
} from "antd";
import api from "@/api/axios";
import dayjs from "dayjs";
import "@/index.css";

const { Content } = Layout;
const { TabPane } = Tabs;

export const MyCouponPage = () => {
    const [unusedCoupons, setUnusedCoupons] = useState([]);
    const [usedCoupons, setUsedCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [qrCodeData, setQrCodeData] = useState(null);
    const [loadingCouponId, setLoadingCouponId] = useState(null);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const [res1, res2] = await Promise.all([
                api.get("/v1/evouchers/unused"),
                api.get("/v1/evouchers/others"),
            ]);
            const unused = (res1.data.data || []).map((item) => ({
                ...item,
                status: "UNUSED",
            }));

            setUnusedCoupons(unused);
            setUsedCoupons(res2.data.data || []);
            console.log(res1.data.data);
            console.log(res2.data.data);
        } catch (err) {
            message.error("Không thể tải danh sách coupon");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleUseCoupon = (coupon) => {
        if (coupon.status !== "UNUSED") return;

        Modal.confirm({
            title: (
                <span style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
      ⚠️ Xác nhận sử dụng coupon?
    </span>
            ),
            className: "custom-login-modal",
            icon: null,
            centered: true,
            content: (
                <div className="modal-light-text" style={{ marginTop: 8 }}>
                    <p style={{ fontWeight: "bold" }}>{coupon.evoucherName}</p>
                    <p>Thương hiệu: {coupon.brandName}</p>
                    <p>Hạn sử dụng: {dayjs(coupon.expiryDate).format("DD/MM/YYYY")}</p>
                </div>
            ),
            okText: "Sử dụng",
            cancelText: "Huỷ",
            okButtonProps: {
                className: "login-submit",
                loading: loadingCouponId === coupon.id,
                style: { minWidth: 100 },
            },
            cancelButtonProps: {
                className: "custom-cancel-btn",
                style: { minWidth: 100 },
            },
            footer: (_, { OkBtn, CancelBtn }) => (
                <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                    <CancelBtn />
                    <OkBtn />
                </div>
            ),
            onOk: async () => {
                setLoadingCouponId(coupon.id);
                try {
                    const res = await api.post(`/v1/evouchers/${coupon.id}/use`);
                    const { serial, code } = res.data.data;
                    setQrCodeData({ serial, code });
                    message.success("Đã sử dụng coupon!");
                    fetchCoupons();
                } catch {
                    message.error("Không thể sử dụng coupon");
                } finally {
                    setLoadingCouponId(null);
                }
            }
        });
    };

    const renderCoupons = (coupons, status) => {
        if (!coupons.length) return <Empty description="Không có coupon" />;

        return (
            <Row gutter={[16, 16]} justify="center">
                {coupons.map((coupon) => (
                    <Col xs={24} sm={18} md={14} lg={12} xl={10} key={coupon.id}>
                        <Card
                            hoverable={coupon.status === "UNUSED"}
                            onClick={() => loadingCouponId ? null : handleUseCoupon(coupon)}
                            style={{
                                cursor: coupon.status === "UNUSED" ? "pointer" : "not-allowed",
                                opacity: coupon.status === "UNUSED" ? 1 : 0.6,
                                // minWidth: 350,
                            }}
                        >
                            <div style={{ display: "flex", gap: 12 }}>
                                <img
                                    alt="coupon"
                                    src={coupon.imgUrl}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        objectFit: "contain",
                                        borderRadius: 8,
                                        backgroundColor: "#fff",
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0 }}>{coupon.evoucherName}</h3>
                                    <p style={{ margin: 0 }}>
                                        <strong>Thương hiệu:</strong> {coupon.brandName}
                                    </p>
                                    <p style={{ margin: 0 }}>
                                        <strong>Hạn sử dụng:</strong> {dayjs(coupon.expiryDate).format("DD/MM/YYYY")}
                                    </p>
                                    <Tag
                                        color={status === "UNUSED" ? "green" : "red"}
                                        style={{ marginTop: 8 }}
                                    >
                                        {status === "UNUSED" ? "Chưa sử dụng" : "Đã sử dụng / Hết hạn"}
                                    </Tag>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    };


    return (
        <Layout style={{ padding: "24px", backgroundColor: "transparent" }}>
            <Content
                style={{
                    backgroundColor: "transparent",
                    width: "100%",
                    maxWidth: "1200px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    padding: "0 24px",
                }}
            >


            <h2 style={{ marginBottom: 16, color: "#fff" }}>🎟️ Kho Coupon Của Tôi</h2>
                <Tabs defaultActiveKey="1" className="custom-dark-tabs">
                <TabPane tab="Chưa sử dụng" key="1">
                        {loading ? <Spin /> : renderCoupons(unusedCoupons, "UNUSED")}
                    </TabPane>
                    <TabPane tab="Đã sử dụng / Hết hạn" key="2">
                        {loading ? <Spin /> : renderCoupons(usedCoupons, "USED")}
                    </TabPane>
                </Tabs>
            </Content>
            <Modal
                open={!!qrCodeData}
                onCancel={() => setQrCodeData(null)}
                title="Mã QR của bạn"
                centered
                footer={
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button
                            onClick={() => setQrCodeData(null)}
                        >
                            Đóng
                        </Button>
                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText(qrCodeData.code);
                                message.success("Đã sao chép mã!");
                            }}
                        >
                            Sao chép mã
                        </Button>
                    </div>
                }
                bodyStyle={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                    textAlign: "center",
                }}
            >
                {qrCodeData && (
                    <>
                        <QRCode value={qrCodeData.serial} size={200} />
                        <p style={{ marginTop: 16 }}>
                            <strong>Mã Serial:</strong> {qrCodeData.serial}
                        </p>
                        <p>
                            <strong>Mã Code:</strong> {qrCodeData.code}
                        </p>
                    </>
                )}
            </Modal>

        </Layout>
    );
};
