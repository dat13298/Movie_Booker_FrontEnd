import React, { useState, useEffect } from "react";
import CategorySelector from "@/components/CategorySelector.jsx";
import {Button, Col, message, Modal, Radio, Row} from "antd";
import api from "@/api/axios.js";
import "@/index.css";import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/auth/AuthProvider.jsx";

export default function Coupons() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [brands, setBrands] = useState([]);
    const [selectedBrandId, setSelectedBrandId] = useState(null);
    const [gifts, setGifts] = useState([]);
    const [giftDetailVisible, setGiftDetailVisible] = useState(false);
    const [giftDetail, setGiftDetail] = useState(null);
    const [selectedPriceId, setSelectedPriceId] = useState(null);
    const [redeemLoading, setRedeemLoading] = useState(false);
    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            message.warning("Vui lòng đăng nhập để sử dụng chức năng này", 2);
            setTimeout(() => {
                navigate("/");
            }, 2000);
        }
    }, [userInfo, navigate]);

    useEffect(() => {
        if (selectedCategory === "all") {
            setBrands([]);
            return;
        }

        api.get("/partner/brands/by-category", {
            params: { categoryId: selectedCategory },
        }).then((res) => {
            console.log("log coupon",res.data);
            setBrands(res.data.data || []);
        });
    }, [selectedCategory]);

    const handleBrandClick = (brand) => {
        // Toggle brand
        if (brand.brandId === selectedBrandId) {
            setSelectedBrandId(null);
            setGifts([]);
            return;
        }

        setSelectedBrandId(brand.brandId);
        api.get("/partner/gifts", {
            params: {
                categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
                brandId: brand.brandId,
            },
        }).then((res) => {
            setGifts(res.data.data.productList || []);
            console.log(res.data.data);
        });
    };

    const handleGiftClick = (productId) => {
        api.get("/partner/gift-detail", {
            params: { productId },
        }).then((res) => {
            const detail = res.data.data?.[0]; // Vì API trả về List
            if (detail) {
                setGiftDetail(detail);
                setGiftDetailVisible(true);
                setSelectedPriceId(detail.prices?.[0]?.priceId || null);
            }
            console.log(res);
        });
    };

    const handleRedeemVoucher = () => {
        if (!giftDetail || !selectedPriceId) return;

        const selectedPrice = giftDetail.prices.find(p => p.priceId === selectedPriceId);
        if (!selectedPrice) return;

        setRedeemLoading(true);

        api.post("/partner/redeem-voucher", {
            giftId: giftDetail.productId,
            priceId: selectedPrice.priceId,
            priceValue: selectedPrice.priceValue,
        })
            .then((res) => {
                const raw = res.data;

                if (raw.code === 200) {
                    Modal.success({
                        title: "🎉 Đổi voucher thành công",
                        content: raw.data || "Bạn đã đổi điểm thành công!",
                    });
                    setGiftDetailVisible(false);
                } else {
                    Modal.error({
                        title: "❌ Đổi voucher thất bại",
                        content: raw.message || "Có lỗi xảy ra khi đổi điểm",
                    });
                }
            })
            .catch((err) => {
                Modal.error({
                    title: "❌ Lỗi hệ thống",
                    content: err.response?.data?.message || "Không thể kết nối tới máy chủ.",
                });
            })
            .finally(() => {
                setRedeemLoading(false);
            });
    };


    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
            <h2>Thương hiệu</h2>
            <CategorySelector
                selectedId={selectedCategory}
                onSelect={(id) => {
                    setSelectedBrandId(null);
                    setSelectedCategory(id);
                }}
            />

            <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                {brands.map((brand) => (
                    <React.Fragment key={brand.brandId}>
                        <Col
                            xs={24}
                            sm={12}
                            md={8}
                            lg={6}
                            xl={4}
                            style={{ display: "flex", justifyContent: "center" }}
                        >
                            <div
                                onClick={() => handleBrandClick(brand)}
                                style={{
                                    width: "100%",
                                    maxWidth: 180,
                                    border: "1px solid #eee",
                                    borderRadius: 12,
                                    padding: 16,
                                    textAlign: "center",
                                    backgroundColor: "#fff",
                                    cursor: "pointer",
                                    boxShadow:
                                        selectedBrandId === brand.brandId ? "0 0 8px rgba(0,0,0,0.1)" : "none",
                                }}
                            >
                                <div
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        margin: "0 auto",
                                        background: "#f9f9f9",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <img
                                        src={brand.brandLogo}
                                        alt={brand.brandNm}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                                <div
                                    style={{
                                        marginTop: 10,
                                        fontSize: "0.9rem",
                                        fontWeight: "500",
                                        color: "#333",
                                    }}
                                >
                                    {brand.brandNm}
                                </div>
                            </div>
                        </Col>

                        {selectedBrandId === brand.brandId && (
                            <Col span={24}>
                                <div
                                    style={{
                                        backgroundColor: "#f0f6ff",
                                        borderRadius: 10,
                                        padding: 20,
                                        marginTop: 10,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "1rem",
                                            fontWeight: 600,
                                            marginBottom: 16,
                                            color: "#333",
                                        }}
                                    >
                                        🎁 Danh sách voucher - {brand.brandNm}
                                    </div>
                                    <Row gutter={[16, 16]}>
                                        {gifts.length === 0 ? (
                                            <Col span={24} style={{ textAlign: "center", padding: 10 }}>
                                                Không có quà nào.
                                            </Col>
                                        ) : (
                                            gifts.map((gift) => (
                                                <Col key={gift.productId} xs={24} sm={12} md={8} lg={6}>
                                                    <div
                                                        onClick={() => handleGiftClick(gift.productId)}
                                                        style={{
                                                            border: "1px solid #ccc",
                                                            borderRadius: 10,
                                                            padding: 10,
                                                            backgroundColor: "#fff",
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <img
                                                            src={gift.productImg}
                                                            alt={gift.productNm}
                                                            style={{
                                                                width: 100,
                                                                height: 100,
                                                                borderRadius: 8,
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                        <div
                                                            style={{
                                                                marginTop: 8,
                                                                fontWeight: "bold",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {gift.productNm}
                                                        </div>
                                                        <div style={{ color: "#ff4b2b", marginTop: 4 }}>
                                                            {gift.prices?.map((p) => p.priceNm).join(", ")}
                                                        </div>
                                                    </div>
                                                </Col>
                                            ))
                                        )}
                                    </Row>
                                </div>
                            </Col>
                        )}
                    </React.Fragment>
                ))}
            </Row>
            {giftDetail && (
                <Modal
                    className="custom-login-modal"
                    open={giftDetailVisible}
                    onCancel={() => setGiftDetailVisible(false)}
                    centered
                    width={700}
                    footer={
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                            <Button
                                className="custom-cancel-btn"
                                onClick={() => setGiftDetailVisible(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                className="login-submit"
                                onClick={handleRedeemVoucher}
                                disabled={!selectedPriceId || redeemLoading}
                            >
                                {redeemLoading ? "Đang xử lý..." : "🎁 Đổi điểm"}
                            </Button>
                        </div>
                    }

                >
                <h2><span style={{ fontWeight: 700, fontSize: 20 }}>{giftDetail.productNm}</span></h2>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                        {/* LEFT: Ảnh voucher */}
                        <div style={{ flex: "1 1 220px", textAlign: "center" }}>
                            <img
                                src={giftDetail.productImg}
                                alt={giftDetail.productNm}
                                style={{
                                    width: 200,
                                    height: 200,
                                    objectFit: "cover",
                                    borderRadius: 12,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                }}
                            />
                            {giftDetail.productShortDesc && (
                                <div
                                    style={{
                                        marginTop: 12,
                                        fontStyle: "italic",
                                        fontSize: 14,
                                        color: "#888",
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {giftDetail.productShortDesc}
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Nội dung */}
                        <div style={{ flex: "2 1 360px" }}>
                            {/* Mệnh giá */}
                            {giftDetail.prices && giftDetail.prices.length > 0 && (
                                <div style={{ marginBottom: 20 }}>
                                    <div style={{ fontWeight: 600, marginBottom: 8 }}>Chọn mệnh giá:</div>
                                    <Radio.Group
                                        onChange={(e) => setSelectedPriceId(e.target.value)}
                                        value={selectedPriceId}
                                        style={{ display: "flex", flexDirection: "column", gap: 8 }}
                                    >
                                        {giftDetail.prices.map((p) => (
                                            <Radio
                                                key={p.priceId}
                                                value={p.priceId}
                                                style={{
                                                    padding: "6px 12px",
                                                    border: "1px solid #ddd",
                                                    borderRadius: 6,
                                                    backgroundColor: "#f9f9f9",
                                                    transition: "all 0.2s",
                                                }}
                                            >
                                                💰 {p.priceNm || `${p.priceValue.toLocaleString()}đ`}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                </div>
                            )}

                            {/* Mô tả HTML */}
                            {giftDetail.productDesc && (
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: 8 }}>Mô tả chi tiết:</div>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: giftDetail.productDesc }}
                                        style={{
                                            padding: "10px",
                                            backgroundColor: "#f5f7fa",
                                            borderRadius: 8,
                                            maxHeight: 200,
                                            overflowY: "auto",
                                            lineHeight: 1.6,
                                            fontSize: 14,
                                            color: "#333",
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>

            )}
        </div>
    );
}
