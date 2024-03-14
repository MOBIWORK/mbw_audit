import { LuUploadCloud } from "react-icons/lu";
import { FormItemCustom, HeaderPage, TableCustom } from "../../components";
import { VscAdd } from "react-icons/vsc";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { Input, Space, Table, TableColumnsType, Tag, Modal, message, Button, UploadProps,DatePicker } from "antd";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AxiosService } from "../../services/server";

const { RangePicker } = DatePicker;
export default function Dashboard() {
  const [searchTime, setSearchTime] = useState([]); // Sử dụng state để lưu giá trị thời gian thực hiện
  const navigate = useNavigate();

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
      
    </>
  );
}
