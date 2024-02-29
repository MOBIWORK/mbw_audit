import {
    DeleteOutlined,
    PlusOutlined,
    SearchOutlined,
  } from "@ant-design/icons";
  import { FormItemCustom, TableCustom } from "../../components";
  import { Button, Input, Modal, TableProps } from "antd";
  import { useEffect, useState } from "react";
  import { AxiosService, AxiosServiceMBW } from "../../services/server";
  
  interface TypeEmployee{
    key?: React.Key;
    name: string;
    employee_name: string;
    email: string
  }
  
  const columnEmployees: TableProps<TypeEmployee>["columns"] = [
    {
      title: "Mã nhân viên",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "employee_name",
      key: "employee_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    }
  ];
  
  export default function EmployeeSellCampaignEdit({onChangeEmployees, employeeEdit}) {
    const [isModalOpenAddEmployee, setIsModalOpenAddEmployee] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [employees, setEmployees] = useState<TypeEmployee[]>([]);
    const [employeesTemp, setEmployeesTemp] = useState<TypeEmployee[]>([]);
    const [searchEmployee, setSearchEmployee] = useState("");
    const [employeeSelected, setEmployeeSelected] = useState<TypeEmployee[]>([]);
  
    const columnEmployeesSelect: TableProps<TypeEmployee>["columns"] = [
      {
        title: "Mã nhân viên",
        dataIndex: "name",
        key: "name",
        render: (text: string) => <a>{text}</a>,
      },
      {
        title: "Tên nhân viên",
        dataIndex: "employee_name",
        key: "employee_name",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "",
        key: "",
        render: (item) => (
          <a>
            <DeleteOutlined onClick={() => handleDeleteEmployeeSelected(item)}/>
          </a>
        ),
      }
    ]; 
  
    useEffect(() => {
      initDataEmployee();
    }, []);
  
    useEffect(() => {
      let employeeFilter = employeesTemp;
      if(searchEmployee != null && searchEmployee != ""){
        employeeFilter = employeesTemp.filter(x => x.employee_name.toLowerCase().includes(searchEmployee.toLowerCase()));
      }
      setEmployees(employeeFilter);
    }, [searchEmployee]);
  
    const initDataEmployee = async () => {
      let urlEmployee = "/api/method/mbw_service_v2.api.ess.employee.get_list_employee";
      let res = await AxiosService.get(urlEmployee);
      let arrEmployeeSource = [];
      if(res != null && res.result != null && res.result.data != null){
        arrEmployeeSource = res.result.data.map((item: TypeEmployee) => {
          return {
            ...item,
            key: item.name
          }
        });
      }
      setEmployees(arrEmployeeSource);
      setEmployeesTemp(arrEmployeeSource);
      let employeesInitSelected = [];
      for(let i = 0; i < employeeEdit.length; i++){
        let dataEmployeeFilter = arrEmployeeSource.filter(x => x.name==employeeEdit[i]);
        if(dataEmployeeFilter != null && dataEmployeeFilter.length > 0){
            //selectedRowKeys.push(customerEdit[i]);
            employeesInitSelected.push(dataEmployeeFilter[0]);
        } 
      }
      setEmployeeSelected(employeesInitSelected)
    }
  
    const showModalAddEmployee = () => {
      setIsModalOpenAddEmployee(true);
    };
  
    const handleOkAddEmployee = () => {
      setIsModalOpenAddEmployee(false);
    };
  
    const handleCancelAddEmployee = () => {
      setIsModalOpenAddEmployee(false);
    };
  
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    };
  
    const onChangeSearch = (event) => {
      setSearchEmployee(event.target.value);
    }
  
    const handleAddEmployee = () => {
      let employeeSelecteds: TypeEmployee[] = [];
      for(let i = 0; i < selectedRowKeys.length; i++ ){
        let employeeFilter = employees.filter(x => x.name == selectedRowKeys[i]);
        if(employeeFilter != null && employeeFilter.length > 0) employeeSelecteds.push(employeeFilter[0]);
      }
      setEmployeeSelected(employeeSelecteds);
      onChangeEmployees(employeeSelecteds);
      handleCancelAddEmployee();
    }
  
    const handleDeleteEmployeeSelected = (item) => {
      const updatedEmployeeSelected = employeeSelected.filter(employee => employee.name !== item.name);
      setEmployeeSelected(updatedEmployeeSelected);
      onChangeEmployees(updatedEmployeeSelected);
    }
  
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
  
    return (
      <>
        <div className="pt-4">
          <p className="ml-4 font-semibold text-sm text-[#212B36]">
            Danh sách nhân viên
          </p>
          <div
            onClick={showModalAddEmployee}
            className="flex justify-center h-9 cursor-pointer items-center ml-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px]"
          >
            <p className="mr-2">
              <PlusOutlined />
            </p>
            <p className="text-sm font-bold text-[#1877F2]">Chọn nhân viên</p>
          </div>
          <div className="pt-6 ml-4 mr-4">
            <TableCustom columns={columnEmployeesSelect} dataSource={employeeSelected} />
          </div>
  
          <Modal
            width={990}
            title="Chọn nhân viên"
            open={isModalOpenAddEmployee}
            onOk={handleOkAddEmployee}
            onCancel={handleCancelAddEmployee}
            footer={false}
          >
            <div className="flex items-center justify-between">
              <FormItemCustom className="w-[320px] border-none pt-4">
                <Input value={searchEmployee} onChange={onChangeSearch}
                  placeholder="Tìm kiếm tên nhân viên"
                  prefix={<SearchOutlined />}
                />
              </FormItemCustom>
              <div>
                <span style={{ marginRight: 8 }}>
                  {hasSelected
                    ? `Đã chọn ${selectedRowKeys.length} nhân viên`
                    : ""}
                </span>
                <Button type="primary" onClick={handleAddEmployee}>Thêm</Button>
              </div>
            </div>
            <div className="pt-4">
              <TableCustom
                rowSelection={rowSelection}
                columns={columnEmployees}
                dataSource={employees}
              />
            </div>
          </Modal>
        </div>
      </>
    );
  }
  