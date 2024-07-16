import {
  AliyunOutlined,
  BarChartOutlined,
  FileDoneOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { Link } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];
export const listMenu: MenuItem[] = [
  //dashboard
  {
    label: (
      <Link className={""} to="/mbw_desk">
          Tổng quan
      </Link>
    ),
    icon: <BarChartOutlined style={{ fontSize: "22px" }} />,
    key: "dashboard",
  },
  //customer map
  {
    label: (
      <Link className={""} to="/mbw_desk/customers-map">
          Bản đồ khách hàng
      </Link>
    ),
    icon: <AliyunOutlined style={{ fontSize: "22px" }}  />,
    key: "csmap",
  },
  //giam sat
  {
    label: (
      <Link className={"text-[#212B36] hover:text-[#212B36]"} to="#">
          Giám sát
      </Link>
    ),
    icon: <FileSearchOutlined style={{ fontSize: "22px" }} />,
    key: "giamsat",
    children: [
      {
        label: (
          <Link className={""} to="/mbw_desk/monitor-album">
              Giám sát chụp ảnh khách hàng
          </Link>
        ),
        key: "giamsat-image",
      },
      {
        label: (
          <Link className={""} to="/mbw_desk/employee-monitor">
              Giám sát viếng thăm khách hàng
          </Link>
        ),
        key: "employee-monitor",
      },
      // {
      //   label: (
      //     <Link className={""} to="employee-monitor-kpi">
      //         Giám sát nhân viên theo kpi
      //     </Link>
      //   ),
      //   key: "employee-monitor-kpi",
      // },
    ],
  },
  //control router
  {
    label: (
      <Link className={""} to="/mbw_desk/router-control">
       Quản lý tuyến
      </Link>
    ),
    icon: <FileDoneOutlined style={{ fontSize: "22px" }} />,
    key: "control",
  },

  //cham diem trung bay
  {
    label: (
      <Link className={"text-[#212B36] hover:text-[#212B36]"} to={"#"}>
          Chấm điểm trưng bày
      </Link>
    ),
    icon: <FileImageOutlined style={{ fontSize: "22px" }} />,
    key: "checkinimage",
    children: [
      {
        label: (
          <a className={"text-[#212B36] hover:text-[#212B36]"} href="/mbw_audit">
              Dashboard
          </a>
        ),
        key: "imagedb",
      },
      {
        label: (
          <a className={"text-[#212B36] hover:text-[#212B36]"} href="/mbw_audit/reports">
              Báo cáo
          </a>
        ),
        key: "imagerb",
      },
      {
        label: (
          <a className={"text-[#212B36] hover:text-[#212B36]"} href="/mbw_audit/product_sku">
              Sản phẩm
          </a>
        ),
        key: "imagesp",
      },
      {
        label: (
          <a className={"text-[#212B36] hover:text-[#212B36]"} href="/mbw_audit/campaign">
              Chiến dịch
          </a>
        ),
        key: "imagecd",
      },
    ]
  },
  //report
  {
    label: (
      <Link to={"#"} className={"text-[#212B36] hover:text-[#212B36]"}>
          Báo cáo
      </Link>
    ),
    icon: <ReconciliationOutlined style={{ fontSize: "22px" }} />,
    key: "report",
    children: [
      {
        label: (
          <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/mbw_desk/report-customer">
              Báo cáo tồn kho khách hàng
          </Link>
        ),
        key: "report-customer",
      },
      {
        label: (
          <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/mbw_desk/report-kpi">
              Báo cáo KPI
          </Link>
        ),
        key: "report_kpi",
      },
      {
        label: (
          <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/mbw_desk/report-checkin">
              Báo cáo viếng thăm
          </Link>
        ),
        key: "report-checkin",
      },
      {
        label: (
          <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/mbw_desk/report-sales">
              Báo cáo tổng hợp bán hàng
          </Link>
        ),
        key: "report-sales",
      },
      {
        label: (
          <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/mbw_desk/report-saleorder">
              Báo cáo tổng hợp đặt hàng
          </Link>
        ),
        key: "report-saleorder",
      },
      {
        label: (
          <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/mbw_desk/report-custom-new">
              Báo cáo khách hàng mới
          </Link>
        ),
        key: "report-custom-new",
      },
      {
        label: (
          <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/mbw_desk/report-checkin-first">
              Báo cáo thống kê khách hàng viếng thăm lần đầu
            
          </Link>
        ),
        key: "report-checkin-first",
      }
    ],
  },
];