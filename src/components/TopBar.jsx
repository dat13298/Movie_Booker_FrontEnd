import React from 'react';
import { Row, Col, Space, Button } from 'antd';

const TopBar = () => {
    return (
        <div style={{ background: '#000', padding: '4px 16px', color: '#fff' }}>
            <Row justify="space-between" align="middle">
                <Col>
                    <Button size="small">⬇ App</Button>
                </Col>
                <Col>
                    <Space>
                        <span>Đăng nhập</span>
                        <span>|</span>
                        <span>Đăng ký</span>
                        <img
                            src="https://flagcdn.com/gb.svg"
                            alt="EN"
                            width={20}
                            style={{ marginLeft: 8 }}
                        />
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default TopBar;
