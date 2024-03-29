import React, { useEffect, useState } from "react";
import { Row, Col, Avatar, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import {} from "frappe-react-sdk";
import { useFrappeAuth } from "frappe-react-sdk";

import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { AxiosService } from "../../services/server";
import { rsData } from "../../types/response";

export default function Header() {
  const { currentUser } = useFrappeAuth();

  const [empDetail, setEmpDetail] = useState<employeeType>();
  useEffect(() => {
    (async () => {
      const rsEmployee: rsData<employeeType> = await AxiosService.get(
        "api/method/mbw_service_v2.api.user.get_employee_info"
      );
      console.log("employee", rsEmployee);
      setEmpDetail(rsEmployee.result);
    })();
  }, []);
  const items: MenuProps["items"] = [
    {
      label: (
        <a href="/app/user-profile" className="w-[200px]">
          My Profile
        </a>
      ),
      key: "0",
    },
    {
      label: <a href={`app/user/${currentUser}`}>My Settings</a>,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: <a href="/?cmd=web_logout">Log out</a>,
      key: "3",
    },
  ];
  return (
    <div className="w-full !border-[red] border bg-white py-[7px] !border-b-4">
      <Row className="justify-end max-w-full ">
        <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement={"bottomRight"}
            dropdownRender={(menu) => (
              <div className="w-[200px]">
                {React.cloneElement(menu as React.ReactElement)}
              </div>
            )}
          >
            <Avatar
              style={{ backgroundColor: "#f56a00" }}
              size={32}
              {...(empDetail?.image ? { src: empDetail?.image } : {})}
            >
              {!empDetail?.image && empDetail?.employee_name[0]}
            </Avatar>
          </Dropdown>
      </Row>
    </div>
  );
}
