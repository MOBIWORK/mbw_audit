import { FormItemCustom, HeaderPage, TableCustom } from "../../components";
import { AxiosService } from "../../services/server";
import * as XLSX from "xlsx";
import * as ExcelJS from "exceljs"; // Giả sử exceljs hỗ trợ cú pháp mô-đun ES6
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import * as FileSaver from "file-saver";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Input,
  TableColumnsType,
  DatePicker,
  Select,
  Image,
  message,
  Form,
} from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import paths from "../AppConst/path.js";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { log } from "console";
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
// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
};
const apiUrl = paths.apiUrl;
export default function ReportDetail() {
  const [searchCampaign, setSearchCampaign] = useState("all");
  const [searchTime, setSearchTime] = useState([]); // Sử dụng state để lưu giá trị thời gian thực hiện
  const [searchEmployee, setSearchEmployee] = useState("all"); // Mặc định là 'all'
  const [searchAIEvalue, setSearchAIEvalue] = useState("all");
  const [searchHumanEvalue, setSearchHumanEvalue] = useState("all");

  const [imageButtonClick, setImageButtonClick] = useState(false);

  const [arrSourceEvalue, setArrSourceEvalue] = useState<any[]>([
    { label: "Đạt", value: 1 },
    { label: "Không đạt", value: 0 },
  ]);
  const [isGroupByCampaign, setIsGroupByCampaign] = useState(false);
  const [columnsReportByCampaign, setColumnsReportByCampaign] = useState([
    {
      title: "STT",
      dataIndex: "stt",
      fixed: "left",
      width: 100,
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
      title: "Số lượng sản phẩm AI đếm",
      children: [],
    },
    {
      title: "Số lượng sản phẩm giám sát đếm",
      children: [],
    },
    {
      title: "Ảnh gian hàng",
      dataIndex: "images",
      render: (item) => (
        <a
          onClick={(event) => {
            event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền ra ngoài
            handleImageClick(item); // Gọi hàm xử lý hiển thị hình ảnh
          }}
        >
          Xem hình ảnh
        </a>
      ),
    },
    {
      title: "Ảnh gian hàng AI",
      dataIndex: "images_ai",
      render: (item) => (
        <a
          onClick={(event) => {
            event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền ra ngoài
            handleImageClick(item); // Gọi hàm xử lý hiển thị hình ảnh
          }}
        >
          Xem hình ảnh
        </a>
      ),
    },
    {
      title: "Thời gian thực hiện",
      dataIndex: "images_time",
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
      render: (scoring_human: number) => (
        <>
          {scoring_human === 1 && (
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
          {scoring_human === 0 && (
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
  ]);
  const [dataReportsByCampaign, setDataReportsByCampaign] = useState([]);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const campaign = params.get("campaign");
  // if(campaign != null && campaign != "" && campaign != "all"){
  //   setSearchCampaign(campaign);
  // }
  const navigate = useNavigate();
  const [dataReports, setDataReports] = useState<any[]>([]);
  const [dataEmployee, setDataEmployee] = useState<any[]>([]);
  const [campaignSources, setCampaignSources] = useState<any[]>([]);

  const handleRowClick = (record) => {
    // Lưu record vào local storage
    localStorage.setItem("recordData", JSON.stringify(record));
    localStorage.setItem("dataReports", JSON.stringify(dataReports));
    navigate(`/report-view`);
  };
  useEffect(() => {
    initDataEmployee();
    initDataCampaigns();
    fetchDataReport(); // Sau đó lấy dữ liệu báo cáo
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
      render: (item) => (
        <a
          onClick={(event) => {
            event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền ra ngoài
            handleImageClick(item); // Gọi hàm xử lý hiển thị hình ảnh
          }}
        >
          Xem hình ảnh
        </a>
      ),
    },
    {
      title: "Ảnh gian hàng AI",
      dataIndex: "images_ai",
      render: (item) => (
        <a
          onClick={(event) => {
            event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền ra ngoài
            handleImageClick(item); // Gọi hàm xử lý hiển thị hình ảnh
          }}
        >
          Xem hình ảnh
        </a>
      ),
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
      render: (scoring_human: number, item: any) => (
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Select
            defaultValue={scoring_human}
            onChange={() => handleChange(item)}
            bordered={false}
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

  const handleChange = async (value: any) => {
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
    } else {
      message.error("Cập nhật thất bại");
    }
  };

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
      console.log(urlReports);
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
        for (let j = 0; j < dataSources.length; j++) {
          for (let i = 0; i < dataSources[j].info_products_ai.length; i++) {
            if (!isRenderHeader) {
              let objColProductAI = {
                title: dataSources[j].info_products_ai[i].product_name,
                dataIndex: `${dataSources[j].info_products_ai[i].product_name}_ai`,
                key: `${dataSources[j].info_products_ai[i].product_name}_ai`,
                width: 100,
              };
              let objColProductHuman = {
                title: dataSources[j].info_products_ai[i].product_name,
                dataIndex: `${dataSources[j].info_products_ai[i].product_name}_human`,
                key: `${dataSources[j].info_products_ai[i].product_name}_human`,
                width: 100,
              };
              arrChildColsProductAI.push(objColProductAI);
              arrChildColsProductHuman.push(objColProductHuman);
            }
            dataSources[j][
              `${dataSources[j].info_products_ai[i].product_name}_ai`
            ] = dataSources[j].info_products_ai[i].sum;
            dataSources[j][
              `${dataSources[j].info_products_human[i].product_name}_human`
            ] = dataSources[j].info_products_human[i].sum;
          }
          if (arrChildColsProductAI.length > 0) isRenderHeader = true;
        }
        setColumnsReportByCampaign((preValue) => {
          preValue[5].children = arrChildColsProductAI;
          preValue[6].children = arrChildColsProductHuman;
          return preValue;
        });
        setDataReportsByCampaign(dataSources);
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

  const initDataEmployee = async () => {
    try {
      let urlEmployee =
        "/api/method/mbw_service_v2.api.ess.employee.get_list_employee";
      const res = await AxiosService.get(urlEmployee);
      if (res && res.result && res.result.data) {
        setDataEmployee(res.result.data);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
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

  const applyCommonCellStyle = (cell, isHeader = false) => {
    const style = {
      font: {
        bold: true,
        name: "Times New Roman",
        size: 12,
      },
      alignment: {
        vertical: "middle",
        horizontal: "center",
      },
    };

    if (isHeader) {
      style.border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
    }

    cell.style = style;
  };

  const onExportDataToExcelByCampaign = async (table, columns, title) => {
    console.log(table);
    console.log(columns);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Sheet1");

    let currentColumnIndex = 1; // Chỉ số cột hiện tại
    columns.forEach((column, index) => {
      const startColumnIndex = currentColumnIndex; // Chỉ số cột bắt đầu

      // Đặt tiêu đề và chiều rộng cho cột
      if (currentColumnIndex === 1) {
        // Cố định chiều rộng cột đầu tiên
        sheet.getColumn(currentColumnIndex).width = 10;
      } else {
        // Đặt chiều rộng theo giá trị mặc định hoặc được chỉ định
        sheet.getColumn(currentColumnIndex).width = column.width || 20; // Set default width if not provided
      }

      const cell = sheet.getCell(1, currentColumnIndex);
      cell.value = column.title;
      applyCommonCellStyle(cell, true); // Áp dụng viền đậm cho ô tiêu đề cột

      // Kiểm tra nếu cột có children
      if (column.children && column.children.length > 0) {
        // Tính tổng số cột con
        const totalChildColumns = column.children.length;

        // Gộp các ô cho cột cha nếu chưa được gộp
        const isMerged = cell.isMerged;
        if (!isMerged) {
          sheet.mergeCells(
            1,
            currentColumnIndex,
            1,
            currentColumnIndex + totalChildColumns - 1
          );
        }

        // Thêm tiêu đề cho các cột con
        column.children.forEach((child, childIndex) => {
          const childColumnIndex = startColumnIndex + childIndex;
          const childCell = sheet.getCell(2, childColumnIndex);
          childCell.value = child.title;
          applyCommonCellStyle(childCell);
        });

        // Cập nhật chỉ số cột hiện tại cho vòng lặp tiếp theo
        currentColumnIndex += totalChildColumns;
      } else {
        // Nếu cột không có children, di chuyển đến cột tiếp theo
        currentColumnIndex++;
      }
    });

    // Điền dữ liệu từ bảng vào Excel
    const dataRowIndex = 3; // Chỉ số hàng bắt đầu cho dữ liệu
    table.forEach((row, rowIndex) => {
      currentColumnIndex = 1; // Đặt lại chỉ số cột cho mỗi hàng
      columns.forEach((column, columnIndex) => {
        const dataIndex = column.dataIndex; // Tên của thuộc tính trong dữ liệu tương ứng với cột
        let cellValue = row[dataIndex]; // Lấy giá trị từ dữ liệu

        // Kiểm tra nếu cột có children
        if (column.children && column.children.length > 0) {
          // Không làm gì với cột cha có children
          return;
        }

        // Kiểm tra nếu cột là 'title_ai' hoặc 'title_human'
        if (dataIndex.endsWith("_ai") || dataIndex.endsWith("_human")) {
          // Tách tên cột và loại sản phẩm (ai/human)
          const [title, type] = column.title.split(" "); // Giả sử tiêu đề của cột là 'Tên sản phẩm ai'
          // Tìm dữ liệu tương ứng từ dữ liệu của hàng
          const productData = row[title.toLowerCase()]; // title.toLowerCase() sẽ trở thành 'dove_1' hoặc 'dove_2'
          if (productData && Array.isArray(productData)) {
            // Lọc dữ liệu theo loại (ai/human)
            const filteredData = productData.filter(
              (product) => product.product_name === title
            );
            // Tạo chuỗi dữ liệu từ các sản phẩm
            cellValue = filteredData
              .map((product) => `${product.product_name}: ${product.sum}`)
              .join("\n");
          }
        }

        // Gán giá trị vào ô Excel
        const cell = sheet.getCell(dataRowIndex + rowIndex, currentColumnIndex);
        cell.value = cellValue;
        applyCommonCellStyle(cell, false);

        // Di chuyển đến cột tiếp theo
        currentColumnIndex++;
      });
    });
    // Lưu file Excel
    const buffer = await workbook.xlsx.writeBuffer();
    saveAsExcelFile(buffer, "report");
  };

  const onExportDataToExcel = async (table, title) => {
    //const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Sheet1");
    sheet.properties.defaultColWidth = 20;
    sheet.getColumn("A").width = 30;
    sheet.mergeCells("A2:J2");
    sheet.getCell("A2").value = title;
    sheet.getCell("A2").style = {
      font: { bold: true, name: "Times New Roman", size: 12 },
    };
    sheet.getCell("A2").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    let rowHeader = sheet.getRow(4);
    let rowHeader_Next = sheet.getRow(5);
    let fieldsMerge = [
      { title: "Khách hàng", field: "customer_name" },
      { title: "Tên chiến dịch", field: "campaign_name" },
      { title: "Nhân viên thực hiện", field: "employee_name" },
      { title: "Số lượng danh mục", field: "categories" },
      { title: "Ảnh gian hàng", field: "images" },
      { title: "Ảnh gian hàng AI", field: "images_ai" },
      { title: "Thời gian thực hiện", field: "images_time" },
      { title: "Điểm trưng bày AI chấm", field: "scoring_machine" },
      { title: "Điểm trưng bày giám sát chấm", field: "scoring_human" },
    ];
    for (let i = 0; i < fieldsMerge.length; i++) {
      let cellStart = rowHeader.getCell(i + 1);
      let cellEnd = rowHeader_Next.getCell(i + 1);
      sheet.mergeCells(`${cellStart._address}:${cellEnd._address}`);
      rowHeader.getCell(i + 1).style = {
        font: { bold: true, name: "Times New Roman", size: 12, italic: true },
      };
      rowHeader.getCell(i + 1).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      rowHeader.getCell(i + 1).value = fieldsMerge[i].title;
    }
    for (let i = 0; i < table.length; i++) {
      let rowStart = 6;
      let row = sheet.getRow(i + rowStart);
      let cellStart = 1;
      for (let j = 0; j < fieldsMerge.length; j++) {
        row.getCell(cellStart).style = {
          font: { name: "Times New Roman", size: 12, italic: true },
        };
        let valCell = "";
        if (fieldsMerge[j].field == "categories") {
          if (
            table[i][fieldsMerge[j].field] != null &&
            table[i][fieldsMerge[j].field] != ""
          ) {
            let categories = JSON.parse(table[i][fieldsMerge[j].field]);
            valCell = categories.length;
          }
        } else if (
          fieldsMerge[j].field == "scoring_machine" ||
          fieldsMerge[j].field == "scoring_human"
        ) {
          if (table[i][fieldsMerge[j].field] == 0) valCell = "Không đạt";
          else valCell = "Đạt";
        } else {
          valCell = table[i][fieldsMerge[j].field];
        }
        row.getCell(cellStart).value = valCell;
        cellStart += 1;
      }
    }
    const buffer = await workbook.xlsx.writeBuffer();
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

  const handleImageClick = (item) => {
    const imageArray = JSON.parse(item);
    setItemImage(imageArray);
    setPreviewVisible(true); // Mở chế độ xem preview khi click vào hình ảnh
  };
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
              flexDirection: "column",
              paddingRight: "15px",
            }}
          >
            <label style={{ paddingBottom: "5px" }}>Chiến dịch:</label>
            <Select
              className="w-[150px] h-[36px]"
              value={searchCampaign}
              onChange={(value) => onChangeCampaign(value)}
              defaultValue="all"
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
            className="w-[250px] border-none mr-4"
            label="Thời gian thực hiện"
          >
            <RangePicker
              value={searchTime}
              onChange={(dates) => setSearchTime(dates)}
            />
          </FormItemCustom>
          <div
            style={{ display: "flex", flexDirection: "column" }}
            className="mr-4"
          >
            <label style={{ paddingBottom: "5px" }}>Nhân viên:</label>
            <Select
              className="w-[150px] h-[36px]"
              value={searchEmployee}
              onChange={(value) => setSearchEmployee(value)}
              defaultValue="all"
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
            className="mr-4"
          >
            <label style={{ paddingBottom: "5px" }}>Điểm AI chấm:</label>
            <Select
              className="w-[150px] h-[36px]"
              value={searchAIEvalue}
              onChange={(value) => setSearchAIEvalue(value)}
              defaultValue="all"
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
            className="mr-4"
          >
            <label style={{ paddingBottom: "5px" }}>Điểm giám sát chấm:</label>
            <Select
              className="w-[150px] h-[36px]"
              value={searchHumanEvalue}
              onChange={(value) => setSearchHumanEvalue(value)}
              defaultValue="all"
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
        <div>
          {isGroupByCampaign ? (
            <TableCustom
              bordered
              columns={columnsReportByCampaign}
              dataSource={dataReportsByCampaign}
              scroll={{ y: 540, x: 2000 }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => handleRowClick(record), // Gọi hàm xử lý khi click vào dòng
                };
              }}
              rowHoverBg="#f0f0f0" // Màu nền mong muốn khi hover
            />
          ) : (
            <TableCustom
              bordered
              columns={columns}
              dataSource={dataReports}
              scroll={{ y: 540, x: 1300 }}
              pagination={false}
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => handleRowClick(record), // Gọi hàm xử lý khi click vào dòng
                };
              }}
              rowHoverBg="#f0f0f0" // Màu nền mong muốn khi hover
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
    </>
  );
}
