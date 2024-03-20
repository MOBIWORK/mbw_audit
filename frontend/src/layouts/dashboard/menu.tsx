import { MenuProps } from "antd/lib";
import { useEffect, useState } from "react";
import { listMenu } from "./data";
import { MenuCustom } from "../../components/menu-item/menu-item";
import { useLocation } from 'react-router-dom';

export default function MenuLeft() {
  const [current, setCurrent] = useState("dashboard");
  let location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      setCurrent("dashboard");
    } else if (location.pathname === "/reports") {
      setCurrent("report");
    } else if (location.pathname === "/product_sku") {
      setCurrent("product_sku");
    }else if(location.pathname === "/campaign"){
      setCurrent("campaign");
    }
  }, [location.pathname]);
  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

 
  return (
    <MenuCustom
      onClick={onClick}
      selectedKeys={[current]}
      mode="inline"
      items={listMenu}
    ></MenuCustom>
  );
}
