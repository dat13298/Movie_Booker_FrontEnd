import React, { useState } from "react";

const faqs = [
    {
        question: "1. Cách thức mua vé online và nhận mã vé nhanh chóng",
        answer: (
            <div>
                <h3>CÁCH MUA VÉ ONLINE</h3>
                <p><strong>1. Mua vé qua App NCC:</strong><br />
                    Đăng nhập &gt; Chọn phim &gt; Nhấn “Đặt vé” &gt; Chọn ngày chiếu & giờ chiếu &gt; Chọn ghế &gt; Nhấn “Đặt vé” &gt; Chọn hình thức thanh toán &gt; Tiến hành thanh toán.
                </p>
                <p><strong>2. Mua vé online trên Website:</strong><br />
                    Đăng nhập &gt; Chọn phim tại mục “Phim đang chiếu” &gt; Chọn ngày & giờ chiếu &gt; Chọn ghế &gt; Nhấn “Thanh toán” &gt; Check lại thông tin vé &gt; Chọn hình thức thanh toán &gt; Tiến hành thanh toán.
                </p>
                <p><strong>3. Mua vé trên Ví điện tử và App của các ngân hàng:</strong><br />
                    Đăng nhập app ngân hàng &gt; Chọn mục mua vé xem phim &gt; Chọn phim &gt; Nhấn “Đặt vé” &gt; Chọn ngày chiếu &gt; Chọn logo Trung tâm Chiếu phim Quốc gia (55k) &gt; Chọn giờ chiếu phim &gt; Chọn ghế &gt; Nhấn “Tiếp tục” &gt; Check lại thông tin vé &gt; Nhập email &gt; Nhập mã giảm giá (nếu có) &gt; Nhấn “Đặt vé”.
                </p>
                <h3>CÁCH NHẬN MÃ VÉ</h3>
                <p><strong>Mã QR:</strong> dùng hình ảnh lên thẳng phòng chiếu hoặc có thể in vé giấy nếu muốn.<br />
                    <strong>Mã CODE:</strong> vui lòng in vé giấy tại máy bán vé tự động.
                </p>
                <p><strong>1. App NCC:</strong> Trong app, email, SMS.<br />
                    <strong>2. Website:</strong> "Lịch sử mua vé", email, SMS.<br />
                    <strong>3. Ví điện tử:</strong> "Vé đã mua", email.
                </p>
                <h3>LƯU Ý</h3>
                <p>• Bạn có 5 phút để giữ ghế đến khi hoàn tất giao dịch.</p>
                <p>• Danh sách ngân hàng hỗ trợ: VNPay, Agribank, Vietcombank, BIDV, SCB, ZaloPay, VietCredit, v.v.</p>
            </div>
        )
    },
    {
        question: "2. Xem phim tại NCC cần tuân thủ các quy định nào?",
        answer: (
            <div>
                <ul>
                    <li>Không vào muộn quá 20 phút.</li>
                    <li>Không quay phim, chụp ảnh, hút thuốc, gây ảnh hưởng.</li>
                    <li>Không mang thú nuôi, đồ ăn ngoài. Chỉ mang bắp và nước.</li>
                    <li>Tuân thủ phân loại phim P, K, T13, T16, T18, C.</li>
                    <li>Xuất trình giấy tờ chứng minh độ tuổi khi được yêu cầu.</li>
                    <li>Vi phạm có thể bị phạt tiền theo Nghị định 128/2022/NĐ-CP.</li>
                </ul>
            </div>
        )
    },
    {
        question: "3. Không áp dụng các chế độ ưu đãi, chương trình khuyến mại vào thời gian nào?",
        answer: "Không áp dụng vào ngày 20/10, 20/11, 31/10, các ngày Lễ, Tết, suất chiếu sớm, suất chiếu đặc biệt."
    },
    {
        question: "4. Vé đã thanh toán có thể hủy hoặc thay đổi không?",
        answer: "Không hỗ trợ hủy hoặc thay đổi vé đã thanh toán."
    },
    {
        question: "5. Liên hệ với ai trong trường hợp thuê phòng tổ chức Hội nghị và các dịch vụ khác?",
        answer: "Liên hệ Phòng Dịch vụ: 0243.5142856"
    },
    {
        question: "6. Phòng chiếu có màn ảnh lớn nhất Việt Nam là phòng số mấy?",
        answer: "Phòng chiếu số 1."
    },
    {
        question: "7. Có các hình thức bán vé nào?",
        answer: (
            <ul>
                <li>Hợp đồng khoán gọn</li>
                <li>Vé mở, vé tập thể, vé tự chọn vị trí, quầy vé online</li>
            </ul>
        )
    },
    {
        question: "8. Khi nào phải áp dụng giá vé ngày Lễ, Tết",
        answer: "Vào các ngày nghỉ Lễ, Tết theo quy định của Nhà nước và các ngày đặc biệt như 14/2, 8/3, 24/12, ngày nghỉ bù."
    },
    {
        question: "9. Chính sách giá vé cho các đối tượng khán giả như thế nào?",
        answer: (
            <div>
                <p>• Giảm 20% cho trẻ em, người cao tuổi, người có công, người hoàn cảnh khó khăn.</p>
                <p>• Giảm 50% cho người khuyết tật nặng.</p>
                <p>• Miễn phí cho trẻ dưới 0.7m đi cùng người lớn và người khuyết tật đặc biệt nặng.</p>
                <p><strong>Lưu ý:</strong> Chỉ áp dụng tại quầy, phải xuất trình giấy tờ.</p>
            </div>
        )
    },
    {
        question: "10. Có những ưu đãi giá vé nào tại Trung tâm Chiếu phim Quốc gia?",
        answer: (
            <div>
                <p>• HSSV U22: vé 2D đồng giá 55.000đ từ T2–T6 (mua tại quầy, xuất trình thẻ).</p>
                <p>• T2 cuối tháng: đồng giá 50.000đ/vé 2D cho mọi đối tượng.</p>
            </div>
        )
    }
];

export default function Faqs() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div style={{ backgroundColor: "#0f111a", minHeight: "100vh", padding: "40px 16px", display: "flex", justifyContent: "center", color: "#fdd" }}>
            <div style={{ backgroundColor: "#1b1d2a", padding: "32px", borderRadius: "12px", maxWidth: "900px", width: "100%", boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)" }}>
                <h1 style={{ textAlign: "center", textTransform: "uppercase", fontSize: "24px", marginBottom: "24px" }}>Câu Hỏi Thường Gặp</h1>
                {faqs.map((item, index) => (
                    <div key={index} style={{ marginBottom: "12px" }}>
                        <div
                            onClick={() => toggle(index)}
                            style={{
                                cursor: "pointer",
                                backgroundColor: "#2a2d40",
                                padding: "16px 20px",
                                borderRadius: openIndex === index ? "8px 8px 0 0" : "8px",
                                fontWeight: "bold",
                                fontSize: "17px",
                                userSelect: "none",
                                transition: "all 0.2s"
                            }}
                        >
                            {openIndex === index ? "▼" : "▶"} {item.question}
                        </div>
                        {openIndex === index && (
                            <div style={{ padding: "12px 20px", backgroundColor: "#202233", borderRadius: "0 0 8px 8px" }}>
                                <div style={{ margin: 0 }}>{item.answer}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
