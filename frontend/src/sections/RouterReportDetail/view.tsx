
import { FormItemCustom, HeaderPage, TableCustom } from "../../components";
import  {AxiosService} from '../../services/server';
import * as XLSX from 'xlsx';
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
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
    title: "Số lượng danh mục sản phẩm",
    dataIndex: "quantity_cate",
  },
  {
    title: "Thời gian thực hiện",
    dataIndex: "images_time",
  },
  {
    title: "Chấm điểm trưng bày",
    dataIndex: "scoring_machine",
    render: (scoring_machine: number) => (
      <>
        {scoring_machine === 1 && <span style={{ display: 'flex' }}><CheckCircleOutlined style={{fontSize: '17px', color: 'green', paddingRight: '3px'}} /> <span style={{color: 'green', verticalAlign: 'middle'}}>Đạt</span></span>}
        {scoring_machine === 0 && <span style={{ display: 'flex' }}><CloseCircleOutlined style={{fontSize: '17px', color: 'red', paddingRight: '3px'}} /> <span style={{color: 'red', verticalAlign: 'middle'}}>Không đạt</span></span>}
      </>
    )
  },
];
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
  
  const transformDataSourceForExcel = (dataSource) => {
    return dataSource.map(item => ({
      ...item,
      scoring_machine: item.scoring_machine === 1 ? "Đạt" : "Không đạt"
      // Thêm các chuyển đổi khác nếu cần
    }));
  };

  const exportToExcel = (columns, fileName) => {
    const boldCellStyle = { font: { bold: true } };

    // Tạo dữ liệu từ dataSource
    const transformedDataSource = transformDataSourceForExcel(dataReports);
    const data = transformedDataSource.map((item) =>
        columns.map((column) => item[column.dataIndex])
    );

    // Tạo sheet từ dữ liệu
    const ws = XLSX.utils.aoa_to_sheet([
        columns.map((column) => column.title),
        ...data,
    ]);

    // Thiết lập các cấu hình cho các ô trong sheet
    ws['!cols'] = columns.map(() => ({ width: 20 })); // Thiết lập độ rộng cột
    ws['!rows'] = [{ hpx: 30 }]; // Thiết lập chiều cao dòng

    // Thiết lập các cấu hình cho từng ô trong hàng đầu tiên (tên cột)
    columns.forEach((column, colIndex) => {
        const cell = XLSX.utils.encode_cell({ r: 0, c: colIndex }); // Tên ô
        ws[cell].s = boldCellStyle; // Áp dụng kiểu cho ô
    });

    // Tạo workbook và append sheet vào workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Xuất file Excel
    XLSX.writeFile(wb, fileName + '.xlsx');
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
             action: () => exportToExcel(columns,'Danh sách báo cáo'),
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
          />
        </div>
      </div>
    </>
  );

}
