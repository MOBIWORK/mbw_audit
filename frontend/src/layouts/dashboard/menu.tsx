import { BarsOutlined, FileDoneOutlined, FileTextOutlined, PieChartOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { MenuProps } from "antd/lib";
import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";

export default function MenuLeft() {
  const [current, setCurrent] = useState("1");
  const location = useLocation();
  useEffect(() => {
    if(location.pathname == "/"){
      setCurrent("1");
    }else if(location.pathname == "/product_sku"){
      setCurrent("2");
    }else if(location.pathname == "/campaign"){
      setCurrent("3");
    }
  }, [location])
  console.log(location);
  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }

  const items: MenuItem[] = [
    getItem(
      <NavLink
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
        to="/"
      >
        Báo cáo
      </NavLink>,
      "1",
      <PieChartOutlined />
    ),
    getItem(
      <NavLink
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
        to="/product_sku"
      >
        Sản phẩm
      </NavLink>,
      "2",
      <FileTextOutlined />
    ),
    getItem(
      <NavLink
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
        to="/campaign"
      >
        Chiến dịch
      </NavLink>,
      "3",
      <FileDoneOutlined />
    ),
    
  ];
  type MenuItem = Required<MenuProps>["items"][number];
  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="inline"
      items={items}
    ></Menu>
  );
}
