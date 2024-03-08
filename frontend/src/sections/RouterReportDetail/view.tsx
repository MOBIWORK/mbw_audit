
import { FormItemCustom, HeaderPage, TableCustom } from "../../components";
import  {AxiosService} from '../../services/server';
import { VscAdd } from "react-icons/vsc";
import * as XLSX from 'xlsx';
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import { Input, Space, Table, TableColumnsType,DatePicker,Select,Upload } from "antd";
import { useState,useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import paths from "../AppConst/path.js";
interface DataType {
  key: React.Key;
  stt: string;
  name: string;
  status: string;
  start: string;
  end: string;
  sum : string;
}
const { RangePicker } = DatePicker;
const columns: TableColumnsType<DataType> = [
  {
    title: "STT",
    dataIndex: "stt",
  },
  {
    title: "Khách hàng",
    dataIndex: "retail_code",
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
  const [searchCampaign, setSearchCampaign] = useState('');
  const [searchTime, setSearchTime] = useState(null); // Sử dụng state để lưu giá trị thời gian thực hiện
  const [searchEmployee, setSearchEmployee] = useState('all'); // Mặc định là 'all'
  const [filteredDataReport, setFilteredDataReport] =  useState<any[]>([]);

  const navigate = useNavigate();
  const [dataReport, setDataReport] = useState<any[]>([]);
  const [dataEmployee, setDataEmployee] = useState<any[]>([]);
  const [dataCustomer, setDataCustomer] = useState<any[]>([]);
  const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
    "checkbox"
  );
  const handleRowClick = (record) => {
    // Lưu record vào local storage
    localStorage.setItem('recordData', JSON.stringify(record));
    navigate(`/report-view`);
  };
  useEffect(() => {
     fetchDataReport(); // Sau đó lấy dữ liệu báo cáo
}, []);

const fetchDataReport = async () => {
   let arr =  await initDataEmployee();
    try {
        let urlReport = apiUrl + '.api.get_list_reports';
        const response = await AxiosService.get(urlReport);
        if (response && response.message && response.message.data) {
            let dataReport: DataType[] = response.message.data.map((item: DataType, index: number) => {
              let stt: string = (index + 1).toString().padStart(2, '0'); // Chuyển stt thành chuỗi và thêm số 0 nếu nhỏ hơn 10
              let quantity_cate: string = JSON.parse(item.categories).length.toString().padStart(2, '0'); // Số lượng danh mục với số 0 nếu nhỏ hơn 10
                return {
                    ...item,
                    key: item.name,
                    stt: stt,
                    quantity_cate: quantity_cate,
                    employee_name: findEmployeeName(arr,item.employee_code)
                };
            });

            setDataReport(dataReport);
            setFilteredDataReport(dataReport);
        }
    } catch (error) {
        console.error("Error fetching report data:", error);
    }
};

const initDataEmployee = async () => {
    try {
        let urlEmployee = "/api/method/mbw_service_v2.api.ess.employee.get_list_employee";
        const res = await AxiosService.get(urlEmployee);
        if (res && res.result && res.result.data) {
            setDataEmployee(res.result.data)
            return (res.result.data);
        }
    } catch (error) {
        console.error("Error fetching employee data:", error);
    }
};

// Hàm tìm kiếm tên nhân viên dựa trên employee_code
const findEmployeeName = (arr: [],employeeCode: string) => {
    const matchedEmployee = arr.find(employee => employee.name === employeeCode);
    return matchedEmployee ? matchedEmployee.employee_name : ''; 
};

  useEffect(() => {
    // Lọc dữ liệu báo cáo dựa trên các trường tìm kiếm khi có sự thay đổi
    const filteredData = dataReport.filter(record => {
      const matchCampaign = record.campaign_name.toLowerCase().includes(searchCampaign.toLowerCase());
      // Xử lý lọc theo thời gian nếu cần
      // const matchTime = true; // Đặt điều kiện mặc định
      // Xử lý lọc theo nhân viên
      // const matchTime = searchTime && searchTime[0] && searchTime[1] ?
      // new Date(record.date_check_in) >= searchTime[0] && new Date(record.date_check_in) <= searchTime[1] : true;
      const startOfDay = searchTime && searchTime[0] ? new Date(searchTime[0]) : null;
      const endOfDay = searchTime && searchTime[1] ? new Date(searchTime[1]) : null;
      
      const matchTime =
          startOfDay && endOfDay
              ? (
                  new Date(record.images_time) >= new Date(startOfDay.setHours(0, 0, 0, 0)) &&
                  new Date(record.images_time) <= new Date(endOfDay.setHours(23, 59, 59, 999))
                )
              : true;
      const matchEmployee = searchEmployee === 'all' || record.employee_code === searchEmployee;
      return matchCampaign && matchEmployee && matchTime; // && matchTime nếu cần thêm điều kiện thời gian
    });
    setFilteredDataReport(filteredData);
  }, [searchCampaign, searchTime, searchEmployee, dataReport]);
  const transformDataSourceForExcel = (dataSource) => {
    return dataSource.map(item => ({
      ...item,
      scoring_machine: item.scoring_machine === 1 ? "Đạt" : "Không đạt"
      // Thêm các chuyển đổi khác nếu cần
    }));
  };
  const exportToExcel = (columns, dataSource, fileName) => {
    const boldCellStyle = { font: { bold: true } };

    // Tạo dữ liệu từ dataSource
    const transformedDataSource = transformDataSourceForExcel(filteredDataReport);
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
             action: () => exportToExcel(columns,filteredDataReport,'Danh sách báo cáo'),
          },
        ]}
      />
      <div className="bg-white rounded-xl">
        <div className="flex p-4" style={{ alignItems: 'flex-end' }}>
      <FormItemCustom className="w-[320px] border-none mr-4 " >
        <Input placeholder="Tìm kiếm theo chiến dịch" 
         value={searchCampaign}
         onChange={(e) => setSearchCampaign(e.target.value)}
         prefix={<SearchOutlined />} />
      </FormItemCustom>
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
            dataSource={filteredDataReport}
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
