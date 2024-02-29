
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
    dataIndex: "employee_code",
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

export default function ReportDetail() {
  const [searchCampaign, setSearchCampaign] = useState('');
  const [searchTime, setSearchTime] = useState(null); // Sử dụng state để lưu giá trị thời gian thực hiện
  const [searchEmployee, setSearchEmployee] = useState('all'); // Mặc định là 'all'
  const [filteredDataReport, setFilteredDataReport] =  useState<any[]>([]);

  const navigate = useNavigate();
  const [dataReport, setDataReport] = useState<any[]>([]);
  const dataEmployee =  [
    {
        "designation": null,
        "email": "hoanganh@gmail.com",
        "cell_number": null,
        "name": "HR-EMP-00014",
        "date_of_birth": 1017939600,
        "employee_name": "Hoàng Anh",
        "image": null
    },
    {
        "designation": null,
        "email": "hapt@mbw.vn",
        "cell_number": null,
        "name": "HR-EMP-00013",
        "date_of_birth": 639766800,
        "employee_name": "Hà PT",
        "image": null
    },
    {
        "designation": null,
        "email": "lamthatnhanh111@gmail.com",
        "cell_number": null,
        "name": "HR-EMP-00012",
        "date_of_birth": 987181200,
        "employee_name": "Vương Linh",
        "image": null
    },
    {
        "designation": null,
        "email": "haudang130197@gmail.com",
        "cell_number": null,
        "name": "HR-EMP-00011",
        "date_of_birth": 891709200,
        "employee_name": "Đặng Hậu",
        "image": "http://hr.mbwcloud.com:8007/private/files/growing-hydrangeas-1402684-01-3942-3246-1680492267.jpg"
    },
    {
        "designation": null,
        "email": "hong23n@gmail.com",
        "cell_number": null,
        "name": "HR-EMP-00010",
        "date_of_birth": 891709200,
        "employee_name": "Thúy Hồng",
        "image": "http://hr.mbwcloud.com:8007/private/files/avtDefault.png"
    },
    {
        "designation": null,
        "email": "longkhuat0902@gmail.com",
        "cell_number": null,
        "name": "HR-EMP-00009",
        "date_of_birth": 1017939600,
        "employee_name": "Khuất Long",
        "image": null
    },
    {
        "designation": null,
        "email": "chuquynhanh256@gmail.com",
        "cell_number": null,
        "name": "HR-EMP-00008",
        "date_of_birth": 923158800,
        "employee_name": "Chu Anh",
        "image": "http://hr.mbwcloud.com:8004/files/avarta_HR-EMP-00005_2023-11-11 10:50:38.394703_b58c7d.png"
    },
    {
        "designation": null,
        "email": "ductuan1999@gmail.com",
        "cell_number": null,
        "name": "HR-EMP-00007",
        "date_of_birth": 923763600,
        "employee_name": "Đức Tuấn",
        "image": null
    },
    {
        "designation": null,
        "email": "tungda@mobiwork.vn",
        "cell_number": null,
        "name": "HR-EMP-00006",
        "date_of_birth": 607798800,
        "employee_name": "Đỗ Tùng",
        "image": "http://hr.mbwcloud.com:8007/private/files/IMG_20220327_1504415734df.jpg"
    },
    {
        "designation": null,
        "email": "phongtran100401@gmail.com",
        "cell_number": null,
        "name": "HR-EMP-00005",
        "date_of_birth": 986835600,
        "employee_name": "Trần Phong",
        "image": null
    },
    {
        "designation": null,
        "email": null,
        "cell_number": null,
        "name": "HR-EMP-00004",
        "date_of_birth": 1563123600,
        "employee_name": "Nguyễn Thanh Mạnh",
        "image": null
    },
    {
        "designation": null,
        "email": null,
        "cell_number": null,
        "name": "HR-EMP-00003",
        "date_of_birth": 950893200,
        "employee_name": "Hà Chi",
        "image": null
    },
    {
        "designation": null,
        "email": "ngocsondds@gmail.com",
        "cell_number": null,
        "name": "HR-EMP-00002",
        "date_of_birth": 959706000,
        "employee_name": "Ngọc Sơn",
        "image": null
    },
    {
        "designation": null,
        "email": "chuyendev@gmail.com",
        "cell_number": null,
        "name": "HR-EMP-00001",
        "date_of_birth": 1694019600,
        "employee_name": "Lê Công Chuyện",
        "image": null
    }
]
  const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
    "checkbox"
  );
  const handleRowClick = (record) => {
    // Lưu record vào local storage
    localStorage.setItem('recordData', JSON.stringify(record));
    navigate(`/report-view`);
  };
  //Các hàm xử lý danh mục
  const fetchDataReport= async () => {
    try {
      //setLoading(true);
      let urlReport = '/api/method/vgm_audit.api.api.get_list_reports';
      const response = await AxiosService.get(urlReport);
      // Kiểm tra xem kết quả từ API có chứa dữ liệu không
      if (response && response.message.data) {
        //Thêm key cho mỗi phần tử trong mảng, sử dụng trường 'name'
        let dataReport: DataType[] = response.message.data.map((item: DataType,index: number) => {
          return {
            ...item,
            key: item.name,
            stt: index+1,
            quantity_cate:JSON.parse(item.categories).length.toString() 
          }
        })
        setDataReport(dataReport);
        setFilteredDataReport(dataReport);
      }


    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchDataReport();
  }, []);

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
