import React, { useState } from 'react';

const buttonStyle = (isActive) => ({
    padding: '6px 7px',
    fontSize: '15px',
    borderRadius: '999px',
    border: '1px solid #333',
    background: isActive ? 'linear-gradient(to right, #e50914, #ff6a00)' : 'transparent',
    color: isActive ? '#fff' : '#eee',
    fontWeight: 500,
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.3s ease',

});

export default function PolicyPage() {
    const [activeTab, setActiveTab] = useState('privacy');

    return (
        <div style={{ padding: '40px 24px', color: '#eee', background: '#0f111a', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Chính Sách</h1>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
                <button
                    style={buttonStyle(activeTab === 'privacy')}
                    onClick={() => setActiveTab('privacy')}
                >
                    Chính sách bảo mật
                </button>
                <button
                    style={buttonStyle(activeTab === 'payment')}
                    onClick={() => setActiveTab('payment')}
                >
                    Chính sách thanh toán
                </button>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto', lineHeight: '1.8', fontSize: '16px' }}>
                {activeTab === 'privacy' && (
                    <div>
                        <h2>1. Mục đích và phạm vi thu thập thông tin</h2>
                        <p>1.1. Việc thu thập thông tin cá nhân được thực hiện trên cơ sở khách hàng tự khai báo... (toàn bộ nội dung như bạn đã gửi)</p>
                        {/* Bạn có thể chia nhỏ thêm bằng <p> hoặc <ul> nếu muốn */}
                        <h2>2. Phạm vi sử dụng thông tin</h2>
                        <p>2.1. Trung tâm Chiếu phim Quốc gia chỉ sử dụng thông tin cá nhân... </p>
                        <h2>3. Thời gian lưu trữ thông tin</h2>
                        <p>Dữ liệu cá nhân cơ bản của khách hàng đăng ký thành viên...</p>
                        <h2>4. Cách thức chỉnh sửa dữ liệu cá nhân</h2>
                        <p>Khách hàng có thể tự đăng nhập và chỉnh sửa thông tin...</p>
                        <h2>5. Trung tâm Chiếu phim Quốc gia cam kết</h2>
                        <p>5.1. Mọi thông tin cá nhân của khách hàng thu thập được từ website...</p>
                        {/* Bạn có thể thêm các <p> khác nếu muốn */}
                    </div>
                )}

                {activeTab === 'payment' && (
                    <div>
                        <h2>Chính sách thanh toán</h2>
                        <p>Xin vui lòng đọc các điều khoản sau cẩn thận trước khi sử dụng dịch vụ thanh toán trực tuyến...</p>
                        <h3>1. Đối tượng áp dụng</h3>
                        <p>Chương trình thanh toán online chỉ áp dụng cho các suất chiếu quy định...</p>
                        <h3>2. Chính sách Hoàn Vé hay Đổi Vé</h3>
                        <p>Trung tâm Chiếu phim Quốc gia không chấp nhận hoàn tiền hoặc đổi vé...</p>
                        <h3>3. Thư và tin nhắn xác nhận đặt vé</h3>
                        <p>Sau khi hoàn thành việc thanh toán vé trực tuyến...</p>
                        <h3>4. Nhận Vé</h3>
                        <p>Hiện tại chúng tôi chưa có dịch vụ hủy hoặc thay đổi thông tin vé thanh toán trực tuyến...</p>
                        <h3>5. Phí Đặt Vé</h3>
                        <p>Những vé thanh toán trên website sẽ phải chấp nhận một phụ phí không hoàn lại...</p>
                        <h3>6. Phân Loại Phim</h3>
                        <p>Mức độ phổ biến phim được Cục Điện Ảnh duyệt...</p>
                        <h3>7. Thuế Giá Trị Gia Tăng</h3>
                        <p>Thuế GTGT được áp dụng cho tất cả các mặt hàng và dịch vụ...</p>
                        <h3>8. Chức năng chống gian lận</h3>
                        <p>Trung tâm sử dụng các công nghệ đặc biệt để nhận biết các hoạt động giả mạo...</p>
                        <h3>9. Sử dụng thẻ tín dụng/ thẻ ghi nợ</h3>
                        <p>Nếu bạn phát hiện thẻ của mình bị sử dụng giả mạo...</p>
                        <h3>10. Cảnh Báo An Ninh</h3>
                        <p>Chúng tôi sẽ hết sức cố gắng sử dụng mọi biện pháp để đảm bảo an toàn thông tin cá nhân...</p>
                        <h3>LIÊN HỆ</h3>
                        <p>Các bạn có thể liên hệ với chúng tôi theo số điện thoại: 0123456789 để được hỗ trợ thêm.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
