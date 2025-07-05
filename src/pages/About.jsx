import React from "react";
import '../styles/about.css';

export default function About() {
    return (
        <div className="about-container">
            <h1 className="about-title">Giới Thiệu</h1>

            <p className="about-paragraph">
                🎥 <strong>Cinema Theater</strong> là một đơn vị tiên phong trong lĩnh vực điện ảnh tại Việt Nam, hoạt động dưới sự quản lý của Bộ Văn hóa, Thể thao và Du lịch. Được thành lập từ năm 1997, chúng tôi không ngừng nỗ lực phát triển nhằm mang đến cho khán giả những trải nghiệm điện ảnh chất lượng cao và đầy cảm xúc.
            </p>

            <p className="about-paragraph">
                💡 Với sứ mệnh phổ biến các tác phẩm điện ảnh phục vụ nhiệm vụ chính trị, tuyên truyền các chủ trương, chính sách của Đảng và Nhà nước, Cinema Theater đóng vai trò là cầu nối giữa nghệ thuật điện ảnh và công chúng, góp phần nâng cao nhận thức xã hội qua từng bộ phim giá trị.
            </p>

            <p className="about-paragraph">
                💼 Bên cạnh đó, chúng tôi còn tổ chức các hoạt động chiếu phim thương mại, liên hoan phim, tuần lễ phim trong nước và quốc tế, tạo nên một không gian văn hóa đa dạng và sôi động dành cho những người yêu điện ảnh ở mọi lứa tuổi.
            </p>
        </div>
    );
}
