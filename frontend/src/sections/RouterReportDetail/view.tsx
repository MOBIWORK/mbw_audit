
import { FormItemCustom, HeaderPage, TableCustom } from "../../components";
import  {AxiosService} from '../../services/server';
import * as XLSX from 'xlsx';
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import * as FileSaver from 'file-saver';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import { Input, TableColumnsType, DatePicker, Select } from "antd";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import paths from "../AppConst/path.js";
interface DataTypeReport {
  key: React.Key;
  stt: string;
  name: string;
  customer_name: string;
  employee_name: string;
  campaign_name: string;
  categories : string;
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
  const [searchCampaign, setSearchCampaign] = useState('all');
  const [searchTime, setSearchTime] = useState([]); // Sử dụng state để lưu giá trị thời gian thực hiện
  const [searchEmployee, setSearchEmployee] = useState('all'); // Mặc định là 'all'

  const navigate = useNavigate();
  const [dataReports, setDataReports] = useState<any[]>([]);
  const [dataEmployee, setDataEmployee] = useState<any[]>([]);
  const [campaignSources, setCampaignSources] = useState<any[]>([]);

  const handleRowClick = (record) => {
    // Lưu record vào local storage
    localStorage.setItem('recordData', JSON.stringify(record));
    navigate(`/report-view`);
  };
  useEffect(() => {
    initDataEmployee();
    initDataCampaigns();
    fetchDataReport(); // Sau đó lấy dữ liệu báo cáo
  }, []);

  const handleShowImage = (image) => {
    console.log(image)
  }

  const columns: TableColumnsType<DataTypeReport> = [
    {
      title: "STT",
      dataIndex: "stt",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer_name",
    },
    {
      title: "Tên chiến dịch",
      dataIndex: "campaign_name",
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
        <>
          <a onClick={() => handleShowImage(item)}>Xem hình ảnh</a>
        </>
      )
    },
    {
      title: "Ảnh gian hàng AI",
      dataIndex: "images",
      render: (item) => (
        <>
          <a onClick={() => handleShowImage(item)}>Xem hình ảnh</a>
        </>
      )
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
          {scoring_machine === 1 && <span style={{ display: 'flex' }}><CheckCircleOutlined style={{fontSize: '17px', color: 'green', paddingRight: '3px'}} /> <span style={{color: 'green', verticalAlign: 'middle'}}>Đạt</span></span>}
          {scoring_machine === 0 && <span style={{ display: 'flex' }}><CloseCircleOutlined style={{fontSize: '17px', color: 'red', paddingRight: '3px'}} /> <span style={{color: 'red', verticalAlign: 'middle'}}>Không đạt</span></span>}
        </>
      )
    },
    {
      title: "Điểm trưng bày giám sát chấm",
      dataIndex: "scoring_human",
      render: (scoring_human: number) => (
        <>
          {scoring_human === 1 && <span style={{ display: 'flex' }}><CheckCircleOutlined style={{fontSize: '17px', color: 'green', paddingRight: '3px'}} /> <span style={{color: 'green', verticalAlign: 'middle'}}>Đạt</span></span>}
          {scoring_human === 0 && <span style={{ display: 'flex' }}><CloseCircleOutlined style={{fontSize: '17px', color: 'red', paddingRight: '3px'}} /> <span style={{color: 'red', verticalAlign: 'middle'}}>Không đạt</span></span>}
        </>
      )
    }
  ];

  const expandedColumns = [
    // { title: "STT", dataIndex: "stt" },
    { title: "Tên sản phẩm", dataIndex: "product_name" },
    { title: "Số lượng sản phẩm AI đếm", dataIndex: "sum_product" },
    {
      title: "Số lượng sản phẩm giám sát đếm",
      dataIndex: "sum_product_human"
    },
    { title: "Điểm trưng bày AI chấm", dataIndex: "scoring_machine", render: (scoring_machine: number) => (
      <>
        {scoring_machine === 1 && <span style={{ display: 'flex' }}><CheckCircleOutlined style={{fontSize: '17px', color: 'green', paddingRight: '3px'}} /> <span style={{color: 'green', verticalAlign: 'middle'}}>Đạt</span></span>}
        {scoring_machine === 0 && <span style={{ display: 'flex' }}><CloseCircleOutlined style={{fontSize: '17px', color: 'red', paddingRight: '3px'}} /> <span style={{color: 'red', verticalAlign: 'middle'}}>Không đạt</span></span>}
      </>
    ) }
];

const fetchDataReport = async () => {
  let urlReports = "/api/method/mbw_audit.api.api.get_reports_by_filter";
  if(searchCampaign != null && searchCampaign != "" && searchCampaign != "all"){
    urlReports = `${urlReports}?campaign_code=${searchCampaign}`;
  }
  if(searchTime != null && searchTime.length == 2){
    let start_date = new Date(searchTime[0]).getTime()/1000;
    let end_date = new Date(searchTime[1]).getTime()/1000;
    if(urlReports.includes("?")) urlReports = `${urlReports}&start_date=${start_date}&end_date=${end_date}`;
    else urlReports = `${urlReports}?start_date=${start_date}&end_date=${end_date}`;
  }
  if(searchEmployee != null && searchEmployee != "" && searchEmployee != "all"){
    if(urlReports.includes("?")) urlReports = `${urlReports}&employee_id=${searchEmployee}`;
    else urlReports = `${urlReports}?employee_id=${searchEmployee}`;
  }
  let res = await AxiosService.get(urlReports);
  if(res != null && res.message == "ok" && res.result != null && res.result.data != null){
    let dataSources = res.result.data.map((item: DataTypeReport, index: number) => {
      let stt: string = (index + 1).toString().padStart(2, '0');
      let quantity_cate: string = JSON.parse(item.categories).length.toString().padStart(2, '0');
      return {
        ...item,
        key: item.name,
        stt: stt,
        quantity_cate: quantity_cate
      }
    })
    setDataReports(dataSources);
    console.log(dataSources);
  }else{
    setDataReports([]);
  }
};

