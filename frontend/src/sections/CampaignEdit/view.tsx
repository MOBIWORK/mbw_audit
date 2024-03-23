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
  const [loadingEditCampaign, setLoadingEditCampaign] = useState<boolean>(false);

  //init data
  const [statusCampaignEdit, setStatusCampaignEdit] = useState("");
  const [categoryEdit, setCategoryEdit] = useState([]);
  const [employeeEdit, setEmployeeEdit] = useState([]);
  const [customerEdit, setCustomerEdit] = useState([]);
  const [productEdit, setProductEdit] = useState({});
  const [checkExistProduct, setCheckExistProduct] = useState(false);
  const [settingSequenceProduct, setSettingSequenceProduct] = useState([]);
  const [sequenceProducts, setSequenceProducts] = useState([]);
  const [checkSequenceProduct, setCheckSequenceProduct] = useState(false);

  useEffect(() => {
    initDataByIdCampaign();
  }, [name]);

  const initDataByIdCampaign = async () => {
    let urlDetailCampaign = `/api/resource/VGM_Campaign/${name}`;
    let res = await AxiosService(urlDetailCampaign);
    if(res != null && res.data != null){
      console.log(res.data);
        form.setFieldsValue({
            'campaign_name': res.data.campaign_name,
            'campaign_description': res.data.campaign_description,
            'campaign_start': convertDateFormat(res.data.start_date),
            'campaign_end': convertDateFormat(res.data.end_date),
             campaign_status: res.data.campaign_status,
        })
        setCampaignStatus(res.data.campaign_status)
        setStatusCampaignEdit(res.data.campaign_status);
        setCategoryEdit(JSON.parse(res.data.categories));
        setProductEdit(convertSettingScoreAudit(JSON.parse(res.data.setting_score_audit)));
        setEmployeeEdit(JSON.parse(res.data.employees));
        setCustomerEdit(JSON.parse(res.data.retails));
        if(res.data.setting_score_audit != null && res.data.setting_score_audit != ""){
          let objSettingScoreAudit = JSON.parse(res.data.setting_score_audit);
          if(objSettingScoreAudit.sequence_product != null) setSettingSequenceProduct(objSettingScoreAudit.sequence_product);
          
        }
        let objSettingScore = JSON.parse(res.data.setting_score_audit);
        if(objSettingScore.min_product != null && Object.getOwnPropertyNames(objSettingScore.min_product).length > 0) setCheckExistProduct(true);

        console.log(object);
    }
  }

  const convertSettingScoreAudit = (objSetting: any) => {
    let objResult = {};
    if(objSetting.min_product != null && Object.getOwnPropertyNames(objSetting.min_product).length > 0){
      let arrFieldNameProduct = Object.getOwnPropertyNames(objSetting.min_product);
      arrFieldNameProduct.forEach(item => {
        objResult[item] = {};
        objResult[item].min_product = objSetting.min_product[item];
      })
    }
    return objResult;
  }

  const convertDateFormat = (val) => {
    const datePickerDate = moment(val, 'YYYY-MM-DD HH:mm:ss');
    return datePickerDate;
  }

  const handleEditCampaign = async () => {
    try {
        // Lấy giá trị từ form và các dữ liệu khác
        setLoadingEditCampaign(true);
        let objSettingScore = {};
        let propertiesSettingScore = Object.getOwnPropertyNames(productEdit);
        if (checkExistProduct) {
            let objMinProduct = {};
            propertiesSettingScore.forEach(item => {
                let valSettingScore = productEdit[item];
                objMinProduct[item] = valSettingScore.min_product;
            })
            objSettingScore["min_product"] = objMinProduct;
        }
        console.log(checkExistProduct);
        console.log(checkSequenceProduct);
        if(checkSequenceProduct){
          objSettingScore["sequence_product"] = sequenceProducts;
        }
        let objFrm = form.getFieldsValue();

        // Kiểm tra nếu start_date bé hơn end_date
        let startDate = convertDate(objFrm.campaign_start);
        let endDate = convertDate(objFrm.campaign_end);
        if (startDate >= endDate) {
            message.error("Thời gian bắt đầu phải nhỏ hơn Thời gian kết thúc");
            setLoadingEditCampaign(false);
            return; // Dừng lại nếu có lỗi
        }

        let arrCategory = (categoriesSelected && categoriesSelected.length > 0) ? categoriesSelected.map(x => x.name) : categoryEdit;
        let arrEmployee = (employeesSelected && employeesSelected.length > 0) ? employeesSelected.map(x => x.name) : employeeEdit;
        let arrCustomer = (customersSelected && customersSelected.length > 0) ? customersSelected.map(x => x.name) : customerEdit;

        let urlPutData = `/api/resource/VGM_Campaign/${name}`;
        let dataPut = {
            'campaign_name': objFrm.campaign_name,
            'campaign_description': objFrm.campaign_description,
            'start_date': startDate,
            'end_date': endDate,
            'campaign_status': campaignStatus,
            'categories': JSON.stringify(arrCategory),
            'employees': JSON.stringify(arrEmployee),
            'retails': JSON.stringify(arrCustomer),
            'setting_score_audit': objSettingScore
        };

        let res = await AxiosService.put(urlPutData, dataPut);

        if (res != null && res.data != null) {
            message.success("Cập nhật thành công");
            setLoadingEditCampaign(false);
            navigate('/campaign');
        } else {
            message.error("Cập nhật thất bại");
            setLoadingEditCampaign(false);
        }
    } catch (error) {
        // Xử lý khi có lỗi xảy ra trong quá trình cập nhật
        message.error("Không thể cập nhật. Vui lòng kiểm tra lại thông tin");
        setLoadingEditCampaign(false);
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
  const handleChangeSequenceProducts = (val) => {
    setSequenceProducts(val);
  }
  const handleChangeEmployee = (val) => {
    setEmployeesSelected(val);
  }

  const hangleChangeCustomer = (val) => {
    setCustomersSelected(val);
  }

  const handleChangeExistProduct = (val) => {
    setCheckExistProduct(val);
  }
  const handleChangeCheckSequenceProduct = (val) => {
    setCheckSequenceProduct(val);
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
            loading: loadingEditCampaign,
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
                  <ProductCampaignEdit onChangeCategory={handleChangeCategory} categoryEdit={categoryEdit} productEdit={productEdit} objSettingSequenceProduct={settingSequenceProduct}
                      onChangeCheckExistProduct={handleChangeExistProduct} onChangeCheckSequenceProduct={handleChangeCheckSequenceProduct} onChangeSequenceProducts={handleChangeSequenceProducts}
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
