import React, { useEffect, useState } from "react";
import { Modal, Select, message, Tag, Popover, Spin, Button } from "antd";
import api from "@/api/axios";

const { Option } = Select;

const seatTypeColors = {
    VIP: "#ff9800",
    COUPLE: "#f06292",
    NORMAL: "#90caf9",
    CHILD: "#aed581",
    ELDERLY: "#ce93d8",
};

const defaultPrices = {
    VIP: 65000,
    COUPLE: 140000,
    NORMAL: 55000,
    CHILD: 45000,
    ELDERLY: 50000,
};

const seatStatusStyles = {
    AVAILABLE: { border: "2px solid green" },
    BOOKED: { border: "2px solid red", cursor: "not-allowed", opacity: 0.6 },
    UNAVAILABLE: { border: "2px dashed gray" },
};

const totalRows = 10;
const totalCols = 15;

export default function SeatMapModal({ showTime, open, onClose, onSaved }) {
    const [seats, setSeats] = useState([]);
    const [saving, setSaving] = useState(false);
    const [deletingSeatId, setDeletingSeatId] = useState(null);
    const [seatTypePrices, setSeatTypePrices] = useState(defaultPrices);
    const [bulkAddType, setBulkAddType] = useState("NORMAL");

    useEffect(() => {
        if (!open) setSeats([]);
    }, [open]);

    useEffect(() => {
        if (open && showTime) {
            api.get(`/show-times/${showTime.id}/seats`)
                .then(res => setSeats(res.data))
                .catch(() => message.error("Không tải được danh sách ghế"));
        }
    }, [open, showTime]);

    const handleSeatClick = (rowIdx, colIdx) => {
        const existing = seats.find(s => s.rowIdx === rowIdx && s.colIdx === colIdx);
        if (existing?.status === "BOOKED") return;

        if (existing) {
            if (typeof existing.id === "number") {
                setDeletingSeatId(existing.id);
                api.delete(`/seats/${existing.id}`)
                    .then(() => {
                        message.success(`Đã xóa ghế ${existing.seatNumber}`);
                        setSeats(prev => prev.filter(s => s.id !== existing.id));
                    })
                    .catch(() => message.error("Lỗi khi xóa ghế khỏi hệ thống"))
                    .finally(() => setDeletingSeatId(null));
            } else {
                setSeats(prev => prev.filter(s => s.id !== existing.id));
            }
        } else {
            setSeats(prev => [
                ...prev,
                {
                    id: `temp-${rowIdx}-${colIdx}`,
                    seatNumber: `${String.fromCharCode(65 + rowIdx)}${colIdx + 1}`,
                    screenId: showTime.screen.id,
                    showTimeId: showTime.id,
                    price: seatTypePrices["NORMAL"],
                    seatType: "NORMAL",
                    status: "AVAILABLE",
                    rowIdx,
                    colIdx,
                },
            ]);
        }
    };

    const handleTypeChange = (seatId, seatType) => {
        setSeats(prev =>
            prev.map(s => s.id === seatId ? { ...s, seatType, price: seatTypePrices[seatType] } : s)
        );
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = seats.map(seat => {
                const data = {
                    seatNumber: seat.seatNumber,
                    screenId: seat.screenId,
                    showTimeId: seat.showTimeId,
                    price: seat.price,
                    seatType: seat.seatType,
                    status: seat.status,
                    rowIdx: seat.rowIdx,
                    colIdx: seat.colIdx,
                };
                if (typeof seat.id === "number") data.id = seat.id;
                return data;
            });
            await api.post("/seats/bulk", { seats: payload });
            message.success("Lưu sơ đồ ghế thành công");
            onSaved?.();
        } catch (err) {
            console.error(err);
            message.error("Lỗi khi lưu sơ đồ ghế");
        } finally {
            setSaving(false);
        }
    };

    const getSeatAt = (rowIdx, colIdx) => seats.find(s => s.rowIdx === rowIdx && s.colIdx === colIdx);

    return (
        <Modal
            open={open}
            title="Tùy chỉnh sơ đồ ghế"
            onCancel={onClose}
            width={1200}
            style={{ top: 30 }}
            bodyStyle={{ overflowX: "auto", paddingRight: 24 }} // ✅ fix tràn
            footer={
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button type="primary" onClick={handleSave} loading={saving}>Lưu</Button>
                </div>
            }
        >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Array.from({ length: totalRows }).map((_, rowIdx) => (
                    <div key={`row-${rowIdx}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ display: "grid", gridTemplateColumns: `repeat(${totalCols}, 60px)`, gap: 8 }}>
                            {Array.from({ length: totalCols }).map((_, colIdx) => {
                                const seat = getSeatAt(rowIdx, colIdx);
                                const key = `${rowIdx}-${colIdx}`;
                                return seat ? (
                                    <Popover
                                        key={key}
                                        content={
                                            <div>
                                                <div style={{ marginBottom: 6 }}><b>{seat.seatNumber}</b></div>
                                                <Select
                                                    value={seat.seatType}
                                                    onChange={(val) => handleTypeChange(seat.id, val)}
                                                    style={{ width: 140 }} size="small"
                                                >
                                                    {Object.keys(seatTypeColors).map(type => (
                                                        <Option key={type} value={type}>{type}</Option>
                                                    ))}
                                                </Select>
                                                <div style={{ marginTop: 8, textAlign: "right" }}>
                                                    {deletingSeatId === seat.id ? <Spin size="small" /> : (
                                                        <a onClick={() => handleSeatClick(rowIdx, seat.colIdx)} style={{ color: "red" }}>Xoá ghế</a>
                                                    )}
                                                </div>
                                            </div>
                                        }
                                        title="Loại ghế" trigger="click"
                                    >
                                        <div style={{
                                            backgroundColor: seatTypeColors[seat.seatType],
                                            ...seatStatusStyles[seat.status],
                                            width: 60, height: 70,
                                            display: "flex", flexDirection: "column",
                                            justifyContent: "center", alignItems: "center",
                                            borderRadius: 4, fontSize: 10, cursor: "pointer",
                                        }}>
                                            {seat.seatNumber}
                                        </div>
                                    </Popover>
                                ) : (
                                    <div
                                        key={key}
                                        onClick={() => handleSeatClick(rowIdx, colIdx)}
                                        style={{ width: 60, height: 70, border: "1px dashed #ccc", cursor: "pointer" }}
                                    />
                                );
                            })}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <Select
                                value={bulkAddType} size="small"
                                onChange={val => setBulkAddType(val)}
                                style={{ width: 100 }}
                            >
                                {Object.keys(seatTypeColors).map(type => (
                                    <Option key={type} value={type}>{type}</Option>
                                ))}
                            </Select>
                            <Button
                                size="small"
                                onClick={() => {
                                    const newSeats = [];
                                    for (let colIdx = 0; colIdx < totalCols; colIdx++) {
                                        if (!getSeatAt(rowIdx, colIdx)) {
                                            newSeats.push({
                                                id: `temp-${rowIdx}-${colIdx}`,
                                                seatNumber: `${String.fromCharCode(65 + rowIdx)}${colIdx + 1}`,
                                                screenId: showTime.screen.id,
                                                showTimeId: showTime.id,
                                                price: seatTypePrices[bulkAddType],
                                                seatType: bulkAddType,
                                                status: "AVAILABLE",
                                                rowIdx,
                                                colIdx,
                                            });
                                        }
                                    }
                                    setSeats(prev => [...prev, ...newSeats]);
                                }}
                            >
                                ➕ Hàng {String.fromCharCode(65 + rowIdx)}
                            </Button>
                            <Button
                                danger size="small"
                                onClick={() => {
                                    const bookedSeats = seats.filter(s => s.rowIdx === rowIdx && s.status === "BOOKED");
                                    if (bookedSeats.length > 0) return message.error("Không thể xoá hàng có ghế đã đặt");
                                    setSeats(prev => prev.filter(s => s.rowIdx !== rowIdx));
                                }}
                            >
                                ❌ Xoá hàng
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 16 }}>
                <Tag color="green">AVAILABLE: Có thể đặt</Tag>
                <Tag color="red">BOOKED: Đã đặt</Tag>
                <Tag color="gray">UNAVAILABLE: Không sử dụng</Tag>
                <Tag color="default">Click vào ô trống để thêm ghế</Tag>
                <Tag color="default">Click vào ghế để xóa</Tag>
            </div>

            <div style={{ marginTop: 24 }}>
                <h4>Tuỳ chỉnh giá theo loại ghế</h4>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {Object.keys(seatTypePrices).map(type => (
                        <div key={type} style={{ display: "flex", flexDirection: "column" }}>
                            <label style={{ color: seatTypeColors[type], fontWeight: 600 }}>{type}</label>
                            <input
                                type="number" min={0} value={seatTypePrices[type]}
                                onChange={e => setSeatTypePrices(prev => ({ ...prev, [type]: Number(e.target.value) }))}
                                style={{ width: 100, padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc", fontSize: 14 }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
}
