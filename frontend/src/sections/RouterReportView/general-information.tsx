import { Col, Input,Carousel,Button ,Image } from "antd";
import { useState,useEffect } from "react";
import RowCustom from "../RouterCreate/styled";
import { FormItemCustom } from "../../components";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
type Options = {
  label: string;
  value: any;
};

export const statusOption: Options[] = [
  {
    label: "Hoạt động",
    value: "Active",
  },
  {
    label: "Khóa",
    value: "Lock",
  },
];
export default function GeneralInformation({ form,recordData }) {
  const [lstImage, setLstImage] = useState<string[]>([]);
  const [lstImageAI, setLstImageAI] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [mainImageIndexAI, setMainImageIndexAI] = useState<number>(0);
  useEffect(() => {
    console.log(recordData);
    if (recordData) {
      form.setFieldsValue({
        store: recordData.customer_name,
        campaign_name: recordData.campaign_name,
        employee_code: recordData.employee_name,
        quatity: recordData.quantity_cate,
        time_report: recordData.images_time,
        scoring_machine: recordData.scoring_machine == 1? "Đạt" : recordData.scoring_machine == 0? "Không đạt" : "",

       
        // Gán giá trị cho các trường khác nếu cần
      });
      let arrImageStore = [];
      if( recordData.images != null && recordData.images != ""){
        let objArrImage = JSON.parse(recordData.images);
        arrImageStore = objArrImage;
      }
      let arrImageStoreAI = [];
      if( recordData.image_ai != null && recordData.image_ai != ""){
        let objArrImage = JSON.parse(recordData.image_ai);
        arrImageStoreAI = objArrImage;
      }
      setLstImage(arrImageStore);
      setLstImageAI(arrImageStoreAI);
    }
  }, [recordData]);
    // // State để lưu trữ hình ảnh lớn được hiển thị
    // const [mainImage, setMainImage] = useState(null);

    // // State để lưu trữ danh sách các hình ảnh nhỏ
    // const [smallImages, setSmallImages] = useState([
    //   'http://vgm.ts:8003/files/2.png',
    //   'http://vgm.ts:8003/files/test_1.png',
    //   'http://vgm.ts:8003/files/img_13.jpg',
    //   'http://vgm.ts:8003/files/2.png',
    //   'http://vgm.ts:8003/files/test_1.png',
    //   'http://vgm.ts:8003/files/test_1.png',
      
    // ]);

    const handleImageClick = (index: number) => {
      setMainImageIndex(index);
    };
    const handleImageClickAI = (index: number) => {
      setMainImageIndexAI(index);
    };
  
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
    const handlePrevImageAI = () => {
      if (mainImageIndexAI > 0) {
        setMainImageIndexAI(mainImageIndexAI - 1);
      }
    };
  
    const handleNextImageAI = () => {
      if (mainImageIndexAI < lstImageAI.length - 1) {
        setMainImageIndexAI(mainImageIndexAI + 1);
      }
    };
    return (
      <>
        <div className="p-4 pt-6 pb-[40px]">
          <RowCustom>
            <Col span={8}>
              <FormItemCustom label="Khách hàng" name="store" className="pt-3" required>
                <Input readOnly={true} />
              </FormItemCustom>
            </Col>
            <Col span={8}>
              <FormItemCustom label="Chiến dịch" name="campaign_name" className="pt-3" required>
                <Input readOnly={true} />
              </FormItemCustom>
            </Col>
            <Col span={8}>
              <FormItemCustom label="Nhân viên thực hiện" name="employee_code" className="pt-3" required>
                <Input readOnly={true} />
              </FormItemCustom>
            </Col>
          </RowCustom>
          <RowCustom>
            <Col span={8}>
              <FormItemCustom label="Thời gian thực hiện" name="time_report" className="pt-3" required>
                <Input readOnly={true} />
              </FormItemCustom>
            </Col>
            <Col span={8}>
              <FormItemCustom
                label="Chấm điểm trưng bày"
                name="scoring_machine"
                className="pt-3"
                required
              >
                <Input readOnly={true} style={{
                  color: recordData && recordData.scoring_machine === 1 ? 'green' : recordData && recordData.scoring_machine === 0 ? 'red' : 'black'
                }}/>
              </FormItemCustom>
            </Col>
            <Col span={8}></Col>
          </RowCustom>
          <RowCustom>
            <Col span={8}>
            <FormItemCustom label="Hình ảnh cửa hàng" className="pt-3" required>
  <div style={{ position: 'relative', width: '100%', height: 'auto', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Image
      src={lstImage[mainImageIndex]}
      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', alignSelf: 'center',borderRadius: '10px' }}
    />
    <div  onClick={handlePrevImage} style={{
          height: '50px',
          width: '35px',
          display: 'flex',
          justifyContent:'center',
        borderRadius: '5px',
        position: 'absolute',
        top: '50%',
        left: '10px',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        fontSize: '24px',
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'// Chỉnh màu của biểu tượng nếu cần
      }}>
    <LeftOutlined onClick={handlePrevImage}
     style={{color:'white'}}
    />
    </div>
   <div onClick={handleNextImage}  style={{
     height: '50px',
     width: '35px',
     display: 'flex',
     justifyContent:'center',
        borderRadius: '5px',
        position: 'absolute',
        top: '50%',
        right: '10px',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        fontSize: '24px',
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'// Chỉnh màu của biểu tượng nếu cần
      }}>
  <RightOutlined onClick={handleNextImage}
      style={{color:'white'}}
      />
   </div>
  
  </div>
  <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', overflowX: 'hidden', marginTop:'10px' }}>
    {lstImage.map((image, index) => (
      <Image
        key={index}
        src={image}
        onClick={() => handleImageClick(index)}
        style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer',borderRadius: '10px' }}
        preview={false}
      />
    ))}
  </div>
</FormItemCustom>
            </Col>
            <Col span={8}>
            <FormItemCustom label="Hình ảnh AI trả về" className="pt-3" required>
  <div style={{ position: 'relative', width: '100%', height: 'auto', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Image
      src={lstImageAI[mainImageIndexAI]}
      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', alignSelf: 'center',borderRadius: '10px' }}
    />
    <div  onClick={handlePrevImageAI} style={{
          height: '50px',
          width: '35px',
          display: 'flex',
          justifyContent:'center',
        borderRadius: '5px',
        position: 'absolute',
        top: '50%',
        left: '10px',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        fontSize: '24px',
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'// Chỉnh màu của biểu tượng nếu cần
      }}>
    <LeftOutlined onClick={handlePrevImageAI}
     style={{color:'white'}}
    />
    </div>
   <div onClick={handleNextImageAI}  style={{
     height: '50px',
     width: '35px',
     display: 'flex',
     justifyContent:'center',
        borderRadius: '5px',
        position: 'absolute',
        top: '50%',
        right: '10px',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        fontSize: '24px',
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'// Chỉnh màu của biểu tượng nếu cần
      }}>
  <RightOutlined onClick={handleNextImageAI}
      style={{color:'white'}}
      />
   </div>
  
  </div>
  <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', overflowX: 'hidden', marginTop:'10px' }}>
    {lstImageAI.map((image, index) => (
      <Image
        key={index}
        src={image}
        onClick={() => handleImageClickAI(index)}
        style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer',borderRadius: '10px' }}
        preview={false}
      />
    ))}
  </div>
</FormItemCustom>
            </Col>
            <Col span={8}></Col>
          </RowCustom>
        </div>
      </>
    );
}
