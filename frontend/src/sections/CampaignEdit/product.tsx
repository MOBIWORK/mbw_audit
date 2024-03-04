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
  import { useState, useEffect } from "react";
  import { AxiosService } from "../../services/server";
  
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
  
  export default function ProductCampaignEdit({onChangeCategory, categoryEdit}) {
    const [isModalOpenCategory, setIsModalOpenCategory] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  
    const [categories, setCategories] = useState<TypeCategory[]>([]);
    const [searchCategory, setSearchCategory] = useState("");
    const [categoriesSelected, setCategoriesSelected] = useState<TypeCategory[]>([]);
  
    useEffect(() => {
        initDataCategoriesWithOutFilter();
    }, []);

    const initDataCategoriesWithOutFilter = async () => {
        let urlCategory = '/api/resource/VGM_Category?fields=["*"]';
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
            let categoryInitSelected = [];
            for(let i = 0; i < categoryEdit.length; i++){
                let dataCategoryFilter = dataCategories.filter(x => x.name==categoryEdit[i]);
                if(dataCategoryFilter != null && dataCategoryFilter.length > 0){
                    categoryInitSelected.push(dataCategoryFilter[0]);
                } 
            }
            setCategoriesSelected(categoryInitSelected)
        }
    }
  
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
  
    const onSelectChangeCategory = (newSelectedRowKeys: React.Key[], selectedRow: TypeCategory[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    };
  
    const rowSelectionCategory = {
      selectedRowKeys,
      onChange: onSelectChangeCategory,
    };
  
    const handleSelectCategory = () => {
      let arrCategorySelect: TypeCategory[] = [];
      for(let i = 0; i < selectedRowKeys.length; i++){
        let item = categories.filter(x => x.name == selectedRowKeys[i]);
        if(item != null && item.length > 0){
          item[0].stt = arrCategorySelect.length + 1;
          arrCategorySelect.push(item[0]);
        } 
      }
      setCategoriesSelected(arrCategorySelect);
      onChangeCategory(arrCategorySelect);
      handleCancelAddCategory();
    }
  
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
      const updatedCategoriesSelected = categoriesSelected.filter(category => category.name !== item.name);
      setCategoriesSelected(updatedCategoriesSelected);
      onChangeCategory(updatedCategoriesSelected);
    }
  
    const expandedRowRender = (record, index) => {
      const columnProducts: TableColumnsType<ExpandedDataType> = [
        { title: "Mã sản phẩm", dataIndex: "product_code", key: "product_code" },
        { title: "Tên sản phẩm", dataIndex: "product_name", key: "product_name" },
      ];
      return <Table columns={columnProducts} dataSource={record.products} pagination={false} />;
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
      </div>
    );
  }
  