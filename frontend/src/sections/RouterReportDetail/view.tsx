import { FormItemCustom, HeaderPage, TableCustom } from "../../components";
import { AxiosService } from "../../services/server";
import * as ExcelJS from "exceljs"; // Giả sử exceljs hỗ trợ cú pháp mô-đun ES6
import {
  DownOutlined,
  VerticalAlignBottomOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import * as FileSaver from "file-saver";
import {
  Button,
  TableColumnsType,
  DatePicker,
  Select,
  Image,
  message,
  Space,
  Radio,
  Modal
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import type { RadioChangeEvent } from 'antd';

declare var require: any;

interface DataTypeReport {
  key: React.Key;
  stt: string;
  name: string;
  customer_name: string;
  employee_name: string;
  campaign_name: string;
  categories: string;
  info_products_ai: Array<any>;
  info_products_human: Array<any>;
  images: string;
  images_ai: string;
  images_time: string;
  scoring_machine: number;
  scoring_human: number;
  quantity_cate: number;
  detail_skus: Array<any>;
  category_names: Array<any>;
}

const { RangePicker } = DatePicker;

export default function ReportDetail() {
  const [searchCampaign, setSearchCampaign] = useState("all");
  const [searchTime, setSearchTime] = useState([]); // Sử dụng state để lưu giá trị thời gian thực hiện
  const [searchEmployee, setSearchEmployee] = useState("all"); // Mặc định là 'all'
  const [searchAIEvalue, setSearchAIEvalue] = useState("all");
  const [searchHumanEvalue, setSearchHumanEvalue] = useState("all");
  const [hoveredSelect, setHoveredSelect] = useState(null);

  const [arrSourceEvalue, setArrSourceEvalue] = useState<any[]>([
    { label: "Đạt", value: 1 },
    { label: "Không đạt", value: 0 },
  ]);
  const [isGroupByCampaign, setIsGroupByCampaign] = useState(false);
  const [columnsReportByCampaign, setColumnsReportByCampaign] = useState([
    {
      title: "STT",
      dataIndex: "stt",
      width: 50,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer_name",
      width: 100,
    },
    {
      title: "Tên chiến dịch",
      dataIndex: "campaign_name",
      width: 100,
    },
    {
      title: "Nhân viên thực hiện",
      dataIndex: "employee_name",
      width: 100,
    },
    {
      title: "Số lượng danh mục",
      dataIndex: "quantity_cate",
      width: 100,
    },
    {
      title: "Số lượng sản phẩm AI đếm",
      children: [],
      width: 300,
    },
    {
      title: "Số lượng sản phẩm giám sát đếm",
      children: [],
      width: 300,
    },
    {
      title: "Ảnh gian hàng",
      dataIndex: "images",
      render: (item: any) => {
        let imageArray: any[] = [];
        if (item !== null) {
          try {
            imageArray = JSON.parse(item);
          } catch (error) {
          }
        }
        return (
          <a
            style={{
              cursor: imageArray.length > 0 ? "pointer" : "default",
            }}
            onClick={(event) => {
              event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền ra ngoài
              if (imageArray.length > 0) {
                handleImageClick(item); // Gọi hàm xử lý hiển thị hình ảnh nếu có hình ảnh trả về
              }
            }}
          >
            {imageArray.length > 0 ? "Xem hình ảnh" : "Không có hình ảnh"}
          </a>
        );
      },
      width: 120,
    },
    {
      title: "Ảnh gian hàng AI",
      dataIndex: "images_ai",
      render: (item: any) => {
        let imageArray: any[] = [];
        if (item !== null) {
          try {
            imageArray = JSON.parse(item);
          } catch (error) {
          }
        }
        return (
          <a
            style={{
              cursor: imageArray.length > 0 ? "pointer" : "default",
            }}
            onClick={(event) => {
              event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền ra ngoài
              if (imageArray.length > 0) {
                handleImageClick(item); // Gọi hàm xử lý hiển thị hình ảnh nếu có hình ảnh trả về
              }
            }}
          >
            {imageArray.length > 0 ? "Xem hình ảnh" : "Không có hình ảnh"}
          </a>
        );
      },
      width: 120,
    },
    {
      title: "Thời gian thực hiện",
      dataIndex: "images_time",
      render: (time) => {
        // Chuyển đổi chuỗi thời gian thành đối tượng Date
        const dateObj = new Date(time);

        // Lấy ngày, tháng và năm từ đối tượng Date
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
        const year = dateObj.getFullYear();

        // Lấy giờ và phút từ đối tượng Date
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();

        // Biến đổi thành chuỗi thời gian theo định dạng "dd/MM/yyyy hh:mm"
        const formattedTime = `${day.toString().padStart(2, "0")}/${month
          .toString()
          .padStart(2, "0")}/${year} ${hours
          .toString()
          .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

        // Trả về chuỗi thời gian đã được định dạng
        return <div>{formattedTime}</div>;
      },
      width: 120,
    },
    {
      title: "Điểm trưng bày AI chấm",
      dataIndex: "scoring_machine",
      render: (scoring_machine: number) => (
        <>
          {scoring_machine === 1 && (
            <span style={{ display: "flex" }}>
              <CheckCircleOutlined
                style={{
                  fontSize: "17px",
                  color: "green",
                  paddingRight: "3px",
                }}
              />{" "}
              <span style={{ color: "green", verticalAlign: "middle" }}>
                Đạt
              </span>
            </span>
          )}
          {scoring_machine === 0 && (
            <span style={{ display: "flex" }}>
              <CloseCircleOutlined
                style={{ fontSize: "17px", color: "red", paddingRight: "3px" }}
              />{" "}
              <span style={{ color: "red", verticalAlign: "middle" }}>
                Không đạt
              </span>
            </span>
          )}
        </>
      ),
      width: 120,
    },
    {
      title: "Điểm trưng bày giám sát chấm",
      dataIndex: "scoring_human",
      render: (scoring_human: number, item: any, index: number) => (
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Select
            value={scoring_human}
            onChange={() => handleChange(item, index, true)}
            bordered={hoveredSelect === index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            suffixIcon={hoveredSelect === index ? <DownOutlined /> : null}
          >
            <Select.Option value={1}>
              <span style={{ display: "flex" }}>
                <CheckCircleOutlined
                  style={{
                    fontSize: "17px",
                    color: "green",
                    paddingRight: "3px",
                  }}
                />
                <span style={{ color: "green", verticalAlign: "middle" }}>
                  Đạt
                </span>
              </span>
            </Select.Option>
            <Select.Option value={0}>
              <span style={{ display: "flex" }}>
                <CloseCircleOutlined
                  style={{
                    fontSize: "17px",
                    color: "red",
                    paddingRight: "3px",
                  }}
                />
                <span style={{ color: "red", verticalAlign: "middle" }}>
                  Không đạt
                </span>
              </span>
            </Select.Option>
          </Select>
        </div>
      ),
      width: 120,
    },
  ]);
  const [dataReportsByCampaign, setDataReportsByCampaign] = useState([]);

  const { search } = useLocation();
  const navigate = useNavigate();
  const [dataReports, setDataReports] = useState<any[]>([]);
  const [dataEmployee, setDataEmployee] = useState<any[]>([]);
  const [campaignSources, setCampaignSources] = useState<any[]>([]);
  const [showFrmUpdateScore, setShowFrmUpdateScore] = useState<boolean>(false);
  const [typeUpdateScore, setTypeUpdateScore] = useState<number>(0);
  const [valScore, setValScore] = useState<number>(0);
  const [loadingUpdateScores, setLoadingUpdateScores] = useState<boolean>(false);

  const handleClickUpdateAI = async () => {
    if (!isGroupByCampaign) {
      // Biến đổi mảng dữ liệu thành danh sách mới
      if (dataReports.length > 0) {
        const transformedList = dataReports.map((item) => {
          return {
            name: item.name,
            scoring_machine: item.scoring_machine, // Gán lại scoring_human bằng scoring_machine
          };
        });
        let objReport = {
          data_list: JSON.stringify(transformedList),
        };
        let urlReportUpdate =
          "/api/method/mbw_audit.api.api.updatelistreport_scorehuman_by_AI";
        try {
          const res = await AxiosService.post(urlReportUpdate, objReport);
          if (res && res.message.status === "success") {
            fetchDataReport()
        message.success("Cập nhật thành công");
          } else {
            message.error("Cập nhật thất bại");
          }
        } catch (error) {
          message.error("Cập nhật thất bại");
        }
      } else {
        message.warning("Danh sách đang trống. Không thể cập nhật");
      }
    } else {
      if (dataReportsByCampaign.length > 0) {
        const transformedList = dataReportsByCampaign.map((item) => {
          return {
            name: item.name,
            scoring_machine: item.scoring_machine, // Gán lại scoring_human bằng scoring_machine
          };
        });

        let objReport = {
          data_list: JSON.stringify(transformedList),
        };

        let urlReportUpdate =
          "/api/method/mbw_audit.api.api.updatelistreport_scorehuman_by_AI";
        try {
          const res = await AxiosService.post(urlReportUpdate, objReport);
          if (res && res.message.status === "success") {
            fetchDataReport()
            message.success("Cập nhật thành công");
          } else {
            message.error("Cập nhật thất bại");
          }
        } catch (error) {
          message.error("Cập nhật thất bại");
        }
      } else {
        message.warning("Danh sách đang trống. Không thể cập nhật");
      }
    }
  };
  const handleClickUpdateHuman = async (valScore) => {
    if (!isGroupByCampaign) {
    // Biến đổi mảng dữ liệu thành danh sách mới
    if (dataReports.length > 0) {
      const transformedList = dataReports.map((item) => ({ name: item.name })); // Biến đổi các phần tử được lọc
      let objReport = {
        data_list: JSON.stringify(transformedList),
        val_score: valScore
      };

      let urlReportUpdate =
        "/api/method/mbw_audit.api.api.update_list_report_by_val";
      try {
        const res = await AxiosService.post(urlReportUpdate, objReport);

        if (res && res.message.status === "success") {
          fetchDataReport()
      message.success("Cập nhật thành công");
        } else {
          message.error("Cập nhật thất bại");
        }
      } catch (error) {
        message.error("Cập nhật thất bại");
      }
    } else {
      message.warning("Danh sách đang trống. Không thể cập nhật");
    }
    }else{
      if (dataReportsByCampaign.length > 0) {
        const transformedList = dataReportsByCampaign.map((item) => ({ name: item.name })); // Biến đổi các phần tử được lọc
        let objReport = {
          data_list: JSON.stringify(transformedList),
          val_score: valScore
        };
  
        let urlReportUpdate =
          "/api/method/mbw_audit.api.api.update_list_report_by_val";
  
        try {
          const res = await AxiosService.post(urlReportUpdate, objReport);
  
          if (res && res.message.status === "success") {
            fetchDataReport()
        message.success("Cập nhật thành công");
          } else {
            message.error("Cập nhật thất bại");
          }
        } catch (error) {
          message.error("Cập nhật thất bại");
        }
      } else {
        message.warning("Danh sách đang trống. Không thể cập nhật");
      }
    }
  };
  const handleRowClick = (record, index) => {
    // Lưu record vào local storage
    localStorage.setItem("recordData", JSON.stringify(record));
    localStorage.setItem("dataReports", JSON.stringify(dataReports));
    navigate(`/report-view`);
  };
  useEffect(() => {
    initDataEmployee();
    initDataCampaigns();
    // fetchDataReport(); // Sau đó lấy dữ liệu báo cáo
  }, []);

  const columns: TableColumnsType<DataTypeReport> = [
    {
      title: "STT",
      dataIndex: "stt",
      fixed: "left",
      width: "5%",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer_name",
      fixed: "left",
    },
    {
      title: "Tên chiến dịch",
      dataIndex: "campaign_name",
      fixed: "left",
    },
    {
      title: "Nhân viên thực hiện",
      dataIndex: "employee_name",
    },
    {
      title: "Số lượng danh mục",
      dataIndex: "quantity_cate",
    },
    {
      title: "Ảnh gian hàng",
      dataIndex: "images",
      render: (item: any) => {
        let imageArray: any[] = [];
        if (item !== null) {
          try {
            imageArray = JSON.parse(item);
          } catch (error) {
          }
        }
        return (
          <a
            style={{
              cursor: imageArray.length > 0 ? "pointer" : "default",
            }}
            onClick={(event) => {
              event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền ra ngoài
              if (imageArray.length > 0) {
                handleImageClick(item); // Gọi hàm xử lý hiển thị hình ảnh nếu có hình ảnh trả về
              }
            }}
          >
            {imageArray.length > 0 ? "Xem hình ảnh" : "Không có hình ảnh"}
          </a>
        );
      },
    },
    {
      title: "Ảnh gian hàng AI",
      dataIndex: "images_ai",
      render: (item: any) => {
        let imageArray: any[] = [];
        if (item !== null) {
          try {
            imageArray = JSON.parse(item);
          } catch (error) {
          }
        }
        return (
          <a
            style={{
              cursor: imageArray.length > 0 ? "pointer" : "default",
            }}
            onClick={(event) => {
              event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền ra ngoài
              if (imageArray.length > 0) {
                handleImageClick(item); // Gọi hàm xử lý hiển thị hình ảnh nếu có hình ảnh trả về
              }
            }}
          >
            {imageArray.length > 0 ? "Xem hình ảnh" : "Không có hình ảnh"}
          </a>
        );
      },
    },
    {
      title: "Thời gian thực hiện",
      dataIndex: "images_time",
      render: (time) => {
        // Chuyển đổi chuỗi thời gian thành đối tượng Date
        const dateObj = new Date(time);

        // Lấy ngày, tháng và năm từ đối tượng Date
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
        const year = dateObj.getFullYear();

        // Lấy giờ và phút từ đối tượng Date
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();

        // Biến đổi thành chuỗi thời gian theo định dạng "dd/MM/yyyy hh:mm"
        const formattedTime = `${day.toString().padStart(2, "0")}/${month
          .toString()
          .padStart(2, "0")}/${year} ${hours
          .toString()
          .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

        // Trả về chuỗi thời gian đã được định dạng
        return <div>{formattedTime}</div>;
      },
    },
    {
      title: "Điểm trưng bày AI chấm",
      dataIndex: "scoring_machine",
      render: (scoring_machine: number) => (
        <>
          {scoring_machine === 1 && (
            <span style={{ display: "flex" }}>
              <CheckCircleOutlined
                style={{
                  fontSize: "17px",
                  color: "green",
                  paddingRight: "3px",
                }}
              />{" "}
              <span style={{ color: "green", verticalAlign: "middle" }}>
                Đạt
              </span>
            </span>
          )}
          {scoring_machine === 0 && (
            <span style={{ display: "flex" }}>
              <CloseCircleOutlined
                style={{ fontSize: "17px", color: "red", paddingRight: "3px" }}
              />{" "}
              <span style={{ color: "red", verticalAlign: "middle" }}>
                Không đạt
              </span>
            </span>
          )}
        </>
      ),
    },
    {
      title: "Điểm trưng bày giám sát chấm",
      dataIndex: "scoring_human",
      render: (scoring_human: number, item: any, index: number) => (
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Select
            value={scoring_human}
            onChange={() => handleChange(item, index, false)}
            bordered={hoveredSelect === index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            suffixIcon={hoveredSelect === index ? <DownOutlined /> : null}
          >
            <Select.Option value={1}>
              <span style={{ display: "flex" }}>
                <CheckCircleOutlined
                  style={{
                    fontSize: "17px",
                    color: "green",
                    paddingRight: "3px",
                  }}
                />
                <span style={{ color: "green", verticalAlign: "middle" }}>
                  Đạt
                </span>
              </span>
            </Select.Option>
            <Select.Option value={0}>
              <span style={{ display: "flex" }}>
                <CloseCircleOutlined
                  style={{
                    fontSize: "17px",
                    color: "red",
                    paddingRight: "3px",
                  }}
                />
                <span style={{ color: "red", verticalAlign: "middle" }}>
                  Không đạt
                </span>
              </span>
            </Select.Option>
          </Select>
        </div>
      ),
    },
  ];

  const expandedColumns = [
    // { title: "STT", dataIndex: "stt" },
    { title: "Tên sản phẩm", dataIndex: "product_name" },
    { title: "Số lượng sản phẩm AI đếm", dataIndex: "sum_product" },
    {
      title: "Số lượng sản phẩm giám sát đếm",
      dataIndex: "sum_product_human",
    },
    {
      title: "Điểm trưng bày AI chấm",
      dataIndex: "scoring_machine",
      render: (scoring_machine: number) => (
        <>
          {scoring_machine === 1 && (
            <span style={{ display: "flex" }}>
              <CheckCircleOutlined
                style={{
                  fontSize: "17px",
                  color: "green",
                  paddingRight: "3px",
                }}
              />{" "}
              <span style={{ color: "green", verticalAlign: "middle" }}>
                Đạt
              </span>
            </span>
          )}
          {scoring_machine === 0 && (
            <span style={{ display: "flex" }}>
              <CloseCircleOutlined
                style={{ fontSize: "17px", color: "red", paddingRight: "3px" }}
              />{" "}
              <span style={{ color: "red", verticalAlign: "middle" }}>
                Không đạt
              </span>
            </span>
          )}
        </>
      ),
    },
  ];

  const fetchDataReport = async () => {
    const localData = JSON.parse(localStorage.getItem("campaign_dashboard"));
    if (localData) {
      setSearchCampaign(localData.campaign_code);
      setIsGroupByCampaign(true);
      // Xóa dữ liệu đã lưu trong localStorage
      localStorage.removeItem("campaign_dashboard");
    }
    let urlReports = "/api/method/mbw_audit.api.api.get_reports_by_filter";
    if (
      searchCampaign != null &&
      searchCampaign != "" &&
      searchCampaign != "all"
    ) {
      urlReports = `${urlReports}?campaign_code=${searchCampaign}`;
    }
    if (searchTime != null && searchTime.length == 2) {
      let start_date = Math.round(new Date(searchTime[0]).getTime() / 1000);
      let end_date = Math.round(new Date(searchTime[1]).getTime() / 1000);
      if (urlReports.includes("?"))
        urlReports = `${urlReports}&start_date=${start_date}&end_date=${end_date}`;
      else
        urlReports = `${urlReports}?start_date=${start_date}&end_date=${end_date}`;
    }
    if (
      searchEmployee != null &&
      searchEmployee != "" &&
      searchEmployee != "all"
    ) {
      if (urlReports.includes("?"))
        urlReports = `${urlReports}&employee_id=${searchEmployee}`;
      else urlReports = `${urlReports}?employee_id=${searchEmployee}`;
    }
    if (searchAIEvalue != null && searchAIEvalue != "all") {
      if (urlReports.includes("?"))
        urlReports = `${urlReports}&status_scoring_ai=${searchAIEvalue}`;
      else urlReports = `${urlReports}?status_scoring_ai=${searchAIEvalue}`;
    }
    if (searchHumanEvalue != null && searchHumanEvalue != "all") {
      if (urlReports.includes("?"))
        urlReports = `${urlReports}&status_scoring_human=${searchHumanEvalue}`;
      else
        urlReports = `${urlReports}?status_scoring_human=${searchHumanEvalue}`;
    }
    let res = await AxiosService.get(urlReports);
    if (
      res != null &&
      res.message == "ok" &&
      res.result != null &&
      res.result.data != null
    ) {
      let dataSources = res.result.data.map(
        (item: DataTypeReport, index: number) => {
          let stt: string = (index + 1).toString().padStart(2, "0");
          let quantity_cate: string = JSON.parse(item.categories)
            .length.toString()
            .padStart(2, "0");
          return {
            ...item,
            key: item.name,
            stt: stt,
            quantity_cate: quantity_cate,
          };
        }
      );
      if (!isGroupByCampaign) {
        setDataReports(dataSources);
      } else {
        let isRenderHeader = false;
        let arrChildColsProductAI = [];
        let arrChildColsProductHuman = [];
        let allProductNames = new Set();
        let productInfoOfAllReport = [];
        
        // Tìm dataSource có số lượng sản phẩm nhiều nhất và thu thập tất cả tên sản phẩm
        for (let j = 0; j < dataSources.length; j++) {
          const dataSource = dataSources[j];
          const infoProductsAI = dataSource.info_products_ai;

          for(let i  = 0; i < infoProductsAI.length; i++){
            let filterProduct = productInfoOfAllReport.filter(x => x.product_name == infoProductsAI[i].product_name);
            if(filterProduct.length == 0) productInfoOfAllReport.push(infoProductsAI[i]);
          }
        
          // Thu thập tất cả tên sản phẩm từ tất cả các dataSource
          infoProductsAI.forEach((product) => {
            allProductNames.add(product.product_name);
          });
        }

        if (productInfoOfAllReport) {
          for(let i = 0; i < productInfoOfAllReport.length; i++){
            const productName = productInfoOfAllReport[i].product_name;
            const objColProductAI = {
              title: productName,
              dataIndex: `${productName}_ai`,
              key: `${productName}_ai`,
              width: 100,
            };
        
            const objColProductHuman = {
              title: productName,
              dataIndex: `${productName}_human`,
              key: `${productName}_human`,
              width: 100,
            };
        
            arrChildColsProductAI.push(objColProductAI);
            arrChildColsProductHuman.push(objColProductHuman);
          }
        }
        
        // Duyệt qua tất cả các dataSource để cập nhật dữ liệu vào các cột đã tạo
        const updatedDataSources = dataSources.map((dataSource) => {
          const updatedDataSource = { ...dataSource };
        
          allProductNames.forEach((productName) => {
            const matchingInfoProductAI = dataSource.info_products_ai.find(
              (product) => product.product_name === productName
            );
        
            const matchingInfoProductHuman = dataSource.info_products_human.find(
              (product) => product.product_name === productName
            );
        
            if (matchingInfoProductAI) {
              updatedDataSource[`${productName}_ai`] = matchingInfoProductAI.sum;
            }
        
            if (matchingInfoProductHuman) {
              updatedDataSource[`${productName}_human`] = matchingInfoProductHuman.sum;
            }
          });
        
          return updatedDataSource;
        });
        
        // Cập nhật lại columns và dataReportsByCampaign
        setColumnsReportByCampaign((preValue) => {
          preValue[5].children = arrChildColsProductAI;
          preValue[6].children = arrChildColsProductHuman;
          return preValue;
        });
        
        setDataReportsByCampaign(updatedDataSources);
      
      }
    } else {
      if (isGroupByCampaign) {
        setColumnsReportByCampaign((preValue) => {
          preValue[5].children = [];
          preValue[6].children = [];
          return preValue;
        });
        setDataReportsByCampaign([]);
      } else {
        setDataReports([]);
      }
    }
  };

  const handleMouseEnter = (index: any) => {
    setHoveredSelect(index);
  };
  const handleMouseLeave = () => {
    setHoveredSelect(false);
  };
  const handleChange = async (value: any, index: any, groupCampaign = false) => {
    const newScoringHuman = value.scoring_human === 1 ? 0 : 1;

    let objReportSKU = {
      name: value.name,
      scoring_human: newScoringHuman,
    };
    let urlReportUpdate =
      "/api/method/mbw_audit.api.api.update_scorehuman_by_name";
    const res = await AxiosService.post(urlReportUpdate, objReportSKU);
    if (
      res != null &&
      res.message == "ok" &&
      res.result != null &&
      res.result.data == "success"
    ) {
      message.success("Cập nhật thành công");
      //fetchDataReport();
      if (!groupCampaign) {
        setDataReports((prevDataReports) => {
          let newDataReports = [...prevDataReports]; // Tạo bản sao của mảng hiện tại
          newDataReports[index].scoring_human = newScoringHuman; // Cập nhật phần tử của mảng tại chỉ mục index
          return newDataReports; // Trả về mảng mới đã được thay đổi
        });
      }else{
        setDataReportsByCampaign((prevDataReports) => {
          let newDataReports = [...prevDataReports]; // Tạo bản sao của mảng hiện tại
          newDataReports[index].scoring_human = newScoringHuman; // Cập nhật phần tử của mảng tại chỉ mục index
          return newDataReports; // Trả về mảng mới đã được thay đổi
        });
      }

     
    } else {
      message.error("Cập nhật thất bại");
    }
  };

  const initDataEmployee = async () => {
    try {
      let urlEmployee =
        "/api/method/mbw_service_v2.api.ess.employee.get_list_employee";
      const res = await AxiosService.get(urlEmployee);
      if (res && res.result && res.result.data) {
        setDataEmployee(res.result.data);
      }
    } catch (error) {
    }
  };

  const initDataCampaigns = async () => {
    let urlCampaign = "/api/method/mbw_audit.api.api.get_all_campaigns";
    const res = await AxiosService.get(urlCampaign);
    if (res != null && res.message == "ok" && res.result != null) {
      setCampaignSources(res.result.data);
    } else {
      setCampaignSources([]);
    }
  };

  useEffect(() => {
    fetchDataReport();
  }, [
    searchCampaign,
    searchTime,
    searchEmployee,
    searchAIEvalue,
    searchHumanEvalue,
  ]);

  const exportToExcel = () => {
    isGroupByCampaign
      ? onExportDataToExcelByCampaign(
          dataReportsByCampaign,
          columnsReportByCampaign,
          "Báo cáo chấm điểm trưng bày"
        )
      : onExportDataToExcel(dataReports, "Báo cáo chấm điểm trưng bày");
  };

  const onExportDataToExcelByCampaign = async (table, columns, title) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Sheet1");
    let isMergeRow = false;
    for(let i = 0; i < columns.length; i++){
      if(columns[i].children != null && columns[i].children.length > 0){
        isMergeRow = true;
        break;
      }
    }
    let startIndexHead = 1;
    for(let i = 0; i < columns.length; i++){
      let rowHead = sheet.getRow(1);
      if(columns[i].children != null && columns[i].children.length > 0){
        let startIndexGroupHead = startIndexHead;
        rowHead.getCell(startIndexHead).style = {font: {bold: true, name: "Times New Roman", size: 12}};
        rowHead.getCell(startIndexHead).value = columns[i].title;
        for(let j = 0; j < columns[i].children.length; j++){
          let rowHeadNext = sheet.getRow(2);
          rowHeadNext.getCell(startIndexHead).style = {font: {bold: true, name: "Times New Roman", size: 12}};
          sheet.getColumn(startIndexHead).width = columns[i].children[j].width/5;
          rowHeadNext.getCell(startIndexHead).value = columns[i].children[j].title;
          startIndexHead +=1;
        }
        if(columns[i].children.length >= 2) sheet.mergeCells(`${rowHead.getCell(startIndexGroupHead)["_address"]}:${rowHead.getCell(startIndexHead-1)["_address"]}`);
      }else{
        sheet.getColumn(startIndexHead).width = columns[i].width/5;
        if(isMergeRow){
          let rowHeadNext = sheet.getRow(2);
          sheet.mergeCells(`${rowHead.getCell(startIndexHead)["_address"]}:${rowHeadNext.getCell(startIndexHead)["_address"]}`);
        }
        rowHead.getCell(startIndexHead).style = {font: {bold: true, name: "Times New Roman", size: 12}};
        rowHead.getCell(startIndexHead).value = columns[i].title;
        startIndexHead += 1;
      }
    }
    let startRowValue = 2;
    if(isMergeRow) startRowValue = 3;
    for(let i = 0; i < table.length; i++){
      let startIndexVal = 1;
      let rowValue = sheet.getRow(startRowValue);
      for(let j = 0; j < columns.length; j++){
        if(columns[j].children != null && columns[j].children.length > 0){
          for(let t = 0; t < columns[j].children.length; t++){
            rowValue.getCell(startIndexVal).value = table[i][columns[j].children[t].dataIndex];
            rowValue.getCell(startIndexVal).style = {font: {bold: false, name: "Times New Roman", size: 12}};
            startIndexVal +=1;
          }
        }else{
          if(columns[j].dataIndex == "scoring_human" || columns[j].dataIndex == "scoring_machine"){
            rowValue.getCell(startIndexVal).value = getScoringLabel(table[i][columns[j].dataIndex]);
          }else{
            rowValue.getCell(startIndexVal).value = table[i][columns[j].dataIndex];
          }
          rowValue.getCell(startIndexVal).style = {font: {bold: false, name: "Times New Roman", size: 12}};
          startIndexVal += 1;
        }
      }
      startRowValue += 1;
    }
    // Lưu file Excel
    const buffer = await workbook.xlsx.writeBuffer();
    saveAsExcelFile(buffer, "report");
  };
  const getScoringLabel = (value) => {
    if (value === 1) {
      return "Đạt";
    } else if (value === 0) {
      return "Không đạt";
    } else {
      return ""; // Xử lý các giá trị khác (nếu cần)
    }
  };
  const onExportDataToExcel = async (tableinput, title) => {
    const workbookx = new ExcelJS.Workbook();
    const sheetx = workbookx.addWorksheet("Sheet1");
    let fieldHeader = [
      {'title': "STT", 'width': 10, 'key': "stt"},
      {'title': "Khách hàng", 'width': 20, 'key': "customer_name"},
      {'title': "Tên chiến dịch", 'width': 30, 'key': "campaign_name"},
      {'title': "Nhân viên thực hiện", 'width': 20, 'key': "employee_name"},
      {'title': "Số lượng danh mục", 'width': 20, 'key': "categories"},
      {'title': "Ảnh gian hàng", 'width': 30, 'key': "images"},
      {'title': "Ảnh gian hàng AI", 'width': 30, 'key': "images_ai"},
      {'title': "Thời gian thực hiện", 'width': 30, 'key': "images_time"},
      {'title': "Điểm trưng bày AI chấm", 'width': 20, 'key': "scoring_machine"},
      {'title': "Điểm trưng bày giám sát chấm", 'width': 20, 'key': "scoring_human"}
    ];
    let startIndexHead = 1;
    for(let i = 0; i < fieldHeader.length; i++){
      let rowHead = sheetx.getRow(1);
      sheetx.getColumn(startIndexHead).width = fieldHeader[i].width;
      rowHead.getCell(startIndexHead).style = {font: {bold: true, name: "Times New Roman", size: 12}};
      rowHead.getCell(startIndexHead).value = fieldHeader[i].title;
      startIndexHead += 1;
    }
    let startRowValue = 2;
    for(let i = 0; i < tableinput.length; i++){
      let startIndexVal = 1;
      let rowValue = sheetx.getRow(startRowValue);
      for(let j = 0; j < fieldHeader.length; j++){
        if(fieldHeader[j].key == "scoring_human" || fieldHeader[j].key == "scoring_machine"){
          rowValue.getCell(startIndexVal).value = getScoringLabel(tableinput[i][fieldHeader[j].key]);
        }else if(fieldHeader[j].key == "categories"){
          let catergoriesStr = tableinput[i][fieldHeader[j].key];
          let countCategories = 0;
          if(catergoriesStr != null && catergoriesStr != ""){
            let catergories = JSON.parse(catergoriesStr);
            if(catergories != null) countCategories = catergories.length;
          }
          rowValue.getCell(startIndexVal).value = countCategories;
        }else{
          rowValue.getCell(startIndexVal).value = tableinput[i][fieldHeader[j].key];
        }
        rowValue.getCell(startIndexVal).style = {font: {bold: false, name: "Times New Roman", size: 12}};
        startIndexVal += 1;
      }
      startRowValue += 1;
    }
    const buffer = await workbookx.xlsx.writeBuffer();
    saveAsExcelFile(buffer, "report");
  };

  const saveAsExcelFile = (buffer: any, fileName: string) => {
    let EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    let EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  };

  const onChangeCampaign = (val) => {
    setSearchCampaign(val);
    if (val == "all") {
      setIsGroupByCampaign(false);
    } else {
      setIsGroupByCampaign(true);
    }
  };
  const [itemImage, setItemImage] = useState<any[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false); // Thiết lập mặc định là true để hiển thị chế độ preview

  const handlePreviewVisibleChange = (visible) => {
    setPreviewVisible(false); // Đặt previewVisible thành false khi chế độ xem preview đóng lại
    setItemImage([]);
  };
  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.children ?? "").toLowerCase().includes(input.toLowerCase());
  const handleImageClick = (item) => {
    const imageArray = JSON.parse(item);
    setItemImage(imageArray);
    setPreviewVisible(true); // Mở chế độ xem preview khi click vào hình ảnh
  };
  const onShowFrmUpdateScore = () => {
    setShowFrmUpdateScore(true);
  }
  const handleCancelUpdateScore = () => {
    setShowFrmUpdateScore(false);
  }
  const handleOkUpdateScore = async () => {
    setLoadingUpdateScores(true);
    if(typeUpdateScore == 0){
      await handleClickUpdateAI();
    }else{
      await handleClickUpdateHuman(valScore);
    }
    setLoadingUpdateScores(false);
    handleCancelUpdateScore();
  }
  const onChangeTypeUpdateScore = (e: RadioChangeEvent) => {
    setTypeUpdateScore(e.target.value);
  };
  const handleChangeScore = (e: number) => {
    setValScore(e);
  }
  return (
    <>
      <HeaderPage
        title="Báo cáo"
        buttons={[
          {
            label: "Xuất dữ liệu",
            type: "primary",
            icon: <VerticalAlignBottomOutlined className="text-xl" />,
            size: "20px",
            className: "flex items-center",
            action: exportToExcel,
          },
        ]}
      />

      <div className="bg-white rounded-xl">
        <div className="flex p-4" style={{ alignItems: "flex-end" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", flexWrap: "wrap" }}>
              <div
                className="mt-2"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingRight: "15px",
                }}
              >
                <label style={{ paddingBottom: "5px" }}>Chiến dịch:</label>
                <Select
                  showSearch
                  className="w-[150px] h-[36px]"
                  value={searchCampaign}
                  onChange={(value) => onChangeCampaign(value)}
                  defaultValue="all"
                  filterOption={filterOption}
                  optionFilterProp="children"
                >
                  <Select.Option value="all">Tất cả</Select.Option>
                  {campaignSources.map((campaign) => (
                    <Select.Option key={campaign.name} value={campaign.name}>
                      {campaign.campaign_name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <FormItemCustom
                className="w-[250px] border-none mr-4 mt-2"
                label="Thời gian thực hiện"
              >
                <RangePicker
                  value={searchTime}
                  onChange={(dates) => setSearchTime(dates)}
                />
              </FormItemCustom>
              <div
                style={{ display: "flex", flexDirection: "column" }}
                className="mr-4 mt-2"
              >
                <label style={{ paddingBottom: "5px" }}>Nhân viên:</label>
                <Select
                  showSearch
                  className="w-[150px] h-[36px]"
                  value={searchEmployee}
                  onChange={(value) => setSearchEmployee(value)}
                  defaultValue="all"
                  filterOption={filterOption}
                  optionFilterProp="children"
                >
                  <Select.Option value="all">Tất cả</Select.Option>
                  {dataEmployee.map((employee) => (
                    <Select.Option key={employee.name} value={employee.name}>
                      {employee.employee_name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column" }}
                className="mr-4 mt-2"
              >
                <label style={{ paddingBottom: "5px" }}>Điểm AI chấm:</label>
                <Select
                  showSearch
                  className="w-[150px] h-[36px]"
                  value={searchAIEvalue}
                  onChange={(value) => setSearchAIEvalue(value)}
                  defaultValue="all"
                  filterOption={filterOption}
                  optionFilterProp="children"
                >
                  <Select.Option value="all">Tất cả</Select.Option>
                  {arrSourceEvalue.map((source) => (
                    <Select.Option key={source.value} value={source.value}>
                      {source.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column" }}
                className="mr-4 mt-2"
              >
                <label style={{ paddingBottom: "5px" }}>
                  Điểm giám sát chấm:
                </label>
                <Select
                  className="w-[150px] h-[36px]"
                  value={searchHumanEvalue}
                  onChange={(value) => setSearchHumanEvalue(value)}
                  defaultValue="all"
                  filterOption={filterOption}
                  optionFilterProp="children"
                  showSearch
                >
                  <Select.Option value="all">Tất cả</Select.Option>
                  {arrSourceEvalue.map((source) => (
                    <Select.Option key={source.value} value={source.value}>
                      {source.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <Button type="primary" onClick={onShowFrmUpdateScore}>Cập nhật điểm giám sát chấm</Button>
            </div>
          </div>
        </div>

        <div>
          {isGroupByCampaign ? (
            <TableCustom
              bordered
              columns={columnsReportByCampaign}
              dataSource={dataReportsByCampaign}
              pagination={dataReportsByCampaign.length > 5}
              scroll={{ y: 540, x: 2000 }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => handleRowClick(record, rowIndex), // Gọi hàm xử lý khi click vào dòng
                };
              }}
              //rowHoverBg="red" // Màu nền mong muốn khi hover
              //rowHoverable={true}
            />
          ) : (
            <TableCustom
              bordered
              columns={columns}
              dataSource={dataReports}
              scroll={{ y: 540, x: 1300 }}
              pagination={dataReports.length > 5}
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => handleRowClick(record, rowIndex), // Gọi hàm xử lý khi click vào dòng
                };
              }}
              //rowHoverBg="red " // Màu nền mong muốn khi hover
              //rowHoverable={true}
              expandable={{
                expandedRowRender: (record, index) => (
                  <div style={{ margin: 5 }}>
                    <TableCustom
                      columns={expandedColumns}
                      dataSource={record.detail_skus}
                      pagination={false}
                    />
                  </div>
                ),
              }}
            />
          )}
        </div>
      </div>

      <Image.PreviewGroup
        preview={{
          visible: previewVisible,
          onVisibleChange: handlePreviewVisibleChange,
        }}
      >
        {itemImage.map((url, index) => (
          <Image style={{ display: "none" }} key={index} width={50} src={url} />
        ))}
      </Image.PreviewGroup>

      <Modal
        title="Cập nhật điểm trưng bày giám sát chấm"
        open={showFrmUpdateScore}
        width={600}
        onOk={handleOkUpdateScore}
        onCancel={handleCancelUpdateScore}
        footer={[
          <Button key="back" onClick={handleCancelUpdateScore}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOkUpdateScore} loading={loadingUpdateScores}>
            Lưu lại
          </Button>,
        ]}
      >
        <p className="text-[#637381] font-normal text-sm">
          Dữ liệu chấm điểm trưng bày giám sát chấm sẽ được cập nhật dựa theo một trong các tiêu chí
        </p>
        <Radio.Group onChange={onChangeTypeUpdateScore} value={typeUpdateScore}>
          <Space direction="vertical">
            <Radio value={0}>Điểm trưng bày giám sát chấm được cập nhập dựa theo AI chấm</Radio>
            <Radio value={1}>Điểm trưng bày giám sát chấm được cập nhập theo giá trị được chọn</Radio>
          </Space>
        </Radio.Group>
        {
          typeUpdateScore === 1 && (
            <Select
              defaultValue={valScore}
              style={{ width: 540, marginTop: 10, marginBottom: 10 }}
              onChange={handleChangeScore}
              options={[
                { value: 0, label: 'Không đạt' },
                { value: 1, label: 'Đạt' }
              ]}
            />
          )
        }
      </Modal>
    </>
  );
}
