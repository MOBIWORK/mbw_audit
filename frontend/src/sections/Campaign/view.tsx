import { LuUploadCloud } from "react-icons/lu";
import { FormItemCustom, HeaderPage, TableCustom } from "../../components";
import { VscAdd } from "react-icons/vsc";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Input, Space, Table, TableColumnsType, Tag, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AxiosService } from "../../services/server";
import moment from 'moment';
import "./campaign.css";

interface TypeCampaign {
  key: React.Key;
  name: string;
  campaign_name: string;
  campaign_description: string;
  campaign_status: string;
  employees: string;
  products: string;
  retails: string;
  start_date: string;
  end_date: string;
}


export default function Campaign() {
  const navigate = useNavigate();
  const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
    "checkbox"
  );
  const columnCampaigns: TableColumnsType<TypeCampaign> = [
    {
      title: "Tên chiến dịch",
      dataIndex: "campaign_name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Trạng thái",
      dataIndex: "campaign_status",
      render: (_, record) => (
        <>
          {record.campaign_status === 'Open' && <Tag color="green"><div className={"dot-tag-green"}></div> Hoạt động</Tag>}
          {record.campaign_status === 'Close' && <Tag color="red"><div className={"dot-tag-red"}></div> Không hoạt động</Tag>}
        </>
      )
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      render: (date) => moment(date).format('DD/MM/YYYY')
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      render: (date) => moment(date).format('DD/MM/YYYY')
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>
            <EditOutlined onClick={() => handleEditCampaign(record)}/>
          </a>
          <a>
            <DeleteOutlined onClick={() => handleDeleteCampaign(record)}/>
          </a>
        </Space>
      ),
    },
  ];
  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: TypeCampaign[]) => {
      setCampaignsSelected(selectedRows);
      if(selectedRows.length > 0) setShowDeleteListCampaign(true);
      else setShowDeleteListCampaign(false);
    },
  };
  const [campaigns, setCampaigns] = useState<TypeCampaign[]>([]);
  const [searchCampaign, setSearchCampaign] = useState("");
  const [itemCampaignDelete, setItemCampaignDelete] = useState({});
  const [isModalOpenDeleteCampaign, setIsModalOpenDeleteCampaign] = useState(false);
  const [campaignsSelected, setCampaignsSelected] = useState<TypeCampaign[]>([]);
  const [showDeleteListCampaign, setShowDeleteListCampaign] = useState(false);
  const [isModalOpenDeleteListCampaign, setIsModalOpenDeleteListCampaign] = useState(false);

  useEffect(() => {
    initDataCampaigns();
  }, []);

  useEffect(() => {
    initDataCampaigns();
  }, [searchCampaign]);

  const initDataCampaigns = async () => {
    let urlCampaigns = `/api/resource/VGM_Campaign?fields=["*"]`;
    if(searchCampaign != null && searchCampaign != ""){
      urlCampaigns += `&filters=[["campaign_name","like","%${searchCampaign}%"]]`;
    }
    let res = await AxiosService.get(urlCampaigns);
    if (res && res.data) {
      // Thêm key cho mỗi phần tử trong mảng, sử dụng trường 'name'
      let dataCampaigns: TypeCampaign[] = res.data.map((item: TypeCampaign) => {
        return {
          ...item,
          key: item.name
        }
      })
      setCampaigns(dataCampaigns);
    }else{
      setCampaigns([]);
    }
  }

  const onChangeFilterCampaign = (event) => {
    setSearchCampaign(event.target.value);
  }

  const handleEditCampaign = (item) => {
    navigate(`/campaign-edit/${item.name}`);
  }

  const handleDeleteCampaign = (item) => {
    setItemCampaignDelete(item);
    setIsModalOpenDeleteCampaign(true);
  }

  const handleDeleteOkCampaign = async () => {
    let urlDelete = `/api/resource/VGM_Campaign/${itemCampaignDelete.name}`;
    let res = await AxiosService.delete(urlDelete);
    if(res != null && res.message != null && res.message == "ok"){
      message.success("Xóa thành công");
      initDataCampaigns();
      setItemCampaignDelete({});
      handleDeleteCancelCampaign();
    }else{
      message.error("Xóa thất bại");
    }
  }

  const handleDeleteCancelCampaign = () => {
    setIsModalOpenDeleteCampaign(false);
  }

  const handleDeleteListCampaign = () => {
    setIsModalOpenDeleteListCampaign(true);
  }

  const handleOkDeleteListCampaign = async () => {
    let urlDeleteByList = "/api/method/vgm_audit.api.api.deleteListByDoctype";
    let arrIdDelete = [];
    for(let i = 0; i < campaignsSelected.length; i++) arrIdDelete.push(campaignsSelected[i].name);
    let dataDeletePost = {
      'doctype': "VGM_Campaign",
      'items': JSON.stringify(arrIdDelete)
    }
    let res = await AxiosService.post(urlDeleteByList, dataDeletePost);
    if(res != null && res.message != null && res.message.status == "success"){
      message.success("Xóa thành công");
      setCampaignsSelected([]);
      setShowDeleteListCampaign(false);
      initDataCampaigns();
      handleCancelDeleteListcampaign();
    }else{
      message.error("Xóa thất bại");
    }
  }

  const handleCancelDeleteListcampaign = () => {
    setIsModalOpenDeleteListCampaign(false);
  }

  return (
    <>
      <HeaderPage
        title="Chiến dịch"
        buttons={[
          showDeleteListCampaign && {
            label: "Xóa",
            type: "primary",
            icon: <DeleteOutlined />,
            size: "20px",
            className: "flex items-center mr-2",
            danger: true,
            action: handleDeleteListCampaign
          },
          {
            label: "Nhập file",
            icon: <LuUploadCloud className="text-xl" />,
            size: "20px",
            className: "flex items-center mr-2",
          },
          {
            label: "Thêm mới",
            type: "primary",
            icon: <VscAdd className="text-xl" />,
            size: "20px",
            className: "flex items-center",
            action: () => navigate('/campaign-create')
          },
        ]}
      />
      <div className="bg-white rounded-xl pt-4">
        <FormItemCustom className="w-[320px] border-none p-4">
          <Input value={searchCampaign} onChange={onChangeFilterCampaign} 
            placeholder="Tìm kiếm chiến dịch" prefix={<SearchOutlined />} />
        </FormItemCustom>
        <div className="p-4">
          <TableCustom
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            columns={columnCampaigns}
            dataSource={campaigns}
          />
        </div>
      </div>

      <Modal
        title={`Xóa ${itemCampaignDelete.campaign_name}?`}
        open={isModalOpenDeleteCampaign}
        onOk={handleDeleteOkCampaign}
        onCancel={handleDeleteCancelCampaign}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <div>Bạn có chắc muốn xóa {itemCampaignDelete.campaign_name} ra khỏi hệ thống không?</div>
        <div>Khi thực hiện hành động này, sẽ không thể hoàn tác.</div>
      </Modal>
      
      <Modal
        title={`Xóa ${campaignsSelected.length} chiến dịch?`}
        open={isModalOpenDeleteListCampaign}
        onOk={handleOkDeleteListCampaign}
        onCancel={handleCancelDeleteListcampaign}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <div>Bạn có chắc muốn xóa {campaignsSelected.length} chiến dịch ra khỏi hệ thống không?</div>
        <div>Khi thực hiện hành động này, sẽ không thể hoàn tác.</div>
      </Modal>
        
    </>
  );
}
