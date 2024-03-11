import { HeaderPage } from "../../components";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Form, Tabs, message } from "antd";
import GeneralInformation from "./general-information";
import Product from "./product";
import Customer from "./customer-list";
import EmployeeSell from "./employee-sale";
import { useState } from "react";
import { AxiosService } from "../../services/server";

export default function CampaignCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [campaignStatus, setCampaignStatus] = useState("Open");
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [employeesSelected, setEmployeesSelected] = useState([]);
  const [customersSelected, setCustomersSelected] = useState([]);
  const [scoreSelected, setScoreSelected] = useState({});
  const [checkExistProduct, setCheckExistProduct] = useState(true);

  const handleAddCampaign = async () => {
    try {
        // Lấy giá trị từ form và các dữ liệu khác
        let objFrm = form.getFieldsValue();
        let startDate = convertDate(objFrm.campaign_start);
        let endDate = convertDate(objFrm.campaign_end);

        // Kiểm tra nếu start_date bé hơn end_date
        if (startDate >= endDate) {
            message.error("Thời gian bắt đầu phải nhỏ hơn Thời gian kết thúc");
            return; // Dừng lại nếu có lỗi
        }

        // Tiếp tục xử lý nếu không có lỗi về ngày tháng
        let objSettingScore = {};
        let propertiesSettingScore = Object.getOwnPropertyNames(scoreSelected);
        if (checkExistProduct) {
            let objMinProduct = {};
            propertiesSettingScore.forEach(item => {
                let valSettingScore = scoreSelected[item];
                objMinProduct[item] = valSettingScore.min_product;
            })
            objSettingScore["min_product"] = objMinProduct;
        }

        let arrCategory = categoriesSelected.map((x) => x.name);
        let arrEmployee = employeesSelected.map((x) => x.name);
        let arrCustomer = customersSelected.map((x) => x.name);

        let urlPostData = "/api/resource/VGM_Campaign";
        let dataPost = {
            campaign_name: objFrm.campaign_name,
            campaign_description: objFrm.campaign_description,
            start_date: startDate,
            end_date: endDate,
            campaign_status: campaignStatus,
            categories: JSON.stringify(arrCategory),
            employees: JSON.stringify(arrEmployee),
            retails: JSON.stringify(arrCustomer),
            setting_score_audit: objSettingScore
        };
        let res = await AxiosService.post(urlPostData, dataPost);

        if (res != null && res.data != null) {
            message.success("Thêm mới thành công");
            navigate("/campaign");
        } else {
            message.error("Thêm mới thất bại");
        }
    } catch (error) {
        // Xử lý khi có lỗi xảy ra trong quá trình thêm mới
        message.error("Không thể thêm mới. Vui lòng kiểm tra lại thông tin thời gian, sản phẩm, nhân viên, khách hàng");
    }
};

  const convertDate = (val) => {
    // Tạo một đối tượng Date từ chuỗi thời gian
    const dateObject = new Date(val);

    // Chuyển đổi định dạng thành định dạng phù hợp cho MySQL
    const formattedDate = dateObject
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    return formattedDate;
  };

  const handleCampaignStatusChange = (val) => {
    setCampaignStatus(val);
  };

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

        setScoreSelected(result);
  };

  const handleChangeEmployee = (val) => {
    setEmployeesSelected(val);
  };

  const hangleChangeCustomer = (val) => {
    setCustomersSelected(val);
  };

  const handleChangeExistProduct = (val) => {
    setCheckExistProduct(val);
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
            action: handleAddCampaign,
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
                children: (
                  <GeneralInformation
                    form={form}
                    onCampaignStatusChange={handleCampaignStatusChange}
                  />
                ),
              },
              {
                label: <p className="px-4 mb-0">Sản phẩm</p>,
                key: "2",
                children: <Product onChangeCategory={handleChangeCategory} onChangeCheckExistProduct={handleChangeExistProduct}/>,
              },
              {
                label: <p className="px-4 mb-0">Nhân viên bán hàng</p>,
                key: "3",
                children: (
                  <EmployeeSell onChangeEmployees={handleChangeEmployee} />
                ),
              },
              {
                label: <p className="px-4 mb-0">Khách hàng</p>,
                key: "4",
                children: <Customer onChangeCustomer={hangleChangeCustomer} />,
              },
            ]}
            indicatorSize={(origin) => origin - 18}
          />
        </Form>
      </div>
    </>
  );
}
