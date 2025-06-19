import React from 'react';
import { Drawer, Menu } from 'antd';

const MobileDrawer = ({ visible, onClose }) => {
    return (
        <Drawer
            title="Danh mục"
            placement="right"
            onClose={onClose}
            visible={visible}
        >
            <Menu mode="vertical" items={[
                { key: 'lich-chieu', label: 'LỊCH CHIẾU' },
                { key: 'phim', label: 'PHIM' },
                { key: 'rap', label: 'RẠP' },
                { key: 'gia-ve', label: 'GIÁ VÉ' },
                { key: 'uu-dai', label: 'TIN MỚI & ƯU ĐÃI' },
                { key: 'thanh-vien', label: 'THÀNH VIÊN' }
            ]} />
        </Drawer>
    );
};

export default MobileDrawer;
