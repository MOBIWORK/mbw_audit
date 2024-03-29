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
import moment from "moment";

export default function CampaignCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [campaignStatus, setCampaignStatus] = useState("Open");
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [employeesSelected, setEmployeesSelected] = useState([]);
  const [customersSelected, setCustomersSelected] = useState([]);
  const [scoreSelected, setScoreSelected] = useState({});
  const [checkExistProduct, setCheckExistProduct] = useState(true);
  const [checkSequenceProduct, setCheckSequenceProduct] = useState(false);
  const [sequenceProducts, setSequenceProducts] = useState([]);
  const [loadingAddCampaign, setLoadingAddCampaign] = useState<boolean>(false);

  const handleAddCampaign = async () => {
    try {
      // Lấy giá trị từ form và các dữ liệu khác
      setLoadingAddCampaign(true);
      let objFrm = form.getFieldsValue();
      let startDate = convertDate(objFrm.campaign_start);
      let endDate = convertDate(objFrm.campaign_end);
      
      // Kiểm tra nếu start_date bé hơn end_date
      if (startDate >= endDate) {
        message.error("Thời gian bắt đầu phải nhỏ hơn Thời gian kết thúc");
        setLoadingAddCampaign(false);
        return; // Dừng lại nếu có lỗi
      }

      // Tiếp tục xử lý nếu không có lỗi về ngày tháng
      let objSettingScore = {};
      let propertiesSettingScore = Object.getOwnPropertyNames(scoreSelected);
      if (checkExistProduct) {
        objSettingScore["min_product"] = scoreSelected.min_product;
      }

      if (checkSequenceProduct) {
        objSettingScore["sequence_product"] = sequenceProducts;
      }
      // Kiểm tra xem ba mảng có chứa dữ liệu hợp lệ không
      if (categoriesSelected.length === 0) {
        message.error("Vui lòng điền thông tin sản phẩm");
        setLoadingAddCampaign(false);
        return;
      }

      if (employeesSelected.length === 0) {
        message.error("Vui lòng chọn ít nhất một nhân viên.");
        setLoadingAddCampaign(false);
        return;
      }

      if (customersSelected.length === 0) {
        message.error("Vui lòng chọn ít nhất một khách hàng.");
        setLoadingAddCampaign(false);
        return;
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
        setting_score_audit: objSettingScore,
      };
      let res = await AxiosService.post(urlPostData, dataPost);

      if (res != null && res.data != null) {
        message.success("Thêm mới thành công");
        setLoadingAddCampaign(false);
        navigate("/campaign");
      } else {
        message.error("Thêm mới thất bại");
        setLoadingAddCampaign(false);
      }
    } catch (error) {
      // Xử lý khi có lỗi xảy ra trong quá trình thêm mới
      message.error(
        "Không thể thêm mới. Vui lòng kiểm tra lại thông tin thời gian, sản phẩm, nhân viên, khách hàng"
      );
      setLoadingAddCampaign(false);
    }
  };

  const convertDate = (val) => {
    // Tạo một đối tượng Date từ chuỗi thời gian
    const dateObject = new Date(val);
    const formattedDated = moment(dateObject).format('YYYY-MM-DD HH:mm:ss');
    // Chuyển đổi định dạng thành định dạng phù hợp cho MySQL
    const formattedDate = dateObject
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    return formattedDated;
  };

  const handleCampaignStatusChange = (val) => {
    setCampaignStatus(val);
  };

  const handleChangeCategory = (val) => {
    setCategoriesSelected(val);
    const min_product = {};

    // Duyệt qua mỗi phần tử trong mảng data
    val.forEach((item) => {
      // Duyệt qua mỗi sản phẩm trong mảng products của mỗi phần tử
      item.products.forEach((product) => {
        // Kiểm tra nếu key của sản phẩm đã tồn tại trong min_product và giá trị mới nhỏ hơn giá trị hiện tại
        if (min_product.hasOwnProperty(product.key)) {
          min_product[product.key] = Math.min(
            min_product[product.key],
            parseInt(product.product_num)
          );
        } else {
          // Nếu key chưa tồn tại, thêm key mới vào min_product
          min_product[product.key] = parseInt(product.product_num);
        }
      });
    });

    const result = { min_product: min_product };
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
  };

  const handleChangeCheckSequenceProduct = (val) => {
    setCheckSequenceProduct(val);
  };

  const handleChangeSequenceProducts = (val) => {
    setSequenceProducts(val);
  };

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
            loading: loadingAddCampaign,
            action: handleAddCampaign,
          },
        ]}
      />
      <div className="bg-white pt-4 rounded-xl border-[#DFE3E8] border-[0.2px] border-solid">
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
                children: (
                  <Product
                    onChangeCategory={handleChangeCategory}
                    onChangeCheckExistProduct={handleChangeExistProduct}
                    onChangeCheckSequenceProduct={
                      handleChangeCheckSequenceProduct
                    }
                    onChangeSequenceProducts={handleChangeSequenceProducts}
                  />
                ),
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
