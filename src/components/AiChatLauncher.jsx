// ChatWidget.jsx
import React, { useState, useRef, useEffect } from "react";
import { MessageOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchGeminiResponse } from "../services/geminiService";
import { movies } from "../data/fakeMovies";
import { slugify } from "@/utils/slugify";

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const historyRef = useRef(null);
    const navigate = useNavigate();

    const sampleQuestions = [
        "Làm sao để đặt vé?",
        "Phim nào đang chiếu hôm nay?",
        "Giá vé bao nhiêu?",
        "Tôi có được hoàn vé không?",
        "Trung tâm có ghế Couple không?",
        "Lịch chiếu hôm nay thế nào?",
    ];

    useEffect(() => {
        if (historyRef.current)
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }, [messages, loading]);

    const sendMessage = async (text = null) => {
        const userText = text || input;
        if (!userText.trim()) return;

        setInput("");
        setMessages((prev) => [...prev, { sender: "user", text: userText }]);
        setLoading(true);

        try {
            const res = await fetchGeminiResponse(userText);
            const found = movies.find((m) =>
                res.movie?.toLowerCase().includes(m.name.toLowerCase())
            );

            if (res.intent === "booking" && found) {
                setMessages((prev) => [
                    ...prev,
                    { sender: "ai", text: `Đang chuyển đến trang đặt vé cho phim "${found.name}"…` },
                ]);
                setTimeout(() => navigate(`/booking/${slugify(found.name)}`), 1500);
                return;
            }

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: res.reply || "Tôi chưa rõ bạn cần gì, bạn có thể hỏi lại nhé!",
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: "Đã xảy ra lỗi khi phản hồi. Vui lòng thử lại." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Nút mở chat */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    style={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        background: "linear-gradient(90deg,#ff416c,#ff4b2b)",
                        color: "#fff",
                        borderRadius: 16,
                        width: 56,
                        height: 56,
                        border: "none",
                        boxShadow: "0 4px 15px rgba(255,65,108,.6)",
                        cursor: "pointer",
                        zIndex: 1000,
                    }}
                >
                    <MessageOutlined style={{ fontSize: 24 }} />
                </button>
            )}

            {/* Hộp chat */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: "fixed",
                            bottom: 140,
                            right: 16,
                            width: "90vw",
                            maxWidth: 380,
                            height: "75vh",
                            display: "flex",
                            flexDirection: "column",
                            border: "1px solid #ff4b2b",
                            borderRadius: 16,
                            background: "#1e1e1e",
                            zIndex: 1000,
                            boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                            color: "#fff",
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                background: "linear-gradient(90deg,#ff416c,#ff4b2b)",
                                color: "#fff",
                                padding: "12px 16px",
                                borderRadius: "16px 16px 0 0",
                                fontWeight: "bold",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            Trợ lý AI Đặt Vé
                            <button
                                onClick={() => setOpen(false)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: 18,
                                    cursor: "pointer",
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Gợi ý câu hỏi */}
                        <div style={{ padding: "8px 12px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {sampleQuestions.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => sendMessage(q)}
                                    style={{
                                        padding: "6px 12px",
                                        borderRadius: 16,
                                        border: "1px solid #ff4b2b",
                                        background: "transparent",
                                        color: "#ffb3a7",
                                        fontSize: 13,
                                        cursor: "pointer",
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.background = "#ff4b2b22")}
                                    onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>

                        {/* Tin nhắn */}
                        <div
                            ref={historyRef}
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                padding: "12px 8px 0",
                            }}
                        >
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    style={{
                                        textAlign: m.sender === "user" ? "right" : "left",
                                        marginBottom: 10,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "inline-block",
                                            maxWidth: "80%",
                                            padding: "10px 14px",
                                            borderRadius: 18,
                                            wordBreak: "break-word",
                                            background:
                                                m.sender === "user"
                                                    ? "linear-gradient(90deg,#ff416c,#ff4b2b)"
                                                    : "#2a2a2a",
                                            color: "#fff",
                                            fontSize: 14,
                                        }}
                                    >
                                        <strong
                                            style={{
                                                fontSize: 11,
                                                opacity: 0.7,
                                                display: "block",
                                                marginBottom: 4,
                                            }}
                                        >
                                            {m.sender === "user" ? "Bạn" : "Trợ lý"}
                                        </strong>
                                        {m.sender === "ai" ? (
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                                        ) : (
                                            m.text
                                        )}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div style={{ fontStyle: "italic", color: "#ff9c9c" }}>
                                    Trợ lý đang soạn…
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                padding: 12,
                                borderTop: "1px solid #292929",
                            }}
                        >
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Nhập câu hỏi…"
                                style={{
                                    flex: 1,
                                    padding: "10px 14px",
                                    borderRadius: 12,
                                    border: "1px solid #444",
                                    background: "#0e0e0e",
                                    color: "#fff",
                                    outline: "none",
                                }}
                            />
                            <button
                                onClick={sendMessage}
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: 12,
                                    background: "linear-gradient(90deg,#ff416c,#ff4b2b)",
                                    border: "none",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                            >
                                Gửi
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
