import { LuUploadCloud } from "react-icons/lu";
import { VscAdd } from "react-icons/vsc";
import { FormItemCustom, HeaderPage, TableCustom } from "../../components";
import ObjectDetectionResult from './ObjectDetectionResult';
import * as XLSX from "xlsx";
import {
  DeleteOutlined,
  EditOutlined,
  FileProtectOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  List,
  Modal,
  Row,
  Space,
  Table,
  TableColumnsType,
  Typography,
  Upload,
  UploadProps,
  message
} from "antd";
import paths from "../AppConst/path.js";
import { useState, useEffect } from "react";
import Dragger from "antd/es/upload/Dragger";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { UploadFile } from "antd/lib";
import  {AxiosService} from '../../services/server';
import "./productsku.css";
import JsBarcode from "jsbarcode";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

interface TypeCategory{
  key: React.Key;
  name: string;
  category_name: string;
  category_description: string;
  owner: string;
  hidden: boolean;
}
interface TypeProduct{
  key: React.Key;
  name: string;
  barcode: string;
  category: string;
  category_name: string;
  product_code: string;
  product_name: string;
  product_description: string;
}
interface TypeProductFromERP{
  key: React.Key;
  name: string;
  image: string;
  description: string;
  item_code: string;
  item_group: string;
  item_name: string
}

import type { GetProp } from "antd";


