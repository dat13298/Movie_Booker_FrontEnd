import React from "react";

export default function TicketPrice() {
    // return <div style={{ color: "white", padding: 32 }}>Trang GIÁ VÉ</div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-8 uppercase">
        Bảng Giá Vé
      </h1>

      <div className="text-sm leading-relaxed mb-6">
        <p>
          <strong>⚠️ Ghi chú:</strong> Giá vé có thể thay đổi vào các dịp lễ, tết hoặc suất chiếu đặc biệt. Vui lòng liên hệ phòng vé để biết thêm thông tin.
        </p>
      </div>

      <table className="w-full border border-gray-300 text-sm mb-8">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="border px-3 py-2">Đối tượng</th>
            <th className="border px-3 py-2">Giá vé 2D</th>
            <th className="border px-3 py-2">Giá vé 3D</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-3 py-2">Người lớn</td>
            <td className="border px-3 py-2">70.000đ</td>
            <td className="border px-3 py-2">100.000đ</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border px-3 py-2">Học sinh - Sinh viên</td>
            <td className="border px-3 py-2">55.000đ</td>
            <td className="border px-3 py-2">75.000đ</td>
          </tr>
          <tr>
          <td className="border px-3 py-2">Trẻ em (&lt; 1m3)</td>
            <td className="border px-3 py-2">50.000đ</td>
            <td className="border px-3 py-2">70.000đ</td>
          </tr>
        </tbody>
      </table>

      <div className="text-sm text-gray-600">
        <p>🎫 Đặt vé online qua ứng dụng hoặc website để được ưu đãi giá tốt.</p>
        <p>📞 Mọi thắc mắc xin liên hệ tổng đài: <strong>1900 123 456</strong></p>
      </div>
    </div>
  );
}


