import React from "react";
import { Table, Typography } from "antd";

const { Title } = Typography;

const textColor = "#fdd";
const bgColor = "#000";
const headerBg = "#001529";

const standardColor = "#00ff99";
const vipColor = "#ffc107";
const sweetboxColor = "#ff0055";

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
        Khung giờ
        <br />
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
              <span style={{ color: standardColor }}>Standard</span>
            </div>
        ),
        dataIndex: "monThu_standard",
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
              <span style={{ color: sweetboxColor }}>Sweetbox</span>
            </div>
        ),
        dataIndex: "monThu_sweetbox",
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
              <span style={{ color: standardColor }}>Standard</span>
            </div>
        ),
        dataIndex: "friSun_standard",
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
              <span style={{ color: sweetboxColor }}>Sweetbox</span>
            </div>
        ),
        dataIndex: "friSun_sweetbox",
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
    monThu_standard: "55.000đ",
    monThu_vip: "65.000đ",
    monThu_sweetbox: "140.000đ",
    friSun_standard: "70.000đ",
    friSun_vip: "80.000đ",
    friSun_sweetbox: "170.000đ",
  },
  {
    key: "2",
    time: "12:00 - 17:00<br/>From 12PM to 5PM",
    monThu_standard: "70.000đ",
    monThu_vip: "75.000đ",
    monThu_sweetbox: "160.000đ",
    friSun_standard: "80.000đ",
    friSun_vip: "85.000đ",
    friSun_sweetbox: "180.000đ",
  },
  {
    key: "3",
    time: "17:00 - 23:00<br/>From 5PM to 11PM",
    monThu_standard: "80.000đ",
    monThu_vip: "85.000đ",
    monThu_sweetbox: "180.000đ",
    friSun_standard: "90.000đ",
    friSun_vip: "95.000đ",
    friSun_sweetbox: "200.000đ",
  },
  {
    key: "4",
    time: "Từ 23:00<br/>From 11PM",
    monThu_standard: "65.000đ",
    monThu_vip: "70.000đ",
    monThu_sweetbox: "150.000đ",
    friSun_standard: "75.000đ",
    friSun_vip: "80.000đ",
    friSun_sweetbox: "170.000đ",
  },
];

const TicketPrice = () => {
  return (
      <div style={{ backgroundColor: "#0b0f1a", padding: 40, minHeight: "100vh" }}>
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
          Bảng Giá Vé <br />  TICKET PRICE
        </Title>

        {/* Inject style to kill hover effect completely */}
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