import { useEffect, useState } from "react";
import "./style.css";
import { AxiosService } from "../../../services/server";
import {Row, Col, Image, Spin, Button, Select, message} from 'antd';
import {LeftOutlined, RightOutlined, LoadingOutlined, CloseOutlined} from "@ant-design/icons";
import CanvasImage from "../canvas_image/view";
import { FormItemCustom } from "../../../components";

export default function ProductLabelling({category, arrImage, backPageEmit, completeProductLabelling}){
    const [lstImage, setLstImage] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState<number>(0);
    const [showActionImage, setShowActionImage] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    const [stateInsertImageContent, setStateInsertImageContent] = useState(0);
    const [lstImageBboxProduct, setLstImageBboxProduct] = useState([]);
    const [optionsProduct, setOptionsProduct] = useState([]);
    const [labelProductSelect, setLabelProductSelect] = useState("");
    const [loadingAssignLabel, setLoadingAssignLabel] = useState(false);

    useEffect(() => {
        renderImageWithBBox();
    }, [arrImage]);

    useEffect(() => {
        renderLabelProduct();
    }, [category]);

    const renderImageWithBBox = async () => {
        setLoadingPage(true);
        if(arrImage.length > 1) setShowActionImage(true);
        else setShowActionImage(false);
        let dataPost = {
            'lst_image': arrImage
        }
        let urlBboxImage = "/api/method/mbw_audit.api.api.get_bbox_by_image";
        const res = await AxiosService.post(urlBboxImage, dataPost);
        if(res.message == "ok"){
            let arrInfoImage = [];
            for(let i = 0; i < res.result.length; i++){
                let locates = res.result[i].locates;
                let objImage = {
                    'url': arrImage[i],
                    'bboxes': locates
                }
                arrInfoImage.push(objImage);
            }
            setLstImage(arrInfoImage);
        }
        setLoadingPage(false);
    }

    const renderLabelProduct = async () => {
        let urlProduct = `api/method/mbw_audit.api.api.get_products_by_category?category=${category}`;
        let res = await AxiosService.get(urlProduct);
        if(res.message == "ok"){
            let arrProduct = [];
            for(let i = 0; i < res.result.length; i++){
                let objLabelProduct = {
                    'label': res.result[i].product_name,
                    'value': res.result[i].name
                }
                arrProduct.push(objLabelProduct);
            }
            setOptionsProduct(arrProduct);
        }
    }

    const handleBackPage = function (){
        backPageEmit(arrImage);
    }
    const handlePrevImage = () => {
        if (mainImageIndex > 0) {
          setMainImageIndex(mainImageIndex - 1);
        }
    };
    
    const handleNextImage = () => {
        if (mainImageIndex < lstImage.length - 1) {
          setMainImageIndex(mainImageIndex + 1);
        }
    };

    const handleClickBboxProduct = function(dataImage){
        setLstImageBboxProduct((prevImages) => [...prevImages, dataImage]);
    }

    const onDeleteImage = function(indexImage){
        setLstImageBboxProduct((prevImages) => {
            return prevImages.filter((image, index) => index !== indexImage);
        });
    }

    const setValLabelProduct = (val) => {
        setLabelProductSelect(val);
    }

    const handleSaveLabelForImage = async () =>{
        if(labelProductSelect == null || labelProductSelect == ""){
            message.warning("Vui lòng chọn tên sản phẩm để thực hiện gán nhãn");
            return;
        }
        if(lstImageBboxProduct.length == 0){
            message.warning("Vui lòng chọn ảnh sản phẩm trong ảnh trưng bày để thực hiện gán nhãn");
            return;
        }
        setLoadingAssignLabel(true);
        let arrUrlImage = [];
        let objRenderImage = {
            'name_product': labelProductSelect,
            'name_category': category,
            'lst_base64': []
        }
        for(let i = 0; i < lstImageBboxProduct.length; i++){
            let base64 = lstImageBboxProduct[i].split(',')[1];
            objRenderImage.lst_base64.push(base64);
            if((i > 0 && i % 5 == 0) || (i == lstImageBboxProduct.length-1)){
                let urlRenderImage = "api/method/mbw_audit.api.api.render_image_by_base64";
                let res = await AxiosService.post(urlRenderImage, objRenderImage);
                if(res.message == "ok"){
                    for(let j = 0; j < res.result.length; j++){
                        arrUrlImage.push(res.result[j]);
                    }
                    objRenderImage.lst_base64 = [];
                }else{
                    message.error("Tạo ảnh cho sản phẩm lỗi. Vui lòng liên hệ quản trị hệ thống để tiếp tục");
                    setLoadingAssignLabel(false);
                    return;
                }
            }
        }
        let objAssignImage = {
            'name_product': labelProductSelect,
            'name_category': category,
            'lst_image': arrUrlImage
        }
        let urlAssignImage = "/api/method/mbw_audit.api.api.assign_image_to_product";
        let resAssign = await AxiosService.post(urlAssignImage, objAssignImage);
        if(resAssign.message == "ok"){
            //Clear dữ liệu
            setLoadingAssignLabel(false);
            setLabelProductSelect("");
            setLstImageBboxProduct([]);
            setStateInsertImageContent(1);
        }else{
            message.error("Gán nhãn cho sản phẩm lỗi. Vui lòng liên hệ quản trị hệ thống để tiếp tục");
            setLoadingAssignLabel(false);
            return;
        }
    }

    const handleAddAnotherProduct = () => {
        setStateInsertImageContent(0);
    }

    const handleCompleteProductLabelling = () => {
        completeProductLabelling(arrImage);
    }

    return (
        <>
            {loadingPage && (
            <div style={{
            position: 'fixed',
            width: '100%',
            height: '85%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 30, color: '#fff' }} spin />} />
            </div>
        )}
            <Row style={{height:'100%'}}>
                <Col span={15} style={{padding: '0px 24px 20px'}}>
                    <div className="py-3">
                        <div className="flex items-center cursor-pointer" style={{width: 'fit-content',paddingBottom: '13px'}} onClick={handleBackPage}>
                            <LeftOutlined style={{color: '#1877F2', fontSize: '23px'}} />
                            <span style={{fontWeight:700,fontSize:'15px',lineHeight:'36px', color: '#1877F2'}} className="mx-2">Quay lại trang</span>
                        </div>
                        <div className="font-semibold leading-[21px]" style={{fontSize: '1.4rem'}}>Nhận diện sản phẩm</div>
                    </div>
                    <div className="py-2">
                        <div
                            style={{
                            position: "relative",
                            width: "100%",
                            height: "auto",
                            overflow: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            }}
                        >
                        {
                            lstImage.length > 0 &&(
                                <CanvasImage
                                    key={mainImageIndex}
                                    src={lstImage[mainImageIndex].url}
                                    bboxes={lstImage[mainImageIndex].bboxes}
                                    clickBboxProductEmit={handleClickBboxProduct}
                                />
                            )
                        }
                
                        {showActionImage && ( <div
                            onClick={handlePrevImage}
                            style={{
                                height: "50px",
                                width: "35px",
                                display: "flex",
                                justifyContent: "center",
                                borderRadius: "5px",
                                position: "absolute",
                                top: "50%",
                                left: "10px",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                fontSize: "24px",
                                zIndex: 1,
                                backgroundColor: "rgba(0, 0, 0, 0.2)", // Chỉnh màu của biểu tượng nếu cần
                            }}
                            >
                            <LeftOutlined
                                onClick={handlePrevImage}
                                style={{ color: "white" }}
                            />
                            </div>)}
                        {showActionImage && (  <div
                            onClick={handleNextImage}
                            style={{
                                height: "50px",
                                width: "35px",
                                display: "flex",
                                justifyContent: "center",
                                borderRadius: "5px",
                                position: "absolute",
                                top: "50%",
                                right: "10px",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                fontSize: "24px",
                                zIndex: 1,
                                backgroundColor: "rgba(0, 0, 0, 0.2)", // Chỉnh màu của biểu tượng nếu cần
                            }}
                            >
                            <RightOutlined
                                onClick={handleNextImage}
                                style={{ color: "white" }}
                            />
                            </div>)}
                        </div>
                        <div
                            style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            gap: "10px",
                            overflowX: "hidden",
                            marginTop: "10px",
                            }}
                        >
                            {lstImage.map((image, index) => (
                            <Image
                                key={index}
                                src={image.url}
                                style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                cursor: "pointer",
                                borderRadius: "10px",
                                }}
                                preview={false}
                            />
                            ))}
                        </div>
                    </div>
                </Col>
                <Col span={9}>
                    <div className="bg-white h-full" style={{padding: '20px', position: 'relative'}}>
                        <div style={{fontWeight:600,fontSize: '18px',lineHeight: '36px'}}>Thêm hình ảnh vào sản phẩm</div>
                        {stateInsertImageContent==0&&(
                            <>
                                <div style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '490px', overflowY: 'auto' }} className="py-3">
                                    {lstImageBboxProduct.map((image, index) => (
                                    <div key={index} style={{ marginRight: '15px',marginBottom: '15px', position: 'relative' }}>
                                        <Image
                                            width={80}
                                            height={80}
                                            src={image}
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                objectFit: "cover",
                                                borderRadius: "10px"
                                            }}
                                            preview={false}
                                        />
                                        <Button
                                            shape="circle"
                                            size="small"
                                            icon={<CloseOutlined style={{fontSize:'10px'}} />}
                                            style={{ position: 'absolute', top: '0px', right: '2px' }}
                                            onClick={() => onDeleteImage(index)}
                                        />
                                    </div>
                                    ))}
                                </div>
                                <FormItemCustom name="campaign_status">
                                    <div className="py-1" style={{fontWeight: 500, fontSize: '14px', lineHeight: '21px'}}>Chọn sản phẩm</div>
                                    <Select options={optionsProduct} onChange={setValLabelProduct}>
                                    </Select>
                                </FormItemCustom>
                                <div className="py-5">
                                    <Button type="primary" ghost loading={loadingAssignLabel} onClick={handleSaveLabelForImage}>Lưu hình ảnh</Button>
                                </div>
                                
                            </>
                        )}
                        {stateInsertImageContent==1&&(
                            <>
                                <div style={{width: '100%', height: '210px', position: 'relative'}}>
                                    <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                                        <svg width="220" height="180" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.5743 87.1166C18.8488 82.6547 61.0786 103.951 70.8568 116.036C70.8568 116.036 79.054 160.661 72.7339 164.644C69.0218 165.991 53.812 143.926 50.2319 138.536C49.7742 137.847 47.7984 134.586 47.2186 134.079C28.6694 107.598 16.3144 91.5272 17.5743 87.1166Z" fill="#007867"/>
                                            <path d="M160.423 26.3935C156.674 22.6435 77.2958 100.652 70.3126 115.313C70.3126 115.313 62.1276 163.417 72.1881 165C77.6308 165 93.7501 135.938 97.5001 129.375C117.188 99.3751 164.13 30.1003 160.423 26.3935Z" fill="#00A76F"/>
                                        </svg>
                                        <div style={{fontWeight: 700, fontSize: '14px', lineHeight: '24px'}}>Ảnh đã được lưu vào sản phẩm</div>
                                        <div className="py-5">
                                            <Button type="primary" ghost onClick={handleAddAnotherProduct}>Thêm sản phẩm khác</Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        <div style={{position: 'absolute', bottom: '20px', width: '92%'}}>
                            <Button type="primary" onClick={handleCompleteProductLabelling} block>Hoàn thành nhận diện</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    );
}