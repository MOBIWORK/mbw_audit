import { useState,useEffect } from "react";
import { HeaderPage } from "../../components";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Form ,Collapse, message  } from "antd";
import type { CollapseProps } from 'antd';
import GeneralInformation from "./general-information";
import Product from "./product";
import './view.css'; 
import { AxiosService } from "../../services/server";
export default function  ReportView() {
  const [recordData, setRecordData] = useState(null);
  const [scoringHuman, setScoringHuman] = useState(0);
  const [reportSKUs, setReportSKUs] = useState<any[]>([]);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const navigate = useNavigate();
  const onChange = (key: string | string[]) => {
  };
  const [form] = Form.useForm();

  const handleChangeScoringHuman = (val) => {
    setScoringHuman(val);
  }

  const handleChangeValReportSKU = (val) => {
    setReportSKUs(val);
  }

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: <span style={{ fontWeight: 700 }}>Thông tin chung</span>,
      children: <GeneralInformation form={form} recordData={recordData} onChangeScoringHuman={handleChangeScoringHuman}/>,
    },
    {
      key: '2',
      label: <span style={{ fontWeight: 700 }}>Sản phẩm</span>,
      children: <Product recordData={recordData} onChangeValReportSKU={handleChangeValReportSKU}
    />,
    },
    
  ];
  
  useEffect(() => {
    // Lấy record từ local storage khi component được mount
    let storedRecordData = localStorage.getItem('recordData');
    console.log(JSON.parse(storedRecordData));
    if (storedRecordData) {
      let objRecord = JSON.parse(storedRecordData);
      setRecordData(objRecord);
      setScoringHuman(objRecord.scoring_human);
      let arrReportSKU = [];
      for(let i = 0; i < objRecord.detail_skus.length; i++){
        let reportSKU = {
          'report_sku_id': objRecord.detail_skus[i].name,
          'sum_product_human': objRecord.detail_skus[i].sum_product_human,
          'scoring_human': objRecord.detail_skus[i].scoring_human
        }
        arrReportSKU.push(reportSKU);
      }
      setReportSKUs(arrReportSKU);
    }

    // Xóa record khỏi local storage sau khi đã sử dụng
    localStorage.removeItem('recordData');
  }, []);

  const handleSaveReport = async () => {
    setLoadingUpdate(true);
    let objReportSKU = {
      'name': recordData.name,
      'scoring': scoringHuman,
      'arr_product': reportSKUs
    }
    let urlReportUpdate = "/api/method/mbw_audit.api.api.update_report";
    const res = await AxiosService.post(urlReportUpdate, objReportSKU);
    if(res != null && res.message == "ok" && res.result != null && res.result.data == "success"){
      message.success("Cập nhật thành công");
      setLoadingUpdate(false);
    }else{
      message.error("Cập nhật thất bại");
      setLoadingUpdate(false);
    }
  }

  const renderTitle = () => {
    if (recordData) {
      // Tiêu đề bao gồm tên cửa hàng và chiến dịch từ storedRecordData
      return `${recordData.customer_name} - ${recordData.campaign_name}`;
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
            onClick={() => navigate("/reports")}
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
            loading: loadingUpdate,
            action: handleSaveReport
          },
        ]}
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
