import React from "react";
import { Table, Typography } from "antd";

const { Title } = Typography;

const textColor = "#fdd";
const bgColor = "#0b0f1a";
const headerBg = "#001529";


const normalColor = "#00ff99";
const vipColor = "Gold";
const coupleColor = "#ff0055";
const childColor = "#00ccff";
const elderlyColor = "GreenYellow";

const headerStyle = {
    backgroundColor: headerBg,
    color: textColor,
    textAlign: "center",
    border: "1px solid #333",
};

const withHeaderStyle = (column) => ({
    ...column,
    onHeaderCell: () => ({ style: headerStyle }),
});

const columns = [
    withHeaderStyle({
        title: (
            <span style={{ color: textColor }}>
        Khung giờ<br />
        <span style={{ fontWeight: "normal" }}></span>
      </span>
        ),
        dataIndex: "time",
        key: "time",
        align: "center",
        render: (text) => (
            <div
                dangerouslySetInnerHTML={{ __html: text }}
                style={{ color: textColor }}
            />
        ),
    }),
    {
        title: (
            <div style={{ ...headerStyle, padding: 10 }}>
                Từ thứ 2 đến thứ 5
                <br />
                <span style={{ fontWeight: "normal" }}>From Monday to Thursday</span>
            </div>
        ),
        children: [
            withHeaderStyle({
                title: (
                    <div>
                        Ghế thường<br />
                        <span style={{ color: normalColor }}>Normal</span>
                    </div>
                ),
                dataIndex: "monThu_normal",
                align: "center",
                render: (text) => <span style={{ color: textColor }}>{text}</span>,
            }),
            withHeaderStyle({
                title: (
                    <div>
                        Ghế VIP<br />
                        <span style={{ color: vipColor }}>VIP</span>
                    </div>
                ),
                dataIndex: "monThu_vip",
                align: "center",
                render: (text) => <span style={{ color: textColor }}>{text}</span>,
            }),
            withHeaderStyle({
                title: (
                    <div>
                        Ghế đôi<br />
                        <span style={{ color: coupleColor }}>Couple</span>
                    </div>
                ),
                dataIndex: "monThu_couple",
                align: "center",
                render: (text) => <span style={{ color: textColor }}>{text}</span>,
            }),
            withHeaderStyle({
                title: (
                    <div>
                        Trẻ em<br />
                        <span style={{ color: childColor }}>Child</span>
                    </div>
                ),
                dataIndex: "monThu_child",
                align: "center",
                render: (text) => <span style={{ color: textColor }}>{text}</span>,
            }),
            withHeaderStyle({
                title: (
                    <div>
                        Người già<br />
                        <span style={{ color: elderlyColor }}>Elderly</span>
                    </div>
                ),
                dataIndex: "monThu_elderly",
                align: "center",
                render: (text) => <span style={{ color: textColor }}>{text}</span>,
            }),
        ],
    },
    {
        title: (
            <div style={{ ...headerStyle, padding: 10 }}>
                Thứ 6, 7, CN và ngày Lễ
                <br />
                <span style={{ fontWeight: "normal" }}>
          Friday, Saturday, Sunday & public holiday
        </span>
            </div>
        ),
        children: [
            withHeaderStyle({
                title: (
                    <div>
                        Ghế thường<br />
                        <span style={{ color: normalColor }}>Normal</span>
                    </div>
                ),
                dataIndex: "friSun_normal",
                align: "center",
                render: (text) => <span style={{ color: textColor }}>{text}</span>,
            }),
            withHeaderStyle({
                title: (
                    <div>
                        Ghế VIP<br />
                        <span style={{ color: vipColor }}>VIP</span>
                    </div>
                ),
                dataIndex: "friSun_vip",
                align: "center",
                render: (text) => <span style={{ color: textColor }}>{text}</span>,
            }),
            withHeaderStyle({
                title: (
                    <div>
                        Ghế đôi<br />
                        <span style={{ color: coupleColor }}>Couple</span>
                    </div>
                ),
                dataIndex: "friSun_couple",
                align: "center",
                render: (text) => <span style={{ color: textColor }}>{text}</span>,
            }),
            withHeaderStyle({
                title: (
                    <div>
                        Trẻ em<br />
                        <span style={{ color: childColor }}>Child</span>
                    </div>
                ),
                dataIndex: "friSun_child",
                align: "center",
                render: (text) => <span style={{ color: textColor }}>{text}</span>,
            }),
            withHeaderStyle({
                title: (
                    <div>
                        Người già<br />
                        <span style={{ color: elderlyColor }}>Elderly</span>
                    </div>
                ),
                dataIndex: "friSun_elderly",
                align: "center",
                render: (text) => <span style={{ color: textColor }}>{text}</span>,
            }),
        ],
    },
];

