import React, { useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    Upload,
    Button,
    Row,
    Col,
    message
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const foodTypeOptions = [
    { value: "snack", label: "Snack" },
    { value: "drink", label: "Drink" },
    { value: "combo", label: "Combo" },
];

export default function ComboFormModal({ visible, onClose, onSubmit, initialValues }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (initialValues) {
                console.log("initialValues", initialValues);
                form.setFieldsValue({
                    ...initialValues,
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
        } else {
            form.resetFields(); // Reset the form when modal is closed
        }
    }, [visible, initialValues, form]);

    const normFile = (e) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    const beforeUpload = (file) => {
        const ok = ["image/jpeg", "image/png"].includes(file.type);
        if (!ok) message.error("Chỉ nhận JPG hoặc PNG!");
        return ok ? false : Upload.LIST_IGNORE;
    };

    const handleFinish = (values) => {
        const formData = new FormData();

        // Tạo JSON object từ các field
        const json = {
            name: values.name,
            description: values.description,
            price: values.price,
            isActive: values.isActive,
            foodType: values.foodType,
        };

        // ✅ Gắn JSON này vào key "data"
        formData.append("data", new Blob([JSON.stringify(json)], { type: "application/json" }));

        // ✅ Gắn file ảnh (nếu có)
        if (values.image?.[0]?.originFileObj) {
            formData.append("image", values.image[0].originFileObj);
        }

        onSubmit(formData);
    };




    return (
        <Modal
            open={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
            title={initialValues ? "Chỉnh sửa combo" : "Thêm combo mới"}
            okText="Lưu"
            cancelText="Hủy"
            destroyOnHidden
            forceRender
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="name" label="Tên combo" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
                            <TextArea rows={3} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
                            <InputNumber min={1000} step={1000} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="foodType" label="Loại combo" rules={[{ required: true }]}>
                            <Select options={foodTypeOptions} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="isActive" label="Hiển thị" valuePropName="checked">
                            <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="image"
                            label="Ảnh combo"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                listType="picture"
                                beforeUpload={beforeUpload}
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