const initDataEmployee = async () => {
    try {
        let urlEmployee = "/api/method/mbw_service_v2.api.ess.employee.get_list_employee";
        const res = await AxiosService.get(urlEmployee);
        if (res && res.result && res.result.data) {
          setDataEmployee(res.result.data)
        }
    } catch (error) {
        console.error("Error fetching employee data:", error);
    }
};

const initDataCampaigns = async () => {
  let urlCampaign = "/api/method/mbw_audit.api.api.get_all_campaigns";
  const res = await AxiosService.get(urlCampaign);
  if(res != null && res.message == "ok" && res.result != null){
    setCampaignSources(res.result.data);
  }else{
    setCampaignSources([]);
  }
}


  useEffect(() => {
    fetchDataReport();
  }, [searchCampaign, searchTime, searchEmployee]);
  
  const exportToExcel = () => {
    onExportDataToExcel(dataReports, "Báo cáo chấm điểm trưng bày");
  };

  const onExportDataToExcel = async (table, title) => {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');
    sheet.properties.defaultColWidth = 20;
    sheet.getColumn('A').width = 30;
    sheet.mergeCells('A2:J2');
    sheet.getCell('A2').value = title;
    sheet.getCell('A2').style = { font: { bold: true, name: 'Times New Roman', size: 12 } };
    sheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    let rowHeader = sheet.getRow(4);
    let rowHeader_Next = sheet.getRow(5);
    let fieldsMerge = [
      {"title": "Khách hàng", "field": "customer_name"},
      {"title": "Tên chiến dịch", "field": "campaign_name"},
      {"title": "Nhân viên thực hiện", "field": "employee_name"},
      {"title": "Số lượng danh mục", "field": "categories"},
      {"title": "Ảnh gian hàng", "field": "images"},
      {"title": "Ảnh gian hàng AI", "field": "images_ai"},
      {"title": "Thời gian thực hiện", "field": "images_time"},
      {"title": "Điểm trưng bày AI chấm", "field": "scoring_machine"},
      {"title": "Điểm trưng bày giám sát chấm", "field": "scoring_human"}
    ]
    for(let i = 0; i < fieldsMerge.length; i++){
      let cellStart = rowHeader.getCell(i+1);
      let cellEnd = rowHeader_Next.getCell(i+1);
      sheet.mergeCells(`${cellStart._address}:${cellEnd._address}`);
      rowHeader.getCell(i+1).style = { font: { bold: true, name: 'Times New Roman', size: 12, italic: true } };
      rowHeader.getCell(i+1).alignment = { vertical: 'middle', horizontal: 'center' };
      rowHeader.getCell(i+1).value = fieldsMerge[i].title;
    }
    for(let i = 0; i < table.length; i++){
      let rowStart = 6;
      let row = sheet.getRow(i + rowStart);
      let cellStart = 1;
      for(let j = 0; j < fieldsMerge.length; j++){
        row.getCell(cellStart).style = { font: { name: 'Times New Roman', size: 12, italic: true } };
        let valCell = "";
        if(fieldsMerge[j].field == "categories"){
          if(table[i][fieldsMerge[j].field] != null && table[i][fieldsMerge[j].field] != "") {
            let categories = JSON.parse(table[i][fieldsMerge[j].field]);
            valCell = categories.length;
          }
        }else if(fieldsMerge[j].field == "scoring_machine" || fieldsMerge[j].field == "scoring_human"){
          if(table[i][fieldsMerge[j].field] == 0) valCell = "Không đạt";
          else valCell = "Đạt";
        }
        else{
          valCell = table[i][fieldsMerge[j].field];
        }
        row.getCell(cellStart).value = valCell;
        cellStart += 1;
      }
    }
    const buffer = await workbook.xlsx.writeBuffer();
    saveAsExcelFile(buffer, "report");
  }

  const saveAsExcelFile = (buffer: any, fileName: string) => {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
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
             action: exportToExcel
          },
        ]}
      />
      <div className="bg-white rounded-xl">
        <div className="flex p-4" style={{ alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '15px' }}>
          <label style={{paddingBottom: '5px'}}>Chiến dịch:</label>
          <Select className="w-[200px] h-[36px]" value={searchCampaign}
                    onChange={(value) => setSearchCampaign(value)} defaultValue="all">
            <Select.Option value="all">Tất cả</Select.Option>
            {campaignSources.map(campaign => (
              <Select.Option key={campaign.name} value={campaign.name}>
                {campaign.campaign_name}
              </Select.Option>
            ))}
          </Select>
        </div>
      <FormItemCustom className="w-[250px] border-none mr-4" label="Thời gian thực hiện">
        <RangePicker  value={searchTime}
             onChange={(dates) => setSearchTime(dates)}/>
      </FormItemCustom>
  <div style={{ display: 'flex', flexDirection: 'column' }}>
  <label style={{paddingBottom: '5px'}}>Nhân viên:</label>
  <Select className="w-[200px] h-[36px]" value={searchEmployee}
            onChange={(value) => setSearchEmployee(value)} defaultValue="all">
    <Select.Option value="all">Tất cả</Select.Option>
    {dataEmployee.map(employee => (
      <Select.Option key={employee.name} value={employee.name}>
        {employee.employee_name}
      </Select.Option>
    ))}
  </Select>
</div>

    </div>
        <div>
          <TableCustom
            columns={columns}
            dataSource={dataReports}
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
              )
          }}
          />
        </div>
      </div>
    </>
  );

}
