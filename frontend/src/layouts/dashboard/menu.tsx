import { MenuProps } from "antd/lib";
import { useState } from "react";
import { MenuCustom } from "../../components/menu/menu";
import { listMenu } from "./data";
import { Link } from "react-router-dom";
import logo from "../../assets/react.svg";
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
     "1"
  );

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    localStorage.setItem("selectedKey", e.key);
  };

  const toggleCollapsed = () => {
    handleCollapsed(!collapsed);
  };

  return (
    <div>
      <Row className="justify-between items-center py-4 pl-4">
        <Col>
          <Link to="" onClick={e => {
            e.preventDefault()
            window.location.href = '/app'
          }} className="w-[32px] h-[32px]">
            <img src={logo} className="object-contain w-[32px] h-[32px]" />
          </Link>
        </Col>
        <Col onClick={toggleCollapsed} className="pr-2">
          {collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
        </Col>
      </Row>
      <div className="font-semibold text-lg text-[#919EAB] leading-[22px] pl-[8px] mx-2 pb-4">
        <Link className="font-semibold text-lg !text-[#919EAB] leading-[22px]" to="/">DMS</Link>
      </div>
      <div className="flex-1 !max-h-[89vh] overflow-y-auto invisible-scrollbar">
        <MenuCustom
          theme="light"
          onClick={onClick}
          selectedKeys={[current]}
          mode="inline"
          items={listMenu}
        // inlineCollapsed={collapsed}
        />
      </div>
    </div>
  );
}