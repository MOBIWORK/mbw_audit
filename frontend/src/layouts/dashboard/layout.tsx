import React, { useState } from "react";
import Header from "./header";
import MenuLeft from "./menu";
import { Layout } from "antd";
import styled from "styled-components";
import AvatarComponent from "./avatar-component";

type Props = {
  children: React.ReactNode;
};
const { Content, Sider } = Layout;


const SiderCustome = styled(Sider)` 
& .ant-layout-sider-trigger {
  width:100%;
  height: fit-content;
}
`
export default function DashboardLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout className="overflow-hidden h-screen">
        <SiderCustome className="!bg-[#fff]" width={!collapsed ? 250 : 78} collapsible collapsed={collapsed} trigger={<AvatarComponent mini={collapsed}/>} >            
            <MenuLeft handleCollapsed = {setCollapsed} collapsed={collapsed}/>
          </SiderCustome>
          <Content
              className="round !overflow-y-auto"
              style={{ padding: "0px 24px 20px", maxHeight: "calc(100vh-46px)", overflow: "auto" ,background:"#F4F6F8" }}
            >
              <div style={{width:'100%', height: '100%'}}>{children}</div>
            </Content>
    </Layout>
  );
}