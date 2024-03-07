import {
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import {
  Table,
  TableColumnsType,
} from "antd";
import { TableCustom } from "../../components";
import { useState } from "react"; 

interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
}


export default function Product(props) {

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
    { title: "Chấm điểm trưng bày", dataIndex: "scoring_machine", render: (scoring_machine: number) => (
      <>
        {scoring_machine === 1 && <span style={{ display: 'flex' }}><CheckCircleOutlined style={{fontSize: '17px', color: 'green', paddingRight: '3px'}} /> <span style={{color: 'green', verticalAlign: 'middle'}}>Đạt</span></span>}
        {scoring_machine === 0 && <span style={{ display: 'flex' }}><CloseCircleOutlined style={{fontSize: '17px', color: 'red', paddingRight: '3px'}} /> <span style={{color: 'red', verticalAlign: 'middle'}}>Không đạt</span></span>}
      </>
    ) }
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
      stt: `${(detailIndex + 1).toString().padStart(2, '0')}`,
      name_product: detailItem.product_name,
      sum_product: detailItem.sum_product.toString(),
      image: detailItem.images,
      creation: detailItem.creation,
      scoring_machine: detailItem.scoring_machine
      // Các trường dữ liệu khác của chi tiết
  }));
});
  return (
   
      < >
        <TableCustom
          columns={mainColumns}
          expandable={{
            expandedRowRender: (record, index) => (
              <div style={{ margin: 5 }}>
                <Table
                    columns={expandedColumns}
                    dataSource={expandedRowData[index]}
                    pagination={false}
                />
              </div>
            ),
            rowExpandable: (record) => expandedRowData[record.key].length > 0
        }}
          dataSource={mainTableData}
        />
      </>
    
  );
}