const data = [
    {
        key: "1",
        time: "Trước 12:00<br/>Before 12PM",
        monThu_normal: "55.000đ",
        monThu_vip: "65.000đ",
        monThu_couple: "140.000đ",
        monThu_child: "45.000đ",
        monThu_elderly: "50.000đ",
        friSun_normal: "70.000đ",
        friSun_vip: "80.000đ",
        friSun_couple: "170.000đ",
        friSun_child: "60.000đ",
        friSun_elderly: "65.000đ",
    },
    {
        key: "2",
        time: "12:00 - 17:00<br/>From 12PM to 5PM",
        monThu_normal: "70.000đ",
        monThu_vip: "75.000đ",
        monThu_couple: "160.000đ",
        monThu_child: "55.000đ",
        monThu_elderly: "60.000đ",
        friSun_normal: "80.000đ",
        friSun_vip: "85.000đ",
        friSun_couple: "180.000đ",
        friSun_child: "65.000đ",
        friSun_elderly: "70.000đ",
    },
    {
        key: "3",
        time: "17:00 - 23:00<br/>From 5PM to 11PM",
        monThu_normal: "80.000đ",
        monThu_vip: "85.000đ",
        monThu_couple: "180.000đ",
        monThu_child: "65.000đ",
        monThu_elderly: "70.000đ",
        friSun_normal: "90.000đ",
        friSun_vip: "95.000đ",
        friSun_couple: "200.000đ",
        friSun_child: "75.000đ",
        friSun_elderly: "80.000đ",
    },
    {
        key: "4",
        time: "Từ 23:00<br/>From 11PM",
        monThu_normal: "65.000đ",
        monThu_vip: "70.000đ",
        monThu_couple: "150.000đ",
        monThu_child: "55.000đ",
        monThu_elderly: "60.000đ",
        friSun_normal: "75.000đ",
        friSun_vip: "80.000đ",
        friSun_couple: "170.000đ",
        friSun_child: "65.000đ",
        friSun_elderly: "70.000đ",
    },
];

const TicketPrice = () => {
    return (
        <div style={{ backgroundColor: bgColor, padding: 40, minHeight: "100vh" }}>
            <Title
                level={3}
                style={{
                    textAlign: "center",
                    color: textColor,
                    backgroundColor: "#3b51b3",
                    padding: 20,
                    marginBottom: 30,
                }}
            >
                Bảng Giá Vé <br /> TICKET PRICE
            </Title>

            <style>
                {`
          .ant-table-tbody > tr:hover > td {
            background: ${bgColor} !important;
          }
        `}
            </style>

            <Table
                columns={columns}
                dataSource={data}
                bordered
                pagination={false}
                scroll={{ x: "max-content" }}
                rowClassName={() => ""}
                style={{ backgroundColor: bgColor }}
                components={{
                    header: {
                        cell: (props) => (
                            <th
                                {...props}
                                style={{
                                    ...props.style,
                                    backgroundColor: headerBg,
                                    color: textColor,
                                    textAlign: "center",
                                    border: "1px solid #333",
                                }}
                            />
                        ),
                    },
                    body: {
                        row: (props) => (
                            <tr
                                {...props}
                                style={{
                                    ...props.style,
                                    backgroundColor: bgColor,
                                    color: textColor,
                                    transition: "none",
                                }}
                            />
                        ),
                    },
                }}
            />
        </div>
    );
};

export default TicketPrice;
