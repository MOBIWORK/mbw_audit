import React from "react";
// import Header from './header'
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCookie from "../../hooks/useCookie";
import "./layout.css";
import { Dropdown, Avatar, Tooltip, Row, Col } from "antd";
import {
  BarsOutlined,
  EnvironmentOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme, Button } from "antd";
import MenuLeft from "./menu";
import HeaderItem from "./header-item";

const { Header, Content, Sider } = Layout;
type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    isLoading,
    currentUser,
    login,
  }: { isLoading: boolean; currentUser: any; login: any } = useCookie();
  useEffect(() => {
    // Define your handleLogin function
    const handleLogin = async () => {
      try {
        // Call the login function
        const response = await login({
          username: "administrator",
          password: "123",
        }); // Assuming login returns a promise
        console.log(response); // Log the response from the login function
      } catch (error) {
        console.error(error); // Log any errors that occur during login
      }
    };

    // Call handleLogin when the component mounts
    handleLogin();

    // Clean up function (optional)
    return () => {
      // Perform any cleanup if needed
    };
  }, []);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const UserProfileMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <a href="/">Thông tin cá nhân</a>
      </Menu.Item>
      <Menu.Item key="setting" icon={<SettingOutlined />}>
        <a href="/">Cài đặt</a>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        <a href="/">Đăng xuất</a>
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        style={{ background: colorBgContainer }}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="container_logo">
          <img src="./vgm_project/logo.png" className="icon_logo"/>
          <div className="icon_text">
            <div className="title_text">NEXT GEN</div>
            <div className="description_text">MOBIWORK</div>
          </div>
        </div>
       <MenuLeft/>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Row justify="space-between" align="middle">
            <Col md={18}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
            </Col>
            <Col
              md={6}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingRight: "20px",
                height: "35px",
              }}
            >
              <Dropdown
                overlay={UserProfileMenu}
                trigger={["click"]}
                placement="bottomRight"
                overlayStyle={{ marginTop: "8px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Avatar icon={<UserOutlined />} />
                  <span style={{ marginLeft: "8px" }}>
                    {currentUser ? currentUser : "Administrator"}
                  </span>
                </div>
              </Dropdown>
            </Col>
          </Row>
        </Header>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <div style={{ margin: "0px 16px 0px 35px" }}>
          {children}
        </div>
        {/* <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer> */}
      </Layout>
    </Layout>
  );
}
