import { LuUploadCloud } from "react-icons/lu";
import { FormItemCustom, HeaderPage, TableCustom } from "../../components";
import { VscAdd } from "react-icons/vsc";
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
      dataIndex: "campaign_name",
    },
    {
      title: "Tỷ lệ giám sát chấm",
      dataIndex: "campaign_name",
    },]
  }
  const colTableTienDoTyLe = 
  {
    columns: [{
      title: "STT",
      dataIndex: "stt"
    },
    {
      title: "Chiến dịch",
      dataIndex: "campaign_name",
    },
    {
      title: "Tỷ lệ",
      dataIndex: "campaign_name",
    },
   ]
  }
  const colTableNhanVienChupAnh= 
  {
    columns: [{
      title: "",
      dataIndex: "stt"
    },
    {
      title: "Nhân viên",
      dataIndex: "campaign_name",
    },
    {
      title: "Số lượng",
      dataIndex: "campaign_name",
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
