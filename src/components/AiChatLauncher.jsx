// ChatWidget.jsx
import React, {useState, useRef, useEffect} from "react";
import {MessageOutlined} from "@ant-design/icons";
import {AnimatePresence, motion} from "framer-motion";
import {useNavigate} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* demo movies + gọi API giả lập */
import {fetchGeminiResponse} from "../services/geminiService";
import {movies} from "../data/fakeMovies";
import {slugify} from "@/utils/slugify.js";

export default function ChatWidget() {
    /* bật / tắt hộp chat */
    const [open, setOpen] = useState(false);

    /* state hội thoại */
    const [messages, setMsgs] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoad] = useState(false);

    const navigate = useNavigate();
    const historyRef = useRef(null);     // để cuộn

    /* auto-scroll xuống cuối khi có tin mới */
    useEffect(() => {
        if (historyRef.current)
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }, [messages, loading]);

    /* detect tên phim */
    const detectMovie = (text) => {
        const lower = text.toLowerCase();
        return movies.find((m) => lower.includes(m.name.toLowerCase())) || null;
    };

    /* gửi tin */
    const sendMessage = async () => {
        if (!input.trim()) return;

        const userText = input;
        setInput("");
        setMsgs((p) => [...p, {sender: "user", text: userText}]);
        setLoad(true);

        try {
            const aiText = await fetchGeminiResponse(userText);
            const movie = detectMovie(userText);

            if (movie) {
                setMsgs((p) => [
                    ...p,
                    {sender: "ai", text: `Đang chuyển đến trang đặt vé cho phim "${movie.name}"…`},
                ]);
                setTimeout(() => navigate(`/booking/${slugify(movie.name)}`), 1500);
            } else {
                setMsgs((p) => [
                    ...p,
                    {sender: "ai", text: aiText || "Hiện không có suất chiếu phim đó, bạn muốn xem phim khác không?"},
                ]);
            }
        } catch {
            setMsgs((p) => [...p, {sender: "ai", text: "Lỗi khi gọi AI."}]);
        } finally {
            setLoad(false);
        }
    };

    /* ------------- UI ------------- */
    return (
        <>
            <style>{`
        .ai-chat-panel {
          position: relative;
        }
        .ai-chat-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: radial-gradient(
            rgba(255,75,43,0.35) 0%,
            rgba(255,75,43,0.15) 40%,
            transparent 70%
          );
          filter: blur(20px);
          transform: translateY(22px);
          z-index: -1;
          pointer-events: none;
        }
      `}</style>
            {/* Nút nổi */}
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
                    <MessageOutlined style={{fontSize: 24}}/>
                </button>
            )}

            {/* Hộp chat */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{opacity: 0, y: 50, scale: 0.9}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, y: 50, scale: 0.9}}
                        transition={{duration: 0.3}}
                        className="ai-chat-panel"
                        style={{
                            position: "fixed",
                            bottom: 140,
                            right: 16,
                            width: "90vw",
                            maxWidth: 380,
                            height: "70vh",
                            display: "flex",
                            flexDirection: "column",
                            border: "1px solid #ff4b2b",
                            borderRadius: 16,
                            background: "#1e1e1e",
                            zIndex: 1000,
                            boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
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
                                borderBottom: "1px solid #ff4b2b",
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

                        {/* Lịch sử chat (có animation) */}
                        <div
                            ref={historyRef}
                            style={{flex: 1, overflowY: "auto", padding: "12px 8px 0"}}
                        >
                            <AnimatePresence mode="popLayout">
                                {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{opacity: 0, y: 12}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: -12}}
                                        transition={{duration: 0.25}}
                                        layout
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
                                                        : "#3a3a3a",
                                                color: "#fff",
                                                fontSize: 14,
                                                boxShadow: "0 2px 6px rgba(0,0,0,.3)",
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
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {m.text}
                                                </ReactMarkdown>
                                            ) : (
                                                m.text
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {loading && (
                                <span
                                    style={{
                                        fontStyle: "italic",
                                        background: "linear-gradient(90deg,#ff416c,#ff4b2b)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        display: "inline-block",
                                    }}
                                >
                                  Trợ lý đang soạn…
                                </span>
                            )}
                        </div>

                        {/* Ô nhập + nút gửi (CỐ ĐỊNH) */}
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
                                    boxShadow: "0 0 8px rgba(255,75,43,.4)",
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
