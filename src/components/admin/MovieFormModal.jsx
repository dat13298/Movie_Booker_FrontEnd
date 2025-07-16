import React, {useEffect} from "react";
import {Modal, Form, Input, InputNumber, DatePicker, Select, Upload, Button, Switch, Row, Col, message} from "antd";
import dayjs from "dayjs";
import {UploadOutlined} from "@ant-design/icons";

const {TextArea} = Input;
const {Option} = Select;

export default function MovieFormModal({visible, onClose, onSubmit, initialValues}) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (!visible) {
            form.resetFields();
        }
    }, [visible]);


    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                premiereDate: initialValues.premiereDate ? dayjs(initialValues.premiereDate) : null,
                releaseDate: initialValues.releaseDate ? dayjs(initialValues.releaseDate) : null,
                is18Plus: initialValues?.is18Plus ?? false,
                movieCode: initialValues.movieCode || "",
                trailerUrl: initialValues.trailerUrl || "",
                image: initialValues.imageUrl
                    ? [
                        {
                            uid: "-1",
                            name: "image.png",
                            status: "done",
                            url: initialValues.imageUrl,
                        },
                    ]
                    : [],
            });
        } else {
            form.resetFields();
        }
    }, [initialValues, visible, form]);

    const normFile = (e) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    const handleFinish = (values) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("duration", values.duration);
        formData.append("rating", values.rating);
        formData.append("releaseDate", values.releaseDate.format("YYYY-MM-DD"));
        formData.append("director", values.director);
        formData.append("actors", values.actors);
        formData.append("movieType", values.movieType);
        formData.append("language", values.language);
        formData.append("premiereDate", values.premiereDate.format("YYYY-MM-DD"));
        formData.append("movieStatus", values.movieStatus);
        formData.append("screenType", values.screenType);
        formData.append("is18Plus", values.is18Plus);

        // Mã phim và Trailer URL mới
        formData.append("movieCode", values.movieCode);
        formData.append("trailerUrl", values.trailerUrl);

        if (values.image?.[0]?.originFileObj) {
            formData.append("image", values.image[0].originFileObj);
        }

        // *** LOG TOÀN BỘ FORMDATA ***
        console.log("=== FormData entries ===");
        formData.forEach((value, key) => {
            // Với file sẽ log ra File object, còn text thì log ra string
            console.log(key, value);
        });
        console.log("========================");

        onSubmit(formData);
        // form.resetFields();
    };

    const beforeUpload = (file) => {
        const ok = ["image/jpeg", "image/png"].includes(file.type);
        if (!ok) {
            message.error("Chỉ nhận JPG hoặc PNG!");
        }
        return ok ? false : Upload.LIST_IGNORE;
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            title={initialValues ? "Chỉnh sửa phim" : "Thêm phim mới"}
            destroyOnClose
            width={800}
            footer={
                <div style={{display: "flex", justifyContent: "flex-end", gap: 8}}>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button
                        type="primary"
                        onClick={() => form.submit()}
                        style={{padding: "0 16px", height: 32}}
                    >
                        Lưu
                    </Button>
                </div>
            }
        >

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{movieStatus: "COMING_SOON"}}
            >
                {/* Hàng 1: Tên & Mã phim */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="title" label="Tên phim" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="movieCode" label="Mã phim" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Hàng 2: Thể loại & Ngôn ngữ */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="movieType" label="Thể loại" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="language" label="Ngôn ngữ" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Hàng 3: Đạo diễn & Diễn viên */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="director" label="Đạo diễn" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="actors" label="Diễn viên" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Hàng 4: Thời lượng & Xếp hạng */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="duration" label="Thời lượng (phút)" rules={[{required: true}]}>
                            <InputNumber min={1} style={{width: "100%"}}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="rating" label="Xếp hạng" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Hàng 5: Ngày phát hành & Ngày khởi chiếu */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="releaseDate" label="Ngày phát hành" rules={[{required: true}]}>
                            <DatePicker style={{width: "100%"}}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="premiereDate" label="Ngày khởi chiếu" rules={[{required: true}]}>
                            <DatePicker style={{width: "100%"}}/>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Hàng 6: Trạng thái & Loại màn hình */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="movieStatus" label="Trạng thái" rules={[{required: true}]}>
                            <Select>
                                <Option value="COMING_SOON">Sắp chiếu</Option>
                                <Option value="NOW_SHOWING">Đang chiếu</Option>
                                <Option value="ENDED">Đã ngừng chiếu</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="screenType" label="Loại màn hình" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Hàng 7: Phim 18+ & Trailer URL */}
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            name="is18Plus"
                            label="Phim 18+"
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="Có" unCheckedChildren="Không"/>
                        </Form.Item>
                    </Col>
                    <Col span={18}>
                        <Form.Item
                            name="trailerUrl"
                            label="URL Trailer"
                            rules={[
                                {required: true, message: "Vui lòng nhập URL Trailer"},
                                {type: "url", message: "URL không hợp lệ"},
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Hàng 8: Ảnh Poster */}
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="image"
                            label="Ảnh Poster"
                            valuePropName="fileList"
                            beforeUpload={beforeUpload}
                            accept="image/png,image/jpeg"
                            getValueFromEvent={normFile}
                            // rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}
                        >
                            <Upload listType="picture" beforeUpload={() => false} maxCount={1}>
                                <Button icon={<UploadOutlined/>}>Chọn ảnh</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Hàng 9: Mô tả toàn chiều rộng */}
                <Form.Item name="description" label="Mô tả" rules={[{required: true}]}>
                    <TextArea rows={3}/>
                </Form.Item>
            </Form>
        </Modal>
    );
}
