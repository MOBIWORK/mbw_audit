import{r as l,a1 as j,j as e,a2 as H,F as h,z as E,Y as w,S as r,G as P,a4 as S,a as C,H as T}from"./main-InCxzH1o.js";const{RangePicker:M}=S,k=[{title:"STT",dataIndex:"stt"},{title:"Cửa hàng",dataIndex:"retail_code"},{title:"Tên chiến dịch",dataIndex:"campaign_name"},{title:"Nhân viên thực hiện",dataIndex:"employee_code"},{title:"Thời gian vào",dataIndex:"date_check_in"},{title:"Thời gian ra",dataIndex:"date_check_out"},{title:"Số lượng",dataIndex:"quantity_cate"}];function I(){const[s,g]=l.useState(""),[t,_]=l.useState(null),[m,p]=l.useState("all"),[x,u]=l.useState([]),f=j(),[d,b]=l.useState([]),y=[{designation:null,email:"hoanganh@gmail.com",cell_number:null,name:"HR-EMP-00014",date_of_birth:1017939600,employee_name:"Hoàng Anh",image:null},{designation:null,email:"hapt@mbw.vn",cell_number:null,name:"HR-EMP-00013",date_of_birth:639766800,employee_name:"Hà PT",image:null},{designation:null,email:"lamthatnhanh111@gmail.com",cell_number:null,name:"HR-EMP-00012",date_of_birth:987181200,employee_name:"Vương Linh",image:null},{designation:null,email:"haudang130197@gmail.com",cell_number:null,name:"HR-EMP-00011",date_of_birth:891709200,employee_name:"Đặng Hậu",image:"http://hr.mbwcloud.com:8007/private/files/growing-hydrangeas-1402684-01-3942-3246-1680492267.jpg"},{designation:null,email:"hong23n@gmail.com",cell_number:null,name:"HR-EMP-00010",date_of_birth:891709200,employee_name:"Thúy Hồng",image:"http://hr.mbwcloud.com:8007/private/files/avtDefault.png"},{designation:null,email:"longkhuat0902@gmail.com",cell_number:null,name:"HR-EMP-00009",date_of_birth:1017939600,employee_name:"Khuất Long",image:null},{designation:null,email:"chuquynhanh256@gmail.com",cell_number:null,name:"HR-EMP-00008",date_of_birth:923158800,employee_name:"Chu Anh",image:"http://hr.mbwcloud.com:8004/files/avarta_HR-EMP-00005_2023-11-11 10:50:38.394703_b58c7d.png"},{designation:null,email:"ductuan1999@gmail.com",cell_number:null,name:"HR-EMP-00007",date_of_birth:923763600,employee_name:"Đức Tuấn",image:null},{designation:null,email:"tungda@mobiwork.vn",cell_number:null,name:"HR-EMP-00006",date_of_birth:607798800,employee_name:"Đỗ Tùng",image:"http://hr.mbwcloud.com:8007/private/files/IMG_20220327_1504415734df.jpg"},{designation:null,email:"phongtran100401@gmail.com",cell_number:null,name:"HR-EMP-00005",date_of_birth:986835600,employee_name:"Trần Phong",image:null},{designation:null,email:null,cell_number:null,name:"HR-EMP-00004",date_of_birth:1563123600,employee_name:"Nguyễn Thanh Mạnh",image:null},{designation:null,email:null,cell_number:null,name:"HR-EMP-00003",date_of_birth:950893200,employee_name:"Hà Chi",image:null},{designation:null,email:"ngocsondds@gmail.com",cell_number:null,name:"HR-EMP-00002",date_of_birth:959706e3,employee_name:"Ngọc Sơn",image:null},{designation:null,email:"chuyendev@gmail.com",cell_number:null,name:"HR-EMP-00001",date_of_birth:1694019600,employee_name:"Lê Công Chuyện",image:null}];l.useState("checkbox");const R=a=>{localStorage.setItem("recordData",JSON.stringify(a)),f("/report-view")},v=async()=>{try{const n=await C.get("/api/method/vgm_audit.api.api.get_list_reports");if(n&&n.message.data){let o=n.message.data.map((i,c)=>({...i,key:i.name,stt:c+1,quantity_cate:JSON.parse(i.categories).length.toString()}));b(o),u(o)}}catch{}finally{}};return l.useEffect(()=>{v()},[]),l.useEffect(()=>{const a=d.filter(n=>{const o=n.campaign_name.toLowerCase().includes(s.toLowerCase()),i=t&&t[0]&&t[1]?new Date(n.date_check_in)>=t[0]&&new Date(n.date_check_in)<=t[1]:!0,c=m==="all"||n.employee_code===m;return o&&c&&i});u(a)},[s,t,m,d]),e.jsxs(e.Fragment,{children:[e.jsx(H,{title:"Báo cáo"}),e.jsxs("div",{className:"bg-white rounded-xl",children:[e.jsxs("div",{className:"flex p-4",style:{alignItems:"flex-end"},children:[e.jsx(h,{className:"w-[320px] border-none mr-4 ",children:e.jsx(E,{placeholder:"Tìm kiếm theo chiến dịch",value:s,onChange:a=>g(a.target.value),prefix:e.jsx(w,{})})}),e.jsx(h,{className:"w-[250px] border-none mr-4",label:"Thời gian thực hiện",children:e.jsx(M,{value:t,onChange:a=>_(a)})}),e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx("label",{style:{paddingBottom:"5px"},children:"Nhân viên:"}),e.jsxs(r,{className:"w-[200px] h-[36px]",value:m,onChange:a=>p(a),defaultValue:"all",children:[e.jsx(r.Option,{value:"all",children:"Tất cả"}),y.map(a=>e.jsx(r.Option,{value:a.name,children:a.employee_name},a.name))]})]})]}),e.jsx("div",{className:"p-4",children:e.jsx(P,{columns:k,dataSource:x,onRow:(a,n)=>({onClick:()=>R(a)}),rowHoverBg:"#f0f0f0"})})]})]})}function D(){return e.jsxs(e.Fragment,{children:[e.jsx(T,{children:e.jsx("title",{children:"BÁO CÁO"})}),e.jsx(I,{})]})}export{D as default};
