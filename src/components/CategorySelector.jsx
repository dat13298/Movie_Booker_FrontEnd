import React, { useEffect, useState } from "react";
import api from "../api/axios";

const CategorySelector = ({ selectedId, onSelect }) => {
    const [categories, setCategories] = useState([]);
    const activeBgColor = "#FFE0C1";
    const activeBorderColor = "#FFBB7B";
    const activeTextColor = "#E67E22";

    useEffect(() => {
        api.get("/partner/categories").then((res) => {
            const raw = res.data?.data;

            if (!Array.isArray(raw)) {
                console.warn("Dữ liệu category không hợp lệ:", raw);
                setCategories([]);
                return;
            }

            const fetched = raw.map((cat) => ({
                id: cat.categoryId,
                name: cat.categoryNm,
                img: cat.categoryImg || "https://via.placeholder.com/60?text=?",
            }));

            setCategories(fetched);
            console.log(res);
        }).catch((err) => {
            console.error("Lỗi lấy categories:", err);
            setCategories([]);
        });
    }, []);


    return (
        <div style={{ display: "flex", gap: "20px", padding: "10px", overflowX: "auto" }}>
            {categories.map((cat) => (
                <div
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        cursor: "pointer",
                        color: cat.id === selectedId ? activeTextColor : "#888",
                        fontWeight: cat.id === selectedId ? "bold" : "normal",
                        minWidth: 80,
                    }}
                >
                    <div
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            overflow: "hidden",
                            background: cat.id === selectedId ? activeBgColor : "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: cat.id === selectedId ? `2px solid ${activeBorderColor}` : "1px solid #ddd",
                        }}
                    >
                        <img
                            src={cat.img}
                            alt={cat.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                    <span style={{ marginTop: 6, fontSize: 12, textAlign: "center" }}>
            {cat.name}
          </span>
                </div>
            ))}
        </div>
    );
};

export default CategorySelector;
