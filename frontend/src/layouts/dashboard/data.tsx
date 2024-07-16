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
      <a href="/mbw_desk" style={{textDecoration: "unset"}}>Tổng quan</a>
    ),
    icon: <BarChartOutlined style={{ fontSize: "22px" }} />,
    key: "dashboard",
  },
  //customer map
  {
    label: (
      <a href="/mbw_desk/customers-map" style={{textDecoration: "unset"}}>Bản đồ khách hàng</a>
    ),
    icon: <AliyunOutlined style={{ fontSize: "22px" }}  />,
    key: "csmap",
  },
  //giam sat
  {
    label: (
      <a href="#" className={"text-[#212B36] hover:text-[#212B36]"} style={{textDecoration: "unset"}}>Giám sát</a>
    ),
    icon: <FileSearchOutlined style={{ fontSize: "22px" }} />,
    key: "giamsat",
    children: [
      {
        label: (
          <a href="/mbw_desk/monitor-album" style={{textDecoration: "unset"}}>Giám sát chụp ảnh khách hàng</a>
        ),
        key: "giamsat-image",
      },
      {
        label: (
          <a href="/mbw_desk/employee-monitor" style={{textDecoration: "unset"}}>Giám sát viếng thăm khách hàng</a>
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
      <a href="/mbw_desk/router-control" style={{textDecoration: "unset"}}>Quản lý tuyến</a>
    ),
    icon: <FileDoneOutlined style={{ fontSize: "22px" }} />,
    key: "control",
  },

  //cham diem trung bay
  {
    label: (
      <a href="#" className={"text-[#212B36] hover:text-[#212B36]"} style={{textDecoration: "unset"}}>Chấm điểm trưng bày</a>
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
      <a href="#" className={"text-[#212B36] hover:text-[#212B36]"} style={{textDecoration: "unset"}}>Báo cáo</a>
    ),
    icon: <ReconciliationOutlined style={{ fontSize: "22px" }} />,
    key: "report",
    children: [
      {
        label: (
          <a href="/mbw_desk/report-customer" className={"text-[#212B36] hover:text-[#212B36]"} style={{textDecoration: "unset"}}>Báo cáo tồn kho khách hàng</a>
        ),
        key: "report-customer",
      },
      {
        label: (
          <a href="/mbw_desk/report-kpi" className={"text-[#212B36] hover:text-[#212B36]"} style={{textDecoration: "unset"}}>Báo cáo KPI</a>
        ),
        key: "report_kpi",
      },
      {
        label: (
          <a href="/mbw_desk/report-checkin" className={"text-[#212B36] hover:text-[#212B36]"} style={{textDecoration: "unset"}}>Báo cáo viếng thăm</a>
        ),
        key: "report-checkin",
      },
      {
        label: (
          <a href="/mbw_desk/report-sales" className={"text-[#212B36] hover:text-[#212B36]"} style={{textDecoration: "unset"}}>Báo cáo tổng hợp bán hàng</a>
        ),
        key: "report-sales",
      },
      {
        label: (
          <a href="/mbw_desk/report-saleorder" className={"text-[#212B36] hover:text-[#212B36]"} style={{textDecoration: "unset"}}>Báo cáo tổng hợp đặt hàng</a>
        ),
        key: "report-saleorder",
      },
      {
        label: (
          <a href="/mbw_desk/report-custom-new" className={"text-[#212B36] hover:text-[#212B36]"} style={{textDecoration: "unset"}}>Báo cáo khách hàng mới</a>
        ),
        key: "report-custom-new",
      },
      {
        label: (
          <a href="/mbw_desk/report-checkin-first" className={"text-[#212B36] hover:text-[#212B36]"} style={{textDecoration: "unset"}}>Báo cáo thống kê khách hàng viếng thăm lần đầu</a>
        ),
        key: "report-checkin-first",
      }
    ],
  },
];