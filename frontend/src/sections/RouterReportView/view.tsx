import { VscAdd } from "react-icons/vsc";
import { useState,useEffect } from "react";
import { HeaderPage } from "../../components";
import { LeftOutlined,CaretRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Form, Tabs ,Collapse  } from "antd";
import type { CollapseProps } from 'antd';
import GeneralInformation from "./general-information";
import Product from "./product";
import Customer from "./customer-list";
import EmployeeSell from "./employee-sale";
import './view.css'; 
export default function  ReportView() {
  const [recordData, setRecordData] = useState(null);
  const navigate = useNavigate();
  const onChange = (key: string | string[]) => {
    console.log(key);
  };
  const [form] = Form.useForm();
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: <span style={{ fontWeight: 700 }}>Thông tin chung</span>,
      children: <GeneralInformation form={form} recordData={recordData} />,
    },
    {
      key: '2',
      label: <span style={{ fontWeight: 700 }}>Sản phẩm</span>,
      children: <Product recordData={recordData}
      // handleCustomer={setCustomerRouter}
      // listCustomer={customerRouter}
    />,
    },
    
  ];
  
  useEffect(() => {
    // Lấy record từ local storage khi component được mount
    const storedRecordData = localStorage.getItem('recordData');
    if (storedRecordData) {
      setRecordData(JSON.parse(storedRecordData));
    }

    // Xóa record khỏi local storage sau khi đã sử dụng
    localStorage.removeItem('recordData');
  }, []);
  const renderTitle = () => {
    if (recordData) {
      // Tiêu đề bao gồm tên cửa hàng và chiến dịch từ storedRecordData
      return `${recordData.retail_code} - ${recordData.campaign_name}`;
    }
    // Nếu không có dữ liệu, hiển thị một tiêu đề mặc định
    return 'Tiêu đề';
  };
  return (
    <>
      <HeaderPage
        title={renderTitle()}
        icon={
          <p
            onClick={() => navigate("/")}
            className="mr-2 cursor-pointer"
          >
            <LeftOutlined />
          </p>
        }
        // buttons={[
        //   {
        //     label: "Thêm mới",
        //     type: "primary",
        //     size: "20px",
        //     className: "flex items-center",
        //   },
        // ]}
      />
      <div className="bg-white  rounded-xl">
        <Form layout="vertical" form={form}>
        <Collapse items={items} defaultActiveKey={['1','2']} onChange={onChange} className="custom-collapse"/>
          {}
        </Form>
      </div>
    </>
  );
}
