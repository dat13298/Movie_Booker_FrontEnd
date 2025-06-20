import React, { useState } from 'react';
import { Row, Col, Select, Button, Grid, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import MobileDrawer from './MobileDrawer';

const { useBreakpoint } = Grid;

const HeaderBar = () => {
    const screens = useBreakpoint();
    const [visible, setVisible] = useState(false);

    const handleDrawer = () => setVisible(true);
    const handleClose = () => setVisible(false);

    return (
        <>
            <div style={{ background: '#fff', padding: '12px 16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <Row align="middle" justify="space-between">
                    <Col>
                        <img src="https://betacinemas.vn/Assets/Common/logo.png" alt="logo" height={30} />
                    </Col>
                    <Col flex="auto" style={{ paddingLeft: 16 }}>
                        <Select defaultValue="Beta Thái Nguyên" style={{ width: '100%', maxWidth: 200 }}>
                            <Select.Option value="thai-nguyen">Beta Thái Nguyên</Select.Option>
                            <Select.Option value="hanoi">Beta Hà Nội</Select.Option>
                        </Select>
                    </Col>

                    {/* Mobile Button */}
                    {!screens.md && (
                        <Col>
                            <Button icon={<MenuOutlined />} onClick={handleDrawer} />
                        </Col>
                    )}

                    {/* Desktop Menu */}
                    {screens.md && (
                        <Col>
                            <Menu mode="horizontal" items={[
                                { key: 'lich-chieu', label: 'LỊCH CHIẾU' },
                                { key: 'phim', label: 'PHIM' },
                                { key: 'rap', label: 'RẠP' },
                                { key: 'gia-ve', label: 'GIÁ VÉ' },
                                { key: 'uu-dai', label: 'TIN MỚI & ƯU ĐÃI' },
                                { key: 'thanh-vien', label: 'THÀNH VIÊN' }
                            ]} />
                        </Col>
                    )}
                </Row>
            </div>

            {/* Mobile Menu */}
            <MobileDrawer visible={visible} onClose={handleClose} />
        </>
    );
};

export default HeaderBar;
