import{u as me,r as s,A as p,j as e,H as he,Y as M,g as pe,Z as ge,$ as ue,T as xe,a1 as C,a2 as v,a0 as fe,a4 as F,a5 as X,a6 as Ce,s as o,d as je}from"./main--OB17fI9.js";import{a as ye,V as De,D as _e,E as Se,r as ke,u as be,p as Ie}from"./xlsx-PaQG_Xxv.js";import"./progress-2AfH5ify.js";const j=Ie.apiUrl;function Oe(){const y=me(),[H,Te]=s.useState("checkbox"),Y=[{title:"Tên chiến dịch",dataIndex:"campaign_name"},{title:"Trạng thái",dataIndex:"campaign_status",render:(a,t)=>e.jsxs(e.Fragment,{children:[t.campaign_status==="Open"&&e.jsxs(F,{color:"green",children:[e.jsx("div",{className:"dot-tag-green"})," Hoạt động"]}),t.campaign_status==="Close"&&e.jsxs(F,{color:"red",children:[e.jsx("div",{className:"dot-tag-red"})," Không hoạt động"]})]})},{title:"Thời gian bắt đầu",dataIndex:"start_date",render:a=>X(a).format("DD/MM/YYYY")},{title:"Thời gian kết thúc",dataIndex:"end_date",render:a=>X(a).format("DD/MM/YYYY")},{title:"Hành động",key:"action",render:(a,t)=>e.jsxs(Ce,{size:"middle",children:[e.jsx("a",{children:e.jsx(Se,{onClick:()=>Z(t)})}),e.jsx("a",{children:e.jsx(M,{onClick:()=>q(t)})})]})}],B={onChange:(a,t)=>{k(t),t.length>0?x(!0):x(!1)}},[P,g]=s.useState([]),A={action:"https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",multiple:!1,beforeUpload:async a=>{try{const t=a.name.toLowerCase();if(t.endsWith(".xls")||t.endsWith(".xlsx")||t.endsWith(".xlsm")||t.endsWith(".xlsb")||t.endsWith(".csv")||t.endsWith(".ods")){let r=[{uid:"-1",name:a.name,status:"done",url:""}];g(r);const n=new FileReader;n.onload=c=>{const se=c.target.result,N=ke(se,{type:"buffer"}),ne=N.SheetNames[0],ie=N.Sheets[ne],i=be.sheet_to_json(ie,{header:1});let L=[];if(i.length>=2)for(let l=1;l<i.length;l++){const E=new Date(1899,11,31),le=(i[l][2]-1)*24*60*60*1e3;let ce=new Date(E.getTime()+le);const re=(i[l][2]-1)*24*60*60*1e3;let oe=new Date(E.getTime()+re),de={campaign_name:i[l][0],campaign_description:i[l][1],campaign_start:(ce.getTime()/1e3).toString(),campaign_end:(oe.getTime()/1e3).toString(),campaign_status:i[l][4]!=""?i[l][4]:"Open",campaign_categories:i[l][5],campaign_employees:i[l][6],campaign_customers:i[l][7]};L.push(de)}J(L)},n.readAsArrayBuffer(a)}else return o.error("Đã xảy ra lỗi, không đúng định dạng file: xls, xlsx, xlsm, xlsb, csv, ods"),!1}catch{o.error("File không chính xác, tải dữ liệu mẫu để tiếp tục")}return!1}},[W,D]=s.useState([]),[m,K]=s.useState(""),[u,_]=s.useState({}),[U,S]=s.useState(!1),[d,k]=s.useState([]),[V,x]=s.useState(!1),[$,b]=s.useState(!1),[z,f]=s.useState(!1),[G,J]=s.useState([]);s.useState([]),s.useEffect(()=>{h()},[]),s.useEffect(()=>{h()},[m]);const h=async()=>{let a='/api/resource/VGM_Campaign?fields=["*"]';m!=null&&m!=""&&(a+=`&filters=[["campaign_name","like","%${m}%"]]`);let t=await p.get(a);if(t&&t.data){let r=t.data.map(n=>({...n,key:n.name}));D(r)}else D([])},R=a=>{K(a.target.value)},Z=a=>{y(`/campaign-edit/${a.name}`)},q=a=>{_(a),S(!0)},Q=async()=>{let a=j+".api.deleteListByDoctype",t=[u.name];for(let c=0;c<d.length;c++)t.push(d[c].name);let r={doctype:"VGM_Campaign",items:JSON.stringify(t)},n=await p.post(a,r);n!=null&&n.message!=null&&n.message.status=="success"?(o.success("Xóa thành công"),h(),_({}),I()):o.error("Xóa thất bại, Chiến dịch đã tồn tại ở báo cáo")},I=()=>{S(!1)},ee=()=>{b(!0)},te=async()=>{let a=j+".api.deleteListByDoctype",t=[];for(let c=0;c<d.length;c++)t.push(d[c].name);let r={doctype:"VGM_Campaign",items:JSON.stringify(t)},n=await p.post(a,r);n!=null&&n.message!=null&&n.message.status=="success"?(o.success("Xóa thành công"),k([]),x(!1),h(),O()):o.error("Xóa thất bại")},O=()=>{b(!1)},ae=()=>{f(!0),g([])},T=async()=>{let a=j+".api.import_campaign",t={listcampaign:JSON.stringify(G)};(await p.post(a,t)).message.status=="success"?(o.success("Thên chiến dịch thành công"),f(!1),h()):o.error("Thêm chiến dịch thất bại")},w=()=>{f(!1),g([])};return e.jsxs(e.Fragment,{children:[e.jsx(he,{title:"Chiến dịch",buttons:[V&&{label:"Xóa",type:"primary",icon:e.jsx(M,{}),size:"20px",className:"flex items-center mr-2",danger:!0,action:ee},{label:"Nhập file",icon:e.jsx(ye,{className:"text-xl"}),size:"20px",className:"flex items-center mr-2",action:ae},{label:"Thêm mới",type:"primary",icon:e.jsx(De,{className:"text-xl"}),size:"20px",className:"flex items-center",action:()=>y("/campaign-create")}]}),e.jsxs("div",{className:"bg-white rounded-xl pt-4 border-[#DFE3E8] border-[0.2px] border-solid",children:[e.jsx(pe,{className:"w-[320px] border-none p-4",children:e.jsx(ge,{value:m,onChange:R,placeholder:"Tìm kiếm chiến dịch",prefix:e.jsx(ue,{})})}),e.jsx("div",{children:e.jsx(xe,{rowSelection:{type:H,...B},columns:Y,dataSource:W})})]}),e.jsxs(C,{title:`Xóa ${u.campaign_name}?`,open:U,onOk:Q,onCancel:I,okText:"Xác nhận",cancelText:"Hủy",children:[e.jsxs("div",{children:["Bạn có chắc muốn xóa ",u.campaign_name," ra khỏi hệ thống không?"]}),e.jsx("div",{children:"Khi thực hiện hành động này, sẽ không thể hoàn tác."})]}),e.jsxs(C,{title:`Xóa ${d.length} chiến dịch?`,open:$,onOk:te,onCancel:O,okText:"Xác nhận",cancelText:"Hủy",children:[e.jsxs("div",{children:["Bạn có chắc muốn xóa ",d.length," chiến dịch ra khỏi hệ thống không?"]}),e.jsx("div",{children:"Khi thực hiện hành động này, sẽ không thể hoàn tác."})]}),e.jsxs(C,{title:"Nhập dữ liệu từ tệp excel",open:z,width:777,onOk:T,onCancel:w,footer:[e.jsx(v,{onClick:w,children:"Hủy"},"back"),e.jsx(v,{type:"primary",onClick:T,children:"Lưu lại"},"submit")],children:[e.jsxs("p",{className:"text-[#637381] font-normal text-sm",children:["Chọn file excel có định dạng .xlsx để thực hiện nhập dữ liệu. Tải dữ liệu mẫu ",e.jsx("a",{target:"_blank",href:"/mbw_audit/data_sample/campaign_sample.xlsx",children:"tại đây"})]}),e.jsxs(_e,{...A,fileList:P,children:[e.jsx("p",{className:"ant-upload-drag-icon",children:e.jsx(fe,{})}),e.jsx("p",{className:"ant-upload-text",children:"Kéo, thả hoặc chọn tệp để tải lên"})]})]})]})}function Ee(){return e.jsxs(e.Fragment,{children:[e.jsx(je,{children:e.jsx("title",{children:" Campaign"})}),e.jsx(Oe,{})]})}export{Ee as default};