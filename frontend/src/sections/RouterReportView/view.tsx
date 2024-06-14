import { useState, useEffect } from "react";
import { HeaderPage } from "../../components";
import { DoubleLeftOutlined, LeftOutlined, FormOutlined, FileAddOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Form, Collapse, message } from "antd";
import type { CollapseProps } from 'antd';
import GeneralInformation from "./general-information";
import Product from "./product";
import './view.css';
import { AxiosService } from "../../services/server";
import ProductLabelling from "../common/product_labelling/view"

export default function ReportView() {
  const [recordData, setRecordData] = useState(null);
  const [scoringHuman, setScoringHuman] = useState(0);
  const [reportSKUs, setReportSKUs] = useState<any[]>([]);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [updateStorage, setUpdateStorage] = useState<boolean>(false);
  const [firstRecord, setFirstRecord] = useState<boolean>(false);
  const [lastRecord, setLastRecord] = useState<boolean>(false);
  const [showAssignLabelForProduct, setShowAssignLabelForProduct] = useState(false);
  const [category, setCategory] = useState<String>("");
  const [lstImageBoothForLabelling, setLstImageBoothForLabelling] = useState<String[]>([]);
  const [loadingAddImageToReport, setLoadingAddImageToReport] = useState<boolean>(false);

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
      children: <GeneralInformation form={form} recordData={recordData} onChangeScoringHuman={handleChangeScoringHuman} />,
    },
    {
      key: '2',
      label: <span style={{ fontWeight: 700 }}>Sản phẩm</span>,
      children: <Product recordData={recordData} inputValue={recordData}  onChangeValReportSKU={handleChangeValReportSKU}
      />,
    },

  ];

  useEffect(() => {
    // Lấy record từ local storage khi component được mount
    let storedRecordData = localStorage.getItem('recordData');
    if (storedRecordData) {
      let objRecord = JSON.parse(storedRecordData);
      setRecordData(objRecord);
      setScoringHuman(objRecord.scoring_human);
      let arrReportSKU = [];
      for (let i = 0; i < objRecord.detail_skus.length; i++) {
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
    // localStorage.removeItem('recordData');
  }, [updateStorage]);

  useEffect(() => {
    // Kiểm tra xem đây có phải là record đầu tiên hay cuối cùng không
    let dataReports = JSON.parse(localStorage.getItem('dataReports'));
    if (dataReports) {
      const currentIndex = dataReports.findIndex((item) => item.name === recordData?.name);
      if (currentIndex === 0) {
        setFirstRecord(true); // Nếu đây là record đầu tiên, hiển thị lastRecord button
      } else if (currentIndex === dataReports.length - 1) {
        setLastRecord(true); // Nếu đây là record cuối cùng, hiển thị nextRecord button
      } else {
        setFirstRecord(false);
        setLastRecord(false);
      }
    }
  }, [recordData]);

  const handleSaveReport = async () => {
    setLoadingUpdate(true);
    let objReportSKU = {
      'name': recordData.name,
      'scoring': scoringHuman,
      'arr_product': reportSKUs
    }
    let urlReportUpdate = "/api/method/mbw_audit.api.api.update_report";
    const res = await AxiosService.post(urlReportUpdate, objReportSKU);
    if (res != null && res.message == "ok" && res.result != null && res.result.data == "success") {
      message.success("Cập nhật thành công");
      setLoadingUpdate(false);
      let dataReports = JSON.parse(localStorage.getItem('dataReports'));
      let record = JSON.parse(localStorage.getItem('recordData'));
      for (let i = 0; i < record.detail_skus.length; i++) {
        for (let j = 0; j < reportSKUs.length; j++) {
          if (record.detail_skus[i].name == reportSKUs[j].report_sku_id) {
            record.detail_skus[i].sum_product_human = reportSKUs[j].sum_product_human
            record.detail_skus[i].scoring_human = reportSKUs[j].scoring_human
          }
        }

      }
      record.scoring_human = scoringHuman
      const currentIndex = dataReports.findIndex((item) => item.name === record.name);

      // Kiểm tra nếu không phải là record cuối cùng trong danh sách
      if (currentIndex !== null && currentIndex < dataReports.length - 1) {
        const nextRecord = dataReports[currentIndex + 1];
        localStorage.setItem('recordData', JSON.stringify(nextRecord));
        setUpdateStorage(prevState => !prevState);
      } else {
        //localStorage.removeItem('recordData');
        return
      }
      // Cập nhật lại record mới vào dataReports
      dataReports[currentIndex] = record;

      // Cập nhật lại dataReports trong local storage
      localStorage.setItem('dataReports', JSON.stringify(dataReports));
    } else {
      message.error("Cập nhật thất bại");
      setLoadingUpdate(false);
    }
  }

  const handleSaveReportWithOutNext = async() => {
    setLoadingUpdate(true);
    let objReportSKU = {
      'name': recordData.name,
      'scoring': scoringHuman,
      'arr_product': reportSKUs
    }
    let urlReportUpdate = "/api/method/mbw_audit.api.api.update_report";
    const res = await AxiosService.post(urlReportUpdate, objReportSKU);
    if (res != null && res.message == "ok" && res.result != null && res.result.data == "success") {
      message.success("Cập nhật thành công");
      setLoadingUpdate(false);
      let dataReports = JSON.parse(localStorage.getItem('dataReports'));
      let record = JSON.parse(localStorage.getItem('recordData'));
      for (let i = 0; i < record.detail_skus.length; i++) {
        for (let j = 0; j < reportSKUs.length; j++) {
          if (record.detail_skus[i].name == reportSKUs[j].report_sku_id) {
            record.detail_skus[i].sum_product_human = reportSKUs[j].sum_product_human
            record.detail_skus[i].scoring_human = reportSKUs[j].scoring_human
          }
        }

      }
      record.scoring_human = scoringHuman
      const currentIndex = dataReports.findIndex((item) => item.name === record.name);

      // Cập nhật lại record mới vào dataReports
      dataReports[currentIndex] = record;

      // Cập nhật lại dataReports trong local storage
      localStorage.setItem('dataReports', JSON.stringify(dataReports));
    } else {
      message.error("Cập nhật thất bại");
      setLoadingUpdate(false);
    }
  }

  const handleNavigateToPrevious = () => {
    let dataReports = JSON.parse(localStorage.getItem('dataReports'));
    const currentIndex = dataReports.findIndex((item) => item.name === recordData.name);
    if (currentIndex > 0) {
      const previousRecord = dataReports[currentIndex - 1];
      localStorage.setItem('recordData', JSON.stringify(previousRecord));
      setUpdateStorage(prevState => !prevState);
    }
  };

  const renderTitle = () => {
    if (recordData) {
      // Tiêu đề bao gồm tên cửa hàng và chiến dịch từ storedRecordData
      return `${recordData.customer_name} - ${recordData.campaign_name}`;
    }
    // Nếu không có dữ liệu, hiển thị một tiêu đề mặc định
    return 'Tiêu đề';
  };
  // Hàm xử lý khi click và điều hướng
  const handleNavigateToReports = () => {
    navigate("/reports");
    localStorage.removeItem('recordData');
    localStorage.removeItem('dataReports');
  };

  const onAssignLabelForProduct = () => {
    if(recordData.images != null && recordData.images != ""){
      let arrImage = JSON.parse(recordData.images);
      if(arrImage.length > 0){
        setLstImageBoothForLabelling(arrImage);
        //setLstImageBoothForLabelling(["http://localhost:8001/public/gian.png"]);
      }else{
        message.warning("Bạn không có ảnh gian hàng sản phẩm để thực hiện gán nhãn");
        return;
      }
    }else{
      message.warning("Bạn không có ảnh gian hàng sản phẩm để thực hiện gán nhãn");
      return;
    }
    if(recordData.categories != null && recordData.categories != ""){
      let categories = JSON.parse(recordData.categories);
      if(categories.length > 0){
        setCategory(categories[0]);
      }else{
        message.warning("Bạn không có danh mục sản phẩm khi tạo chiến dịch");
        return;
      }
    }else{
      message.warning("Bạn không có danh mục sản phẩm khi tạo chiến dịch");
      return;
    }
    setShowAssignLabelForProduct(true);
    let arrNode = document.getElementsByClassName("ant-layout-content");
    arrNode[0].style.padding = "0px";
  }

  const onBackPage = (event) => {
    setLstImageBoothForLabelling([]);
    setCategory("");
    setShowAssignLabelForProduct(false);
    let arrNode = document.getElementsByClassName("ant-layout-content");
    arrNode[0].style.padding = "0px 24px 20px";
  }

  const onCompleteProductLabelling = (event) => {
    setLstImageBoothForLabelling([]);
    setCategory("");
    setShowAssignLabelForProduct(false);
    let arrNode = document.getElementsByClassName("ant-layout-content");
    arrNode[0].style.padding = "0px 24px 20px";
  }

  const onAddImageToReport = () => {
    document.getElementById('fileInput').click();
  }

  const handleFileChange = async (event) => {
    console.log(event);
    setLoadingAddImageToReport(true);
    let files = event.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    formData.append('report_id', recordData.name);
    const response = await AxiosService.post(
      "/api/method/mbw_audit.api.api.update_images_for_report",
      formData
    );
    console.log(response);
    if(response.message == "ok"){
      setLoadingAddImageToReport(false);
      message.success("Thành công");
      if(response.result.name != null){
        let dataReports = JSON.parse(localStorage.getItem('dataReports'));
        const currentIndex = dataReports.findIndex((item) => item.name === recordData.name);
        if (currentIndex > 0) {
          const previousRecord = response.result;
          localStorage.setItem('recordData', JSON.stringify(previousRecord));
          setUpdateStorage(prevState => !prevState);
        }
      }
      document.getElementById('fileInput').value = "";
    }else{
      setLoadingAddImageToReport(true);
      message.error("Lỗi trong quá trình cập nhật");
      document.getElementById('fileInput').value = "";
    }
  }

  return (
    <>
      <input
        id="fileInput"
        type="file"
        multiple
        accept=".png, .jpg, .jpeg"
        onChange={handleFileChange}
        style={{ display: 'none' }}/>
      {showAssignLabelForProduct == false && (
        <>
          {lastRecord == false && (
            <HeaderPage
              title={renderTitle()}
              icon={
                <p
                  onClick={() => handleNavigateToReports()}
                  className="mr-2 cursor-pointer"
                >
                  <LeftOutlined />
                </p>
              }
              buttons={[
                {
                  label: "trước",
                  type: "default",
                  size: "20px",
                  className: "flex items-center mr-2",
                  icon: <DoubleLeftOutlined />,
                  action: handleNavigateToPrevious,
                  disabled: firstRecord
                },
                {
                  label: "Lưu lại và Tiếp",
                  type: "primary",
                  size: "20px",
                  className: "flex items-center mr-2",
                  loading: loadingUpdate,
                  action: handleSaveReport,
                  disabled: lastRecord
                },
                {
                  label: "Gán nhãn từ ảnh trưng bày",
                  type: "primary",
                  icon: <FormOutlined className="text-xl" />,
                  size: "20px",
                  className: "flex items-center mr-2",
                  action: onAssignLabelForProduct
                },{
                  label: "Thêm ảnh trưng bày",
                  type: "primary",
                  icon: <FileAddOutlined className="text-xl" />,
                  size: "20px",
                  className: "flex items-center",
                  action: onAddImageToReport,
                  loading: loadingAddImageToReport
                }
              ]}
            />
          )}
          {lastRecord == true && (
            <HeaderPage
              title={renderTitle()}
              icon={
                <p
                  onClick={() => handleNavigateToReports()}
                  className="mr-2 cursor-pointer"
                >
                  <LeftOutlined />
                </p>
              }
              buttons={[
                {
                  label: "trước",
                  type: "default",
                  size: "20px",
                  className: "flex items-center mr-2",
                  icon: <DoubleLeftOutlined />,
                  action: handleNavigateToPrevious,
                  disabled: firstRecord
                },
                {
                  label: "Lưu lại",
                  type: "primary",
                  size: "20px",
                  className: "flex items-center mr-2",
                  loading: loadingUpdate,
                  action: handleSaveReportWithOutNext
                },
                {
                  label: "Gán nhãn từ ảnh trưng bày",
                  type: "primary",
                  icon: <FormOutlined className="text-xl" />,
                  size: "20px",
                  className: "flex items-center mr-2",
                  action: onAssignLabelForProduct,
                },
                {
                  label: "Thêm ảnh trưng bày",
                  type: "primary",
                  icon: <FileAddOutlined className="text-xl" />,
                  size: "20px",
                  className: "flex items-center",
                  action: onAddImageToReport
                }
              ]}
            />
          )}
          
          <div className="bg-white  rounded-xl">
            <Form layout="vertical" form={form}>
              <Collapse items={items} defaultActiveKey={['1', '2']} onChange={onChange} className="custom-collapse" />
              { }
            </Form>
          </div>
        </>
      )}
      {showAssignLabelForProduct == true && (
        <ProductLabelling category={category} arrImage={lstImageBoothForLabelling}
          backPageEmit={onBackPage} completeProductLabelling={onCompleteProductLabelling}></ProductLabelling>
      )}
    </>
  );
}
