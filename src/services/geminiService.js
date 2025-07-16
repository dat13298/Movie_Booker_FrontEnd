const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function fetchGeminiResponse(message) {
    const promptSystem = `
Bạn là một trợ lý AI hỗ trợ người dùng đặt vé xem phim. Nhiệm vụ của bạn là **phân tích yêu cầu của người dùng** và **trả về một JSON hợp lệ** với cấu trúc sau:

{
  "intent": "booking" | "showing_list" | "other",
  "movie": "tên phim hoặc null nếu không rõ",
  "reply": "câu trả lời lịch sự dành cho người dùng"
}

**Giải thích các intent:**
- Nếu người dùng muốn **đặt vé một bộ phim cụ thể** → "intent": "booking"
- Nếu người dùng muốn **xem danh sách phim đang chiếu** → "intent": "showing_list"
- Nếu người dùng hỏi về **giá vé, review, mô tả, chính sách, hoàn vé** hoặc các vấn đề khác → "intent": "other"

- ⚠️ Nếu người dùng hỏi về **hoàn vé hoặc hoàn tiền**, hãy trả lời lịch sự rằng *vé đã mua không thể hoàn trả theo chính sách của rạp*.

⚠️ **Chỉ trả về đúng đối tượng JSON.** Không được viết thêm bất kỳ mô tả, markdown, hay ký tự thừa nào ngoài JSON hợp lệ.

---

Câu hỏi của người dùng: ${message}
`;



    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;
    const requestBody = {
        contents: [
            {
                role: "user",
                parts: [{ text: promptSystem }],
            },
        ],
    };

    console.log("📤 Request URL:", url);
    console.log("📦 Request Body:", JSON.stringify(requestBody, null, 2));

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`Lỗi Gemini API: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log("📥 Full Gemini API Response:", result);

        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Không có nội dung trả về từ Gemini");

        console.log("🔍 Extracted Gemini Text:", text);

        let cleanText = text.trim();
        if (cleanText.startsWith("```json")) {
            cleanText = cleanText.replace(/^```json/, "").replace(/```$/, "").trim();
        }

        const parsed = JSON.parse(cleanText);
        console.log("✅ Parsed JSON Output:", parsed);
        return parsed;
    } catch (error) {
        console.warn("⚠️ Không parse được JSON từ Gemini hoặc lỗi khác:", error);
        return {
            intent: "other",
            movie: null,
            reply:
                "Hệ thống đang gặp sự cố hoặc quá tải. Vui lòng thử lại sau vài phút nhé!",
        };
    }
}
