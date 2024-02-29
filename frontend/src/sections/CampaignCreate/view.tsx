import { HeaderPage } from "../../components";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Form, Tabs, message } from "antd";
import GeneralInformation from "./general-information";
import Product from "./product";
import Customer from "./customer-list";
import EmployeeSell from "./employee-sale";
import {useState} from 'react';
import { AxiosService } from "../../services/server";

export default function  CampaignCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [campaignStatus, setCampaignStatus] = useState("Open");
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [employeesSelected, setEmployeesSelected] = useState([]);
  const [customersSelected, setCustomersSelected] = useState([]);

  const handleAddCampaign = async () => {
    let objFrm = form.getFieldsValue();
    let arrCategory = categoriesSelected.map(x => x.name);
    let arrEmployee = employeesSelected.map(x => x.name);
    let arrCustomer = customersSelected.map(x => x.name);

    let urlPostData = "/api/resource/VGM_Campaign";
    let dataPost = {
      'campaign_name': objFrm.campaign_name,
      'campaign_description': objFrm.campaign_description,
      'start_date': convertDate(objFrm.campaign_start),
      'end_date': convertDate(objFrm.campaign_end),
      'campaign_status': campaignStatus,
      'products': JSON.stringify(arrCategory),
      'employees': JSON.stringify(arrEmployee),
      'retails': JSON.stringify(arrCustomer)
    }
    let res = await AxiosService.post(urlPostData, dataPost);
    if(res != null && res.data != null){
      message.success("Thêm mới thành công");
      navigate('/campaign');
    }else{
      message.error("Thêm mới thất bại");
    }
  }

  const convertDate = (val) => {
    // Tạo một đối tượng Date từ chuỗi thời gian
    const dateObject = new Date(val);

    // Chuyển đổi định dạng thành định dạng phù hợp cho MySQL
    const formattedDate = dateObject.toISOString().slice(0, 19).replace('T', ' ');
    return formattedDate;
  }

  const handleCampaignStatusChange = (val) => {
    setCampaignStatus(val);
  }

  const handleChangeCategory = (val) => {
    setCategoriesSelected(val);
  }

  const handleChangeEmployee = (val) => {
    setEmployeesSelected(val);
  }

  const hangleChangeCustomer = (val) => {
    setCustomersSelected(val);
  }

  return (
    <>
      <HeaderPage
        title="Thêm mới chiến dịch"
        icon={
          <p
            onClick={() => navigate("/campaign")}
            className="mr-2 cursor-pointer"
          >
            <LeftOutlined />
          </p>
        }
        buttons={[
          {
            label: "Thêm mới",
            type: "primary",
            size: "20px",
            className: "flex items-center",
            action: handleAddCampaign
          },
        ]}
      />
      <div className="bg-white pt-4 rounded-xl">
        <Form layout="vertical" form={form}>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                label: <p className="px-4 mb-0"> Thông tin chung</p>,
                key: "1",
                children: <GeneralInformation form={form} onCampaignStatusChange={handleCampaignStatusChange}/>,
              },
              {
                label: <p className="px-4 mb-0">Sản phẩm</p>,
                key: "2",
                children: (
                  <Product onChangeCategory={handleChangeCategory}
                  />
                ),
              },
              {
                label: <p className="px-4 mb-0">Nhân viên bán hàng</p>,
                key: "3",
                children: (
                  <EmployeeSell onChangeEmployees={handleChangeEmployee}
                  />
                ),
              },
              {
                label: <p className="px-4 mb-0">Khách hàng</p>,
                key: "4",
                children: (
                  <Customer onChangeCustomer={hangleChangeCustomer}
                  />
                ),
              },
            ]}
            indicatorSize={(origin) => origin - 18}
          />
        </Form>
      </div>
    </>
  );
}
