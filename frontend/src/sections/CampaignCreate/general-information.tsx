import { Col, Input, Select, DatePicker } from "antd";
import RowCustom from "../RouterCreate/styled";
import { FormItemCustom } from "../../components";
import TextArea from "antd/es/input/TextArea";
import React, {useState} from 'react';

type Options = {
  label: string;
  value: any;
};
export const statusOption: Options[] = [
  {
    label: "Hoạt động",
    value: "Open",
  },
  {
    label: "Đóng",
    value: "Close",
  },
];
export default function GeneralInformation({ form, onCampaignStatusChange }) {
  const [campaignStatus, setCampaignStatus] = useState("Open");

  const setValCampaignStatus = (val) => {
    setCampaignStatus(val);
    onCampaignStatusChange(val);
  }

  return (
    <>
      <div className="p-4 pt-6 pb-[58px]">
        <RowCustom>
          <Col span={8}>
            <FormItemCustom label="Tên chiến dịch" name="campaign_name" required>
              <Input />
            </FormItemCustom>
          </Col>
          <Col span={8}>
            <FormItemCustom label="Thời gian bắt đầu" name="campaign_start" required>
              <DatePicker className="!bg-[#F4F6F8]" showTime />
            </FormItemCustom>
          </Col>
          <Col span={8}>
            <FormItemCustom label="Thời gian kết thúc" name="campaign_end" required>
            <DatePicker className="!bg-[#F4F6F8]" showTime />
            </FormItemCustom>
          </Col>
        </RowCustom>
        <RowCustom className="pt-2">
          <Col span={8}>
            <FormItemCustom label="Trạng thái" name="campaign_status">
              <Select defaultValue={"Open"} options={statusOption} onChange={setValCampaignStatus}>
              </Select>
            </FormItemCustom>
          </Col>
          <Col span={8}>
            <FormItemCustom label="Mô tả" name="campaign_description">
              <TextArea
                className="bg-[#F5F7FA]"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </FormItemCustom>
          </Col>
        </RowCustom>
      </div>
    </>
  );
}
