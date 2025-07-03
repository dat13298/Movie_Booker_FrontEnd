import React from "react";
import { Row, Col, Typography, Divider } from "antd";

const { Title, Text, Link } = Typography;

export default function Contact() {
    return (
        <div style={{ background: "#0f111a", color: "#fdd", padding: "48px 24px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <Title level={2} style={{ color: "#fdd", textAlign: "center", marginBottom: 40 }}>Liên Hệ</Title>

                <Row gutter={[32, 32]}>
                    {/* Cột trái: Thông tin liên hệ */}
                    <Col xs={24} md={12}>
                        <div style={{ color: "#fdd" }}>
                            <Title level={5} style={{ color: "#fdd" }}>TRỤ SỞ</Title>
                            <Text style={{ color: "#fdd" }}>
                                Số 87 Láng Hạ, Phường Thành Công, Quận Ba Đình, Tp.Hà Nội
                            </Text>

                            <Divider style={{ borderColor: "#333" }} />

                            <Title level={5} style={{ color: "#fdd" }}>HỖ TRỢ KHÁCH HÀNG</Title>
                            <Text style={{ color: "#fdd" }}>Hotline: 024.35141791</Text><br />
                            <Text style={{ color: "#fdd" }}>
                                Zalo: <Link style={{ color: "#40a9ff" }} href="https://oa.zalo.me/ttcpqg" target="_blank">https://oa.zalo.me/ttcpqg</Link>
                            </Text><br />
                            <Text style={{ color: "#fdd" }}>Giờ làm việc: 8:00 - 22:00</Text><br />
                            <Text style={{ color: "#fdd" }}>Tất cả các ngày bao gồm cả Lễ tết</Text><br />
                            <Text style={{ color: "#fdd" }}>Email hỗ trợ: </Text>

                            <Divider style={{ borderColor: "#333" }} />

                            <Title level={5} style={{ color: "#fdd" }}>LIÊN HỆ QUẢNG CÁO, TỔ CHỨC SỰ KIỆN, THUÊ RẠP</Title>
                            <Text style={{ color: "#fdd" }}>Phòng dịch vụ</Text><br />
                            <Text style={{ color: "#fdd" }}>Hotline: 024.35142856</Text><br />
                            <Text style={{ color: "#fdd" }}>Email: </Text>

                            <Divider style={{ borderColor: "#333" }} />

                            <Title level={5} style={{ color: "#fdd" }}>LIÊN HỆ MUA VÉ HỢP ĐỒNG</Title>
                            <Text style={{ color: "#fdd" }}>Phòng Chiếu phim và Trưng bày Điện Ảnh</Text><br />
                            <Text style={{ color: "#fdd" }}>Hotline: 024.35148647</Text><br />
                            <Text style={{ color: "#fdd" }}>Email: </Text>
                        </div>
                    </Col>

                    {/* Cột phải: Bản đồ Google Maps */}
                    <Col xs={24} md={12}>
                        <div
                            style={{
                                width: "100%",
                                height: 500,
                                border: "1px solid #333",
                                borderRadius: 8,
                                overflow: "hidden",
                            }}
                        >
                            <iframe
                                title="Địa điểm chỉ định"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4506469700446!2d106.65843017577755!3d10.776893759216316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b2d4f8c3d%3A0x693fc2bda4a61e8b!2zMTIzIMSQxrDhu51uZyBBQkMsIFF14buRYyAxLCBUUC5IQ00!5e0!3m2!1svi!2s!4v1719723571849!5m2!1svi!2s"
                            />

                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
