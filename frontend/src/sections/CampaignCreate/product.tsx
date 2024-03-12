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
  Collapse,
  Checkbox
} from "antd";
import './view.css'; 
import type { CollapseProps } from 'antd';
import { FormItemCustom, TableCustom } from "../../components";
import { useState, useEffect } from "react";
import { AxiosService } from "../../services/server";

import DrapTable from "../common/drap-table";

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

interface TypeCategory{
  stt: number;
  key: React.Key;
  name: string;
  category_name: string;
  product_num: number;
  products: Array<TypeProduct>;
}
interface TypeProduct{
  key: React.Key;
  name: string;
  product_code: string;
  product_name: string;
}

export default function Product({onChangeCategory, onChangeCheckExistProduct, onChangeCheckSequenceProduct, onChangeSequenceProducts}) {
  const [isModalOpenCategory, setIsModalOpenCategory] = useState(false);
  const [isModalOpenProduct , setIsModalOpenProduct] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedProductRowKeys, setSelectedProductRowKeys] = useState<React.Key[]>([]);

  const [categories, setCategories] = useState<TypeCategory[]>([]);
  const [arrProductCategory, setArrProductCategory] = useState([]);
  const [arrPro, setArrPro] = useState([]);
  const [productSort, setProductSort] = useState([]);
  
  
  const [searchCategory, setSearchCategory] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [categoriesSelected, setCategoriesSelected] = useState<TypeCategory[]>([]);
  const [productSelected, setProductSelected] = useState<TypeCategory[]>([]);
  const [checkExistProduct, setCheckExistProduct] = useState(true);
  const [checkSequenceProduct, setCheckSequenceProduct] = useState(false);
  const [sequenceProducts, setSequenceProducts] = useState([]);
  
  const [sequenceValues, setSequenceValues] = useState({});


  useEffect(() => {
    initDataCategories();
  }, []);

  useEffect(() => {
    initDataCategories();
  }, [searchCategory]);

  const initDataCategories = async () => {
    let urlCategory = '/api/resource/VGM_Category?fields=["*"]';
    if(searchCategory != null && searchCategory != ""){
      urlCategory += `&filters=[["category_name", "like", "%${searchCategory}%"]]`;
    }
    const response = await AxiosService.get(urlCategory);
      // Kiểm tra xem kết quả từ API có chứa dữ liệu không
      if (response && response.data) {
        // Thêm key cho mỗi phần tử trong mảng, sử dụng trường 'name'
        let dataCategories: TypeCategory[] = response.data.map((item: TypeCategory) => {
          return {
            ...item,
            key: item.name
          }
        })
        for(let i = 0; i < dataCategories.length; i++){
          let urlProduct = `/api/resource/VGM_Product?fields=["name","product_code","product_name"]&&filters=[["category","=","${dataCategories[i].name}"]]`;
          let res = await AxiosService.get(urlProduct);
        
          if(res != null && res.data != null){
            
            dataCategories[i].product_num = res.data.length;
            let arrProducts: TypeProduct[] = res.data.map((item: TypeProduct) => {
              return {
                ...item,
                key: item.name
              }
            })
            
            
            dataCategories[i].products = arrProducts;
          } 
          else{
            dataCategories[i].product_num = 0;
            dataCategories[i].products = [];
          } 
        }
        setCategories(dataCategories);
      }
  }

  const handleSearchCategory = (event) => {
    setSearchCategory(event.target.value);
  }
  const handleSearchProduct = (event) => {
    const searchValue = event.target.value.toLowerCase(); // Lấy giá trị tìm kiếm và chuyển đổi thành chữ thường
    setSearchProduct(searchValue);
    // Tạo một mảng tạm thời để lưu trữ danh sách sản phẩm ban đầu
    const tempProducts = [...arrPro];
    // Nếu ô tìm kiếm rỗng, hiển thị lại tất cả sản phẩm từ mảng tạm thời
    if (searchValue === '') {
        setArrProductCategory(arrPro);
        return;
    }else{
        // Lọc danh sách sản phẩm hiển thị dựa trên giá trị tìm kiếm
      const filteredProducts = tempProducts.filter(product => {
        // Kiểm tra xem tên sản phẩm có chứa giá trị tìm kiếm không
        return product.product_name.toLowerCase().includes(searchValue);
      });

      // Cập nhật danh sách sản phẩm hiển thị sau khi lọc
      setArrProductCategory(filteredProducts);
    }
  }

  const onSelectChangeCategory = (newSelectedRowKeys: React.Key[], selectedRow: TypeCategory[]) => {
    console.log(newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    
  };
  const onSelectChangeProduct = (newSelectedRowKeys: React.Key[], selectedRow: TypeCategory[]) => {
    // Thêm trường sequence_product vào mỗi phần tử trong mảng dữ liệu
    const newData = arrPro.map((item, index) => {
      const sequenceIndex = newSelectedRowKeys.indexOf(item.name);
      const sequenceProduct = sequenceIndex !== -1 ? sequenceIndex + 1 : null;
      return { ...item, sequence_product: sequenceProduct };
    });
    setArrProductCategory(newData)
    setSelectedProductRowKeys(newSelectedRowKeys);
  };
//   const onSelectAllCategory = (selected: boolean, selectedRows: TypeCategory[], changeRows: TypeCategory[]) => {
//     const keys = selected ? categories.map(row => row.key) : [];
//     console.log(keys);
//     setSelectedRowKeys(keys);
// };
  const rowSelectionCategory = {
    selectedRowKeys,
  //  onSelectAll: onSelectAllCategory,
    onChange: onSelectChangeCategory,
    
  };
  const rowSelectionProduct = {
    selectedProductRowKeys,
  //  onSelectAll: onSelectAllCategory,
    onChange: onSelectChangeProduct,
    
  };

  const handleSelectCategory = () => {
    let arrCategorySelect: TypeCategory[] = [];
    let allProducts = [];
    for (let i = 0; i < selectedRowKeys.length; i++) {
      let item = categories.filter(x => x.name === selectedRowKeys[i]);
      if (item != null && item.length > 0) {
          item[0].stt = arrCategorySelect.length + 1;
          // Tạo một bản sao của đối tượng category
          let categoryCopy = { ...item[0] };

          // Thêm trường "name" của category vào mỗi phần tử trong mảng "products"
          categoryCopy.products = categoryCopy.products.map(product => {
              return { ...product, cate_name: categoryCopy.category_name  , product_num : "1"};
          });
          allProducts = allProducts.concat(categoryCopy.products);
          arrCategorySelect.push(categoryCopy);
      }
  }
    setProductSelected(allProducts)
    setCategoriesSelected(arrCategorySelect);
    onChangeCategory(arrCategorySelect);
    handleCancelAddCategory();
  }
  const handleSelectProduct = () => {
    const result = arrProductCategory.filter(item => selectedProductRowKeys.includes(item.name));
    console.log(result);
    let arrSequenceProduct = result.map(x => x.name);
    onChangeSequenceProducts(arrSequenceProduct);
    setProductSort(result);
    console.log(arrProductCategory);
    handleCancelProduct();
  }

  const hasSelected = selectedRowKeys.length > 0;
  const hasSelectedProduct = selectedProductRowKeys.length > 0;
  const showModalCategory = () => {
    setIsModalOpenCategory(true);
  };
  const showModalProduct= () => {
    setIsModalOpenProduct(true);
   // Tạo mảng chứa tất cả sản phẩm
const allProducts = [];
// Duyệt qua mỗi danh mục
categoriesSelected.forEach(category => {
    // Thêm sản phẩm của từng danh mục vào mảng allProducts
    allProducts.push(...category.products.map(product => ({ ...product, cate_name: category.category_name })));
});
  setArrProductCategory(allProducts); // In ra mảng chứa tất cả sản phẩm của từng danh mục
  setArrPro(allProducts)
  };

  const handleOkAddCategory = () => {
    setIsModalOpenCategory(false);
  };

  const handleCancelAddCategory = () => {
    setIsModalOpenCategory(false);
  };
  const handleCancelProduct = () => {
    setIsModalOpenProduct(false);
  };

  const handleDeleteCategory = (item) => {
    const updatedCategoriesSelected = categoriesSelected.filter(category => category.name !== item.name);
    const updatedProductSelected = productSelected.filter(product => product.cate_name !== item.category_name);
    setProductSelected(updatedProductSelected)
    setCategoriesSelected(updatedCategoriesSelected);
    onChangeCategory(updatedCategoriesSelected);
  }

  const handleChangeCheckExist = (e) => {
    setCheckExistProduct(e.target.checked);
    onChangeCheckExistProduct(e.target.checked);
  }

  const handleChangeCheckSequence = (e) => {
    setCheckSequenceProduct(e.target.checked);
    onChangeCheckSequenceProduct(e.target.checked);
  }

  const expandedRowRender = (record, index) => {
    const columnProducts: TableColumnsType<ExpandedDataType> = [
      { title: "Mã sản phẩm", dataIndex: "product_code", key: "product_code" },
      { title: "Tên sản phẩm", dataIndex: "product_name", key: "product_name" },
    ];
    return <><div style={{ margin: 5 }}><Table columns={columnProducts} dataSource={record.products} pagination={false} /></div></>;
  };

  const columnCategories: TableColumnsType<DataType> = [
    { title: "STT", dataIndex: "stt", key: "stt" },
    { title: "Danh mục sản phẩm", dataIndex: "category_name", key: "category_name" },
    { title: "Số lượng sản phẩm", dataIndex: "product_num", key: "product_num" },
    {
      title: "",
      key: "",
      render: (item) => (
        <a>
          <DeleteOutlined onClick={() => handleDeleteCategory(item)}/>
        </a>
      ),
    },
  ];
  const columnProduct: TableColumnsType<DataType> = [
    { title: "Mã sản phẩm", dataIndex: "product_code",  },
    { title: "Tên sản phẩm", dataIndex: "product_name", },
    { title: "Danh mục", dataIndex: "cate_name",  },
    { 
      title: "Số lượng ít nhất", 
      dataIndex: "product_num", 
      render: (item: number, rowData: DataType, index: number) => ( // Thêm index vào render function
          <Input style={{width : '120px'}}
              defaultValue={item}  
              onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))} // Sử dụng index trong handleQuantityChange
          />
      )
  },
 
   
  ];
  const columnProductSort: TableColumnsType<DataType> = [
    { key: 'sort' },
    { title: "STT", dataIndex: "sequence_product",  },
    { title: "Mã sản phẩm", dataIndex: "product_code", },
    { title: "Tên sản phẩm", dataIndex: "product_name",  },
    { 
      title: "Danh mục", 
      dataIndex: "cate_name",
  },
]

  const handleQuantityChange = (index: number, newValue: number) => {
    // Tạo một bản sao của dữ liệu hàng
    const updatedRowData = [...productSelected];
    // Cập nhật giá trị "Số lượng ít nhất" của hàng với chỉ số index
    updatedRowData[index].product_num = newValue;
    // Cập nhật trạng thái của bảng
    setProductSelected(updatedRowData);
    onChangeCategory(categoriesSelected)
};
const handleQuantityChangeProduct = (index: number, newValue: number) => {
  console.log(index,newValue);
};
const handleDragRowEvent = (data: any) => {
  let arrSequenceProduct = data.map(x => x.name);
  setSequenceProducts(arrSequenceProduct);
  onChangeSequenceProducts(arrSequenceProduct);
}
const itemsChildren: CollapseProps['itemsChildren'] = [
  {
    key: '1',
    label: <Checkbox checked={checkExistProduct} onChange={handleChangeCheckExist}> <span style={{ fontWeight: 700, fontSize: '15px' }}> 1. Tiêu chí tồn tại sản phẩm</span> </Checkbox> ,
    children:  <div>
    <TableCustom
      columns={columnProduct}
      dataSource={productSelected}
    />
  </div>,
  },
  {
    key: '2',
    label: <Checkbox checked={checkSequenceProduct} onChange={handleChangeCheckSequence}> <span style={{ fontWeight: 700, fontSize: '15px' }}> 2. Tiêu chí sắp xếp sản phẩm</span> </Checkbox> ,
    children:  <div>
        <div
        onClick={showModalProduct}
        className="flex justify-center h-9 cursor-pointer items-center ml-4 mt-4 mb-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px] "
      >
        <p className="mr-2">
          <PlusOutlined />
        </p>
        <p className="text-sm font-bold text-[#1877F2]">Chọn sản phẩm</p>
      </div>
      <div className="ml-4 mb-4 mr-4 mt-4" style={{ fontSize: '17px', fontStyle: 'italic', fontWeight: 400, lineHeight: '21px', letterSpacing: '0em', textAlign: 'left',color:"rgba(99, 115, 129, 1)" }}>
    <span>
        Di chuyển (kéo, thả) các sản phẩm để sắp xếp thứ tự sản phẩm
    </span>
</div>
    <DrapTable columnsTable={columnProductSort} datasTable={productSort} keyPros={"sequence_product"} onDragRowEvent={handleDragRowEvent}></DrapTable>
  </div>
  }
]
  const itemscoll: CollapseProps['itemscoll'] = [
    {
      key: '1',
      label:  <span style={{ fontWeight: 700, fontSize: '15px' }}>  Thiết lập tiêu chí chấm điểm trưng bày sản phẩm</span> ,
      children:  
         <Collapse items={itemsChildren} defaultActiveKey={['1','2']}  className="custom-collapse-audit"/>
    },
    
    
  ];
 
  const onChange = (key: string | string[]) => {
  };
  return (
    <div className="pt-4">
      <p className="ml-4 font-semibold text-sm text-[#212B36]">Danh sách sản phẩm</p>
      <div
        onClick={showModalCategory}
        className="flex justify-center h-9 cursor-pointer items-center ml-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px]"
      >
        <p className="mr-2">
          <PlusOutlined />
        </p>
        <p className="text-sm font-bold text-[#1877F2]">Chọn danh mục</p>
      </div>
      <div className="pt-6 ml-4">
        <TableCustom
          columns={columnCategories}
          expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
          dataSource={categoriesSelected}
        />
         <Collapse items={itemscoll} defaultActiveKey={['1','2']} onChange={onChange} className="custom-collapse-parent"/>
      </div>

      <Modal
        width={990}
        title="Chọn danh mục sản phẩm"
        open={isModalOpenCategory}
        onOk={handleOkAddCategory}
        onCancel={handleCancelAddCategory}
        footer={false}
      >
        <div className="flex items-center justify-between">
          <FormItemCustom className="w-[320px] border-none pt-4">
            <Input value={searchCategory} onChange={handleSearchCategory}
              placeholder="Tìm kiếm danh mục sản phẩm"
              prefix={<SearchOutlined />}
            />
          </FormItemCustom>
          <div>
            <span style={{ marginRight: 8 }}>
              {hasSelected ? `Đã chọn ${selectedRowKeys.length} danh mục` : ""}
            </span>
            <Button type="primary" onClick={handleSelectCategory}>Thêm</Button>
          </div>
        </div>
        <div className="pt-4">
          <TableCustom rowSelection={rowSelectionCategory} columns={[
              { title: "Danh mục sản phẩm", dataIndex: "category_name", key: "category_name" },
              { title: "Số lượng sản phẩm", dataIndex: "product_num", key: "product_num" },
            ]} dataSource={categories} />
        </div>
      </Modal>

      <Modal
        width={990}
        title="Sắp xếp sản phẩm"
        open={isModalOpenProduct}
        onCancel={handleCancelProduct}
        footer={false}
      >
        <div className="flex items-center justify-between">
          <FormItemCustom className="w-[320px] border-none pt-4">
            <Input value={searchProduct} onChange={handleSearchProduct}
              placeholder="Tìm kiếm sản phẩm"
              prefix={<SearchOutlined />}
            />
          </FormItemCustom>
          <div>
            <span style={{ marginRight: 8 }}>
              {hasSelectedProduct ? `Đã chọn ${selectedProductRowKeys.length} sản phẩm` : ""}
            </span>
            <Button type="primary" onClick={handleSelectProduct}>Thêm</Button>
          </div>
        </div>
        <div className="pt-4">
          <TableCustom rowSelection={rowSelectionProduct} columns={[
              { title: "Mã sản phẩm", dataIndex: "product_code", key: "product_code" },
              { title: "Tên sản phẩm", dataIndex: "product_name", key: "product_name" }, { title: "Danh mục", dataIndex: "cate_name", key: "cate_name" },
              { title: "Chọn thứ tự", dataIndex: "sequence_product", dataIndex: "sequence_product", 
              render: (item: number, rowData: DataType, index: number) => ( // Thêm index vào render function
                <Input style={{width : '120px'}}
                    defaultValue={item} 
                    value={item} 
                    onChange={(e) => handleQuantityChangeProduct(index, parseInt(e.target.value))} // Sử dụng index trong handleQuantityChange
                />
              ) }
            ]} dataSource={arrProductCategory} />
        </div>
      </Modal>
    </div>
  );
}
