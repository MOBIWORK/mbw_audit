import { LuUploadCloud, LuImport } from "react-icons/lu";
import { VscAdd } from "react-icons/vsc";
import { FormItemCustom, HeaderPage, TableCustom } from "../../components";
import ObjectDetectionResult from "./ObjectDetectionResult";
import * as ExcelJS from "exceljs";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import {
  DeleteOutlined,
  EditOutlined,
  FileProtectOutlined,
  PlusOutlined,
  SearchOutlined,
  VerticalAlignBottomOutlined,
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
  message,
  Image,
} from "antd";
import paths from "../AppConst/path.js";
import { useState, useEffect } from "react";
import Dragger from "antd/es/upload/Dragger";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { UploadFile } from "antd/lib";
import { AxiosService } from "../../services/server";
import "./productsku.css";
import JsBarcode from "jsbarcode";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

interface TypeCategory {
  key: React.Key;
  name: string;
  category_name: string;
  category_description: string;
  owner: string;
  hidden: boolean;
}
interface TypeProduct {
  key: React.Key;
  name: string;
  barcode: string;
  category: string;
  category_name: string;
  product_code: string;
  product_name: string;
  product_description: string;
}
interface TypeProductFromERP {
  key: React.Key;
  name: string;
  image: string;
  description: string;
  item_code: string;
  item_group: string;
  item_name: string;
}

