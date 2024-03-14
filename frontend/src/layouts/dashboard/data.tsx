import {
    BarChartOutlined, ReconciliationOutlined, SolutionOutlined, UnorderedListOutlined,
  } from "@ant-design/icons";
  import { MenuProps } from "antd";
  import { Link } from "react-router-dom";
  
  type MenuItem = Required<MenuProps>["items"][number];
  export const listMenu: MenuItem[] = [
    //dashboard
    {
      label: (
        <Link className={""} to="/">
          <p className="text-[#212B36] text-custom font-normal text-sm leading-[22px]">
            Dashboard
          </p>
        </Link>
      ),
      icon: <BarChartOutlined style={{ fontSize: "22px" }} />,
      key: "dashboard",
    },
    {
      label: (
        <Link className={""} to="/reports">
          <p className="text-[#212B36] text-custom font-normal text-sm leading-[22px]">
            Báo cáo
          </p>
        </Link>
      ),
      icon: <ReconciliationOutlined style={{ fontSize: "22px" }} />,
      key: "report",
    },
    {
        label: (
          <Link className={""} to="/product_sku">
            <p className="text-[#212B36] text-custom font-normal text-sm leading-[22px]">
              Sản phẩm
            </p>
          </Link>
        ),
        icon: <UnorderedListOutlined style={{ fontSize: "22px" }} />,
        key: "product_sku",
      },
      {
        label: (
          <Link className={""} to="/campaign">
            <p className="text-[#212B36] text-custom font-normal text-sm leading-[22px]">
              Chiến dịch
            </p>
          </Link>
        ),
        icon: <SolutionOutlined style={{ fontSize: "22px" }} />,
        key: "campaign",
      }
  ];
  