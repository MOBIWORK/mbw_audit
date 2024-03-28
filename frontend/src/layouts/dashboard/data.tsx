import {
  BarChartOutlined,
  ReconciliationOutlined,
  SolutionOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { Link } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];
export const listMenu: MenuItem[] = [
  //dashboard
  {
    label: (
      <Link className={""} to="/">
        Dashboard
      </Link>
    ),
    icon: <BarChartOutlined style={{ fontSize: "22px" }} />,
    key: "dashboard",
  },
  {
    label: (
      <Link className={"text-[#212B36] hover:text-[#212B36]"} to={"reports"}>
        Báo cáo
      </Link>
    ),
    icon: <ReconciliationOutlined style={{ fontSize: "22px" }} />,
    key: "report",
  },
  {
    label: (
      <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/product_sku">
        Sản phẩm
      </Link>
    ),
    icon: <UnorderedListOutlined style={{ fontSize: "22px" }} />,
    key: "product_sku",
  },
  {
    label: (
      <Link className={"text-[#212B36] hover:text-[#212B36]"} to="/campaign">
        Chiến dịch
      </Link>
    ),
    icon: <SolutionOutlined style={{ fontSize: "22px" }} />,
    key: "campaign",
  },
];
