import {
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FormItemCustom, TableCustom } from "../../components";
import { Button, Input, Modal, TableProps } from "antd";
import { useState } from "react";
interface DataType {
  key: string;
  name: string;
  age: string;
  address: string;
  tags: string;
  tara: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Tên khách hàng",
    dataIndex: "name",
    key: "name",
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: "Trạng thái",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Nhóm khách hàng",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Địa chỉ",
    key: "tags",
    dataIndex: "tags",
  },
  {
    title: "ID",
    key: "tara",
    dataIndex: "tara",
  },
  {
    title: "",
    key: "action",
    render: (_, record) => (
      <a>
        <DeleteOutlined />
      </a>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: "32",
    address: "New York No. 1 Lake Park",
    tags: "nike",
    tara: "12353"
  },
  {
    key: "2",
    name: "Jim Green",
    age: "42",
    address: "London No. 1 Lake Park",
    tags: "loser",
    tara: "12353"
  },
  {
    key: "3",
    name: "Joe Black",
    age: "32",
    address: "Sydney No. 1 Lake Park",
    tags: "cool",
    tara: "12353"
  },
];
export default function Customer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

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
        <div className="pt-6 ml-4">
          <TableCustom columns={columns} dataSource={data} />;
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
              <Input
                placeholder="Tìm kiếm sản phẩm"
                prefix={<SearchOutlined />}
              />
            </FormItemCustom>
            <div>
              <span style={{ marginRight: 8 }}>
                {hasSelected
                  ? `Đã chọn ${selectedRowKeys.length} khách hàng`
                  : ""}
              </span>
              <Button type="primary">Thêm</Button>
            </div>
          </div>
          <div className="pt-4">
            <TableCustom
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
            />
          </div>
        </Modal>
      </div>
    </>
  );
}
