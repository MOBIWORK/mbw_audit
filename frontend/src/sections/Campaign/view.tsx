import { LuUploadCloud } from "react-icons/lu";
import { FormItemCustom, HeaderPage, TableCustom } from "../../components";
import { VscAdd } from "react-icons/vsc";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { Input, Space, Table, TableColumnsType, Tag, Modal, message, Button, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AxiosService } from "../../services/server";
import moment from 'moment';
import "./campaign.css";
import paths from "../AppConst/path.js";
import * as XLSX from "xlsx";
import { UploadFile } from "antd/lib";

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

const apiUrl = paths.apiUrl;
export default function Campaign() {
  const navigate = useNavigate();
  const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
    "checkbox"
  );
  const columnCampaigns: TableColumnsType<TypeCampaign> = [
    {
      title: "Tên chiến dịch",
      dataIndex: "campaign_name",
      render: (_, record) => (
        <a href="javascript:;" onClick={() => handleEditCampaign(record)}>{record.campaign_name}</a>
      )
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
  const [fileListImport, setFileListImport] = useState<UploadFile[]>([])
  const propUploadImportFileExcel: UploadProps = {
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    multiple: false,
    beforeUpload: async (file) => {
        try {
          const fileName = file.name.toLowerCase();
          if (fileName.endsWith('.xls') || 
          fileName.endsWith('.xlsx') || 
          fileName.endsWith('.xlsm') || 
          fileName.endsWith('.xlsb') || 
          fileName.endsWith('.csv') || 
          fileName.endsWith('.ods')) {
                      // Xử lý khi là file Excel
                      let obj = [{
                        uid: '-1',
                        name: file.name,
                        status: 'done',
                        url: ''
                    }];
                    setFileListImport(obj);
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const bufferArray = event.target.result;
                        const wb = XLSX.read(bufferArray, { type: "buffer" });
                        const wsname = wb.SheetNames[0];
                        const ws = wb.Sheets[wsname];
                        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                        let dataImport = [];
                        if (data.length >= 2) {
                            for (let i = 1; i < data.length; i++) {
                                const EXCEL_EPOCH = new Date(1899, 11, 31);
                                const date_startMilliseconds = (data[i][2] - 1) * 24 * 60 * 60 * 1000;
                                let startDate = new Date(EXCEL_EPOCH.getTime() + date_startMilliseconds);
        
                                const date_endMilliseconds = (data[i][2] - 1) * 24 * 60 * 60 * 1000;
                                let endDate = new Date(EXCEL_EPOCH.getTime() + date_endMilliseconds);
        
                                let objDataImport = {
                                    'campaign_name': data[i][0],
                                    'campaign_description': data[i][1],
                                    'campaign_start': (startDate.getTime() / 1000).toString(),
                                    'campaign_end': (endDate.getTime() / 1000).toString(),
                                    'campaign_status': data[i][4] != "" ? data[i][4] : "Open",
                                    'campaign_categories': data[i][5],
                                    'campaign_employees': data[i][6],
                                    'campaign_customers': data[i][7]
                                }
                                dataImport.push(objDataImport);
                            }
                        }
                        setLstCampaignImport(dataImport);
                    };
                    reader.readAsArrayBuffer(file);

          } else{
             // Xử lý khi không phải là file Excel
             message.error("Đã xảy ra lỗi, không đúng định dạng file: xls, xlsx, xlsm, xlsb, csv, ods");
             return false; // Trả về false để ngăn việc tự động tải file
          }

        } catch (error) {
          message.error("File không chính xác, tải dữ liệu mẫu để tiếp tục");
            // Thực hiện xử lý lỗi ở đây
        }
        return false;
    }
}


  const [campaigns, setCampaigns] = useState<TypeCampaign[]>([]);
  const [searchCampaign, setSearchCampaign] = useState("");
  const [itemCampaignDelete, setItemCampaignDelete] = useState({});
  const [isModalOpenDeleteCampaign, setIsModalOpenDeleteCampaign] = useState(false);
  const [campaignsSelected, setCampaignsSelected] = useState<TypeCampaign[]>([]);
  const [showDeleteListCampaign, setShowDeleteListCampaign] = useState(false);
  const [isModalOpenDeleteListCampaign, setIsModalOpenDeleteListCampaign] = useState(false);
  const [isModalOpenImportFileExcel, setIsModalOpenImportFileExcel] = useState(false);
  const [lstCampaignImport, setLstCampaignImport] = useState([]);

  const [fileListExport , setFileListExport] = useState<any[]>([]);
  
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
    // let urlDelete = `/api/resource/VGM_Campaign/${itemCampaignDelete.name}`;
    // let res = await AxiosService.delete(urlDelete);
    // if(res != null && res.message != null && res.message == "ok"){
    //   message.success("Xóa thành công");
    //   initDataCampaigns();
    //   setItemCampaignDelete({});
    //   handleDeleteCancelCampaign();
    // }else{
    //   message.error("Xóa thất bại");
    // }
    let urlDeleteByList = apiUrl + ".api.deleteListByDoctype";
    let arrIdDelete = [itemCampaignDelete.name];
    for(let i = 0; i < campaignsSelected.length; i++) arrIdDelete.push(campaignsSelected[i].name);
    let dataDeletePost = {
      'doctype': "VGM_Campaign",
      'items': JSON.stringify(arrIdDelete)
    }
    let res = await AxiosService.post(urlDeleteByList, dataDeletePost);
    if(res != null && res.message != null && res.message.status == "success"){
      message.success("Xóa thành công");
      initDataCampaigns();
      setItemCampaignDelete({});
      handleDeleteCancelCampaign();
    }else{
      message.error("Xóa thất bại, Chiến dịch đã tồn tại ở báo cáo");
    }
  }

  const handleDeleteCancelCampaign = () => {
    setIsModalOpenDeleteCampaign(false);
  }

  const handleDeleteListCampaign = () => {
    setIsModalOpenDeleteListCampaign(true);
  }

  const handleOkDeleteListCampaign = async () => {
    let urlDeleteByList = apiUrl + ".api.deleteListByDoctype";
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

  const handleImportFileCampaign = () => {
    setIsModalOpenImportFileExcel(true);
    setFileListImport([])
  }

  const handleOkImportExcel = async() => {
    let url_import_campaign = apiUrl + ".api.import_campaign";
    let dataPost ={
      "listcampaign" :JSON.stringify(lstCampaignImport)
    }
    let res = await AxiosService.post(url_import_campaign, dataPost);
    if(res.message.status == "success"){
      message.success("Thên chiến dịch thành công");
      setIsModalOpenImportFileExcel(false)
      initDataCampaigns();
    }else{
      message.error("Thêm chiến dịch thất bại");
    }
    
   
  }

  const handleCancelImportExcel = () => {
    setIsModalOpenImportFileExcel(false);
    setFileListImport([])
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
            action: handleImportFileCampaign
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
      <div className="bg-white rounded-xl pt-4 border-[#DFE3E8] border-[0.2px] border-solid">
        <FormItemCustom className="w-[320px] border-none p-4">
          <Input value={searchCampaign} onChange={onChangeFilterCampaign} 
            placeholder="Tìm kiếm chiến dịch" prefix={<SearchOutlined />} />
        </FormItemCustom>
        <div>
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
      
      <Modal
        title="Nhập dữ liệu từ tệp excel"
        open={isModalOpenImportFileExcel}
        width={777}
        onOk={handleOkImportExcel}
        onCancel={handleCancelImportExcel}
        footer={[
          <Button key="back" onClick={handleCancelImportExcel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOkImportExcel}>
            Lưu lại
          </Button>,
        ]}
      >
        <p className="text-[#637381] font-normal text-sm">
          Chọn file excel có định dạng .xlsx để thực hiện nhập dữ liệu. Tải dữ liệu mẫu <a target="_blank" href="/mbw_audit/data_sample/campaign_sample.xlsx">tại đây</a>
        </p>
        <Dragger {...propUploadImportFileExcel}  fileList={fileListImport}>
          <p className="ant-upload-drag-icon">
            <PlusOutlined />
          </p>
          <p className="ant-upload-text">Kéo, thả hoặc chọn tệp để tải lên</p>
        </Dragger>
      </Modal>
    </>
  );
}
