import { MenuProps } from "antd/lib";
import { useState } from "react";
import { listMenu } from "./data";
import { MenuCustom } from "../../components/menu-item/menu-item";

export default function MenuLeft() {
  const [current, setCurrent] = useState(
    localStorage.getItem("selectedKey") || "dashboard"
  );
  const onClick: MenuProps["onClick"] = (e) => {
    console.log(e);
    setCurrent(e.key);
    localStorage.setItem("selectedKey", e.key);
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
