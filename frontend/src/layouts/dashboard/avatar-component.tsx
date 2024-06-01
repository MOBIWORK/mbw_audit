import React, { useEffect, useState } from 'react'
import { Row, type MenuProps, Dropdown, Avatar, Col } from 'antd'
import { rsData } from '@/types/response';
import { useFrappeAuth } from 'frappe-react-sdk';
import { AxiosService } from '@/services/server';
import { UpOutlined } from '@ant-design/icons';

function AvatarComponent({mini}:{mini: boolean}) {
    const { currentUser } = useFrappeAuth();

    const [empDetail, setEmpDetail] = useState<employeeType>();
    useEffect(() => {
        (async () => {
            const rsEmployee: rsData<employeeType> = await AxiosService.get(
                "api/method/mbw_service_v2.api.user.get_user_info"
            );
            setEmpDetail(rsEmployee.result);
        })();
    }, []);
    const items: MenuProps["items"] = [
        {
            label: <a href="/?cmd=web_logout" className='!text-[#FF5630] font-semibold text-sm-'>Log out</a>,
            key: "3",
        },
        {
            label: <a href={`app/user/${currentUser}`}>My Settings</a>,
            key: "1",
        },
        {
            label: (
                <a href="/app/user-profile" className="w-[200px]">
                    My Profile
                </a>
            ),
            key: "0",
        },
    ];
    return (
        <div className="w-full !border-[red] border bg-white py-[7px] !border-b-4">
            <Row className="max-w-full px-2 text-[#212B36]">
                <Dropdown
                    menu={{ items }}
                    trigger={["click"]}
                    placement={"bottomRight"}
                    dropdownRender={(menu) => (
                        <div className="w-[240px]">
                            {React.cloneElement(menu as React.ReactElement)}
                        </div>
                    )}
                >
                    <Row className='w-full px-3 py-4 rounded-lg bg-[#F4F6F8] justify-between items-center'>
                        <Col>
                            <Row className="items-center">
                                <Avatar
                                    style={{ backgroundColor: "#f56a00" }}
                                    size={32}
                                    {...(empDetail?.user_image ? { src: empDetail?.user_image } : {})}
                                >
                                    {!empDetail?.user_image && empDetail?.full_name.split(" ").reduce((prev: string, now: string) => `${prev[0] || ""}${now[0]}`, "")}
                                </Avatar>
                                {!mini &&    <p className='text-base font-medium  ml-[5px] text-left'>
                                    <p>{empDetail?.full_name}</p>
                                    <p className='text-xs text-[#637381] font-normal'>{empDetail?.department}</p>
                                </p>}
                              
                            </Row>
                        </Col>
                        {!mini &&   <Col className='text-[#637381] text-xs'><UpOutlined /></Col>}
                      
                    </Row>
                </Dropdown>
            </Row>
        </div>
    );
}

export default AvatarComponent