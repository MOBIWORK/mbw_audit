import { HeaderPage, TableCustom } from "../../components";

import { Progress, Avatar, Form } from "antd";
import {
  Overview,
  InfoCard,
  InfoCardChart,
  InfoCardEmploy,
} from "./components/card";
import {
  message,
  DatePicker,
  Row,
  Col,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosService } from "../../services/server";
import "./dashboard.css";
const { RangePicker } = DatePicker;
export default function Dashboard() {
  const [searchTime, setSearchTime] = useState([]); // Sử dụng state để lưu giá trị thời gian thực hiện
  const [dataChienDichViengTham, setDataChienDichViengTham] = useState({});
  const [dataBaoCaoAI, setDataBaoCaoAI] = useState({});
  const [dataGiamSat, setDataGiamSat] = useState({});
  const [dataKhachHangThamgia, setDataKhachHangThamgia] = useState({});
  const [dataNhanVienThucHien, setDataNhanVienThucHien] = useState({});

  const [colTableTyLeDat, setColTableTyLeDat] = useState({});
  const [colTableTienDoTyLe, setColTableTienDoTyLe] = useState({});
  const [chienDichThucHien, setChienDichThucHien] = useState({});

  const [dataNhanVienChup, setDataNhanVienChup] = useState({});

  const handleCampaignClick = (record: any) => {
    // Xử lý sự kiện click vào từng hàng ở đây
    const navigate = useNavigate();
    localStorage.setItem('campaign_dashboard', JSON.stringify(record));
    navigate(`/reports`);
};
  const pad =(num:any)=> {
    return num < 10 ? '0' + num : num;
  }
  const colTableTyLe = {
    columns: [
      {
        title: "STT",
        dataIndex: "stt",
        width: "10%",
        render: (_, __, index:any) => pad(index+1),
      },
      {
        title: "Chiến dịch",
        dataIndex: "campaign_name",
        width: "40%",
        render: (_, record) => (
          <a href="javascript:;" onClick={() => handleCampaignClick(record)}>{record.campaign_name}</a>
        )
      },
      {
        title: "Tỷ lệ AI chấm",
        dataIndex: "tyle_ai",
        render: (percent) => (
          <Progress
            percent={Math.round(percent)}
            format={(percent) => `${percent} %`}
            strokeColor={percent > 50 ? "#52c41a" : "rgba(255, 86, 48, 1)"}
          />
        ),
      },
      {
        title: "Tỷ lệ giám sát chấm",
        dataIndex: "tyle_giamsat",
        render: (percent) => (
          <Progress
            percent={Math.round(percent)}
            format={(percent) => `${percent} %`}
            strokeColor={percent > 50 ? "#52c41a" : "rgba(255, 86, 48, 1)"}
          />
        ),
      },
    ],
  };

  const colTableNhanVienChupAnh = {
    columns: [
      {
        title: "",
        dataIndex: "stt",
        width: "25%",
        render: (text, record, index) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            {index < 3 && (
              <span style={{ width: "24px", textAlign: "center" }}>
                {/* Phần tử rỗng */}
              </span>
            )}
            {index < 3 &&
              (index === 0 ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_708_22653)">
                    <path
                      d="M19.6523 17.3426H4.3476C4.11377 17.3426 3.89532 17.2271 3.76367 17.0339C1.74438 14.0727 1.58948 8.37646 1.57776 7.53088C1.57703 7.49774 1.57666 7.46423 1.57666 7.43091C1.57666 7.04108 1.89233 6.72485 2.28217 6.72412H2.28363C2.67273 6.72412 2.98895 7.03888 2.99042 7.42816C2.99042 7.43292 2.9906 7.47467 2.99225 7.54865C3.0545 9.55969 4.70996 11.1763 6.73584 11.1763C8.80109 11.1763 10.4813 9.49615 10.4813 7.43091C10.4813 7.04053 10.7979 6.72412 11.188 6.72412H12.8116C13.202 6.72412 13.5184 7.04053 13.5184 7.43091C13.5184 9.49615 15.1988 11.1763 17.264 11.1763C19.2917 11.1763 20.9483 9.55676 21.0078 7.54315C21.0091 7.47247 21.0095 7.43292 21.0095 7.42834C21.0109 7.03888 21.327 6.72412 21.7162 6.72412H21.7175C22.1074 6.72485 22.423 7.04108 22.423 7.43091C22.423 7.46442 22.4227 7.49774 22.4221 7.53107C22.4102 8.37646 22.2553 14.0729 20.2362 17.0341C20.1046 17.2271 19.8859 17.3426 19.6523 17.3426Z"
                      fill="#FFF780"
                    />
                    <path
                      d="M21.7177 6.72412C21.7173 6.72412 21.7169 6.72412 21.7164 6.72412C21.3273 6.72412 21.011 7.03888 21.0096 7.42816C21.0096 7.43292 21.0094 7.47247 21.0079 7.54315C20.9484 9.55658 19.2919 11.1763 17.2642 11.1763C15.1989 11.1763 13.5187 9.49615 13.5187 7.43091C13.5187 7.04053 13.2021 6.72412 12.812 6.72412H12.0002V17.3424H19.6524C19.8862 17.3424 20.1047 17.2269 20.2363 17.0339C22.2556 14.0727 22.4105 8.37628 22.4222 7.53088C22.423 7.49774 22.4233 7.46423 22.4233 7.43091C22.4232 7.04108 22.1075 6.72485 21.7177 6.72412Z"
                      fill="#FFC02E"
                    />
                    <path
                      d="M12 4.3125C10.7408 4.3125 9.71631 5.33698 9.71631 6.59619C9.71631 7.85541 10.7408 8.8797 12 8.8797C13.2592 8.8797 14.2837 7.85541 14.2837 6.59619C14.2837 5.33698 13.2592 4.3125 12 4.3125Z"
                      fill="#FFC02E"
                    />
                    <path
                      d="M12.0002 4.3125V8.87988C13.2595 8.8797 14.2838 7.85541 14.2838 6.59619C14.2838 5.33698 13.2593 4.31268 12.0002 4.3125Z"
                      fill="#FFA73B"
                    />
                    <path
                      d="M2.28369 6.07471C1.02448 6.07471 0 7.09918 0 8.3584C0 9.61761 1.02448 10.6421 2.28369 10.6421C3.54291 10.6421 4.5672 9.61761 4.5672 8.3584C4.5672 7.09918 3.54291 6.07471 2.28369 6.07471Z"
                      fill="#FFC02E"
                    />
                    <path
                      d="M21.7164 6.07471C20.4572 6.07471 19.4329 7.09918 19.4329 8.3584C19.4329 9.61743 20.4572 10.6419 21.7164 10.6419C22.9756 10.6419 24.0001 9.61743 24.0001 8.3584C24.0001 7.09918 22.9756 6.07471 21.7164 6.07471Z"
                      fill="#FFA73B"
                    />
                    <path
                      d="M19.6523 19.6612H4.34766C3.95728 19.6612 3.64087 19.3448 3.64087 18.9544V16.8467H20.3591V18.9544C20.3591 19.3448 20.0427 19.6612 19.6523 19.6612Z"
                      fill="#FFC02E"
                    />
                    <path
                      d="M12.0002 19.6612H19.6524C20.0428 19.6612 20.3592 19.3448 20.3592 18.9544V16.8467H12.0002V19.6612Z"
                      fill="#FFA73B"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_708_22653">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              ) : index === 1 ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_708_22686)">
                    <path
                      d="M19.6523 17.3426H4.3476C4.11377 17.3426 3.89532 17.2271 3.76367 17.0339C1.74438 14.0727 1.58948 8.37646 1.57776 7.53088C1.57703 7.49774 1.57666 7.46423 1.57666 7.43091C1.57666 7.04108 1.89233 6.72485 2.28217 6.72412H2.28363C2.67273 6.72412 2.98895 7.03888 2.99042 7.42816C2.99042 7.43292 2.9906 7.47467 2.99225 7.54865C3.0545 9.55969 4.70996 11.1763 6.73584 11.1763C8.80109 11.1763 10.4813 9.49615 10.4813 7.43091C10.4813 7.04053 10.7979 6.72412 11.188 6.72412H12.8116C13.202 6.72412 13.5184 7.04053 13.5184 7.43091C13.5184 9.49615 15.1988 11.1763 17.264 11.1763C19.2917 11.1763 20.9483 9.55676 21.0078 7.54315C21.0091 7.47247 21.0095 7.43292 21.0095 7.42834C21.0109 7.03888 21.327 6.72412 21.7162 6.72412H21.7175C22.1074 6.72485 22.423 7.04108 22.423 7.43091C22.423 7.46442 22.4227 7.49774 22.4221 7.53107C22.4102 8.37646 22.2553 14.0729 20.2362 17.0341C20.1046 17.2271 19.8859 17.3426 19.6523 17.3426Z"
                      fill="#63AEF3"
                    />
                    <path
                      d="M21.7177 6.72412C21.7173 6.72412 21.7169 6.72412 21.7164 6.72412C21.3273 6.72412 21.011 7.03888 21.0096 7.42816C21.0096 7.43292 21.0094 7.47247 21.0079 7.54315C20.9484 9.55658 19.2919 11.1763 17.2642 11.1763C15.1989 11.1763 13.5187 9.49615 13.5187 7.43091C13.5187 7.04053 13.2021 6.72412 12.812 6.72412H12.0002V17.3424H19.6524C19.8862 17.3424 20.1047 17.2269 20.2363 17.0339C22.2556 14.0727 22.4105 8.37628 22.4222 7.53088C22.423 7.49774 22.4233 7.46423 22.4233 7.43091C22.4232 7.04108 22.1075 6.72485 21.7177 6.72412Z"
                      fill="#2E9BFF"
                    />
                    <path
                      d="M12 4.3125C10.7408 4.3125 9.71631 5.33698 9.71631 6.59619C9.71631 7.85541 10.7408 8.8797 12 8.8797C13.2592 8.8797 14.2837 7.85541 14.2837 6.59619C14.2837 5.33698 13.2592 4.3125 12 4.3125Z"
                      fill="#2E9BFF"
                    />
                    <path
                      d="M12.0002 4.3125V8.87988C13.2595 8.8797 14.2838 7.85541 14.2838 6.59619C14.2838 5.33698 13.2593 4.31268 12.0002 4.3125Z"
                      fill="#2B96F8"
                    />
                    <path
                      d="M2.28369 6.07471C1.02448 6.07471 0 7.09918 0 8.3584C0 9.61761 1.02448 10.6421 2.28369 10.6421C3.54291 10.6421 4.5672 9.61761 4.5672 8.3584C4.5672 7.09918 3.54291 6.07471 2.28369 6.07471Z"
                      fill="#2E9BFF"
                    />
                    <path
                      d="M21.7164 6.07471C20.4572 6.07471 19.4329 7.09918 19.4329 8.3584C19.4329 9.61743 20.4572 10.6419 21.7164 10.6419C22.9756 10.6419 24.0001 9.61743 24.0001 8.3584C24.0001 7.09918 22.9756 6.07471 21.7164 6.07471Z"
                      fill="#2B96F8"
                    />
                    <path
                      d="M19.6523 19.6612H4.34766C3.95728 19.6612 3.64087 19.3448 3.64087 18.9544V16.8467H20.3591V18.9544C20.3591 19.3448 20.0427 19.6612 19.6523 19.6612Z"
                      fill="#2E9BFF"
                    />
                    <path
                      d="M12.0002 19.6612H19.6524C20.0428 19.6612 20.3592 19.3448 20.3592 18.9544V16.8467H12.0002V19.6612Z"
                      fill="#2B96F8"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_708_22686">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              ) : (
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_708_22719)">
                    <path
                      d="M19.6523 17.8426H4.3476C4.11377 17.8426 3.89532 17.7271 3.76367 17.5339C1.74438 14.5727 1.58948 8.87646 1.57776 8.03088C1.57703 7.99774 1.57666 7.96423 1.57666 7.93091C1.57666 7.54108 1.89233 7.22485 2.28217 7.22412H2.28363C2.67273 7.22412 2.98895 7.53888 2.99042 7.92816C2.99042 7.93292 2.9906 7.97467 2.99225 8.04865C3.0545 10.0597 4.70996 11.6763 6.73584 11.6763C8.80109 11.6763 10.4813 9.99615 10.4813 7.93091C10.4813 7.54053 10.7979 7.22412 11.188 7.22412H12.8116C13.202 7.22412 13.5184 7.54053 13.5184 7.93091C13.5184 9.99615 15.1988 11.6763 17.264 11.6763C19.2917 11.6763 20.9483 10.0568 21.0078 8.04315C21.0091 7.97247 21.0095 7.93292 21.0095 7.92834C21.0109 7.53888 21.327 7.22412 21.7162 7.22412H21.7175C22.1074 7.22485 22.423 7.54108 22.423 7.93091C22.423 7.96442 22.4227 7.99774 22.4221 8.03107C22.4102 8.87646 22.2553 14.5729 20.2362 17.5341C20.1046 17.7271 19.8859 17.8426 19.6523 17.8426Z"
                      fill="#BB7712"
                    />
                    <path
                      d="M21.7177 7.22412C21.7173 7.22412 21.7169 7.22412 21.7164 7.22412C21.3273 7.22412 21.011 7.53888 21.0096 7.92816C21.0096 7.93292 21.0094 7.97247 21.0079 8.04315C20.9484 10.0566 19.2919 11.6763 17.2642 11.6763C15.1989 11.6763 13.5187 9.99615 13.5187 7.93091C13.5187 7.54053 13.2021 7.22412 12.812 7.22412H12.0002V17.8424H19.6524C19.8862 17.8424 20.1047 17.7269 20.2363 17.5339C22.2556 14.5727 22.4105 8.87628 22.4222 8.03088C22.423 7.99774 22.4233 7.96423 22.4233 7.93091C22.4232 7.54108 22.1075 7.22485 21.7177 7.22412Z"
                      fill="#8C670F"
                    />
                    <path
                      d="M12 4.8125C10.7408 4.8125 9.71631 5.83698 9.71631 7.09619C9.71631 8.35541 10.7408 9.3797 12 9.3797C13.2592 9.3797 14.2837 8.35541 14.2837 7.09619C14.2837 5.83698 13.2592 4.8125 12 4.8125Z"
                      fill="#8C670F"
                    />
                    <path
                      d="M12.0002 4.8125V9.37988C13.2595 9.3797 14.2838 8.35541 14.2838 7.09619C14.2838 5.83698 13.2593 4.81268 12.0002 4.8125Z"
                      fill="#7C4807"
                    />
                    <path
                      d="M2.28369 6.57471C1.02448 6.57471 0 7.59918 0 8.8584C0 10.1176 1.02448 11.1421 2.28369 11.1421C3.54291 11.1421 4.5672 10.1176 4.5672 8.8584C4.5672 7.59918 3.54291 6.57471 2.28369 6.57471Z"
                      fill="#8C670F"
                    />
                    <path
                      d="M21.7164 6.57471C20.4572 6.57471 19.4329 7.59918 19.4329 8.8584C19.4329 10.1174 20.4572 11.1419 21.7164 11.1419C22.9756 11.1419 24.0001 10.1174 24.0001 8.8584C24.0001 7.59918 22.9756 6.57471 21.7164 6.57471Z"
                      fill="#7C4807"
                    />
                    <path
                      d="M19.6523 20.1612H4.34766C3.95728 20.1612 3.64087 19.8448 3.64087 19.4544V17.3467H20.3591V19.4544C20.3591 19.8448 20.0427 20.1612 19.6523 20.1612Z"
                      fill="#8C670F"
                    />
                    <path
                      d="M12.0002 20.1612H19.6524C20.0428 20.1612 20.3592 19.8448 20.3592 19.4544V17.3467H12.0002V20.1612Z"
                      fill="#7C4807"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_708_22719">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              ))}
            {index < 3 ? (
              <span style={{ marginRight: "8px" }}>{record.stt}</span>
            ) : (
              <span style={{ marginRight: "18px" }}></span>
            )}
            <span>{text}</span>
          </div>
        ),
      },
      {
        title: "Nhân viên",
        dataIndex: "customer_name",
        width: "50%",
        render: (text, record) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar shape="square" size={40} src={record.https} />{" "}
            {/* Avatar nhân viên */}
            <div style={{ marginLeft: "8px", fontSize: "13px" }}>
              {" "}
              {/* Điều chỉnh kích thước văn bản */}
              <p style={{ marginBottom: "2px" }}>{text}</p>{" "}
              {/* Tên nhân viên */}
              <p style={{ color: "#888", margin: "0" }}>
                ID: {record.employee_id}
              </p>{" "}
              {/* Mã nhân viên */}
            </div>
          </div>
        ),
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
      },
    ],
    // source: [
    //   {
    //     stt: "",
    //     customer_name: "Nguyễn Văn A",
    //     employee_id: "NV001",
    //     quantity: 10,
    //     https:
    //       "//user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png",
    //   },
    //   {
    //     stt: "",
    //     customer_name: "Trần Thị B",
    //     employee_id: "NV002",
    //     quantity: 15,
    //     https:
    //       "//user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png",
    //   },
    //   {
    //     stt: "",
    //     customer_name: "Lê Văn C",
    //     employee_id: "NV003",
    //     quantity: 20,
    //     https:
    //       "//user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png",
    //   },
    //   {
    //     stt: "",
    //     customer_name: "Lê Văn C",
    //     employee_id: "NV003",
    //     quantity: 20,
    //     https:
    //       "//user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png",
    //   },
    //   {
    //     stt: "",
    //     customer_name: "Lê Văn C",
    //     employee_id: "NV003",
    //     quantity: 20,
    //     https:
    //       "//user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png",
    //   },
    // ],
  };
  useEffect(() => {
    initDataDashboard();
  }, [searchTime]);
  const initDataDashboard = async () => {
    let startDateTimestamp = null;
    let endDateTimestamp = null;
    if (
      searchTime &&
      searchTime.length === 2 &&
      searchTime[0] &&
      searchTime[1]
    ) {
      const startDate = new Date(searchTime[0]);
      startDate.setUTCHours(0, 0, 0, 0);
      startDateTimestamp = Math.floor(startDate.getTime() / 1000); // Chia cho 1000 để lấy timestamp dưới dạng giây

      const endDate = new Date(searchTime[1]);
      endDate.setUTCHours(23, 59, 59, 999);
      endDateTimestamp = Math.floor(endDate.getTime() / 1000); // Chia cho 1000 để lấy timestamp dưới dạng giây
      if (startDate >= endDate) {
        message.error("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.");
        return; // Dừng hàm nếu có lỗi
      }
    }
    let urlOverviewDashboard = `/api/method/mbw_audit.api.api.summary_overview_dashboard`;
    let urlDashboardCampaign = `/api/method/mbw_audit.api.api.summary_campaign`;
    let urlDashboardEmployeeTakePicture = `/api/method/mbw_audit.api.api.summary_user_by_picture`;

    // Thêm tham số start_date và end_date nếu có
    if (startDateTimestamp !== null && endDateTimestamp !== null) {
      urlOverviewDashboard += `?start_date=${startDateTimestamp}&end_date=${endDateTimestamp}`;
      urlDashboardCampaign += `?start_date=${startDateTimestamp}&end_date=${endDateTimestamp}`;
      urlDashboardEmployeeTakePicture += `?start_date=${startDateTimestamp}&end_date=${endDateTimestamp}`;
    }
    let res = await AxiosService.get(urlOverviewDashboard);
    let resCampaign = await AxiosService.get(urlDashboardCampaign);
    let resEmployeeTakePic = await AxiosService.get(
      urlDashboardEmployeeTakePicture
    );
    if (resCampaign.message == "ok") {
      colTableTyLe["source"] = resCampaign.result.data
        .map((item, index) => {
          return {
            stt: ("0" + (index + 1)).slice(-2), // Chuyển số thứ tự thành chuỗi có độ dài 2 ký tự và thêm số 0 ở đầu nếu cần
            campaign_code: item.id,
            campaign_name: item.campaign_name,
            tyle_ai: item.ratio_ai_evaluate, // Bạn cần tính toán tỷ lệ AI dựa trên dữ liệu của mình
            tyle_giamsat: item.ratio_human_evaluate, // Tương tự, bạn cần tính toán tỷ lệ giám sát
          };
        })
        .sort((a, b) => b.tyle_giamsat - a.tyle_giamsat);
      let colTableTienDoTyLe = {
        columns: [
          {
            title: "STT",
            dataIndex: "stt",
            width: "18%",
          },
          {
            title: "Chiến dịch",
            dataIndex: "campaign_name",
            width: "52%",
            render: (_, record) => (
              <a href="javascript:;" onClick={() => handleCampaignClick(record)}>{record.campaign_name}</a>
            )
          },
          {
            title: "Tỷ lệ",
            dataIndex: "tyle",
            width: "30%",
            render: (percent) => (
              <Progress
                percent={Math.round(percent)}
                format={(percent) => `${percent} %`}
                strokeColor={percent > 50 ? "#52c41a" : "rgba(255, 86, 48, 1)"}
              />
            ),
          },
        ],
        source: resCampaign.result.data
          .map((item, index) => ({
            stt: ("0" + (index + 1)).slice(-2),
            campaign_code: item.id,
            campaign_name: item.campaign_name,
            tyle: item.processing,
          }))
          .sort((a, b) => b.tyle - a.tyle)
          .map((item, index) => ({
            ...item,
            stt: ("0" + (index + 1)).slice(-2),
          })),
      };
      let dataSourceByPicture = JSON.parse(JSON.stringify(resCampaign.result.data));
      dataSourceByPicture = dataSourceByPicture.sort((a, b) => {
        return b.num_picture - a.num_picture;
      });
      let sampleData = {
        labels: dataSourceByPicture.map((entry) => entry.campaign_name),
        datasets: [
          {
            label: "Chiến dịch",
            backgroundColor: "rgba(24, 119, 242, 1)",
            borderColor: "rgba(24, 119, 242, 1)",
            borderWidth: 0.5,
            hoverBackgroundColor: "rgba(24, 119, 242, 1)",
            hoverBorderColor: "rgba(24, 119, 242, 1)",
            data: dataSourceByPicture.map((entry) => entry.num_picture),
          },
        ],
      };
      setColTableTyLeDat(colTableTyLe);
      setColTableTienDoTyLe(colTableTienDoTyLe);
      setChienDichThucHien(sampleData);
    }
    if (res.message == "ok") {
      const campaign_start = res.result.data.campaign_start;
      const report_pass_ai = res.result.data.report_pass_ai;
      const report_pass_human = res.result.data.report_pass_human;
      const num_reports = res.result.data.num_reports;
      const customer = res.result.data.customer;
      const employee = res.result.data.employee;

      setDataChienDichViengTham({
        title: "Tổng số chiến dịch đã chụp ảnh",
        data: campaign_start,
        show_ratio: false,
      });

      setDataBaoCaoAI({
        title: "Số báo cáo AI chấm đạt",
        data: report_pass_ai,
        show_ratio: true,
        ratio:
          num_reports !== 0
            ? Math.round((report_pass_ai / num_reports) * 100)
            : 0,
      });

      setDataGiamSat({
        title: "Số báo cáo giám sát chấm đạt",
        data: report_pass_human,
        show_ratio: true,
        ratio:
          num_reports !== 0
            ? Math.round((report_pass_human / num_reports) * 100)
            : 0,
      });

      setDataKhachHangThamgia({
        title: "Tổng khách hàng tham gia",
        data: customer,
        show_ratio: false,
      });

      setDataNhanVienThucHien({
        title: "Tổng nhân viên thực hiện",
        data: employee,
        show_ratio: false,
      });
    }

    if (resEmployeeTakePic.message == "ok") {
      const sortedData = resEmployeeTakePic.result.data.sort(
        (a, b) => b.num_picture - a.num_picture
      );

      // Chuyển đổi mảng đã sắp xếp thành định dạng mới
      const result = sortedData.map((entry, index) => ({
        stt: "",
        customer_name: entry.employee_name,
        employee_id: entry.id,
        quantity: entry.num_picture,
        https:
          entry.employee_picture ||
          "//user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png",
      }));
      colTableNhanVienChupAnh["source"] = result;
      setDataNhanVienChup(colTableNhanVienChupAnh);
    }
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <HeaderPage title="Dashboard" />
      
        <Form.Item className="border-none" style={{padding:'20px 0', margin:'0'}} label="Thời gian thực hiện">
          <RangePicker
            value={searchTime}
            onChange={(dates) => setSearchTime(dates)}
          />
        </Form.Item>
     
       
      </div>
      <Row gutter={10} style={{ marginTop: "20px" }}>
        <Col span={5} className="card-container">
          <Overview data={dataChienDichViengTham} />
        </Col>

        <Col span={5} className="card-container">
          <Overview data={dataBaoCaoAI} />
        </Col>

        <Col span={5} className="card-container">
          <Overview data={dataGiamSat} />
        </Col>

        <Col span={5} className="card-container">
          <Overview data={dataKhachHangThamgia} />
        </Col>

        <Col span={4} className="card-container">
          <Overview data={dataNhanVienThucHien} />
        </Col>
      </Row>

      <Row gutter={20} style={{ marginTop: "30px" }}>
        <Col span={16} style={{ minHeight: "450px" }}>
          <InfoCard
            data={{
              title: "Tỷ lệ chấm điểm đạt theo từng chiến dịch",
              data: colTableTyLeDat,
              height: 450,
            }}
          />
        </Col>
        <Col span={8} style={{ minHeight: "450px" }}>
          <InfoCard
            data={{
              title: "Tỷ lệ khách hàng đã chụp ảnh trưng bày theo chiến dịch",
              data: colTableTienDoTyLe,
              height: 450,
            }}
          />
        </Col>
      </Row>
      <Row gutter={20} style={{ marginTop: "20px" }}>
        <Col span={16}>
          <InfoCardChart
            data={{
              title: "Số lượng ảnh chụp theo chiến dịch",
              data: chienDichThucHien,
            }}
          />
        </Col>
        <Col span={8}>
          <InfoCardEmploy
            data={{
              title: "Danh sách nhân viên chụp ảnh nhiều nhất",
              data: dataNhanVienChup,
            }}
          />
        </Col>
      </Row>
    </>
  );
}
