import {
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FormItemCustom, TableCustom } from "../../components";
import { Button, Input, Modal, TableProps } from "antd";
import { useEffect, useState } from "react";
import { AxiosService } from "../../services/server";
import paths from "../AppConst/path.js";
interface TypeCustomer {
  key: React.Key;
  name: string;
  customer_name: string;
  customer_group: string;
  customer_primary_address: string;
  customer_code: string;
  primary_address: string;
}



export default function Customer({onChangeCustomer}) {
  const apiUrl = paths.apiUrl;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [customers, setCustomers] = useState<TypeCustomer[]>([]);
  const [customersTemp, setCustomersTemp] = useState<TypeCustomer[]>([]);
  const [customersSelected, setCustomersSelected] = useState<TypeCustomer[]>([]);
  const [searchCustomer, setSearchCustomer] = useState("");

  const columns: TableProps<TypeCustomer>["columns"] = [
    {
      title: "ID",
      dataIndex: "customer_code",
      key: "customer_code"
    },{
      title: "Tên khách hàng",
      key: "customer_name",
      dataIndex: "customer_name",
    },{
      title: "Nhóm khách hàng",
      dataIndex: "customer_group",
      key: "customer_group",
    },{
      title: "Địa chỉ",
      key: "customer_primary_address",
      dataIndex: "customer_primary_address",
    },{
      title: "",
      key: "action",
      render: (_, record) => (
        <a>
          <DeleteOutlined onClick={() => handleDeleteCustomer(record)}/>
        </a>
      ),
    },
  ];

  useEffect(() => {
    initDataCustomer();
  }, []);

  useEffect(() => {
    let customerFilter = customersTemp;
    if(searchCustomer != null && searchCustomer != ""){
      customerFilter = customersTemp.filter(x => x.customer_name.toLowerCase().includes(searchCustomer.toLowerCase()));
    }
    setCustomers(customerFilter);
  }, [searchCustomer]);

  const initDataCustomer = async () => {
    let urlCustomer = apiUrl + ".api.get_list_customers";
    let res = await AxiosService.get(urlCustomer);
    let arrCustomerSource = [];
    if(res != null && res.message == "ok"){
      arrCustomerSource = res.result.data.map((item: TypeCustomer) => {
        return {
          ...item,
          key: item.name
        }
      });
    }
    setCustomers(arrCustomerSource);
    setCustomersTemp(arrCustomerSource);
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChangeSearchCustomer = (event) => {
    setSearchCustomer(event.target.value);
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys((prev) => [...prev, ...newSelectedRowKeys]);
  };

  const handleAddCustomer = () => {
    const arrCustomer = [...customersSelected]; // create a new array reference
    for (let i = 0; i < selectedRowKeys.length; i++) {
      const existCustomer = arrCustomer.filter(x => x.name === selectedRowKeys[i]);
      if (existCustomer.length === 0) {
        const customerFilter = customersTemp.filter(x => x.name === selectedRowKeys[i]);
        if (customerFilter != null && customerFilter.length > 0) arrCustomer.push(customerFilter[0]);
      }
    }
    setCustomersSelected(arrCustomer);
    onChangeCustomer(arrCustomer);
    handleCancel();
    setSelectedRowKeys([])
  }

  const handleDeleteCustomer = (item) => {
    const updatedCustomerSelected = customersSelected.filter(customer => customer.name !== item.name);
    setCustomersSelected(updatedCustomerSelected);
    onChangeCustomer(updatedCustomerSelected);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <>
      <div className="pt-4">
        <p className="ml-4 font-semibold text-sm text-[#212B36]">
          Danh sách khách hàng
        </p>
        <div
          onClick={showModal}
          className="flex justify-center h-9 cursor-pointer items-center ml-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px]"
        >
          <p className="mr-2">
            <PlusOutlined />
          </p>
          <p className="text-sm font-bold text-[#1877F2]">Chọn khách hàng</p>
        </div>
        <div className="pt-6 mx-4">
          <TableCustom columns={columns} dataSource={customersSelected} />
        </div>
        <Modal
          width={990}
          title="Chọn khách hàng"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={false}
        >
          <div className="flex items-center justify-between">
            <FormItemCustom className="w-[320px] border-none pt-4">
              <Input value={searchCustomer} onChange={onChangeSearchCustomer}
                placeholder="Tìm kiếm tên khách hàng"
                prefix={<SearchOutlined />}
              />
            </FormItemCustom>
            <div>
              <span style={{ marginRight: 8 }}>
                {hasSelected
                  ? `Đã chọn ${selectedRowKeys.length} khách hàng`
                  : ""}
              </span>
              <Button type="primary" onClick={handleAddCustomer}>Thêm</Button>
            </div>
          </div>
          <div className="pt-4">
            <TableCustom
              rowSelection={rowSelection}
              columns={[{
                title: "ID",
                dataIndex: "customer_code",
                key: "customer_code"
              },{
                title: "Tên khách hàng",
                key: "customer_name",
                dataIndex: "customer_name",
              },{
                title: "Nhóm khách hàng",
                dataIndex: "customer_group",
                key: "customer_group",
              },{
                title: "Địa chỉ",
                key: "customer_primary_address",
                dataIndex: "customer_primary_address",
              }]}
              dataSource={customers}
            />
          </div>
        </Modal>
      </div>
    </>
  );
}