type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const apiUrl = paths.apiUrl;
export default function Product_SKU() {
  
  const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
    "checkbox"
  );
  const [categories, setCategories] = useState<any[]>([]);
  const [searchCategory, setSearchCategory] = useState('');

  const [form] = useForm();
  const [formEditCategory] = useForm();
  const [formAddProduct] = useForm();
  const [formEditProduct] = useForm();

  
  const [isModalOpenAddProduct, setIsModalOpenAddProduct] = useState(false);
  const [isModalOpenAddCategory, setIsModalOpenAddCategory] = useState(false);
  //item and isShowModel for delete category
  const [deleteItemCategory, setDeleteItemCategory] = useState({});
  const [isModelOpenDeleteCategory, setIsModelOpenDeleteCategory] = useState(false);
  //item and isShowModel for edit category
  const [editItemCategory, setEditItemCategory] = useState({});
  const [isModelOpenEditCategory, setIsModelOpenEditCategory] = useState(false);

  //biến cho sản phẩm theo danh mục
  const [categorySelected, setCategorySelected] = useState({});
  const [products, setProducts] = useState<any[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [fileUploadAddProduct, setFileUploadAddProduct] = useState([]);
  const [deleteItemProduct, setDeleteItemProduct] = useState({});
  const [isModelOpenDeleteProduct, setIsModelOpenDeleteProduct] = useState(false);
  const [editItemProduct, setEditItemProduct] = useState({});
  const [isModelOpenEditProduct, setIsModelOpenEditProduct] = useState(false);
  const [fileUploadEditProduct, setFileUploadEditProduct] = useState([]);
  const [barcodeEditProduct, setBarcodeEditProduct] = useState(null);
  const [productSelected, setProductSelected] = useState<DataType[]>([]);
  const [showDeleteList, setShowDeleteList] = useState(false);
  const [isModelOpenDeleteList, setIsModelOpenDeleteList] = useState(false);
  const [isModalOpenCheckProduct, setIsModalOpenCheckProduct] = useState(false);
  const [fileUploadCheckProduct, setFileUploadCheckProduct] = useState([]);
  const [urlImageCheckProductResult, setUrlImageCheckProductResult] = useState("");
  const [resultProductCheck, setResultProductCheck] = useState([]);
  const [isModelResultProduct, setIsModelResultProduct] = useState(false);
  const [isModalAddProductFromERP, setIsModalAddProductFromERP] = useState(false);
  const [searchProductFromERP,setSearchProductFromERP] = useState("");
  const [productFromERPSelected, setProductFromERPSelected] = useState<any[]>([]);
  const [productFromERP, setProductFromERP] = useState<any[]>([]);

  const [fileListImage , setFileListImage] = useState<any[]>([]);
  const [urlImageAI , setUrlImageAI] = useState("");
  const [objectBoxes , setObjectBoxes] = useState<any[]>([])
  const [isModalOpenImportFileExcel, setIsModalOpenImportFileExcel] = useState(false);
  let labelColors = {}
  
  const [lstProductImport, setLstProductImport] = useState([]);
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
                          let objDataImport = {
                              'product_code': data[i][0] ? data[i][0] : "",
                              'barcode': data[i][1] ? data[i][1] : "",
                              'product_name': data[i][2],
                              'product_description': data[i][3],
                              'url_images': JSON.parse(data[i][4]),
                          }
                          dataImport.push(objDataImport);
                      }
                  }
                  console.log(dataImport);
                  setLstProductImport(dataImport);
              };
              reader.readAsArrayBuffer(file);
              return false;
          } else {
              // Xử lý khi không phải là file Excel
              message.error("Đã xảy ra lỗi, không đúng định dạng file: xls, xlsx, xlsm, xlsb, csv, ods");
              return false; // Trả về false để ngăn việc tự động tải file
          }
      } catch (error) {
          // Xử lý lỗi ở đây, ví dụ hiển thị thông báo cho người dùng
         
          message.error("File không chính xác, tải dữ liệu mẫu để tiếp tục");
          return false; // Trả về false để ngăn việc tự động tải file
      }
  },
};
  const propUploadAddProducts: UploadProps = {
    onRemove: (file) => {},
    beforeUpload: async (file) => {

      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Bạn chỉ có thể tải lên file định dạng JPG/PNG!');
        return isJpgOrPng;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Dung lượng tệp tải lên phải bé hơn 2MB!');
        return isLt2M;
      }
    
      const formData = new FormData();
      const fields = {
        file,
        is_private: "0",
        folder: "Home"
      };
  
      for (const [key, value] of Object.entries(fields)) {
        formData.append(key, value);
      }
      const response = await AxiosService.post(
        "/api/method/upload_file",
        formData
      );
      if (response.message) {
        //fileListUpload.push(response.message);
        setFileUploadAddProduct(prevFileUpload => [...prevFileUpload, response.message]);
        message.success("Tải ảnh thành công");
      } else {
        message.error("Tải ảnh thất bại");
      }
      return false;
    },
  };
  const propUploadEditProducts: UploadProps = {
    onRemove: (file) => {},
    beforeUpload: async (file) => {
     
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Bạn chỉ có thể tải lên file định dạng JPG/PNG!');
        return isJpgOrPng;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Dung lượng tệp tải lên phải bé hơn 2MB!');
        return isLt2M;
      }

      const formData = new FormData();
      const fields = {
        file,
        is_private: "0",
        folder: "Home"
      };
  
      for (const [key, value] of Object.entries(fields)) {
        formData.append(key, value);
      }
      const response = await AxiosService.post(
        "/api/method/upload_file",
        formData
      );
      if (response.message) {
        //fileListUpload.push(response.message);
        setFileUploadEditProduct(prevFileUpload => [...prevFileUpload, response.message]);
        message.success("Tải ảnh thành công");
      } else {
        message.error("Tải ảnh thất bại");
      }
      return false;
    },
  };
  const propUploadCheckProducts: UploadProps = {
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    accept: "image/png, image/jpeg",
    beforeUpload: async (file) => {
      
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Bạn chỉ có thể tải lên file định dạng JPG/PNG!');
        return isJpgOrPng;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Dung lượng tệp tải lên phải bé hơn 2MB!');
        return isLt2M;
      }

      const formData = new FormData();
      const fields = {
        file,
        is_private: "0",
        folder: "Home"
      };
  
      for (const [key, value] of Object.entries(fields)) {
        formData.append(key, value);
      }
      const response = await AxiosService.post(
        "/api/method/upload_file",
        formData
      );
      if (response.message) {
        //fileListUpload.push(response.message);
        let listFile = []
        let obj = {
          uid: '-1',
          name: response.message.file_name,
          status: 'done',
          url: response.message.file_url,
        }
        listFile.push(obj)
        setFileListImage(listFile)
        setFileUploadCheckProduct(prevFileUpload => [...prevFileUpload, response.message]);
        message.success("Tải ảnh thành công");
      } else {
        message.error("Tải ảnh thất bại");
      }
      return false;
    }
  }
  const columnProducts: TableColumnsType<DataType> = [
    {
      title: "Mã Sản phẩm",
      dataIndex: "product_code",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
    },
    // {
    //   title: "Danh mục",
    //   dataIndex: "category_name",
    // },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>
            <EditOutlined onClick={() => handleClickEditProduct(record)}/>
          </a>
          <a>
            <DeleteOutlined onClick={() => handleClickDeleteProduct(record)}/>
          </a>
        </Space>
      ),
    },
  ];

  const rowSelectionProduct = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setProductSelected(selectedRows);
      if(selectedRows.length > 0) setShowDeleteList(true);
      else setShowDeleteList(false);
    },
  };

  //Các hàm xử lý danh mục
  const fetchDataCategories = async () => {
    try {
      //setLoading(true);
      let urlCategory = '/api/resource/VGM_Category?fields=["*"]';
      if(searchCategory != null && searchCategory != ""){
        let filterComand = `[["category_name", "like", "%${searchCategory}%"]]`;
        urlCategory += `&filters=${filterComand}`;
      }
      const response = await AxiosService.get(urlCategory);
      // Kiểm tra xem kết quả từ API có chứa dữ liệu không
      if (response && response.data) {
        // Thêm key cho mỗi phần tử trong mảng, sử dụng trường 'name'
        let dataCategories: TypeCategory[] = response.data.map((item: TypeCategory, index: number) => {
          return {
            ...item,
            key: item.name,
            hidden: true,
            selected: index === 0
          }
        })
        setCategories(dataCategories);
        // Chọn danh mục đầu tiên mặc định
        if (dataCategories.length > 0) {
              setCategorySelected(dataCategories[0]);
        }
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchDataCategories();
  }, []);

  useEffect(() => {
    fetchDataCategories();
  }, [searchCategory]);

  const onChangeFilterCategory = (event) => {
    setSearchCategory(event.target.value);
  }

  const handleMouseEnterCategory = (event, item) => {
    setCategories(prevCategories => 
      prevCategories.map(category => {
        if (category.key === item.key) {
          return { ...category, hidden: false };
        }
        return category;
      })
    );
  }

  const handleMouseLeaveCategory = (event, item) => {
    setCategories(prevCategories => 
      prevCategories.map(category => {
        if (category.key === item.key) {
          return { ...category, hidden: true };
        }
        return category;
      })
    );
  }

  const handleDeleteCategoryClick = (item) => {
    let itemModel = {
      'item': item,
      'title': "Xóa " + item.category_name,
      'contentConfirm': "Bạn có chắc muốn xóa " + item.category_name +" ra khỏi hệ thống không?", 
      'contentRemind': "Khi thực hiện hành động này, sẽ không thể hoàn tác."
    }
    setDeleteItemCategory(itemModel);
    setIsModelOpenDeleteCategory(true);
  }

  const handleDeleteOkCategory = async () => {
    // if(deleteItemCategory != null && deleteItemCategory.item != null){
    //   let urlDelete = `/api/resource/VGM_Category/${deleteItemCategory.item.name}`;
    //   let res = await AxiosService.delete(urlDelete);
    //   if(res != null && res.message == "ok"){
    //     message.success("Xóa thành công");
    //     fetchDataCategories();
    //     handleDeleteCancelCategory();
    //   }else{
    //     message.error("Xóa thất bại");
    //   }
    // }
      if(deleteItemCategory != null && deleteItemCategory.item != null){
        let arrIdDelete = []
        arrIdDelete = [deleteItemCategory.item.name]
        let urlDeleteByList = apiUrl + ".api.deleteListByDoctype";
         let dataDeletePost = {
      'doctype': "VGM_Category",
      'items': JSON.stringify(arrIdDelete)
    }
     let res = await AxiosService.post(urlDeleteByList, dataDeletePost);
    if(res != null && res.message != null && res.message.status == "success"){
      message.success("Xóa thành công");
      fetchDataCategories();
      handleDeleteCancelCategory();
    }else{
      message.error("Xóa thất bại, Danh mục này đang được sử dụng");
    }
      }
   
  }

  const handleDeleteCancelCategory = () => {
    setIsModelOpenDeleteCategory(false);
    setDeleteItemCategory({});
  }

  const handleEditCategoryClick = (item) => {
    formEditCategory.setFieldsValue({
      name_item: item.category_name,
      des: item.category_description,
    });
    setEditItemCategory(item);
    setIsModelOpenEditCategory(true);
  }

  const handleOkEditCategory = async ()=> {
    let objCategory = formEditCategory.getFieldsValue();
    if(editItemCategory != null && editItemCategory.name != null){
      let urlPutCategory = `/api/resource/VGM_Category/${editItemCategory.name}`;
      let dataPut = {
        'category_name': objCategory.name_item,
        'category_description': objCategory.des
      }
      let res = await AxiosService.put(urlPutCategory, dataPut);
      if(res != null && res.data != null){
        message.success("Sửa thành công");
        fetchDataCategories();
        handleCancelEditCategory();
      }else{
        message.error("Sửa thất bại");
      }
    }
  }
  
  const handleCancelEditCategory = () => {
    setEditItemCategory({});
    setIsModelOpenEditCategory(false);
  }

  const showModalCategory = () => {
    setIsModalOpenAddCategory(true);
  };

  const handleOkCategory = async () => {
    const valField = form.getFieldsValue();
    const categoryName = valField.name_item.trim();

    if (!categoryName) {
        message.warning("Vui lòng nhập tên danh mục.");
        return;
    }
    // Kiểm tra xem danh mục đã tồn tại trong mảng category hay không
    const isCategoryExists = categories.some(cat => cat.category_name.toLowerCase() === categoryName.toLowerCase());
    if (isCategoryExists) {
        message.error("Danh mục đã tồn tại.");
        return;
    }

    try {
        const dataPost = {
            'doc': JSON.stringify({
                'doctype': "VGM_Category",
                'category_name': categoryName,
                'category_description': valField.des
            }),
            'action': "Save"
        };

        const resCreateCategory = await AxiosService.post('/api/method/frappe.desk.form.save.savedocs', dataPost);
        if (resCreateCategory && resCreateCategory.docs && resCreateCategory.docs.length > 0) {
            form.resetFields();
            message.success("Thêm mới thành công");
            fetchDataCategories();
            setIsModalOpenAddCategory(false);
        } else {
            message.error("Thêm mới thất bại");
        }
    } catch (error) {
        console.error("Lỗi khi thêm mới danh mục:", error);
        message.error("Đã xảy ra lỗi khi thêm mới danh mục.");
    }
};


  const handleCancelCategory = () => {
    setIsModalOpenAddCategory(false);
  };

  //Các hàm xử lý danh sách sản phẩm
  const handleSelectedCategory = (item) => {
    setCategorySelected(item);
    setCategories(prevCategories => 
        prevCategories.map(category => {
            if (category.key === item.key) {
                return { ...category, selected: true };
            } else {
                return { ...category, selected: false };
            }
        })
    );
  }

  useEffect(() => {
    initDataProductByCategory();
  }, [categorySelected]);

  useEffect(() => {
    if(barcodeEditProduct != null && barcodeEditProduct != "") renderBarcodeByValue(barcodeEditProduct);
  }, [barcodeEditProduct]);

  useEffect(() => {
    initDataProductByCategory();
  }, [searchProduct])

  const initDataProductByCategory = async () => {
    let urlProducts = "";
    if(searchProduct != null && searchProduct != ""){
      urlProducts = `/api/resource/VGM_Product?fields=["*"]&filters=[["category","=","${categorySelected.name}"],["product_name","like","%${searchProduct}%"]]`;
    }else{
      urlProducts = `/api/resource/VGM_Product?fields=["*"]&filters=[["category","=","${categorySelected.name}"]]`;
    }
    let res = await AxiosService.get(urlProducts);
    if (res && res.data) {
      // Thêm key cho mỗi phần tử trong mảng, sử dụng trường 'name'
      let dataProducts: TypeProduct[] = res.data.map((item: TypeProduct) => {
        return {
          ...item,
          key: item.name,
          category_name: categorySelected.category_name
        }
      })
      setProducts(dataProducts);
    }
  }

  const onChangeFilterProduct = (event) => {
    setSearchProduct(event.target.value);
  };

  const showModalAddProduct = () => {
    formAddProduct.resetFields();
    setFileList([])
    let barcode = document.getElementById("barcode");
    if(barcode){
      barcode.innerHTML = "";
    }
    if(categorySelected != null && categorySelected.name != null){
      setIsModalOpenAddProduct(true);
    }
  };

  const handleOkAddProduct = async () => {
    let objProduct = formAddProduct.getFieldsValue();
    let productFilter = products.filter(x => x.product_code.toLowerCase() == objProduct.product_code.toLowerCase());
    if(productFilter.length > 0){
      message.error("Mã sản phẩm đã tồn tại");
      return;
    }
    let arrImages = [];
    for (let i = 0; i < fileUploadAddProduct.length; i++) {
        arrImages.push(fileUploadAddProduct[i].file_url);
    }

    // Kiểm tra xem người dùng đã nhập đủ thông tin hay chưa
    if (!objProduct.product_name || arrImages.length === 0) {
        // Hiển thị thông báo lỗi
        message.error("Vui lòng nhập tên sản phẩm và tải lên ít nhất một hình ảnh");
        return;
    }

    let urlAddProduct = "/api/resource/VGM_Product";
    let objProductCreate = {
        'barcode': objProduct.barcode_product,
        'product_code': objProduct.product_code != null? objProduct.product_code.trim() : null,
        'product_name': objProduct.product_name != null? objProduct.product_name.trim() : null,
        'product_description': objProduct.product_description != null? objProduct.product_description.trim() : null,
        'category': categorySelected.name,
        'images': JSON.stringify(arrImages)
    };

    let res = await AxiosService.post(urlAddProduct, objProductCreate);
    if (res != null && res.data != null) {
        message.success("Thêm mới thành công");
        formAddProduct.resetFields();
        let barcode = document.getElementById("barcode");
        barcode.innerHTML = "";
        setFileUploadAddProduct([]);
        initDataProductByCategory();
        handleCancelAddProduct();
    } else {
        message.error("Thêm mới thất bại");
    }
};

  const handleRenderBarcodeAddProduct = (event) => {
    renderBarcodeByValue(event.target.value);
  }

  const handleCancelAddProduct = () => {
    setIsModalOpenAddProduct(false);
  };

  const handleClickEditProduct = (item) => {
    setEditItemProduct(item);
    setIsModelOpenEditProduct(true);
    formEditProduct.setFieldsValue({
      product_code: item.product_code,
      barcode_product: item.barcode,
      product_name: item.product_name,
      product_description: item.product_description
    });
    setBarcodeEditProduct(item.barcode);
    let arrImage = JSON.parse(item.images);
    let arrImageEdit = [];
    for(let i = 0; i < arrImage.length; i++){
      let objImage = {
        'uid': i,
        'url': arrImage[i], //import.meta.env.VITE_BASE_URL
        'url_base': arrImage[i]
      }
      arrImageEdit.push(objImage);
    }
    setFileListEdit(arrImageEdit);
  };

  const handleRenderBarcodeEditProduct = (event) => {
    renderBarcodeByValue(event.target.value);
  }

  const renderBarcodeByValue = (val) => {
    JsBarcode("#barcode",val, {
      width: 4,
      height: 40,
      displayValue: true,
      font: "Arial",
      text: val,
      textMargin: 10,
      fontSize: 13,
      background: "#F5F7FA"
    });
  }

  const handleOkEditProduct = async () => {
    let arrImage = [];
    let objProduct = formEditProduct.getFieldsValue();
    for(let i = 0; i < fileListEdit.length; i++) if(fileListEdit[i].url_base != null && fileListEdit[i].url_base != "") arrImage.push(fileListEdit[i].url_base);
    if(fileUploadEditProduct != null) for(let i = 0; i < fileUploadEditProduct.length; i++) arrImage.push(fileUploadEditProduct[i].file_url);
    let urlEditProduct = `/api/resource/VGM_Product/${editItemProduct.name}`;
    let objProductEdit = {
      'barcode': objProduct.barcode_product,
      'product_code': objProduct.product_code != null? objProduct.product_code.trim(): null,
      'product_name': objProduct.product_name != null? objProduct.product_name.trim() : null,
      'product_description': objProduct.product_description != null? objProduct.product_description.trim() : null,
      'category': categorySelected.name,
      'images': JSON.stringify(arrImage)
    }
    let res = await AxiosService.put(urlEditProduct, objProductEdit);
    if(res != null && res.data != null){
      message.success("Sửa thành công");
      formEditProduct.resetFields();
      let barcode = document.getElementById("barcode");
      barcode.innerHTML = "";
      setFileUploadEditProduct([]);
      initDataProductByCategory();
      handleCancelEditProduct();
    }else{
      message.error("Sửa thất bại");
    }
  };

  const handleCancelEditProduct = () => {
    setIsModelOpenEditProduct(false);
  }

  const handleClickDeleteProduct = (item) => {
    let itemDeleteProduct = {
      'item': item,
      'title': `Xóa ${item.product_name}`,
      'contentConfirm': `Bạn có chắc muốn xóa ${item.product_name} ra khỏi hệ thống không?`,
      'contentRemind': "Khi thực hiện hành động này, sẽ không thể hoàn tác."
    }
    setDeleteItemProduct(itemDeleteProduct);
    setIsModelOpenDeleteProduct(true);
  };

  const handleDeleteOkProduct = async () => {
    // let urlDeleteProduct = `/api/resource/VGM_Product/${deleteItemProduct.item.name}`;
    // let res = await AxiosService.delete(urlDeleteProduct);
    // if(res != null && res.message != null && res.message == "ok"){
    //   message.success("Xóa thành công");
    //   setDeleteItemProduct({});
    //   initDataProductByCategory();
    //   handleDeleteCancelProduct();
    // }else{
    //   message.error("Xóa thất bại");
    // }
    let arrIdDelete = []
    arrIdDelete = [deleteItemProduct.item.name]
    let urlDeleteByList = apiUrl + ".api.deleteListByDoctype";
    let dataDeletePost = {
      'doctype': "VGM_Product",
      'items': JSON.stringify(arrIdDelete)
    }
    let res = await AxiosService.post(urlDeleteByList, dataDeletePost);
    if(res != null && res.message != null && res.message.status == "success"){
      message.success("Xóa thành công");
      setDeleteItemProduct({});
      initDataProductByCategory();
      handleDeleteCancelProduct();
    }else{
      message.error("Xóa thất bại , Sản phẩm đang được sử dụng");
    }
  }

  const handleDeleteCancelProduct = () => {
    setIsModelOpenDeleteProduct(false);
  }

  const handleDeleteByList = () => {
    setIsModelOpenDeleteList(true);
  }

  const handleDeleteListOkProduct = async () => {
    let urlDeleteByList =apiUrl + ".api.deleteListByDoctype";
    let arrIdDelete = [];
    for(let i = 0; i < productSelected.length; i++) arrIdDelete.push(productSelected[i].name);
    let dataDeletePost = {
      'doctype': "VGM_Product",
      'items': JSON.stringify(arrIdDelete)
    }
    let res = await AxiosService.post(urlDeleteByList, dataDeletePost);
    if(res != null && res.message != null && res.message.status == "success"){
      message.success("Xóa thành công");
      setProductSelected([]);
      setShowDeleteList(false);
      initDataProductByCategory();
      handleDeleteListCancelProduct();
    }else{
      message.error("Xóa thất bại");
    }
  }

  const handleDeleteListCancelProduct = () => {
    setIsModelOpenDeleteList(false);
  }

  const showModalCheckProduct = () => {
    setIsModalOpenCheckProduct(true);
  };
  
  const handleOkCheckProduct = async () => {
    let urlCheckProduct = apiUrl + ".api.checkImageProductExist";
    let objCheckProduct = {
      'collection_name': categorySelected.name,
      'linkimages': fileUploadCheckProduct.length > 0? fileUploadCheckProduct[fileUploadCheckProduct.length - 1].file_url : ""
    }
    let res = await AxiosService.post(urlCheckProduct, objCheckProduct);
    let arrProductDetect = [];
    for(let i = 0; i < products.length; i++){
      arrProductDetect.push(
        {
          'key': products[i].name,
          'product_code': products[i].product_code,
          'product_name': products[i].product_name,
          'product_count': 0
        }
      );
    }
    if(res != null && res.message != null){
      setUrlImageAI("data:image/png;base64,"+res.message.results.verbose[0].base64_image);
      let arrBoxes = [];
      arrProductDetect.forEach(item => {
        if(res.message.results.count[item.product_name] != null) item.product_count = res.message.results.count[item.product_name];
        let locates = res.message.results.verbose[0].locates;
        
        // Lọc các đối tượng có trường label bằng giá trị của item.product_name
        let locatesWithLabel = locates.filter(function (obj) {
            return obj.label === item.product_name;
        });
        let newObjectBoxes = locatesWithLabel.map(function(box) {
          let bbox = box.bbox;
          return {
              x: bbox[0],
              y: bbox[1],
              width: bbox[2] - bbox[0],
              height: bbox[3] - bbox[1],
              label: box.label
          };
      });
      arrBoxes = arrBoxes.concat(newObjectBoxes);
      })
      setObjectBoxes(arrBoxes);
    }
    
    setUrlImageCheckProductResult(fileUploadCheckProduct.length > 0? fileUploadCheckProduct[fileUploadCheckProduct.length - 1].file_url : "");  //import.meta.env.VITE_BASE_URL+
    setResultProductCheck(arrProductDetect);
    setIsModelResultProduct(true);
    handleCancelCheckProduct();
  };
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Xác định màu viền cho các nhãn và lưu vào đối tượng labelColors
objectBoxes.forEach((box) => {
    if (!labelColors[box.label]) {
        labelColors[box.label] = getRandomColor();
    }
});
  const handleCancelCheckProduct = () => {
    setFileListImage([])
    setIsModalOpenCheckProduct(false);
  };

  const handleCancelResultCheckProduct = () => {
    setIsModelResultProduct(false);
  }
  
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileListEdit, setFileListEdit] = useState<UploadFile[]>([]);

  const onChangeImageFormAddProduct: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onChangeImageFormEditProduct: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileListEdit(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleAddProductFromERP = () =>{
    setIsModalAddProductFromERP(true);
  }

  const handleCancelAddProductFromERP = () => {
    setIsModalAddProductFromERP(false);
  }

  const handleSearchProductFromERP = (event)=>{
    setSearchProductFromERP(event.target.value);
  }
  const handleCancelImportExcel = () => {
    setIsModalOpenImportFileExcel(false);
    setFileListImport([])
  }

  useEffect(() => {
    //Goi dich vu san pham tu erp theo tu khoa
    initDataProductFromERP();
  },[searchProductFromERP])

  const hasSelected = productFromERPSelected.length > 0;
  const onSelectChangeProductERP = (newSelectedRowKeys: React.Key[], selectedRow: TypeProductFromERP[]) => {
    setProductFromERPSelected(selectedRow);
  };

  const rowSelectionProductFromERP = {
    productFromERPSelected,
    onChange: onSelectChangeProductERP,
  };

  useEffect(() => {
    initDataProductFromERP();
  },[]);

  const initDataProductFromERP = async () => {
    //Goi dich vu lay danh sach san pham tu erp
    let url = "/api/method/mbw_dms.api.selling.product.list_product";
    if(searchProductFromERP != null && searchProductFromERP != "") url = `${url}?item_name=${searchProductFromERP.trim()}`;
    let res = await AxiosService.get(url);
    let arrProductERPSource = [];
    if(res != null && res.result != null && res.result.data != null){
      arrProductERPSource = res.result.data.map((item: TypeProductFromERP) => {
        return {
          ...item,
          key: item.name
        }
      });
    }
    setProductFromERP(arrProductERPSource);
  }

  const handleSaveProductFromERP = async () => {
    //Goi dich vu luu san pham tu erp
    let arrProductPost = [];
    for(let i = 0; i < productFromERPSelected.length; i++){
      let itemProduct = {
        'product_code': productFromERPSelected[i].item_code,
        'barcode': productFromERPSelected[i].item_code,
        'product_name': productFromERPSelected[i].item_name,
        'product_description': productFromERPSelected[i].description,
        'url_images': productFromERPSelected[i].image != null && productFromERPSelected[i].image != ""? [productFromERPSelected[i].image] : []
      }
      arrProductPost.push(itemProduct);
    }
    let dataPost = {
      'listproduct': JSON.stringify(arrProductPost),
      'category': categorySelected.name
    }
    let urlPostData = apiUrl + ".api.import_product";
    let res = await AxiosService.post(urlPostData, dataPost);
    if(res != null && res.message != null && res.message.status == "success"){
      message.success("Thêm mới thành công");
      setProductFromERPSelected([]);
      initDataProductByCategory();
      handleCancelAddProductFromERP();
    }else{
      message.error("Thêm mới thất bại");
    }
  }
  const handleImportFileProduct = () => {
    setIsModalOpenImportFileExcel(true);
    setFileListImport([])
  }
  const handleOkImportExcel = async() => {
    if(lstProductImport && lstProductImport.length > 0){
      let dataPost = {
        'listproduct': JSON.stringify(lstProductImport),
        'category': categorySelected.name
      }
      let urlPostData = apiUrl + ".api.import_product";
      let res = await AxiosService.post(urlPostData, dataPost);
      if(res != null && res.message != null && res.message.status == "success"){
        message.success("Thêm mới thành công");
        initDataProductByCategory();
        setIsModalOpenImportFileExcel(false);
      }else{
        message.error("Thêm mới thất bại");
      }
    }else{
      message.error("File không chính xác, tải dữ liệu mẫu để tiếp tục");
    }
  
  }
  return (
    <>
      <HeaderPage
        title="Sản phẩm"
        buttons={[
          showDeleteList && {
            label: "Xóa",
            type: "primary",
            icon: <DeleteOutlined />,
            size: "20px",
            className: "flex items-center mr-2",
            danger: true,
            action: handleDeleteByList
          },
          {
            label: "Nhập file",
            icon: <LuUploadCloud className="text-xl" />,
            size: "20px",
            className: "flex items-center mr-2",
            action: handleImportFileProduct
          },
          {
            label: "Thêm sản phẩm từ ERP",
            icon: <VscAdd className="text-xl"/>,
            size: "20px",
            className: "flex items-center mr-2",
            action: handleAddProductFromERP
          },
          {
            label: "Kiểm tra sản phẩm",
            type: "primary",
            icon: <FileProtectOutlined className="text-xl" />,
            size: "20px",
            className: "flex items-center mr-2",
            action: showModalCheckProduct,
          },
          {
            label: "Thêm mới",
            type: "primary",
            icon: <VscAdd className="text-xl" />,
            size: "20px",
            className: "flex items-center",
            action: showModalAddProduct,
          },
        ]}
      />
      <Row gutter={16}>
        <Col span={18} push={6}>
          <div className="bg-white rounded-xl">
            <FormItemCustom className="w-[320px] border-none p-4">
              <Input value={searchProduct} onChange={onChangeFilterProduct}
                placeholder="Tìm kiếm sản phẩm"
                prefix={<SearchOutlined />}
              />
            </FormItemCustom>
            <div className="pt-3">
              <TableCustom
                rowSelection={{
                  type: selectionType,
                  ...rowSelectionProduct,
                }}
                columns={columnProducts}
                dataSource={products}
              />
            </div>
          </div>
        </Col>

        <Col span={6} pull={18}>
          <div className="bg-white rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div><p className="text-base leading-5 font-medium text-[#212B36]">Danh mục</p></div>
              <div className="cursor-pointer" onClick={showModalCategory}>
                <PlusOutlined />
              </div>
            </div>
            <div className="py-3">
              <FormItemCustom className="w-full border-none" name="filter_category">
                <Input onChange={onChangeFilterCategory} value={searchCategory}
                  placeholder="Tìm kiếm danh mục"
                  prefix={<SearchOutlined />}
                />
              </FormItemCustom>
            </div>
            <List 
              style={{maxHeight: 'calc(100vh - 500px)', overflow: 'auto', paddingRight:'10px'}}
              header={false}
              footer={false}
              bordered={false}
              dataSource={categories}
              renderItem={(item: any) => (
                <List.Item 
                
                 onMouseEnter={(event) => handleMouseEnterCategory(event, item)}
                 onMouseLeave={(event) => handleMouseLeaveCategory(event, item)}
                 onClick={() => handleSelectedCategory(item)}>
                  <div className={"item_category"}>
                    <span className={`${item.selected ? 'selected' : ''}`}>
                      <Typography.Text></Typography.Text> {item.category_name}
                    </span>
                    <span  style={{display: item.hidden? 'none' : 'block'}}>
                    <a>
                    <span  style={{marginRight: "10px"}}>
                        <EditOutlined key="edit" onClick={() => handleEditCategoryClick(item)}/>
                      </span>
                    </a>
                    <a>
                    <span onClick={() => handleDeleteCategoryClick(item)}>
                <DeleteOutlined key="delete" />
            </span>
                    </a>
              
                    </span>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>

      <Modal
        title="Kiểm tra ảnh sản phẩm"
        open={isModalOpenCheckProduct}
        width={777}
        afterClose = {handleCancelCheckProduct}
        onOk={handleOkCheckProduct}
        onCancel={handleCancelCheckProduct}
        footer={[
          <Button key="back" onClick={handleCancelCheckProduct}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOkCheckProduct}>
            Kiểm tra
          </Button>,
        ]}
      >
        <p className="text-[#637381] font-normal text-sm">
          Chọn ảnh sản phẩm bất kì để kiểm tra nhận diện sản phẩm
        </p>
        <Dragger {...propUploadCheckProducts} fileList={fileListImage}>
          <p className="ant-upload-drag-icon">
            <PlusOutlined />
          </p>
          <p className="ant-upload-text">Kéo, thả hoặc chọn ảnh để tải lên</p>
        </Dragger>
      </Modal>

      <Modal
        title="Kiểm tra ảnh sản phẩm"
        open={isModelResultProduct}
        width={920}
        onCancel={handleCancelResultCheckProduct}
        footer={null}
      >
        <div style={{marginBottom: "20px",display:'flex'}}>
          <img src={urlImageCheckProductResult} style={{ width: '450px', height: '450px', marginRight: '20px' }} />
          <ObjectDetectionResult
                            imageSrc={urlImageAI}
                            objectBoxes={objectBoxes}
                            labelColors={labelColors} />
        </div>
        
        <div>
          <div>Kết quả kiểm tra hình ảnh:</div>
          <Table dataSource={resultProductCheck} columns={[
                  { title: 'Mã sản phẩm', dataIndex: 'product_code', key: 'product_code' },
                  { title: 'Tên sản phẩm', dataIndex: 'product_name', key: 'product_name' },
                  { title: 'Số lượng', dataIndex: 'product_count', key: 'product_count' },
                ]} pagination={false} />
        </div>
      </Modal>

      <Modal
          width={990}
          title="Thêm sản phẩm từ ERP"
          open={isModalAddProductFromERP}
          onCancel={handleCancelAddProductFromERP}
          footer={false}
        >
          <div className="flex items-center justify-between">
            <FormItemCustom className="w-[320px] border-none pt-4">
              <Input value={searchProductFromERP} onChange={handleSearchProductFromERP}
                placeholder="Tìm kiếm sản phẩm"
                prefix={<SearchOutlined />}
              />
            </FormItemCustom>
            <div>
              <span style={{ marginRight: 8 }}>
                {hasSelected ? `Đã chọn ${productFromERPSelected.length} danh mục` : ""}
              </span>
              <Button type="primary" onClick={handleSaveProductFromERP}>Thêm</Button>
            </div>
          </div>
          <div className="pt-4">
            <TableCustom rowSelection={rowSelectionProductFromERP} columns={[
                { title: "Mã sản phẩm", dataIndex: "item_code", key: "item_code" },
                { title: "Tên sản phẩm", dataIndex: "item_name", key: "item_name" },
                { title: "Danh mục", dataIndex: "item_group", key: "item_group" }
              ]} dataSource={productFromERP} />
          </div>
        </Modal>

      <Modal
        title={"Thêm mới sản phẩm"}
        open={isModalOpenAddProduct}
        onOk={handleOkAddProduct}
        onCancel={handleCancelAddProduct}
        width={1000}
        footer={[
          <Button key="back" onClick={handleCancelAddProduct}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOkAddProduct}>
            Lưu
          </Button>,
        ]}
      >
        <div className="pt-4">
          <Form layout="vertical" form={formAddProduct}>
            <FormItemCustom label="Mã sản phẩm" name="product_code" required>
              <Input />
            </FormItemCustom>
            <FormItemCustom
              className="pt-3"
              label="Barcode"
              name="barcode_product"
              required
            >
              <Input onChange={(event) => handleRenderBarcodeAddProduct(event)}/>
            </FormItemCustom>
            <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "10px",
                  marginTop: "10px",
                  backgroundColor: "#F5F7FA",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: "#d9d9d9",
                  borderRadius: "6px",
                  height: "85px"
                }}
              >
                <svg id="barcode"></svg></div>
            
            <FormItemCustom
              className="pt-3"
              label="Tên sản phẩm"
              name="product_name"
              required
            >
              <Input />
            </FormItemCustom>
            <FormItemCustom className="pt-3" label="Mô tả" name="product_description" required>
              <TextArea className="bg-[#F5F7FA]" autoSize={{ minRows: 3, maxRows: 5 }} />
            </FormItemCustom>
            <FormItemCustom
              className="pt-3"
              label="Hình ảnh"
              name="img"
              required
            >
              <Upload {...propUploadAddProducts}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture-card"
                accept="image/png, image/jpeg"
                fileList={fileList}
                onChange={onChangeImageFormAddProduct}
                onPreview={onPreview}
              >
                {fileList.length < 5 && "+ Upload"}
              </Upload>
            </FormItemCustom>
          </Form>
        </div>
      </Modal>

      <Modal
        title={"Sửa sản phẩm"}
        open={isModelOpenEditProduct}
        onOk={handleOkEditProduct}
        onCancel={handleCancelEditProduct}
        width={1000}
        footer={[
          <Button key="back" onClick={handleCancelEditProduct}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOkEditProduct}>
            Lưu
          </Button>,
        ]}
      >
        <div className="pt-4">
          <Form layout="vertical" form={formEditProduct}>
            <FormItemCustom label="Mã sản phẩm" name="product_code" required>
              <Input />
            </FormItemCustom>
            <FormItemCustom
              className="pt-3"
              label="Barcode"
              name="barcode_product"
              required
            >
              <Input onChange={(event) => handleRenderBarcodeEditProduct(event)}/>
            </FormItemCustom>
            <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "10px",
                  marginTop: "10px",
                  backgroundColor: "#F5F7FA",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: "#d9d9d9",
                  borderRadius: "6px",
                  height: "85px"
                }}
              >
                <svg id="barcode"></svg></div>
            
            <FormItemCustom
              className="pt-3"
              label="Tên sản phẩm"
              name="product_name"
              required
            >
              <Input />
            </FormItemCustom>
            <FormItemCustom className="pt-3" label="Mô tả" name="product_description" required>
              <TextArea className="bg-[#F5F7FA]" autoSize={{ minRows: 3, maxRows: 5 }} />
            </FormItemCustom>
            <FormItemCustom
              className="pt-3"
              label="Hình ảnh"
              name="img"
              required
            >
              <Upload {...propUploadEditProducts}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture-card"
                accept="image/png, image/jpeg"
                fileList={fileListEdit}
                onChange={onChangeImageFormEditProduct}
                onPreview={onPreview}
              >
                 {"+ Upload"}
              </Upload>
            </FormItemCustom>
          </Form>
        </div>
      </Modal>

      <Modal
        title={deleteItemProduct.title}
        open={isModelOpenDeleteProduct}
        onOk={handleDeleteOkProduct}
        onCancel={handleDeleteCancelProduct}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <div>{deleteItemProduct.contentConfirm}</div>
        <div>{deleteItemProduct.contentRemind}</div>
      </Modal>

      <Modal
        title={`Xóa ${productSelected.length} sản phẩm?`}
        open={isModelOpenDeleteList}
        onOk={handleDeleteListOkProduct}
        onCancel={handleDeleteListCancelProduct}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <div>Bạn có chắc muốn xóa {productSelected.length} sản phẩm ra khỏi hệ thống không?</div>
        <div>Khi thực hiện hành động này, sẽ không thể hoàn tác.</div>
      </Modal>

      <Modal
        title={"Thêm mới danh mục"}
        open={isModalOpenAddCategory}
        onOk={handleOkCategory}
        onCancel={handleCancelCategory}
        width={600}
        footer={[
          <Button key="back" onClick={handleCancelCategory}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOkCategory}>
            Lưu
          </Button>,
        ]}
      >
        <div className="pt-4">
          <Form layout="vertical" form={form}>

            <FormItemCustom
              className="pt-3"
              label="Tên danh mục"
              name="name_item"
              required
            >
              <Input />
            </FormItemCustom>
            <FormItemCustom className="pt-3" label="Mô tả" name="des">
              <TextArea className="bg-[#F5F7FA]" autoSize={{ minRows: 3, maxRows: 5 }} />
            </FormItemCustom>
            
          </Form>
        </div>
      </Modal>

      <Modal
        title={"Sửa danh mục"}
        open={isModelOpenEditCategory}
        onOk={handleOkEditCategory}
        onCancel={handleCancelEditCategory}
        width={600}
        footer={[
          <Button key="back" onClick={handleCancelEditCategory}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOkEditCategory}>
            Lưu
          </Button>,
        ]}
      >
        <div className="pt-4">
          <Form layout="vertical" form={formEditCategory}>

            <FormItemCustom
              className="pt-3"
              label="Tên danh mục"
              name="name_item"
              required
            >
              <Input value={editItemCategory.category_name}/>
            </FormItemCustom>
            <FormItemCustom className="pt-3" label="Mô tả" name="des">
              <TextArea className="bg-[#F5F7FA]" autoSize={{ minRows: 3, maxRows: 5 }} value={editItemCategory.category_description}/>
            </FormItemCustom>
            
          </Form>
        </div>
      </Modal>

      <Modal
        title={deleteItemCategory.title}
        open={isModelOpenDeleteCategory}
        onOk={handleDeleteOkCategory}
        onCancel={handleDeleteCancelCategory}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <div>{deleteItemCategory.contentConfirm}</div>
        <div>{deleteItemCategory.contentRemind}</div>
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
          Chọn file excel có định dạng .xlsx để thực hiện nhập dữ liệu. Tải dữ liệu mẫu <a target="_blank" href="/mbw_audit/data_sample/product_sample.xlsx">tại đây</a>
        </p>
        <Dragger {...propUploadImportFileExcel} fileList={fileListImport}>
          <p className="ant-upload-drag-icon">
            <PlusOutlined />
          </p>
          <p className="ant-upload-text">Kéo, thả hoặc chọn tệp để tải lên</p>
        </Dragger>
      </Modal>
    </>
  );
}