import type { GetProp } from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const apiUrl = paths.apiUrl;
export default function Product_SKU() {
  const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
    "checkbox"
  );
  const [categories, setCategories] = useState<any[]>([]);
  const [searchCategory, setSearchCategory] = useState("");

  const [form] = useForm();
  const [formEditCategory] = useForm();
  const [formAddProduct] = useForm();
  const [formEditProduct] = useForm();

  const [isModalOpenAddProduct, setIsModalOpenAddProduct] = useState(false);
  const [isModalOpenAddCategory, setIsModalOpenAddCategory] = useState(false);
  //item and isShowModel for delete category
  const [deleteItemCategory, setDeleteItemCategory] = useState({});
  const [isModelOpenDeleteCategory, setIsModelOpenDeleteCategory] =
    useState(false);
  //item and isShowModel for edit category
  const [editItemCategory, setEditItemCategory] = useState({});
  const [isModelOpenEditCategory, setIsModelOpenEditCategory] = useState(false);
  const [loadingAddCategory, setLoadingAddCategory] = useState<boolean>(false);
  const [loadingDeleteProduct, setLoadingDeleteProduct] =
    useState<boolean>(false);

  const [loadingEditCategory, setLoadingEditCategory] =
    useState<boolean>(false);

  //biến cho sản phẩm theo danh mục
  const [loadingAddProduct, setLoadingAddProduct] = useState<boolean>(false);
  const [loadingEditProduct, setLoadingEditProduct] = useState<boolean>(false);

  const [loadingCheckProduct, setLoadingCheckProduct] =
    useState<boolean>(false);
  const [loadingAddListProduct, setLoadingAddListProduct] =
    useState<boolean>(false);
  const [loadingImportFileExcelProduct, setLoadingImportFileExcelProduct] =
    useState<boolean>(false);
  const [categorySelected, setCategorySelected] = useState({});
  const [products, setProducts] = useState<any[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [fileUploadAddProduct, setFileUploadAddProduct] = useState([]);
  const [deleteItemProduct, setDeleteItemProduct] = useState({});
  const [isModelOpenDeleteProduct, setIsModelOpenDeleteProduct] =
    useState(false);
  const [editItemProduct, setEditItemProduct] = useState({});
  const [isModelOpenEditProduct, setIsModelOpenEditProduct] = useState(false);
  const [fileUploadEditProduct, setFileUploadEditProduct] = useState([]);
  const [idImageProduct, setIdImageProduct] = useState([]);
  const [idAddImageProduct, setIdAddImageProduct] = useState([]);

  const [barcodeEditProduct, setBarcodeEditProduct] = useState(null);
  const [productSelected, setProductSelected] = useState<DataType[]>([]);
  const [showDeleteList, setShowDeleteList] = useState(false);
  const [isModelOpenDeleteList, setIsModelOpenDeleteList] = useState(false);
  const [isModalOpenCheckProduct, setIsModalOpenCheckProduct] = useState(false);
  const [fileUploadCheckProduct, setFileUploadCheckProduct] = useState([]);
  const [urlImageCheckProductResult, setUrlImageCheckProductResult] =
    useState("");
  const [resultProductCheck, setResultProductCheck] = useState([]);
  const [isModelResultProduct, setIsModelResultProduct] = useState(false);
  const [isModalAddProductFromERP, setIsModalAddProductFromERP] =
    useState(false);
  const [searchProductFromERP, setSearchProductFromERP] = useState("");
  const [productFromERPSelected, setProductFromERPSelected] = useState<any[]>(
    []
  );
  const [productFromERP, setProductFromERP] = useState<any[]>([]);

  const [fileListImage, setFileListImage] = useState<any[]>([]);
  const [urlImageAI, setUrlImageAI] = useState("");
  const [objectBoxes, setObjectBoxes] = useState<any[]>([]);
  const [isModalOpenImportFileExcel, setIsModalOpenImportFileExcel] =
    useState(false);
  let labelColors = {};

  const [lstProductImport, setLstProductImport] = useState([]);
  const [fileListImport, setFileListImport] = useState<UploadFile[]>([]);

  const propUploadImportFileExcel: UploadProps = {
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    multiple: false,
    onRemove: () => {
      setFileListImport([]);
      setLstProductImport([]);
    },
    beforeUpload: async (file) => {
      try {
        const fileName = file.name.toLowerCase();
        if (
          fileName.endsWith(".xls") ||
          fileName.endsWith(".xlsx") ||
          fileName.endsWith(".xlsm") ||
          fileName.endsWith(".xlsb") ||
          fileName.endsWith(".csv") ||
          fileName.endsWith(".ods")
        ) {
          // Xử lý khi là file Excel
          let obj = [
            {
              uid: "-1",
              name: file.name,
              status: "done",
              url: "",
            },
          ];
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
                if (!data[i][2]) {
                  continue; // Bỏ qua dòng không có giá trị cho product_name và chuyển sang dòng tiếp theo
                }
                // Kiểm tra xem product_code và product_name đã tồn tại trong mảng existingProducts chưa

                let objDataImport = {
                  product_code: data[i][0] ? data[i][0] : "",
                  barcode: data[i][1] ? data[i][1] : "",
                  product_name: data[i][2],
                  product_description: data[i][3],
                  url_images: data[i][4]
                    ? JSON.parse(data[i][4].replace("“", '"').replace("”", '"'))
                    : [],
                };
                if (
                  products.some(
                    (product) =>
                      product.product_code === objDataImport.product_code &&
                      product.product_name === objDataImport.product_name
                  )
                ) {
                  continue; // Nếu đã tồn tại thì bỏ qua và chuyển sang dòng tiếp theo
                }
                dataImport.push(objDataImport);
              }
            }
            setLstProductImport(dataImport);
          };
          reader.readAsArrayBuffer(file);
          return false;
        } else {
          // Xử lý khi không phải là file Excel
          message.error(
            "Đã xảy ra lỗi, không đúng định dạng file: xls, xlsx, xlsm, xlsb, csv, ods"
          );
          return false; // Trả về false để ngăn việc tự động tải file
        }
      } catch (error) {
        // Xử lý lỗi ở đây, ví dụ hiển thị thông báo cho người dùng

        message.error(
          "Chưa nhập File hoặc File không chính xác tải dữ liệu mẫu để tiếp tục"
        );
        return false; // Trả về false để ngăn việc tự động tải file
      }
    },
  };
  const propUploadAddProducts: UploadProps = {
    onRemove: (file) => {
      const removedFileName = file.name;
      if (removedFileName) {
        const indexToRemove = idAddImageProduct.indexOf(file.uid);
        setFileUploadAddProduct((prevFileUpload) =>
          prevFileUpload.filter((item, index) => index !== indexToRemove)
        );
        setIdAddImageProduct((prevFileUpload) =>
          prevFileUpload.filter((item, index) => index !== indexToRemove)
        );
      }
    },
    beforeUpload: async (file) => {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".png") ||
        fileName.endsWith(".gif") ||
        fileName.endsWith(".bmp") ||
        fileName.endsWith(".tiff") ||
        fileName.endsWith(".tif")
      ) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error("Dung lượng tệp tải lên phải bé hơn 2MB!");
          return;
        }

        const formData = new FormData();
        const fields = {
          file,
          category_name: categorySelected.name,
        };

        for (const [key, value] of Object.entries(fields)) {
          formData.append(key, value);
        }

        const response = await AxiosService.post(
          "/api/method/mbw_audit.api.api.upload_file_for_product",
          formData
        );

        if (response.message === "ok") {
          setFileUploadAddProduct((prevFileUpload) => [
            ...prevFileUpload,
            response.result.file_url,
          ]);
          setIdAddImageProduct((previdUpload) => [...previdUpload, file.uid]);
          message.success("Tải ảnh thành công");
        } else {
          message.error("Tải ảnh thất bại");
        }
      } else {
        message.error(
          "Tải ảnh thất bại, chỉ chấp nhận các định dạng file ảnh: JPEG, JPG, PNG, GIF, BMP, TIFF, TIF"
        );
        return;
      }

      return false;
    },
  };

  const propUploadEditProducts: UploadProps = {
    onRemove: (file) => {
      // Lấy tên tệp tin từ thuộc tính name của file
      const removedFileName = file.name;
      // Loại bỏ tệp tin có tên trùng khớp khỏi mảng fileUploadAddProduct
      if (removedFileName) {
        const indexToRemove = idImageProduct.indexOf(file.uid);
        setFileUploadEditProduct((prevFileUpload) =>
          prevFileUpload.filter((item, index) => index !== indexToRemove)
        );
        setIdImageProduct((prevFileUpload) =>
          prevFileUpload.filter((item, index) => index !== indexToRemove)
        );
      } else {
        setFileListEdit((prevFileUpload) =>
          prevFileUpload.filter((file) => !file.uid)
        );
      }
    },
    beforeUpload: async (file) => {
      // const isJpgOrPng =
      //   file.type === "image/jpeg" || file.type === "image/png";
      // if (!isJpgOrPng) {
      //   message.error("Bạn chỉ có thể tải lên file định dạng JPG/PNG!");
      //   return isJpgOrPng;
      // }

      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isLt2M) {
      //   message.error("Dung lượng tệp tải lên phải bé hơn 2MB!");
      //   return isLt2M;
      // }
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".png") ||
        fileName.endsWith(".gif") ||
        fileName.endsWith(".bmp") ||
        fileName.endsWith(".tiff") ||
        fileName.endsWith(".tif")
      ) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error("Dung lượng tệp tải lên phải bé hơn 2MB!");
          return;
        }
        const formData = new FormData();
        const fields = {
          file,
          category_name: categorySelected.name,
        };

        for (const [key, value] of Object.entries(fields)) {
          formData.append(key, value);
        }
        const response = await AxiosService.post(
          "/api/method/mbw_audit.api.api.upload_file_for_product",
          formData
        );
        if (response.message == "ok") {
          //fileListUpload.push(response.message);
          setFileUploadEditProduct((prevFileUpload) => [
            ...prevFileUpload,
            response.result.file_url,
          ]);

          setIdImageProduct((previdUpload) => [...previdUpload, file.uid]);
          message.success("Tải ảnh thành công");
        } else {
          message.error("Tải ảnh thất bại");
        }
        return false;
      } else {
        message.error(
          "Tải ảnh thất bại, chỉ chấp nhận các định dạng file ảnh: JPEG, JPG, PNG, GIF, BMP, TIFF, TIF"
        );
      }
    },
  };
  const propUploadCheckProducts: UploadProps = {
    onRemove: () => {
      setFileListImage([]);
      setFileUploadCheckProduct([]);
    },
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    accept: "image/png, image/jpeg",
    beforeUpload: async (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("Bạn chỉ có thể tải lên file định dạng JPG/PNG!");
        return isJpgOrPng;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Dung lượng tệp tải lên phải bé hơn 2MB!");
        return isLt2M;
      }

      const formData = new FormData();
      const fields = {
        file,
      };

      for (const [key, value] of Object.entries(fields)) {
        formData.append(key, value);
      }
      const response = await AxiosService.post(
        "/api/method/mbw_audit.api.api.upload_file_for_checking",
        formData
      );
      if (response.message == "ok") {
        //fileListUpload.push(response.message);
        let listFile = [];
        let obj = {
          uid: "-1",
          name: response.result.date_time,
          status: "done",
          url: response.result.file_url,
        };
        listFile.push(obj);
        setFileListImage(listFile);
        setFileUploadCheckProduct((prevFileUpload) => [
          ...prevFileUpload,
          response.result.file_url,
        ]);
        message.success("Tải ảnh thành công");
      } else {
        message.error("Tải ảnh thất bại");
      }
      return false;
    },
  };
  const columnProducts: TableColumnsType<DataType> = [
    {
      title: "Mã Sản phẩm",
      dataIndex: "product_code",
      render: (text: string, record: any) => (
        <a href="javascript:;" onClick={() => handleClickEditProduct(record)}>
          {text}
        </a>
      ),
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
        <>
          <EditOutlined
            className="mr-4"
            onClick={() => handleClickEditProduct(record)}
          />
          <DeleteOutlined onClick={() => handleClickDeleteProduct(record)} />
        </>
      ),
    },
  ];

  const rowSelectionProduct = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setProductSelected(selectedRows);
      if (selectedRows.length > 0) setShowDeleteList(true);
      else setShowDeleteList(false);
    },
  };

  //Các hàm xử lý danh mục
  const fetchDataCategories = async () => {
    try {
      //setLoading(true);
      let urlCategory = '/api/resource/VGM_Category?fields=["*"]';
      if (searchCategory != null && searchCategory != "") {
        let filterComand = `[["category_name", "like", "%${searchCategory}%"]]`;
        urlCategory += `&filters=${filterComand}`;
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
              hidden: true,
              selected: false,
            };
          }
        );
        dataCategories = sortAlphabet(dataCategories, "category_name");
        // Thiết lập selected cho phần tử đầu tiên (nếu có)
        if (dataCategories.length > 0) {
          dataCategories[0].selected = true;
        }
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
  };
  const sortAlphabet = (arr, field) => {
    return arr.sort((a, b) => {
      if (a[field] && b[field]) {
        return a[field].localeCompare(b[field]);
      }
      return 0;
    });
  };
  const handleMouseEnterCategory = (event, item) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.key === item.key) {
          return { ...category, hidden: false };
        }
        return category;
      })
    );
  };

  const handleMouseLeaveCategory = (event, item) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.key === item.key) {
          return { ...category, hidden: true };
        }
        return category;
      })
    );
  };

  const handleDeleteCategoryClick = (item) => {
    let itemModel = {
      item: item,
      title: "Xóa " + item.category_name,
      contentConfirm:
        "Bạn có chắc muốn xóa " +
        item.category_name +
        " ra khỏi hệ thống không?",
      contentRemind: "Khi thực hiện hành động này, sẽ không thể hoàn tác.",
    };
    setDeleteItemCategory(itemModel);
    setIsModelOpenDeleteCategory(true);
  };

  const handleDeleteOkCategory = async () => {
    if (deleteItemCategory != null && deleteItemCategory.item != null) {
      let arrIdDelete = [];
      arrIdDelete = [deleteItemCategory.item.name];
      let urlDeleteByList = apiUrl + ".api.deleteListByDoctype";
      let dataDeletePost = {
        doctype: "VGM_Category",
        items: JSON.stringify(arrIdDelete),
      };
      let res = await AxiosService.post(urlDeleteByList, dataDeletePost);
      if (
        res != null &&
        res.message != null &&
        res.message.status == "success"
      ) {
        message.success("Xóa thành công");
        fetchDataCategories();
        handleDeleteCancelCategory();
      } else {
        message.error("Xóa thất bại, Danh mục này đang được sử dụng");
      }
    }
  };

  const handleDeleteCancelCategory = () => {
    setIsModelOpenDeleteCategory(false);
    setDeleteItemCategory({});
  };

  const handleEditCategoryClick = (item) => {
    formEditCategory.setFieldsValue({
      name_item: item.category_name,
      des: item.category_description,
    });
    setEditItemCategory(item);
    setIsModelOpenEditCategory(true);
  };

  const handleOkEditCategory = async () => {
    setLoadingEditCategory(true);
    let objCategory = formEditCategory.getFieldsValue();
    // Kiểm tra xem trường name_item có tồn tại và có được nhập liệu không
    if (!objCategory.hasOwnProperty("name_item") || !objCategory.name_item) {
      message.warning("Vui lòng nhập tên danh mục.");
      setLoadingEditCategory(false);
      return;
    }
    const categoryName = objCategory.name_item.trim();
    if (!categoryName) {
      message.warning("Vui lòng nhập tên danh mục.");
      return;
    } else {
    }
    const isCategoryExists = categories.some(
      (cat) =>
        cat.category_name.toLowerCase() === categoryName.toLowerCase() &&
        cat.category_name !== editItemCategory.category_name
    );
    // Kiểm tra xem danh mục đã tồn tại trong mảng category hay không
    if (isCategoryExists) {
      message.error("Danh mục đã tồn tại.");
      setLoadingEditCategory(false);
      return;
    }
    if (editItemCategory != null && editItemCategory.name != null) {
      let urlPutCategory = `/api/resource/VGM_Category/${editItemCategory.name}`;
      let dataPut = {
        category_name: objCategory.name_item,
        category_description: objCategory.des,
      };
      let res = await AxiosService.put(urlPutCategory, dataPut);
      if (res != null && res.data != null) {
        message.success("Sửa thành công");
        setLoadingEditCategory(false);
        fetchDataCategories();
        handleCancelEditCategory();
      } else {
        message.error("Sửa thất bại");
        setLoadingEditCategory(false);
      }
    }
  };

  const handleCancelEditCategory = () => {
    setEditItemCategory({});
    setIsModelOpenEditCategory(false);
  };

  const showModalCategory = () => {
    setIsModalOpenAddCategory(true);
  };

  const handleOkCategory = async () => {
    setLoadingAddCategory(true);
    const valField = form.getFieldsValue();
    // Kiểm tra xem trường name_item có tồn tại và có được nhập liệu không
    if (!valField.hasOwnProperty("name_item") || !valField.name_item) {
      message.warning("Vui lòng nhập tên danh mục.");
      setLoadingAddCategory(false);
      return;
    }
    const categoryName = valField.name_item.trim();
    if (!categoryName) {
      message.warning("Vui lòng nhập tên danh mục.");
      return;
    } else {
    }
    // Kiểm tra xem danh mục đã tồn tại trong mảng category hay không
    const isCategoryExists = categories.some(
      (cat) => cat.category_name.toLowerCase() === categoryName.toLowerCase()
    );
    if (isCategoryExists) {
      message.error("Danh mục đã tồn tại.");
      setLoadingAddCategory(false);
      return;
    }
    if (categoryName.length > 25) {
      message.error("Tên danh mục không được vượt quá 25 ký tự.");
      setLoadingAddCategory(false);
      return;
    }
    try {
      const dataPost = {
        doc: JSON.stringify({
          doctype: "VGM_Category",
          category_name: categoryName,
          category_description: valField.des,
        }),
        action: "Save",
      };

      const resCreateCategory = await AxiosService.post(
        "/api/method/frappe.desk.form.save.savedocs",
        dataPost
      );
      if (
        resCreateCategory &&
        resCreateCategory.docs &&
        resCreateCategory.docs.length > 0
      ) {
        form.resetFields();
        message.success("Thêm mới thành công");
        setLoadingAddCategory(false);
        fetchDataCategories();
        setIsModalOpenAddCategory(false);
      } else {
        message.error("Thêm mới thất bại");
        setLoadingAddCategory(false);
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi thêm mới danh mục.");
    }
  };

  const handleCancelCategory = () => {
    setIsModalOpenAddCategory(false);
    setLoadingAddCategory(false);
  };

  //Các hàm xử lý danh sách sản phẩm
  const handleSelectedCategory = (item) => {
    setCategorySelected(item);
    setCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.key === item.key) {
          return { ...category, selected: true };
        } else {
          return { ...category, selected: false };
        }
      })
    );
  };

  useEffect(() => {
    initDataProductByCategory();
  }, [categorySelected]);

  useEffect(() => {
    if (barcodeEditProduct != null && barcodeEditProduct != "")
      renderBarcodeByValue(barcodeEditProduct);
  }, [barcodeEditProduct]);

  useEffect(() => {
    initDataProductByCategory();
  }, [searchProduct]);

  const initDataProductByCategory = async () => {
    let urlProducts = "";
    if (searchProduct != null && searchProduct != "") {
      urlProducts = `/api/resource/VGM_Product?fields=["*"]&filters=[["category","=","${categorySelected.name}"],["product_name","like","%${searchProduct}%"]]`;
    } else {
      urlProducts = `/api/resource/VGM_Product?fields=["*"]&filters=[["category","=","${categorySelected.name}"]]`;
    }
    let res = await AxiosService.get(urlProducts);
    if (res && res.data) {
      // Thêm key cho mỗi phần tử trong mảng, sử dụng trường 'name'
      let dataProducts: TypeProduct[] = res.data.map((item: TypeProduct) => {
        return {
          ...item,
          key: item.name,
          category_name: categorySelected.category_name,
        };
      });
      dataProducts = sortAlphabet(dataProducts, "product_name");
      setProducts(dataProducts);
    }
  };

  const onChangeFilterProduct = (event) => {
    setSearchProduct(event.target.value);
  };

  const showModalAddProduct = () => {
    formAddProduct.resetFields();
    setFileList([]);
    setLoadingAddProduct(false);
    let barcode = document.getElementById("barcode");
    if (barcode) {
      barcode.innerHTML = "";
    }
    if (categorySelected != null && categorySelected.name != null) {
      setIsModalOpenAddProduct(true);
    }
  };
  const isBarcodeValid = (barcode) => {
    // Sử dụng biểu thức chính quy để kiểm tra xem barcode có chứa ký tự tiếng Việt không
    const vietnameseRegex =
      /[\u00C0-\u1EF9\u1EFB-\u1F01\u1F03-\u1F57\u1F59-\u1F5B\u1F5D-\u1F5F\u1F60-\u1FC1\u1FC3-\u1FF9\u1FFB-\u1FFF]/;

    return !vietnameseRegex.test(barcode);
  };

  const handleRenderBarcodeAddProduct = (event) => {
    renderBarcodeByValue(event.target.value);
  };

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
      product_description: item.product_description,
    });
    setBarcodeEditProduct(item.barcode);
    let arrImage = JSON.parse(item.images);
    let arrImageEdit = [];
    for (let i = 0; i < arrImage.length; i++) {
      let objImage = {
        uid: i,
        url: arrImage[i], //import.meta.env.VITE_BASE_URL
        url_base: arrImage[i],
      };
      arrImageEdit.push(objImage);
    }
    setFileListEdit(arrImageEdit);
  };

  const handleRenderBarcodeEditProduct = (event) => {
    renderBarcodeByValue(event.target.value);
  };

  const renderBarcodeByValue = (val) => {
    JsBarcode("#barcode", val, {
      width: 4,
      height: 40,
      displayValue: true,
      font: "Arial",
      text: val,
      textMargin: 10,
      fontSize: 13,
      background: "#F5F7FA",
    });
  };
  const handleOkAddProduct = async () => {
    setLoadingAddProduct(true);
    let objProduct = formAddProduct.getFieldsValue();

    // Kiểm tra mã sản phẩm
    if (objProduct.product_code) {
      let productFilter = products.filter(
        (x) =>
          x.product_code.toLowerCase() === objProduct.product_code.toLowerCase()
      );
      if (productFilter.length > 0) {
        message.error("Mã sản phẩm đã tồn tại");
        setLoadingAddProduct(false);
        return;
      }
    }

    let arrImages = [];
    for (let i = 0; i < fileUploadAddProduct.length; i++) {
      arrImages.push(fileUploadAddProduct[i]);
    }
    // Kiểm tra và gán giá trị cho barcode
    if (!objProduct.barcode_product || objProduct.barcode_product === "") {
      objProduct.barcode_product = objProduct.product_code; // Gán mã sản phẩm cho barcode nếu barcode không tồn tại hoặc rỗng
    }
    // Kiểm tra mã vạch
    if (!isBarcodeValid(objProduct.barcode_product)) {
      message.error("Barcode không được chứa ký tự tiếng Việt");
      setLoadingAddProduct(false);
      return;
    }
    // Kiểm tra xem người dùng đã nhập đủ thông tin hay chưa
    if (!objProduct.product_name || arrImages.length === 0) {
      // Hiển thị thông báo lỗi
      message.error(
        "Vui lòng nhập tên sản phẩm và tải lên ít nhất một hình ảnh"
      );
      setLoadingAddProduct(false);
      return;
    }

    let urlAddProduct = "/api/resource/VGM_Product";
    let objProductCreate = {
      barcode: objProduct.barcode_product,
      product_code:
        objProduct.product_code != null ? objProduct.product_code.trim() : null,
      product_name:
        objProduct.product_name != null ? objProduct.product_name.trim() : null,
      product_description:
        objProduct.product_description != null
          ? objProduct.product_description.trim()
          : null,
      category: categorySelected.name,
      images: JSON.stringify(arrImages),
    };

    let res = await AxiosService.post(urlAddProduct, objProductCreate);
    if (res != null && res.data != null) {
      message.success("Thêm mới thành công");
      setLoadingAddProduct(false);
      formAddProduct.resetFields();
      let barcode = document.getElementById("barcode");
      barcode.innerHTML = "";
      setFileUploadAddProduct([]);
      setIdAddImageProduct([]);
      initDataProductByCategory();
      handleCancelAddProduct();
    } else {
      message.error("Thêm mới thất bại");
      setLoadingAddProduct(false);
    }
  };
  const handleOkEditProduct = async () => {
    setLoadingEditProduct(true);
    let arrImage = [];
    let objProduct = formEditProduct.getFieldsValue();
    // Kiểm tra và gán giá trị cho barcode
    if (!objProduct.barcode_product || objProduct.barcode_product === "") {
      objProduct.barcode_product = objProduct.product_code; // Gán mã sản phẩm cho barcode nếu barcode không tồn tại hoặc rỗng
    }
    // Kiểm tra mã sản phẩm
    if (objProduct.product_code) {
      let productFilter = products.filter(
        (x) =>
          x.product_code.toLowerCase() === objProduct.product_code.toLowerCase() && x.product_code.toLowerCase() !== editItemProduct.product_code.toLowerCase()
      );
      if (productFilter.length > 0) {
        message.error("Mã sản phẩm đã tồn tại");
        setLoadingEditProduct(false);
        return;
      }
    }
    if (!isBarcodeValid(objProduct.barcode_product)) {
      message.error("Barcode không được chứa ký tự tiếng Việt");
      setLoadingEditProduct(false);
      return;
    }
    // Lặp qua mảng fileListEdit và thêm các URL hình ảnh vào arrImage
    for (let i = 0; i < fileListEdit.length; i++) {
      // Kiểm tra nếu có URL và không phải là null hoặc rỗng
      if (
        fileListEdit[i].url_base &&
        fileListEdit[i].url_base !== null &&
        fileListEdit[i].url_base !== ""
      ) {
        arrImage.push(fileListEdit[i].url_base);
      }
    }
    // Kiểm tra và thêm các URL hình ảnh từ fileUploadEditProduct vào arrImage
    if (fileUploadEditProduct !== null) {
      for (let i = 0; i < fileUploadEditProduct.length; i++) {
        arrImage.push(fileUploadEditProduct[i]);
      }
    }
    let urlEditProduct = `/api/resource/VGM_Product/${editItemProduct.name}`;
    let objProductEdit = {
      barcode: objProduct.barcode_product,
      product_code:
        objProduct.product_code != null ? objProduct.product_code.trim() : null,
      product_name:
        objProduct.product_name != null ? objProduct.product_name.trim() : null,
      product_description:
        objProduct.product_description != null
          ? objProduct.product_description.trim()
          : null,
      category: categorySelected.name,
      images: JSON.stringify(arrImage),
    };
    let res = await AxiosService.put(urlEditProduct, objProductEdit);
    if (res != null && res.data != null) {
      message.success("Sửa thành công");
      setLoadingEditProduct(false);
      formEditProduct.resetFields();
      let barcode = document.getElementById("barcode");
      barcode.innerHTML = "";
      setFileUploadEditProduct([]);
      setIdImageProduct([]);
      initDataProductByCategory();
      handleCancelEditProduct();
    } else {
      message.error("Sửa thất bại");
      setLoadingEditProduct(false);
    }
  };

  const handleCancelEditProduct = () => {
    setIsModelOpenEditProduct(false);
    setLoadingEditProduct(false);
  };

  const handleClickDeleteProduct = (item) => {
    let itemDeleteProduct = {
      item: item,
      title: `Xóa ${item.product_name}`,
      contentConfirm: `Bạn có chắc muốn xóa ${item.product_name} ra khỏi hệ thống không?`,
      contentRemind: "Khi thực hiện hành động này, sẽ không thể hoàn tác.",
    };
    setDeleteItemProduct(itemDeleteProduct);
    setIsModelOpenDeleteProduct(true);
  };

  const handleDeleteOkProduct = async () => {
    let arrIdDelete = [];
    try {
      setLoadingDeleteProduct(true);
      arrIdDelete = [deleteItemProduct.item.name];
      let urlDeleteByList = apiUrl + ".api.deleteListByDoctype";
      let dataDeletePost = {
        doctype: "VGM_Product",
        items: JSON.stringify(arrIdDelete),
      };
      let res = await AxiosService.post(urlDeleteByList, dataDeletePost);
      if (
        res != null &&
        res.message != null &&
        res.message.status == "success"
      ) {
        message.success("Xóa thành công");
        setDeleteItemProduct({});
        initDataProductByCategory();
        setLoadingDeleteProduct(false);
        handleDeleteCancelProduct();
      } else {
        message.error("Xóa thất bại , Sản phẩm đang được sử dụng");
        setLoadingDeleteProduct(false);
      }
    } catch (error) {
      message.error("Xóa thất bại,Có lỗi xảy ra khi xóa sản phẩm");
      setLoadingDeleteProduct(false);
    }
  };

  const handleDeleteCancelProduct = () => {
    setIsModelOpenDeleteProduct(false);
  };

  const handleDeleteByList = () => {
    setIsModelOpenDeleteList(true);
  };

  const handleDeleteListOkProduct = async () => {
    try {
      let urlDeleteByList = apiUrl + ".api.deleteListByDoctype";
      let arrIdDelete = [];
      for (let i = 0; i < productSelected.length; i++)
        arrIdDelete.push(productSelected[i].name);
      let dataDeletePost = {
        doctype: "VGM_Product",
        items: JSON.stringify(arrIdDelete),
      };

      let res = await AxiosService.post(urlDeleteByList, dataDeletePost);

      if (
        res != null &&
        res.message != null &&
        res.message.status == "success"
      ) {
        message.success("Xóa thành công");
        setProductSelected([]);
        setShowDeleteList(false);
        initDataProductByCategory();
        handleDeleteListCancelProduct();
      } else {
        message.error("Xóa thất bại, có sản phẩm đã tồn tại trong báo cáo");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  const handleDeleteListCancelProduct = () => {
    setIsModelOpenDeleteList(false);
  };

  const showModalCheckProduct = () => {
    setIsModalOpenCheckProduct(true);
  };

  const handleOkCheckProduct = async () => {
    if (products.length == 0) {
      message.error("Chưa thêm thêm sản phẩm cho danh mục này");
      setLoadingCheckProduct(false);
      return;
    }
    if (fileUploadCheckProduct.length == 0) {
      message.error("Chưa thêm hình ảnh nhận diện");
      setLoadingCheckProduct(false);
      return;
    } else {
      setLoadingCheckProduct(true);
      let urlCheckProduct = apiUrl + ".api.checkImageProductExist";
      let objCheckProduct = {
        collection_name: categorySelected.name,
        linkimages:
          fileUploadCheckProduct.length > 0
            ? fileUploadCheckProduct[fileUploadCheckProduct.length - 1]
            : "",
      };

      let res = await AxiosService.post(urlCheckProduct, objCheckProduct);
      let arrProductDetect = [];
      for (let i = 0; i < products.length; i++) {
        arrProductDetect.push({
          key: products[i].name,
          product_code: products[i].product_code,
          product_name: products[i].product_name,
          product_count: 0,
        });
      }
      if (res != null && res.message != null) {
        if (res.message.status == "failed") {
          setLoadingCheckProduct(false);
          message.error("Không thể kiểm tra ảnh sản phẩm");
        } else {
          if (res.message.results.verbose[0]) {
            setUrlImageAI(res.message.results.verbose[0]);
          }

          // setUrlImageAI(
          //   "data:image/png;base64," +
          //     res.message.results.verbose[0].base64_image
          // );
          // let arrBoxes = [];
          arrProductDetect.forEach((item) => {
            if (res.message.results.count[item.product_name] != null)
              item.product_count = res.message.results.count[item.product_name];
            // let locates = res.message.results.verbose[0].locates;

            // Lọc các đối tượng có trường label bằng giá trị của item.product_name
            // let locatesWithLabel = locates.filter(function (obj) {
            //   return obj.label === item.product_name;
            // });
            // let newObjectBoxes = locatesWithLabel.map(function (box) {
            //   let bbox = box.bbox;
            //   return {
            //     x: bbox[0],
            //     y: bbox[1],
            //     width: bbox[2] - bbox[0],
            //     height: bbox[3] - bbox[1],
            //     label: box.label,
            //   };
            // });
            // arrBoxes = arrBoxes.concat(newObjectBoxes);
          });
          //setObjectBoxes(arrBoxes);
        }
      }

      setUrlImageCheckProductResult(
        fileUploadCheckProduct.length > 0
          ? fileUploadCheckProduct[fileUploadCheckProduct.length - 1]
          : ""
      ); //import.meta.env.VITE_BASE_URL+
      setLoadingCheckProduct(false);
      setResultProductCheck(arrProductDetect);
      setIsModelResultProduct(true);
      handleCancelCheckProduct();
    }
  };
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
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
    setFileUploadCheckProduct([]);
    setFileListImage([]);
    setLoadingCheckProduct(false);
    setIsModalOpenCheckProduct(false);
  };

  const handleCancelResultCheckProduct = () => {
    setIsModelResultProduct(false);
    setFileListImage([]);
    setFileUploadCheckProduct([]);
  };

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileListEdit, setFileListEdit] = useState<UploadFile[]>([]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [previewOpenEdit, setPreviewOpenEdit] = useState(false);
  const [previewImageEdit, setPreviewImageEdit] = useState("");

  const onChangeImageFormAddProduct: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
  };
  const onChangeImageFormEditProduct: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileListEdit(newFileList);
  };
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const onPreviewEdit = async (file: UploadFile) => {
    // let src = file.url as string;
    // if (!src) {
    //   src = await new Promise((resolve) => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file.originFileObj as FileType);
    //     reader.onload = () => resolve(reader.result as string);
    //   });
    // }
    // const image = new Image();
    // image.src = src;
    // const imgWindow = window.open(src);
    // imgWindow?.document.write(image.outerHTML);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImageEdit(file.url || (file.preview as string));
    setPreviewOpenEdit(true);
  };
  const onPreviewAdd = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleAddProductFromERP = () => {
    setIsModalAddProductFromERP(true);
  };

  const handleCancelAddProductFromERP = () => {
    setIsModalAddProductFromERP(false);
  };

  const handleSearchProductFromERP = (event) => {
    setSearchProductFromERP(event.target.value);
  };
  const handleCancelImportExcel = () => {
    setIsModalOpenImportFileExcel(false);
    setFileListImport([]);
  };

  useEffect(() => {
    //Goi dich vu san pham tu erp theo tu khoa
    initDataProductFromERP();
  }, [searchProductFromERP]);

  const hasSelected = productFromERPSelected.length > 0;
  const onSelectChangeProductERP = (
    newSelectedRowKeys: React.Key[],
    selectedRow: TypeProductFromERP[]
  ) => {
    setProductFromERPSelected(selectedRow);
  };

  const rowSelectionProductFromERP = {
    productFromERPSelected,
    onChange: onSelectChangeProductERP,
  };
  const initDataProductFromERP = async () => {
    //Goi dich vu lay danh sach san pham tu erp
    let url = "/api/method/mbw_dms.api.selling.product.list_product";
    // if (searchProductFromERP != null && searchProductFromERP != "")
    //url = `${url}?item_name=${searchProductFromERP.trim()}`;
    let res = await AxiosService.get(url);
    let arrProductERPSource = [];
    if (res != null && res.result != null && res.result.data != null) {
      arrProductERPSource = res.result.data.map((item: TypeProductFromERP) => {
        return {
          ...item,
          key: item.name,
        };
      });
    }
    if (searchProductFromERP != null && searchProductFromERP.trim() !== "") {
      arrProductERPSource = arrProductERPSource.filter((item) =>
        item.item_name
          .toLowerCase()
          .includes(searchProductFromERP.toLowerCase())
      );
    }
    setProductFromERP(arrProductERPSource);
  };

  const handleSaveProductFromERP = async () => {
    //Goi dich vu luu san pham tu erp
    setLoadingAddListProduct(true);
    let arrProductPost = [];
    for (let i = 0; i < productFromERPSelected.length; i++) {
      let itemProduct = {
        product_code: productFromERPSelected[i].item_code,
        barcode: productFromERPSelected[i].item_code,
        product_name: productFromERPSelected[i].item_name,
        product_description: productFromERPSelected[i].description,
        url_images:
          productFromERPSelected[i].image != null &&
          productFromERPSelected[i].image != ""
            ? [productFromERPSelected[i].image]
            : [],
      };
      arrProductPost.push(itemProduct);
    }
    let dataPost = {
      listproduct: JSON.stringify(arrProductPost),
      category: categorySelected.name,
    };
    let urlPostData = apiUrl + ".api.import_product";
    let res = await AxiosService.post(urlPostData, dataPost);
    if (res != null && res.message != null && res.message.status == "success") {
      message.success("Thêm mới thành công");
      setLoadingAddListProduct(false);
      setProductFromERPSelected([]);
      initDataProductByCategory();
      handleCancelAddProductFromERP();
    } else {
      message.error("Thêm mới thất bại");
      setLoadingAddListProduct(false);
    }
  };
  const handleImportFileProduct = () => {
    setIsModalOpenImportFileExcel(true);
    setFileListImport([]);
  };
  const handleOkImportExcel = async () => {
    if (lstProductImport && lstProductImport.length > 0) {
      setLoadingImportFileExcelProduct(true);
      let dataPost = {
        listproduct: JSON.stringify(lstProductImport),
        category: categorySelected.name,
      };
      let urlPostData = apiUrl + ".api.import_product";
      let res = await AxiosService.post(urlPostData, dataPost);
      if (
        res != null &&
        res.message != null &&
        res.message.status == "success"
      ) {
        message.success("Thêm mới thành công");
        setLoadingImportFileExcelProduct(false);
        initDataProductByCategory();
        setIsModalOpenImportFileExcel(false);
      } else {
        message.error("Thêm mới thất bại");
        setLoadingImportFileExcelProduct(false);
      }
    } else {
      message.error("Danh sách sản phẩm đã tồn tại hoặc File không chính xác");
    }
  };
  const exportExcelCheckImage = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Sheet1");

    sheet.properties.defaultColWidth = 20;
    sheet.getColumn("A").width = 30;
    sheet.mergeCells("A2:J2");
    sheet.getCell("A2").value = "Kiểm tra ảnh sản phẩm";
    sheet.getCell("A2").style = {
      font: { bold: true, name: "Times New Roman", size: 12 },
    };
    sheet.getCell("A2").alignment = { vertical: "middle", horizontal: "left" };
    let rowHeader = sheet.getRow(4);
    let rowHeader_Next = sheet.getRow(5);
    // Thêm dữ liệu cột
    let fieldsMerge = [
      { title: "Mã sản phẩm", field: "product_code" },
      { title: "Tên sản phẩm", field: "product_name" },
      { title: "Số lượng", field: "product_count" },
    ];
    for (let i = 0; i < fieldsMerge.length; i++) {
      let cellStart = rowHeader.getCell(i + 1);
      let cellEnd = rowHeader_Next.getCell(i + 1);
      sheet.mergeCells(`${cellStart._address}:${cellEnd._address}`);
      rowHeader.getCell(i + 1).style = {
        font: { bold: true, name: "Times New Roman", size: 12, italic: true },
      };
      rowHeader.getCell(i + 1).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      rowHeader.getCell(i + 1).value = fieldsMerge[i].title;
    }
    for (let i = 0; i < resultProductCheck.length; i++) {
      let rowStart = 6;
      let row = sheet.getRow(i + rowStart);
      let cellStart = 1;
      for (let j = 0; j < fieldsMerge.length; j++) {
        row.getCell(cellStart).style = {
          font: { name: "Times New Roman", size: 12, italic: true },
        };
        let valCell = "";
        valCell = resultProductCheck[i][fieldsMerge[j].field];

        row.getCell(cellStart).value = valCell;
        cellStart += 1;
      }
    }
    // sheet.columns = columns;

    // // Thêm dữ liệu từ bảng vào file Excel
    // resultProductCheck.forEach((row, index) => {
    //   sheet.addRow({
    //     product_code: row.product_code,
    //     product_name: row.product_name,
    //     product_count: row.product_count,
    //   });
    // });
    // Lưu file Excel
    const buffer = await workbook.xlsx.writeBuffer();
    saveAsExcelFile(buffer, "report_check_image");
  };
  const saveAsExcelFile = (buffer: any, fileName: string) => {
    let EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    let EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  };
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
            action: handleDeleteByList,
          },
          {
            label: "Nhập file",
            icon: <LuUploadCloud className="text-xl" />,
            size: "20px",
            className:
              "flex items-center mr-2 text-[#1877F2] border-solid border-[#1877F2]",
            action: handleImportFileProduct,
          },
          {
            label: "Thêm sản phẩm từ ERP",
            icon: <VscAdd className="text-xl" />,
            size: "20px",
            className:
              "flex items-center mr-2 text-[#1877F2] border-solid border-[#1877F2]",
            action: handleAddProductFromERP,
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
          <div className="bg-white rounded-xl border-[#DFE3E8] border-[0.2px] border-solid">
            <FormItemCustom className="w-[320px] border-none p-4">
              <Input
                value={searchProduct}
                onChange={onChangeFilterProduct}
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
          <div className="bg-white rounded-xl p-4 border-[#DFE3E8] border-[0.2px] border-solid">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-base leading-5 font-medium text-[#212B36]">
                  Danh mục
                </p>
              </div>
              <div className="cursor-pointer" onClick={showModalCategory}>
                <PlusOutlined />
              </div>
            </div>
            <div className="py-3">
              <FormItemCustom
                className="w-full border-none"
                name="filter_category"
              >
                <Input
                  onChange={onChangeFilterCategory}
                  value={searchCategory}
                  placeholder="Tìm kiếm danh mục"
                  prefix={<SearchOutlined />}
                />
              </FormItemCustom>
            </div>
            <List
              style={{
                maxHeight: "calc(100vh - 500px)",
                overflow: "auto",
                paddingRight: "10px",
              }}
              header={false}
              footer={false}
              bordered={false}
              dataSource={categories}
              renderItem={(item: any) => (
                <List.Item
                  onMouseEnter={(event) =>
                    handleMouseEnterCategory(event, item)
                  }
                  onMouseLeave={(event) =>
                    handleMouseLeaveCategory(event, item)
                  }
                  onClick={() => handleSelectedCategory(item)}
                >
                  <div className={"item_category"}>
                    <span className={`${item.selected ? "selected" : ""}`}>
                      <Typography.Text></Typography.Text> {item.category_name}
                    </span>
                    <span style={{ display: item.hidden ? "none" : "block" }}>
                      <span style={{ marginRight: "10px" }}>
                        <EditOutlined
                          key="edit"
                          onClick={() => handleEditCategoryClick(item)}
                        />
                      </span>

                      <span onClick={() => handleDeleteCategoryClick(item)}>
                        <DeleteOutlined key="delete" />
                      </span>
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
        afterClose={handleCancelCheckProduct}
        onOk={handleOkCheckProduct}
        onCancel={handleCancelCheckProduct}
        footer={[
          <Button key="back" onClick={handleCancelCheckProduct}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOkCheckProduct}
            loading={loadingCheckProduct}
          >
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "20px",
          }}
        >
          {/* Cột 1: Hình ảnh sản phẩm */}
          <div style={{ flex: 1, marginRight: "10px" }}>
            <h3 style={{ textAlign: "center" }}>Hình ảnh sản phẩm</h3>
            <Image.PreviewGroup>
              <Image
                key="1"
                style={{ width: "100%", height: "auto" }} // Set width to 100% and let height adjust automatically
                src={urlImageCheckProductResult}
              />
            </Image.PreviewGroup>
          </div>

          {/* Cột 2: Hình ảnh AI */}
          <div style={{ flex: 1, marginLeft: "10px" }}>
            <h3 style={{ textAlign: "center" }}>Hình ảnh AI</h3>
            <Image.PreviewGroup>
              <Image
                key="2"
                style={{ width: "100%", height: "auto" }} // Set width to 100% and let height adjust automatically
                src={urlImageAI}
              />
            </Image.PreviewGroup>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Kết quả kiểm tra hình ảnh:</span>
            <Button
              type="primary"
              onClick={exportExcelCheckImage}
              icon={<VerticalAlignBottomOutlined />}
            >
              Xuất dữ liệu
            </Button>
          </div>
          <Table
            dataSource={resultProductCheck}
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
              {
                title: "Số lượng",
                dataIndex: "product_count",
                key: "product_count",
              },
            ]}
            pagination={false}
            scroll={{ y: resultProductCheck.length > 5 ? 350 : undefined }}
          />
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
            <Input
              value={searchProductFromERP}
              onChange={handleSearchProductFromERP}
              placeholder="Tìm kiếm sản phẩm"
              prefix={<SearchOutlined />}
            />
          </FormItemCustom>
          <div>
            <span style={{ marginRight: 8 }}>
              {hasSelected
                ? `Đã chọn ${productFromERPSelected.length} sản phẩm`
                : ""}
            </span>
            <Button
              type="primary"
              onClick={handleSaveProductFromERP}
              loading={loadingAddListProduct}
            >
              Thêm
            </Button>
          </div>
        </div>
        <div className="pt-4">
          <TableCustom
            rowSelection={rowSelectionProductFromERP}
            columns={[
              {
                title: "Mã sản phẩm",
                dataIndex: "item_code",
                key: "item_code",
              },
              {
                title: "Tên sản phẩm",
                dataIndex: "item_name",
                key: "item_name",
              },
              { title: "Danh mục", dataIndex: "item_group", key: "item_group" },
            ]}
            dataSource={productFromERP}
          />
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
          <Button
            key="submit"
            type="primary"
            onClick={handleOkAddProduct}
            loading={loadingAddProduct}
          >
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
              <Input
                onChange={(event) => handleRenderBarcodeAddProduct(event)}
              />
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
                height: "85px",
              }}
            >
              <svg id="barcode"></svg>
            </div>

            <FormItemCustom
              className="pt-3"
              label="Tên sản phẩm"
              name="product_name"
              required
            >
              <Input />
            </FormItemCustom>
            <FormItemCustom
              className="pt-3"
              label="Mô tả"
              name="product_description"
              required
            >
              <TextArea
                className="bg-[#F5F7FA]"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </FormItemCustom>
            <FormItemCustom
              className="pt-3"
              label="Hình ảnh"
              name="img"
              required
            >
              <Upload
                {...propUploadAddProducts}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture-card"
                accept="image/png, image/jpeg"
                fileList={fileList}
                onChange={onChangeImageFormAddProduct}
                onPreview={onPreviewAdd}
              >
                {"+ Upload"}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
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
          <Button
            key="submit"
            type="primary"
            onClick={handleOkEditProduct}
            loading={loadingEditProduct}
          >
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
              <Input
                onChange={(event) => handleRenderBarcodeEditProduct(event)}
              />
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
                height: "85px",
              }}
            >
              <svg id="barcode"></svg>
            </div>

            <FormItemCustom
              className="pt-3"
              label="Tên sản phẩm"
              name="product_name"
              required
            >
              <Input />
            </FormItemCustom>
            <FormItemCustom
              className="pt-3"
              label="Mô tả"
              name="product_description"
              required
            >
              <TextArea
                className="bg-[#F5F7FA]"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </FormItemCustom>
            <FormItemCustom
              className="pt-3"
              label="Hình ảnh"
              name="img"
              required
            >
              <Upload
                {...propUploadEditProducts}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture-card"
                accept="image/png, image/jpeg"
                fileList={fileListEdit}
                onChange={onChangeImageFormEditProduct}
                onPreview={onPreviewEdit}
              >
                {"+ Upload"}
              </Upload>
              {previewImageEdit && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpenEdit,
                    onVisibleChange: (visible) => setPreviewOpenEdit(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImageEdit(""),
                  }}
                  src={previewImageEdit}
                />
              )}
            </FormItemCustom>
          </Form>
        </div>
      </Modal>

      <Modal
        title={deleteItemProduct.title}
        open={isModelOpenDeleteProduct}
        onOk={handleDeleteOkProduct}
        onCancel={handleDeleteCancelProduct}
        footer={[
          <Button key="submit" onClick={handleDeleteCancelProduct}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loadingDeleteProduct}
            onClick={handleDeleteOkProduct}
          >
            Xác nhận
          </Button>,
        ]}
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
        <div>
          Bạn có chắc muốn xóa {productSelected.length} sản phẩm ra khỏi hệ
          thống không?
        </div>
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
          <Button
            key="submit"
            type="primary"
            onClick={handleOkCategory}
            loading={loadingAddCategory}
          >
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
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục!" },
                {
                  max: 25,
                  message: "Tên danh mục không được vượt quá 25 ký tự!",
                },
              ]}
            >
              <Input />
            </FormItemCustom>
            <FormItemCustom className="pt-3" label="Mô tả" name="des">
              <TextArea
                className="bg-[#F5F7FA]"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
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
          <Button
            key="submit"
            type="primary"
            onClick={handleOkEditCategory}
            loading={loadingEditCategory}
          >
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
              <Input value={editItemCategory.category_name} />
            </FormItemCustom>
            <FormItemCustom className="pt-3" label="Mô tả" name="des">
              <TextArea
                className="bg-[#F5F7FA]"
                autoSize={{ minRows: 3, maxRows: 5 }}
                value={editItemCategory.category_description}
              />
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
          <Button
            key="submit"
            type="primary"
            onClick={handleOkImportExcel}
            loading={loadingImportFileExcelProduct}
          >
            Lưu lại
          </Button>,
        ]}
      >
        <p className="text-[#637381] font-normal text-sm">
          Chọn file excel có định dạng .xlsx để thực hiện nhập dữ liệu. Tải dữ
          liệu mẫu{" "}
          <a target="_blank" href="/mbw_audit/data_sample/product_sample.xlsx">
            tại đây
          </a>
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
