import { Col, Input,Carousel } from "antd";
import { useState,useEffect } from "react";
import RowCustom from "../RouterCreate/styled";
import { FormItemCustom } from "../../components";

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
  useEffect(() => {
    console.log(recordData);
    if (recordData) {
      let arrimage = []
      form.setFieldsValue({
        store: recordData.retail_code,
        campaign_name: recordData.campaign_name,
        employee_code: recordData.employee_name,
        quatity: recordData.quantity_cate,
        time_report: recordData.images_time,
        scoring_machine: recordData.scoring_machine == 1? "Đạt" : recordData.scoring_machine == 0? "Không đạt" : ""
       
        // Gán giá trị cho các trường khác nếu cần
      });
      let arrImage = [];
      if( recordData.images != null && recordData.images != ""){
        let objArrImage = JSON.parse(recordData.images);
        arrImage = objArrImage;
      }
      setLstImage(arrImage);
    }
  }, [recordData]);
  return (
    <>
      <div className="p-4 pt-6 pb-[58px]">

        <RowCustom>
          <Col span={10}>
            <Carousel >
              {lstImage.map((image, index) => (
                <div key={index} style={{backgroundColor: "#99989859"}}>
                  <img src={image} style={{ width: '100%', height: 'auto' }} />
                </div>
              ))}
            </Carousel>
          </Col>
          <Col span={14}>
            <FormItemCustom label="Khách hàng" name="store" className="pt-2" required>
              <Input />
            </FormItemCustom>
            <FormItemCustom label="Chiến dịch" name="campaign_name" className="pt-2" required>
              <Input />
            </FormItemCustom>
            <FormItemCustom label="Nhân viên thực hiện"  name="employee_code" className="pt-2" required>
              <Input />
            </FormItemCustom>
            <FormItemCustom label="Thời gian thực hiện"  name="time_report" className="pt-2" required>
              <Input />
            </FormItemCustom>
            <FormItemCustom label="Chấm điểm trưng bày"  name="scoring_machine" className="pt-2" required>
              <Input />
            </FormItemCustom>
          </Col>
        </RowCustom>

        {/* <RowCustom>
          <Col span={12}>
            <FormItemCustom label="Khách hàng" name="store" required>
              <Input />
            </FormItemCustom>
          </Col>
          <Col span={12}>
            <FormItemCustom label="Chiến dịch" name="campaign_name" required>
              <Input />
            </FormItemCustom>
          </Col>
        </RowCustom>
     
        <RowCustom className="pt-2">
        <Col span={12}>
            <FormItemCustom label="Nhân viên thực hiện"  name="employee_code" required>
              <Input />
            </FormItemCustom>
          </Col>
          <Col span={12}>
            <FormItemCustom label="Số lượng danh mục sản phẩm" name="quatity" required>
              <Input />
            </FormItemCustom>
          </Col>
        </RowCustom>
        <RowCustom className="pt-2">
        <Col span={12}>
            <FormItemCustom label="Hình ảnh"  name="image" required>
            <Upload
        listType="picture-card"
        fileList={fileList}
      >
      </Upload>
            </FormItemCustom>
          </Col>
        </RowCustom> */}
      </div>
    </>
  );
}
