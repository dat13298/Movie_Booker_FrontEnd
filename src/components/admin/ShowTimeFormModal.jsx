import React, {useEffect} from "react";
import {Modal, Form, Input, DatePicker, Select} from "antd";
import dayjs from "dayjs";

const {Option} = Select;

export default function ShowTimeFormModal({
                                              open,
                                              onCancel,
                                              onSubmit,
                                              initialValues = {},
                                              movieOptions = [],
                                              roomOptions = [],
                                          }) {
    const [form] = Form.useForm();

    console.log(initialValues);
    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                movieId: initialValues.movie?.id ?? initialValues.movieId,
                screenId: initialValues.screen?.id ?? initialValues.screenId,
                startTime: initialValues.startTime ? dayjs(initialValues.startTime) : null,
                endTime: initialValues.endTime ? dayjs(initialValues.endTime) : null,
                presentation: initialValues.presentation,
            });
        }
    }, [open, initialValues, form]);


    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            values.startTime = values.startTime?.toISOString();
            values.endTime = values.endTime?.toISOString();
            onSubmit(values);
        } catch (err) {
            console.error("Validation Failed:", err);
        }
    };

    return (
        <Modal
            title={initialValues.id ? "Chỉnh sửa suất chiếu" : "Thêm suất chiếu"}
            open={open}
            onCancel={onCancel}
            destroyOnClose
            footer={
                <div style={{display: "flex", justifyContent: "flex-end", gap: 8}}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: "4px 16px",
                            borderRadius: 4,
                            border: "1px solid #d9d9d9",
                            background: "#fff",
                            cursor: "pointer"
                        }}
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={handleOk}
                        style={{
                            padding: "4px 16px",
                            borderRadius: 4,
                            border: "none",
                            background: "#1677ff",
                            color: "#fff",
                            fontWeight: 500,
                            cursor: "pointer"
                        }}
                    >
                        {initialValues.id ? "Cập nhật" : "Thêm mới"}
                    </button>
                </div>
            }
        >

            <Form layout="vertical" form={form}>
                <Form.Item
                    name="movieId"
                    label="Phim"
                    rules={[{required: true, message: "Vui lòng chọn phim"}]}
                >
                    <Select placeholder="Chọn phim">
                        {movieOptions.map((m) => (
                            <Option key={m.id} value={m.id}>
                                {m.title}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="screenId"
                    label="Phòng chiếu"
                    rules={[{required: true, message: "Vui lòng chọn phòng"}]}
                >
                    <Select placeholder="Chọn phòng">
                        {roomOptions.map((r) => (
                            <Option key={r.id} value={r.id}>
                                {r.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="startTime"
                    label="Thời gian bắt đầu"
                    rules={[{required: true, message: "Vui lòng chọn thời gian bắt đầu"}]}
                >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{width: "100%"}}/>
                </Form.Item>

                <Form.Item
                    name="endTime"
                    label="Thời gian kết thúc"
                    rules={[{required: true, message: "Vui lòng chọn thời gian kết thúc"}]}
                >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{width: "100%"}}/>
                </Form.Item>

                <Form.Item
                    name="presentation"
                    label="Định dạng chiếu"
                    rules={[{required: true, message: "Vui lòng chọn định dạng"}]}
                >
                    <Select placeholder="Chọn định dạng">
                        <Option value="2D">2D</Option>
                        <Option value="3D">3D</Option>
                        <Option value="IMAX">IMAX</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}
