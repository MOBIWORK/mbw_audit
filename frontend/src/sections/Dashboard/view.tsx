import { LuUploadCloud } from "react-icons/lu";
import { FormItemCustom, HeaderPage, TableCustom } from "../../components";
import { VscAdd } from "react-icons/vsc";
import { Flex, Progress ,Avatar} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { Overview, InfoCard, WrapperCard,InfoCardChart } from "./components/card";
import { Input, Space, Table, TableColumnsType, Tag, Modal, message, Button, UploadProps,DatePicker,Row,Col } from "antd";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AxiosService } from "../../services/server";
import "./dashboard.css";
const { RangePicker } = DatePicker;
export default function Dashboard() {
  const [searchTime, setSearchTime] = useState([]); // Sử dụng state để lưu giá trị thời gian thực hiện
  const navigate = useNavigate();
  const [dataChienDich, setDataChienDich] = useState([]); 
  const dataChienDichThucHien = {
    color:'rgba(24, 119, 242, 1)',
    tong:50,
    tyle:25,

  }
  const dataKhachHangThamGia = {
    color:'rgba(34, 197, 94, 1)',
    tong:75,
    tyle:25,

  }
  const dataNhanVienThucHien = {
    color:'rgba(142, 51, 255, 1)',
    tong:30,
    tyle:25,

  }
  const colTableTyLe = {
    columns: [{
      title: "STT",
      dataIndex: "stt"
    },
    {
      title: "Chiến dịch",
      dataIndex: "campaign_name",
    },
    {
      title: "Tỷ lệ AI chấm",
      dataIndex: "tyle_ai",
      render: (percent) => <Progress percent={percent} strokeColor={percent > 50 ? '#52c41a' : '#f5222d'} />,
    },
    {
      title: "Tỷ lệ giám sát chấm",
      dataIndex: "tyle_giamsat",
      render: (percent) => <Progress percent={percent} strokeColor={percent > 50 ? '#52c41a' : '#f5222d'} />,
    },],
    source: [{
      stt: "01",
      campaign_name: 'Chiến dịch 1',
      tyle_ai: 30,
      tyle_giamsat: 50,
    },
    {
      stt: "02",
      campaign_name: 'Chiến dịch 2',
      tyle_ai: 45,
      tyle_giamsat: 60,
    },]
  }
  const colTableTienDoTyLe = {
    columns: [
      {
        title: "STT",
        dataIndex: "stt"
      },
      {
        title: "Chiến dịch",
        dataIndex: "campaign_name",
      },
      {
        title: "Tỷ lệ",
        dataIndex: "tyle",
        render: (percent) => (
          <Progress percent={percent} strokeColor={percent > 50 ? '#52c41a' : '#f5222d'} />
        ),
      },
    ],
    source: [
      {
        stt: "01",
        campaign_name: "Chiến dịch 1",
        tyle: 30,
      },
      {
        stt: "02",
        campaign_name: "Chiến dịch 2",
        tyle: 70,
      },
      // Thêm dữ liệu khác nếu cần
    ],
  };
  const colTableNhanVienChupAnh= 
  {
    columns: [{
      title: "",
      dataIndex: "stt"
    },
    {
      title: "Nhân viên",
      dataIndex: "customer_name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar shape="square" size={50} src={record.https} /> {/* Avatar nhân viên */}
          <div style={{ marginLeft: "8px" }}>
            <p>{text}</p> {/* Tên nhân viên */}
            <p>{record.employee_id}</p> {/* Mã nhân viên */}
          </div>
        </div>
      )
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
   ],
   source : [
    {
      stt: "01",
      customer_name: "Nguyễn Văn A",
      employee_id: "NV001",
      quantity: 10,
      https:"//user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png"
    },
    {
      stt: "02",
      customer_name: "Trần Thị B",
      employee_id: "NV002",
      quantity: 15,
      https:"//user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png"
    },
    {
      stt: "03",
      customer_name: "Lê Văn C",
      employee_id: "NV003",
      quantity: 20,
      https:"//user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png"
    },
  ]
  }
  
  return (
    <>
    <div style={{width:'100%',display: 'flex', justifyContent: 'space-between', alignItems:'center',textAlign:'center'}}>
    <HeaderPage
        title="Dashboard"
      />
    <FormItemCustom className="border-none mr-4" label="Thời gian thực hiện">
        <RangePicker  value={searchTime}
             onChange={(dates) => setSearchTime(dates)}/>
      </FormItemCustom>
    </div>
    <Row gutter={20} style={{marginTop:'20px'}}>
        <Col span={8}>
          <Overview  data={{
            title :"Chiến dịch được thực hiện",
            data: dataChienDichThucHien
          }}/>
        </Col>
        <Col span={8}>
        <Overview  data={{
            title :"Khách hàng tham gia ",
            data: dataKhachHangThamGia
          }}/>
        </Col>
        <Col span={8}>
        <Overview  data={{
            title :"Nhân viên thực hiện",
            data: dataNhanVienThucHien
          }}/>
        </Col>
       
      </Row>
      <Row gutter={20} style={{marginTop:'20px'}}>
        <Col span={16} >
          <InfoCard style={{height: '450px', overflow:'auto'}} data={{
            title :"Tỷ lệ đạt của chấm điểm trưng bày",
            data: colTableTyLe
          }}/>
        </Col>
        <Col span={8}>
        <InfoCard style={{height: '450px', overflow:'auto'}} data={{
            title :"Tỷ lệ tiến độ chiến dịch",
            data: colTableTienDoTyLe
          }}/>
        </Col>
       
      </Row>
      <Row gutter={20} style={{marginTop:'20px'}}>
        <Col span={16}>
          <InfoCardChart  data={{
            title :"Chiến dịch được thực hiện",
            data: dataChienDich
          }}/>
        </Col>
        <Col span={8}>
        <InfoCard style={{height: '450px', overflow:'auto'}} data={{
            title :"Top nhân viên chụp nhiều ảnh",
            data: colTableNhanVienChupAnh
          }}/>
        </Col>
       
      </Row>
    </>
  );
}
