import { MenuProps } from "antd/lib";
import { useEffect, useState } from "react";
import { MenuCustom } from "../../components/menu/menu";
import { listMenu } from "./data";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { Col, Row } from "antd";
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";

export default function MenuLeft({
  handleCollapsed,
  collapsed,
}: {
  handleCollapsed: any;
  collapsed: boolean;
}) {
  const [current, setCurrent] = useState(
    localStorage.getItem("selectedKey") || "1"
  );
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    updateMenuState(path);
  }, [location]);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    localStorage.setItem("selectedKey", e.key);
  };

  const toggleCollapsed = () => {
    handleCollapsed(!collapsed);
  };

  const pathToMenuKeyMap: Record<string, string> = {
    "/": "dashboard",
    "/reports": "report",
    "/product_sku": "product_sku",
    "/campaign": "campaign",
  };

  const updateMenuState = (path: string) => {
    const currentKey = pathToMenuKeyMap[path] || "";
    setCurrent(currentKey);
  };
  
  return (
    <div>
      <Row className="justify-between items-center py-4 pl-4">
        <Col>
          <Link to="/" className="w-[32px] h-[32px]">
            <img src={logo} className="object-contain w-[32px] h-[32px]" />
          </Link>
        </Col>
        <Col onClick={toggleCollapsed} className="pr-2">
          {collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
        </Col>
      </Row>
      <div className="font-semibold text-lg text-[#919EAB] leading-[22px] pl-[8px] mx-2 pb-4">
        <Link
          className="font-semibold text-lg !text-[#919EAB] leading-[22px]"
          to=""
        >
          AUDIT
        </Link>
      </div>
      <MenuCustom
        theme="light"
        onClick={onClick}
        selectedKeys={[current]}
        mode="inline"
        items={listMenu}
        // inlineCollapsed={collapsed}
      />
    </div>
  );
}
