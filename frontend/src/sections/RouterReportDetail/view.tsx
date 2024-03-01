
import { LuUploadCloud } from "react-icons/lu";
import { FormItemCustom, HeaderPage, TableCustom } from "../../components";
import  {AxiosService, AxiosServiceMBW} from '../../services/server';
import { VscAdd } from "react-icons/vsc";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Input, Space, Table, TableColumnsType,DatePicker,Select } from "antd";
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
    title: "Cửa hàng",
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
    title: "Thời gian vào",
    dataIndex: "date_check_in",
  },
  {
    title: "Thời gian ra",
    dataIndex: "date_check_out",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity_cate",
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
                return {
                    ...item,
                    key: item.name,
                    stt: index + 1,
                    quantity_cate: JSON.parse(item.categories).length.toString(),
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
        console.log(res);
        console.log("1")
        if (res && res.result && res.result.data) {
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
      const matchTime = searchTime && searchTime[0] && searchTime[1] ?
      new Date(record.date_check_in) >= searchTime[0] && new Date(record.date_check_in) <= searchTime[1] : true;
      const matchEmployee = searchEmployee === 'all' || record.employee_code === searchEmployee;
      return matchCampaign && matchEmployee && matchTime; // && matchTime nếu cần thêm điều kiện thời gian
    });
    setFilteredDataReport(filteredData);
  }, [searchCampaign, searchTime, searchEmployee, dataReport]);
  return (
    <>
      <HeaderPage
        title="Báo cáo"
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
        <div className="p-4">
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
