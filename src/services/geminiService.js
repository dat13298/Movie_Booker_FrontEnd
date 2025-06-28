const API_KEY = "AIzaSyA0SpH2QafPci6RG-TgzLBwpomPPl7o-qo";

export async function fetchGeminiResponse(message) {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;

    const requestBody = {
        contents: [{ parts: [{ text: message }] }],
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ AI.";
}
