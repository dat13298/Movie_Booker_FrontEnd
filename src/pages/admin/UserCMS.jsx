import React, { useEffect, useState } from 'react';
import {
    Layout,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Space,
    message,
    DatePicker,
    Tag
} from 'antd';
import api from '@/api/axios';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Option } = Select;

export const UserCMS = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [editing, setEditing] = useState(null);
    const [roleFilter, setRoleFilter] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/users');
            setUsers(res.data.content || []);
        } catch (err) {
            message.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAdd = () => {
        form.resetFields();
        setEditing(null);
        setOpen(true);
    };

    const handleEdit = (record) => {
        setEditing(record);
        form.setFieldsValue({
            ...record,
            DoB: dayjs(record.DoB)
        });
        setOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/users/${id}`);
            message.success('Xoá thành công');
            fetchUsers();
        } catch {
            message.error('Không thể xoá người dùng');
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                DoB: values.DoB.format('YYYY-MM-DD')
            };

            if (editing) {
                await api.put(`/users/${editing.id}`, payload);
                message.success('Cập nhật thành công');
            } else {
                await api.post('/users/admin/create', payload);
                message.success('Thêm mới thành công');
            }

            setOpen(false);
            fetchUsers();
        } catch (err) {
            message.error('Lỗi khi lưu thông tin người dùng');
        }
    };


    const renderRole = (role) => {
        const cleanRole = role.replace('ROLE_', '');
        const color = cleanRole === 'ADMIN' ? 'volcano' : 'green';
        return <Tag color={color}>{cleanRole}</Tag>;
    };

    const filteredUsers = roleFilter
        ? users.filter((u) => u.role.replace('ROLE_', '') === roleFilter)
        : users;

    const columns = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'Tên đăng nhập', dataIndex: 'username' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Số điện thoại', dataIndex: 'phoneNumber' },
        {
            title: 'Ngày sinh',
            dataIndex: 'DoB',
            render: (date) => dayjs(date).format('YYYY-MM-DD')
        },
        { title: 'Giới tính', dataIndex: 'gender' },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            render: renderRole,
        },
        {
            title: 'Hành động',
            render: (text, record) => (
                <Space>
                    <Button onClick={() => handleEdit(record)}>Sửa</Button>
                    <Button danger onClick={() => handleDelete(record.id)}>Xoá</Button>
                </Space>
            ),
        },
    ];

    return (
        <Layout style={{ padding: 24 }}>
            <Content>
                <Space style={{ marginBottom: 16 }}>
                    <Select
                        allowClear
                        placeholder="Lọc theo vai trò"
                        style={{ width: 200 }}
                        onChange={(value) => setRoleFilter(value)}
                    >
                        <Option value="USER">USER</Option>
                        <Option value="ADMIN">ADMIN</Option>
                    </Select>
                    <Button type="primary" onClick={handleAdd}>Thêm người dùng</Button>
                </Space>

                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    loading={loading}
                />

                <Modal
                    open={open}
                    title={editing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
                    onCancel={() => setOpen(false)}
                    onOk={handleSubmit}
                >
                    <Form layout="vertical" form={form}>
                        <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        {!editing && (
                            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
                                <Input.Password />
                            </Form.Item>
                        )}
                        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="DoB" label="Ngày sinh" rules={[{ required: true }]}>
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
                            <Select>
                                <Option value="MALE">Nam</Option>
                                <Option value="FEMALE">Nữ</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
                            <Select>
                                <Option value="ROLE_USER">USER</Option>
                                <Option value="ROLE_ADMIN">ADMIN</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
};
