import { Col, Input, Select,Upload } from "antd";
import { useState,useEffect } from "react";
import RowCustom from "../RouterCreate/styled";
import { FormItemCustom } from "../../components";
import TextArea from "antd/es/input/TextArea";

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
  const { getFieldDecorator } = form;
  const [fileList, setFileList] = useState<UploadFile[]>([ 
  ]);
  useEffect(() => {
    if (recordData) {
      let arrimage = []
      form.setFieldsValue({
        store: recordData.campaign_code,
        campaign_name: recordData.campaign_name,
        date_check_in: recordData.date_check_in,
        date_check_out: recordData.date_check_out,
        employee_code: recordData.employee_code,
        quatity: recordData.quantity_cate,
       
        // Gán giá trị cho các trường khác nếu cần
      });
        let obj = {
          uid : -1,
          name: 'image.png',
          status: 'done',
          url: import.meta.env.VITE_BASE_URL + recordData.images
        }
        arrimage.push(obj)
      
        setFileList(arrimage)
    }
  }, [recordData]);
  return (
    <>
      <div className="p-4 pt-6 pb-[58px]">
        <RowCustom>
          <Col span={12}>
            <FormItemCustom label="Cửa hàng" name="store" required>
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
            <FormItemCustom label="Thời gian vào" name="date_check_in" required>
              <Input />
            </FormItemCustom>
          </Col>
          <Col span={12}>
            <FormItemCustom label="Thời gian ra" name="date_check_out" required>
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
        </RowCustom>
      </div>
    </>
  );
}
