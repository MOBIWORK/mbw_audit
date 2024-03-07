import { HeaderPage } from "../../components";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Tabs, message } from "antd";
import GeneralInformationCampaignEdit from "./general-information";
import ProductCampaignEdit from "./product";
import CustomerCampaignEdit from "./customer-list";
import EmployeeSellCampaignEdit from "./employee-sale";
import {useEffect, useState} from 'react';
import { AxiosService } from "../../services/server";
import moment from 'moment';

export default function CampaignEdit() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const {name} = useParams();
  const [campaignStatus, setCampaignStatus] = useState("Open");
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [employeesSelected, setEmployeesSelected] = useState([]);
  const [customersSelected, setCustomersSelected] = useState([]);

  //init data
  const [statusCampaignEdit, setStatusCampaignEdit] = useState("");
  const [categoryEdit, setCategoryEdit] = useState([]);
  const [employeeEdit, setEmployeeEdit] = useState([]);
  const [customerEdit, setCustomerEdit] = useState([]);
  const [productEdit, setProductEdit] = useState({});
  

  useEffect(() => {
    initDataByIdCampaign();
  }, [name]);

  const initDataByIdCampaign = async () => {
    let urlDetailCampaign = `/api/resource/VGM_Campaign/${name}`;
    let res = await AxiosService(urlDetailCampaign);
    if(res != null && res.data != null){
        form.setFieldsValue({
            'campaign_name': res.data.campaign_name,
            'campaign_description': res.data.campaign_description,
            'campaign_start': convertDateFormat(res.data.start_date),
            'campaign_end': convertDateFormat(res.data.end_date),
             campaign_status: res.data.campaign_status,
        })
        setStatusCampaignEdit(res.data.campaign_status);
        setCategoryEdit(JSON.parse(res.data.categories));
        setProductEdit(JSON.parse(res.data.setting_score_audit));
        setEmployeeEdit(JSON.parse(res.data.employees));
        setCustomerEdit(JSON.parse(res.data.retails));

    }
  }

  const convertDateFormat = (val) => {
    const datePickerDate = moment(val, 'YYYY-MM-DD HH:mm:ss');
    return datePickerDate;
  }

  const handleEditCampaign = async () => {
    try {
        let objFrm = form.getFieldsValue();
        let arrCategory = (categoriesSelected && categoriesSelected.length > 0) ? categoriesSelected.map(x => x.name) : categoryEdit;
        let arrEmployee = (employeesSelected && employeesSelected.length > 0) ? employeesSelected.map(x => x.name) : employeeEdit;
        let arrCustomer = (customersSelected && customersSelected.length > 0) ? customersSelected.map(x => x.name) : customerEdit;
        let urlPutData = `/api/resource/VGM_Campaign/${name}`;
        let dataPut = {
            'campaign_name': objFrm.campaign_name,
            'campaign_description': objFrm.campaign_description,
            'start_date': convertDate(objFrm.campaign_start),
            'end_date': convertDate(objFrm.campaign_end),
            'campaign_status': campaignStatus,
            'categories': JSON.stringify(arrCategory),
            'employees': JSON.stringify(arrEmployee),
            'retails': JSON.stringify(arrCustomer),
            'setting_score_audit': productEdit
        };

        let res = await AxiosService.put(urlPutData, dataPut);

        if (res != null && res.data != null) {
            message.success("Cập nhật thành công");
            navigate('/campaign');
        } else {
            message.error("Cập nhật thất bại");
        }
    } catch (error) {
        // Xử lý khi có lỗi xảy ra trong quá trình cập nhật
        message.error("Không thể cập nhật. Vui lòng kiểm tra lại thông tin");
    }
};

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
      // Khởi tạo biến kết quả
      let result = {};
      for (let i = 0; i < val.length; i++) {
        // Duyệt qua mảng products và tạo biến kết quả
        val[i].products.forEach((product) => {
          result[product.key] = {
            min_product: parseInt(product.product_num),
          };
        });
      }

      setProductEdit(result);
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
        title="Sửa chiến dịch"
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
            label: "Lưu lại",
            type: "primary",
            size: "20px",
            className: "flex items-center",
            action: handleEditCampaign
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
                children: <GeneralInformationCampaignEdit form={form} statusCampaign={statusCampaignEdit} onCampaignStatusChange={handleCampaignStatusChange}/>,
              },
              {
                label: <p className="px-4 mb-0">Sản phẩm</p>,
                key: "2",
                children: (
                  <ProductCampaignEdit onChangeCategory={handleChangeCategory} categoryEdit={categoryEdit} productEdit={productEdit} 
                  />
                ),
              },
              {
                label: <p className="px-4 mb-0">Nhân viên bán hàng</p>,
                key: "3",
                children: (
                  <EmployeeSellCampaignEdit onChangeEmployees={handleChangeEmployee} employeeEdit={employeeEdit}
                  />
                ),
              },
              {
                label: <p className="px-4 mb-0">Khách hàng</p>,
                key: "4",
                children: (
                  <CustomerCampaignEdit onChangeCustomer={hangleChangeCustomer} customerEdit={customerEdit}
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
