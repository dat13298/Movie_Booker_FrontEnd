import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  notification,
} from "antd";
import axios from "axios";

const TheaterCMS = () => {
  const [theaters, setTheaters] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTheater, setEditingTheater] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData(1, pagination.pageSize);
  }, []);

  const fetchData = async (page, size) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/theaters?page=${page - 1}&size=${size}`);
      setTheaters(res.data.content);
      setPagination({
        current: page,
        pageSize: size,
        total: res.data.totalElements,
      });
    } catch (err) {
      notification.error({ message: "Lỗi khi tải rạp chiếu" });
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize);
  };

  const handleAdd = () => {
    setEditingTheater(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingTheater(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/theaters/${id}`);
      notification.success({ message: "Xoá thành công" });
      fetchData(pagination.current, pagination.pageSize);
    } catch {
      notification.error({ message: "Xoá thất bại" });
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingTheater) {
        await axios.put(`/api/theaters/${editingTheater.id}`, values);
        notification.success({ message: "Cập nhật thành công" });
      } else {
        await axios.post(`/api/theaters`, values);
        notification.success({ message: "Thêm mới thành công" });
      }
      setModalVisible(false);
      fetchData(pagination.current, pagination.pageSize);
    } catch {
      notification.error({ message: "Lưu thất bại" });
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên rạp", dataIndex: "name", key: "name" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "Khu vực", dataIndex: "regionName", key: "regionName" },
    {
      title: "Thao tác",
      render: (_, record) => (
          <Space>
            <Button onClick={() => handleEdit(record)}>Sửa</Button>
            <Popconfirm
                title="Bạn có chắc muốn xoá không?"
                onConfirm={() => handleDelete(record.id)}
            >
              <Button danger>Xoá</Button>
            </Popconfirm>
          </Space>
      ),
    },
  ];

  return (
      <div style={{ padding: 24 }}>
        <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
          Thêm rạp
        </Button>
        <Table
            columns={columns}
            dataSource={theaters}
            rowKey="id"
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
        />

        <Modal
            open={modalVisible}
            title={editingTheater ? "Sửa rạp" : "Thêm rạp"}
            onCancel={() => setModalVisible(false)}
            onOk={handleOk}
            destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item
                name="name"
                label="Tên rạp"
                rules={[{ required: true, message: "Vui lòng nhập tên rạp" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
                name="regionName"
                label="Khu vực"
                rules={[{ required: true, message: "Vui lòng nhập khu vực" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
};

export default TheaterCMS;
