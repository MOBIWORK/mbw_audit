import {
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import {
  Table,
  Input,
  Select,
  message
} from "antd";
import { TableCustom } from "../../components";
import { useEffect, useState } from "react"; 

interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
}


export default function Product(props) {

  const sumProductByCategory = {};
  const [sourceReportSKUs, setSourceReportSKUs] = useState<any[]>([]);
  const [scoringSource, setScoringSource] = useState<any[]>([{'label': "Đạt", 'value': 1}, {'label': "Không đạt", 'value': 0}]);
  // Tính tổng sum_product cho từng danh mục
  props.recordData?.detail_skus.forEach(detailItem => {
      const categoryCode = detailItem.category;
      const sumProduct = 1;
      // Kiểm tra và cập nhật tổng sum_product cho từng danh mục
      sumProductByCategory[categoryCode] = (sumProductByCategory[categoryCode] || 0) + sumProduct;
  });
  
  const handleChangeProductHuman = (index, val, rowData) => {
    setSourceReportSKUs(prev => {
      let filterReport = sourceReportSKUs.filter(x => x.report_sku_id == rowData.name);
      if(filterReport != null && filterReport.length > 0){
        let indexReport = sourceReportSKUs.findIndex(x => x.report_sku_id == rowData.name);
        sourceReportSKUs[indexReport].sum_product_human = val;
      }else{
        sourceReportSKUs.push({
          'report_sku_id': rowData.name,
          'sum_product_human': val,
          'scoring_human': rowData.scoring_human
        })
      }
      props.onChangeValReportSKU(sourceReportSKUs);
      return sourceReportSKUs;
    })
  }

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
  const [editingIndex, setEditingIndex] = useState(null);

  const expandedColumns = [
    { title: "STT", dataIndex: "stt" },
    { title: "Tên sản phẩm", dataIndex: "name_product" },
    { title: "Số lượng sản phẩm AI đếm", dataIndex: "sum_product" },
    {
      title: "Số lượng sản phẩm giám sát đếm",
      dataIndex: "sum_product_human",
      render: (
        item: number,
        rowData: DataType,
        index: number // Thêm index vào render function
      ) => (
        <Input
          style={{ width: "120px" }}
          // value={editingIndex !== null ? undefined : item}
          defaultValue={item}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            if (!isNaN(newValue)) {
              handleChangeProductHuman(index, newValue, rowData)
            } else {
              message.warning("Nhập số lượng");
              handleChangeProductHuman(index, 0, rowData)
            }
          }}
          // onFocus={() => setEditingIndex(index)}
          // onBlur={() => setEditingIndex(null)}
        />
      ),
    },
    { title: "Điểm trưng bày AI chấm", dataIndex: "scoring_machine", render: (scoring_machine: number) => (
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
const [expandedRowData, setExpandedRowData] = useState([]);

useEffect(() => {
  if (props.recordData) {
    const newData = props.recordData.category_names.map((category, index) => {
      const categoryCode = Object.keys(category)[0];
      const details = props.recordData.detail_skus.filter(item => item.category === categoryCode);
      return details.map((detailItem, detailIndex) => ({
        key: `${index}-${detailIndex}`,
        stt: `${(detailIndex + 1).toString().padStart(2, '0')}`,
        name_product: detailItem.product_name,
        sum_product: detailItem.sum_product.toString(),
        image: detailItem.images,
        creation: detailItem.creation,
        scoring_machine: detailItem.scoring_machine,
        scoring_human: detailItem.scoring_human,
        sum_product_human: detailItem.sum_product_human,
        name: detailItem.name,
        index_category: index
      }));
    });
    setExpandedRowData(newData);
  }

}, [props.recordData]);

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
            rowExpandable: (record) => expandedRowData[record.key] && expandedRowData[record.key].length > 0
          }}
          dataSource={mainTableData}
        />
      </>
    
  );
}
