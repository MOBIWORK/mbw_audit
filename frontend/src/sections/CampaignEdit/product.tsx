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
  Checkbox,
  message
} from "antd";
import "./view.css";
import type { CollapseProps } from "antd";
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

interface TypeCategory {
  stt: number;
  key: React.Key;
  name: string;
  category_name: string;
  product_num: number;
  products: Array<TypeProduct>;
}
interface TypeProduct {
  key: React.Key;
  name: string;
  product_code: string;
  product_name: string;
}

export default function ProductCampaignEdit({
  onChangeCategory,
  categoryEdit,
  productEdit,
  objSettingSequenceProduct,
  onChangeCheckExistProduct,
  onChangeCheckSequenceProduct,
  onChangeSequenceProducts,
}) {
  const [productSelected, setProductSelected] = useState<TypeCategory[]>([]);
  const [isModalOpenCategory, setIsModalOpenCategory] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [categories, setCategories] = useState<TypeCategory[]>([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [categoriesSelected, setCategoriesSelected] = useState<TypeCategory[]>(
    []
  );
  const [checkExistProduct, setCheckExistProduct] = useState(false);
  const [checkExistSequenceProduct, setCheckExistSequenceProduct] =
    useState(false);
  const [showModalAddProductSequence, setShowModalAddProductSequence] =
    useState(false);
  const [productSort, setProductSort] = useState([]);
  const [searchProductSequence, setSearchProductSequence] = useState("");
  const [selectedProductRowKeys, setSelectedProductRowKeys] = useState<
    React.Key[]
  >([]);
  const [arrPro, setArrPro] = useState([]);
  const [arrProductCategory, setArrProductCategory] = useState([]);

  const [checkSequenceProduct, setCheckSequenceProduct] = useState(false);

  const onChange = (key: string | string[]) => {};
  useEffect(() => {
    initDataCategoriesWithOutFilter();
    if (
      objSettingSequenceProduct != null &&
      objSettingSequenceProduct.length > 0
    ){
      setCheckExistSequenceProduct(true);
    }
    
  }, []);

  const initDataCategoriesWithOutFilter = async () => {
    setSelectedRowKeys(categoryEdit);
    let urlCategory = '/api/resource/VGM_Category?fields=["*"]';
    const response = await AxiosService.get(urlCategory);
    // Kiểm tra xem kết quả từ API có chứa dữ liệu không
    if (response && response.data) {
      // Thêm key cho mỗi phần tử trong mảng, sử dụng trường 'name'
      let dataCategories: TypeCategory[] = response.data.map(
        (item: TypeCategory,index : number) => {
          return {
            ...item,
            key: item.name,
          };
        }
      );
      for (let i = 0; i < dataCategories.length; i++) {
        let urlProduct = `/api/resource/VGM_Product?fields=["name","product_code","product_name"]&&filters=[["category","=","${dataCategories[i].name}"]]`;
        let res = await AxiosService.get(urlProduct);
        if (res != null && res.data != null) {
          dataCategories[i].product_num = res.data.length;
          let arrProducts: TypeProduct[] = res.data.map((item: TypeProduct) => {
            return {
              ...item,
              key: item.name,
            };
          });
          dataCategories[i].products = arrProducts;
        } else {
          dataCategories[i].product_num = 0;
          dataCategories[i].products = [];
        }

        //Khởi tạo dữ liệu sắp xếp sản phẩm
        if (res != null && res.data != null) {
          for (let i = 0; i < res.data.length; i++) {
            //Dựa theo cấu trúc đưa ra dữ liệu mẫu khi thêm sản phẩm sx
          }
        }
      }
      setCategories(dataCategories);
      let categoryInitSelected = [];
      let allProducts = [];
      let allProductSort = [];
      for (let i = 0; i < categoryEdit.length; i++) {
        let dataCategoryFilter = dataCategories.filter(
          (x) => x.name == categoryEdit[i]
        );
        // categoryInitSelected.push(dataCategoryFilter[0]);
        let categoryCopy = { ...dataCategoryFilter[0] };
            categoryCopy.products = categoryCopy.products.map((product) => {
              return {
                ...product,
                cate_name: categoryCopy.category_name,
                product_num: "1",
              };
            })
            allProductSort  = allProductSort.concat(categoryCopy.products);
        if (dataCategoryFilter != null && dataCategoryFilter.length > 0) {
          
          
          // Thêm trường "name" của category vào mỗi phần tử trong mảng "products"
          // Gán min_product từ dữ liệu vào mỗi sản phẩm trong mảng products
          if(Object.keys(productEdit).length !== 0){
            categoryCopy.products = categoryCopy.products
            .filter((product) => productEdit.hasOwnProperty(product.name))
            .map((product) => {
              
              // Lấy giá trị min_product tương ứng với product_code của sản phẩm
          
              if (
                productEdit[product.name] != null &&
                productEdit[product.name]?.min_product != null &&
                !checkExistProduct
              ) {
                const minProductValue = productEdit[product.name]?.min_product || 1;
                setCheckExistProduct(true);
                   // Gán giá trị cate_name và min_product cho sản phẩm
              return {
                ...product,
                cate_name: categoryCopy.category_name,
                product_num: minProductValue.toString(),
              };
              }
            });
           allProducts = allProducts.concat(categoryCopy.products);
           categoryInitSelected.push(categoryCopy);
          }
          else{
            categoryCopy.products = categoryCopy.products.map((product) => {
              return {
                ...product,
                cate_name: categoryCopy.category_name,
                product_num: "1",
              };
            })
            allProduct  = allProduct.concat(categoryCopy.products);
            categoryInitSelected.push(categoryCopy);
          }
        
        }
      }
      
      // Khởi tạo mảng rỗng để chứa danh sách sản phẩm theo thứ tự và có trường "sequence_product"
      const productsInOrder = objSettingSequenceProduct.map(
        (productName, index) => {
          // Tìm sản phẩm có tên là productName trong mảng allProductSort
          const product = allProductSort.find((item) => item.name === productName);
          // Nếu sản phẩm tồn tại, trả về một bản sao của sản phẩm với trường "sequence_product" được gán giá trị là index + 1
          if (product) {
            return {
              ...product,
              sequence_product: index + 1, // Bắt đầu từ 1
            };
          }
        }
      );
      // Hiển thị danh sách sản phẩm theo thứ tự với trường "sequence_product"
      setProductSort(productsInOrder);
      setProductSelected(allProducts);
      for(let idx = 0 ; idx < categoryInitSelected.length;idx++){
        categoryInitSelected[idx].stt = idx + 1
      }
      onChangeCategory(categoryInitSelected);
      setCategoriesSelected(categoryInitSelected);
      setChangeCategories(categoryInitSelected)
    }
  };

  useEffect(() => {
    initDataCategories();
  }, [searchCategory]);

  const initDataCategories = async () => {
    let urlCategory = '/api/resource/VGM_Category?fields=["*"]';
    if (searchCategory != null && searchCategory != "") {
      urlCategory += `&filters=[["category_name", "like", "%${searchCategory}%"]]`;
    }
    const response = await AxiosService.get(urlCategory);
    // Kiểm tra xem kết quả từ API có chứa dữ liệu không
    if (response && response.data) {
      // Thêm key cho mỗi phần tử trong mảng, sử dụng trường 'name'
      let dataCategories: TypeCategory[] = response.data.map(
        (item: TypeCategory, index: number) => {
          return {
            ...item,
            key: item.name,
          };
        }
      );
      for (let i = 0; i < dataCategories.length; i++) {
        let urlProduct = `/api/resource/VGM_Product?fields=["name","product_code","product_name"]&&filters=[["category","=","${dataCategories[i].name}"]]&limit_page_length=500`;
        let res = await AxiosService.get(urlProduct);
        if (res != null && res.data != null) {
          dataCategories[i].product_num = res.data.length;
          let arrProducts: TypeProduct[] = res.data.map((item: TypeProduct, index: number) => {
            return {
              ...item,
              key: item.name,
              stt: index + 1
            };
          });
          dataCategories[i].products = arrProducts;
        } else {
          dataCategories[i].product_num = 1;
          dataCategories[i].products = [];
        }
      }
     
      setCategories(dataCategories);
    }
  };
  const handleChangeCheckSequence = (e) => {
    setCheckExistSequenceProduct(e.target.checked);
    onChangeCheckSequenceProduct(e.target.checked);
  };
  const handleSearchCategory = (event) => {
    setSearchCategory(event.target.value);
  };

  const onSelectChangeCategory = (
    newSelectedRowKeys: React.Key[],
    selectedRow: TypeCategory[]
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelectionCategory = {
    selectedRowKeys,
    onChange: onSelectChangeCategory,
  };

  const handleSelectCategory = () => {
    if(selectedRowKeys.length > 1){
      message.error("Số lượng danh mục không được vượt quá 1 danh mục");
      return;
    }
    let arrCategorySelect: TypeCategory[] = [];
    let allProducts = [];
    for (let i = 0; i < selectedRowKeys.length; i++) {
      let item = categories.filter((x) => x.name == selectedRowKeys[i]);
      if (item != null && item.length > 0) {
        item[0].stt = arrCategorySelect.length + 1;
        // Tạo một bản sao của đối tượng category
        let categoryCopy = { ...item[0] };

        // Thêm trường "name" của category vào mỗi phần tử trong mảng "products"
        categoryCopy.products = categoryCopy.products.map((product) => {
          return {
            ...product,
            cate_name: categoryCopy.category_name,
            product_num: "1",
          };
        });
        allProducts = allProducts.concat(categoryCopy.products);
        arrCategorySelect.push(categoryCopy);
      }
    }
    setProductSelected(allProducts);
    setCategoriesSelected(arrCategorySelect);
    setChangeCategories(arrCategorySelect)
    onChangeCategory(arrCategorySelect);
    handleCancelAddCategory();
  };

  const hasSelected = selectedRowKeys.length > 0;
  const showModalCategory = () => {
    setIsModalOpenCategory(true);
  };

  const handleOkAddCategory = () => {
    setIsModalOpenCategory(false);
  };

  const handleCancelAddCategory = () => {
    setIsModalOpenCategory(false);
  };

  const handleDeleteCategory = (item) => {
    const updatedCategoriesSelected = categoriesSelected
    .filter((category) => category.name !== item.name)
    .map((category, index) => ({
      ...category,
      stt: index + 1,
    }));
    const updatedProductSelected = productSelected.filter(
      (product) => product.cate_name !== item.category_name
    );
    setArrProductCategory(updatedProductSelected);
    if (productSort.length > 0) {
      // Lọc ra các phần tử có cate_name khác với objToDelete
      const filteredArray = productSort.filter(
        (x) => x.cate_name !== item.category_name
      );

      // Đánh số lại sequence_product
      let sequenceCount = 1;
      const renumberedArray = filteredArray.map((item) => {
        item.sequence_product = sequenceCount++;
        return item;
      });
      setProductSort(renumberedArray);
    }
    setArrPro(updatedProductSelected);
    
    setProductSelected(updatedProductSelected);
    setCategoriesSelected(updatedCategoriesSelected);
    const updatedArray = updatedCategoriesSelected.map(x => ({
      ...x,
      products: x.products.filter(product => productSelected.some(item2 => item2.name === product.name))
  }));
    onChangeCategory(updatedArray);
  };

  const handleChangeCheckExist = (e) => {
    setCheckExistProduct(e.target.checked);
    onChangeCheckExistProduct(e.target.checked);
  };
  const [changecategories, setChangeCategories] = useState<TypeCategory[]>(
    []
  );
  const columnProduct: TableColumnsType<DataType> = [
    { title: "Mã sản phẩm", dataIndex: "product_code" },
    { title: "Tên sản phẩm", dataIndex: "product_name" },
    { title: "Danh mục", dataIndex: "cate_name" },
    {
      title: "Số lượng ít nhất",
      dataIndex: "product_num",
      render: (
        item: number,
        rowData: DataType,
        index: number // Thêm index vào render function
      ) => (
        <Input
          style={{ width: "120px" }}
          defaultValue={item}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            if (!isNaN(newValue) && newValue >= 1) {
              handleQuantityChange(index, newValue);
            } else {
              message.warning("Số lượng ít nhất là 1")
              handleQuantityChange(index, 1);
            }
          }}
        />
      ),
    },
    {
      title: "",
      key: "",
      render: (item) => (
        <DeleteOutlined onClick={() => handleDeleteProductExist(item)} />
      ),
    },
  ];
  const handleDeleteProductExist = (item) => {
    const result = productSelected.filter(x => x.name !== item.name);
    setProductSelected(result)
  
    const updatedArray = changecategories.map(x => ({
    ...x,
    products: x.products.filter(product => result.some(item2 => item2.name === product.name))
  }));
    setChangeCategories(updatedArray)
    onChangeCategory(updatedArray)
   }
  const columnProductSort: TableColumnsType<DataType> = [
    { key: "sort" },
    { title: "STT", dataIndex: "sequence_product" },
    { title: "Mã sản phẩm", dataIndex: "product_code" },
    { title: "Tên sản phẩm", dataIndex: "product_name" },
    {
      title: "Danh mục",
      dataIndex: "cate_name",
    },
  ];

  const handleQuantityChange = (index: number, newValue: number) => {
    // Tạo một bản sao của dữ liệu hàng
    const updatedRowData = [...productSelected];
    // Cập nhật giá trị "Số lượng ít nhất" của hàng với chỉ số index
    updatedRowData[index].product_num = newValue;
    // Cập nhật trạng thái của bảng
    setProductSelected(updatedRowData);
    const updatedArray = changecategories.map(x => ({
      ...x,
      products: x.products.filter(product => updatedRowData.some(item2 => item2.name === product.name))
    }));
    setChangeCategories(updatedArray)
    onChangeCategory(updatedArray);
  };

  // const handleChangeCheckSequence = (e) => {
  //   setCheckExistSequenceProduct(e.target.checked);
  //   //Fire event ra component cha
  // };

  const handleShowModalProductSequence = () => {
    setShowModalAddProductSequence(true);
    const allProducts = [];
    // Duyệt qua mỗi danh mục
    categoriesSelected.forEach((category) => {
      // Thêm sản phẩm của từng danh mục vào mảng allProducts
      allProducts.push(
        ...category.products.map((product) => ({
          ...product,
          cate_name: category.category_name,
        }))
      );
    });
    allProducts.forEach((item, index) => {
      const foundIndex = objSettingSequenceProduct.indexOf(item.name);
      if (foundIndex !== -1) {
          // Nếu mã nằm trong mảng arr1, thêm trường sequence_product
          item.sequence_product = foundIndex + 1;
      } else {
          // Nếu không tìm thấy mã, đặt sequence_product thành null hoặc giá trị mặc định khác
          item.sequence_product = null;
      }
  });
   
    setArrProductCategory(allProducts);
    setArrPro(allProducts);
    setSelectedProductRowKeys(objSettingSequenceProduct)
  };

  const handleDragRowEvent = (data: any) => { 
    let arrSequenceProduct = data.map((x) => x.name);
    // setSequenceProducts(arrSequenceProduct);
    onChangeSequenceProducts(arrSequenceProduct);
  };

  const itemsChildren: CollapseProps["itemsChildren"] = [
    {
      key: "1",
      label: (
        <Checkbox checked={checkExistProduct} onClick={(event) => {event.stopPropagation()}} onChange={handleChangeCheckExist}>
          {" "} 
          <span style={{ fontWeight: 700, fontSize: "15px" }}>
            {" "}
            1. Tiêu chí tồn tại sản phẩm
          </span>{" "}
        </Checkbox>
      ),
      children: (
        <div>
          <TableCustom columns={columnProduct} dataSource={productSelected} />
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <Checkbox
          onClick={(event) => {event.stopPropagation()}}
          checked={checkExistSequenceProduct}
          onChange={handleChangeCheckSequence}
        >
          {" "}
          <span style={{ fontWeight: 700, fontSize: "15px" }}>
            {" "}
            2. Tiêu chí sắp xếp sản phẩm
          </span>{" "}
        </Checkbox>
      ),
      children: (
        <div>
          <div
            onClick={handleShowModalProductSequence}
            className="flex justify-center h-9 cursor-pointer items-center ml-4 mt-4 mb-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px] "
          >
            <p className="mr-2">
              <PlusOutlined />
            </p>
            <p className="text-sm font-bold text-[#1877F2]">Chọn sản phẩm</p>
          </div>
          <div
            className="ml-4 mb-4 mr-4 mt-4"
            style={{
              fontSize: "17px",
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: "21px",
              letterSpacing: "0em",
              textAlign: "left",
              color: "rgba(99, 115, 129, 1)",
            }}
          >
            <span>
              Di chuyển (kéo, thả) các sản phẩm để sắp xếp thứ tự sản phẩm
            </span>
          </div>
          <DrapTable
            columnsTable={columnProductSort}
            datasTable={productSort}
            keyPros={"sequence_product"}
            onDragRowEvent={handleDragRowEvent}
          ></DrapTable>
        </div>
      ),
    },
  ];
  const itemscoll: CollapseProps["itemscoll"] = [
    {
      key: "1",
      label: (
        <span style={{ fontWeight: 700, fontSize: "15px" }}>
          {" "}
          Thiết lập tiêu chí chấm điểm trưng bày sản phẩm
        </span>
      ),
      children: (
        <Collapse
          items={itemsChildren}
          defaultActiveKey={["1", "2"]}
          className="custom-collapse-audit"
        />
      ),
    },
  ];

  const expandedRowRender = (record, index) => {
    const columnProducts: TableColumnsType<ExpandedDataType> = [
      { title: "Mã sản phẩm", dataIndex: "product_code", key: "product_code" },
      { title: "Tên sản phẩm", dataIndex: "product_name", key: "product_name" },
    ];
    return (
      <>
        <div style={{ margin: 5 }}>
          <Table
            columns={columnProducts}
            dataSource={record.products}
            pagination={false}
          />
        </div>
      </>
    );
  };

  const columnCategories: TableColumnsType<DataType> = [
    { title: "STT", dataIndex: "stt", key: "stt" },
    {
      title: "Danh mục sản phẩm",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "Số lượng sản phẩm",
      dataIndex: "product_num",
      key: "product_num",
    },
    {
      title: "",
      key: "",
      render: (item) => (
        <a>
          <DeleteOutlined onClick={() => handleDeleteCategory(item)} />
        </a>
      ),
    },
  ];

  const handleCancelAddProductSequence = () => {
    setShowModalAddProductSequence(false);
  };

  const handleSearchProductSequence = (event) => {
    const searchValue = event.target.value.toLowerCase(); // Lấy giá trị tìm kiếm và chuyển đổi thành chữ thường
    setSearchProductSequence(searchValue);
    // Tạo một mảng tạm thời để lưu trữ danh sách sản phẩm ban đầu
    const tempProducts = [...arrPro];
    // Nếu ô tìm kiếm rỗng, hiển thị lại tất cả sản phẩm từ mảng tạm thời
    if (searchValue === "") {
      setArrProductCategory(arrPro);
      return;
    } else {
      // Lọc danh sách sản phẩm hiển thị dựa trên giá trị tìm kiếm
      const filteredProducts = tempProducts.filter((product) => {
        // Kiểm tra xem tên sản phẩm có chứa giá trị tìm kiếm không
        return product.product_name.toLowerCase().includes(searchValue);
      });

      // Cập nhật danh sách sản phẩm hiển thị sau khi lọc
      setArrProductCategory(filteredProducts);
    }
  };

  const hasSelectedProductSequence = selectedProductRowKeys.length > 0;

  const handleSelectProductSequence = () => {
    const result = arrProductCategory.filter((item) =>
      selectedProductRowKeys.includes(item.name)
    );
    let arrSequenceProduct = result.map((x) => x.name);
    //onChangeSequenceProducts(arrSequenceProduct);
    //Fire event ra component cha
    onChangeSequenceProducts(arrSequenceProduct);
    const resultSorted = result.sort((a, b) => {
      // Chuyển đổi giá trị của sequence_product về kiểu số trước khi so sánh
      const sequenceA = parseInt(a.sequence_product);
      const sequenceB = parseInt(b.sequence_product);
    
      // Sắp xếp các phần tử theo giá trị của sequence_product
      return sequenceA - sequenceB;
    });
    setProductSort(resultSorted);
    handleCancelAddProductSequence();
  };
  const onSelectChangeProduct = (
    newSelectedRowKeys: React.Key[],
    selectedRow: TypeCategory[]
  ) => {
    // Thêm trường sequence_product vào mỗi phần tử trong mảng dữ liệu
    const newData = arrPro.map((item, index) => {
      const sequenceIndex = newSelectedRowKeys.indexOf(item.name);
      const sequenceProduct = sequenceIndex !== -1 ? sequenceIndex + 1 : null;
      return { ...item, sequence_product: sequenceProduct };
    });
    setArrProductCategory(newData);
    setSelectedProductRowKeys(newSelectedRowKeys);
  };

  const rowSelectionProduct = {
    selectedProductRowKeys,
    //  onSelectAll: onSelectAllCategory,
    onChange: onSelectChangeProduct,
  };
  const handleQuantityChangeProduct = (index: number, newValue: number) => {
    setArrProductCategory(prevState => {
      return prevState.map((item, idx) => {
          if (idx === index) {
              const prevValue = item.sequence_product || 0; // Lấy giá trị trước đó, nếu không có thì mặc định là 0
              return { ...item, sequence_product: prevValue + newValue };
          }
          return item;
      });
  });
  };
  return (
    <div className="pt-4">
      <p className="ml-4 font-semibold text-sm text-[#212B36]">Sản phẩm</p>
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
        <Collapse
          items={itemscoll}
          defaultActiveKey={["1", "2"]}
          onChange={onChange}
          className="custom-collapse"
        />
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
            <Input
              value={searchCategory}
              onChange={handleSearchCategory}
              placeholder="Tìm kiếm danh mục sản phẩm"
              prefix={<SearchOutlined />}
            />
          </FormItemCustom>
          <div>
            <span style={{ marginRight: 8 }}>
              {hasSelected ? `Đã chọn ${selectedRowKeys.length} danh mục` : ""}
            </span>
            <Button type="primary" onClick={handleSelectCategory}>
              Thêm
            </Button>
          </div>
        </div>
        <div className="pt-4">
          <TableCustom
            rowSelection={rowSelectionCategory}
            columns={[
              {
                title: "Danh mục sản phẩm",
                dataIndex: "category_name",
                key: "category_name",
              },
              {
                title: "Số lượng sản phẩm",
                dataIndex: "product_num",
                key: "product_num",
              },
            ]}
            dataSource={categories}
          />
        </div>
      </Modal>

      <Modal
        width={990}
        title="Sắp xếp sản phẩm"
        open={showModalAddProductSequence}
        onCancel={handleCancelAddProductSequence}
        footer={false}
      >
        <div className="flex items-center justify-between">
          <FormItemCustom className="w-[320px] border-none pt-4">
            <Input
              value={searchProductSequence}
              onChange={handleSearchProductSequence}
              placeholder="Tìm kiếm sản phẩm"
              prefix={<SearchOutlined />}
            />
          </FormItemCustom>
          <div>
            <span style={{ marginRight: 8 }}>
              {hasSelectedProductSequence
                ? `Đã chọn ${selectedProductRowKeys.length} sản phẩm`
                : ""}
            </span>
            <Button type="primary" onClick={handleSelectProductSequence}>
              Thêm
            </Button>
          </div>
        </div>
        <div className="pt-4">
          <TableCustom scroll={{ y: 270 }}
            rowSelection={rowSelectionProduct}
            columns={[
              {
                title: "Mã sản phẩm",
                dataIndex: "product_code",
                key: "product_code",
              },
              {
                title: "Tên sản phẩm",
                dataIndex: "product_name",
                key: "product_name",
              },
              { title: "Danh mục", dataIndex: "cate_name", key: "cate_name" },
              {
                title: "Chọn thứ tự",
                dataIndex: "sequence_product",
                render: (
                  item: number,
                  rowData: DataType,
                  index: number // Thêm index vào render function
                ) => (
                  <Input
                    type='number'
                    style={{ width: "120px" }}
                   
                    value={item}
                    onChange={(e) =>
                      handleQuantityChangeProduct(
                        index,
                        parseInt(e.target.value)
                      )
                    } // Sử dụng index trong handleQuantityChange
                  />
                ),
              },
            ]}
            dataSource={arrProductCategory}
          />
        </div>
      </Modal>
    </div>
  );
}
