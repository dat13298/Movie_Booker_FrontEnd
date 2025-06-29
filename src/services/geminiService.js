const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function fetchGeminiResponse(message) {
    const promptSystem = `
Bạn là trợ lý AI hỗ trợ người dùng đặt vé xem phim.

Khi nhận câu hỏi từ người dùng, bạn cần phản hồi một đối tượng JSON như sau:

{
  "intent": "booking" | "other",
  "movie": "tên phim hoặc null nếu không rõ",
  "reply": "phản hồi lịch sự dành cho người dùng"
}

Nếu người dùng muốn đặt vé, intent là "booking".
Nếu chỉ hỏi về review, thông tin phim thì intent là "other".

Chỉ trả về JSON. Không được thêm mô tả, giải thích hoặc ký tự dư thừa.

Câu hỏi: ${message}
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
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

        const result = await response.json();
        console.log("📥 Full Gemini API Response:", result);

        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        console.log("🔍 Extracted Gemini Text:", text);

        // Làm sạch nếu có ```json ... ```
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
            reply: "Xin lỗi, tôi chưa hiểu rõ. Bạn có thể hỏi lại cụ thể hơn không?",
        };
    }
}
