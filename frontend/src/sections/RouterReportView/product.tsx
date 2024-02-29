import {
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Modal,
  Table,
  TableColumnsType,
} from "antd";
import { FormItemCustom, TableCustom } from "../../components";
import { useState } from "react"; 
interface DataType {
  key: React.Key;
  stt?: string;
  product: string;
  quantity: string;
}

interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
}

const items = [
  { key: "1", label: "Action 1" },
  { key: "2", label: "Action 2" },
];

export default function Product(props) {
  console.log(props.recordData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const expandedRowRender = () => {
    const columns: TableColumnsType<ExpandedDataType> = [
      { title: "STT", dataIndex: "stt" },
      { title: "Tên sản phẩm", dataIndex: "name" },
      { title: "Số lượng sản phẩm máy chấm", dataIndex: "quantityAI"},
      { title: "Ảnh trưng bày", dataIndex: "date", }
    ];

    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i.toString(),
        date: "2014-12-24 23:12:00",
        name: "This is production name",
      });
    }
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };
  const sumProductByCategory = {};

  // Tính tổng sum_product cho từng danh mục
  props.recordData?.detail.forEach(detailItem => {
      const categoryCode = detailItem.category;
      const sumProduct = parseInt(detailItem.sum_product);
  
      // Kiểm tra và cập nhật tổng sum_product cho từng danh mục
      sumProductByCategory[categoryCode] = (sumProductByCategory[categoryCode] || 0) + sumProduct;
  });
  
  // Xây dựng dữ liệu cho mainTableData và number_product
  const mainTableData = props.recordData?.category_names.map((category, index) => {
      const categoryCode = Object.keys(category)[0];
      return {
          key: index.toString(),
          stt: (index + 1).toString(),
          categoryName: Object.values(category)[0],
          number_product: sumProductByCategory[categoryCode] || 0 // Sử dụng tổng sum_product của danh mục
      };
  });
  const expandedColumns = [
    { title: "STT", dataIndex: "stt" },
    { title: "Tên sản phẩm", dataIndex: "name_product" },
    { title: "Số lượng sản phẩm máy chấm", dataIndex: "sum_product" },
    // { title: "Ảnh trưng bày", dataIndex: "image",  render: (image) => (
    //   <a >
    //   Xem ảnh
    // </a>
    // ), },
];
// Các cột cho bảng chính
const mainColumns = [
  { title: "STT", dataIndex: "stt" },
  { title: "Danh mục sản phẩm", dataIndex: "categoryName" },
  { title: "Số lượng sản phẩm", dataIndex: "number_product" }
];
// Xây dựng dữ liệu mở rộng cho mỗi danh mục sản phẩm
const expandedRowData = props.recordData?.category_names.map((category, index) => {
  const categoryCode = Object.keys(category)[0];
  const details = props.recordData?.detail.filter(item => item.category === categoryCode);
  return details.map((detailItem, detailIndex) => ({
      key: `${index}-${detailIndex}`,
      stt: `${index+1}`,
      name_product: detailItem.product_name,
      sum_product: detailItem.sum_product.toString(),
      image: detailItem.images,
      creation: detailItem.creation,
      // Các trường dữ liệu khác của chi tiết
  }));
});
  return (
   
      < >
        <TableCustom
          columns={mainColumns}
          expandable={{
            expandedRowRender: (record, index) => (
                <Table
                    columns={expandedColumns}
                    dataSource={expandedRowData[index]}
                    pagination={false}
                />
            ),
            rowExpandable: (record) => expandedRowData[record.key].length > 0
        }}
          // expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
          dataSource={mainTableData}
        />
      </>
    
  );
}
