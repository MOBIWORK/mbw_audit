import{u as de,r as i,A as g,j as e,H as pe,Z as X,h as he,$ as ge,a0 as ue,T as xe,a2 as C,a3 as H,a1 as fe,a5 as B,a6 as Y,a7 as Ce,s as r,d as je}from"./main-iKPneAyp.js";import{a as ye,V as De,D as Se,E as _e,r as ke,u as be,p as Oe}from"./xlsx-xmXpk0iU.js";import"./progress-99z1QLjO.js";const j=Oe.apiUrl;function Ie(){const y=de(),[P,Ne]=i.useState("checkbox"),A=[{title:"Tên chiến dịch",dataIndex:"campaign_name",render:(a,t)=>e.jsx("a",{href:"javascript:;",onClick:()=>N(t),children:t.campaign_name})},{title:"Trạng thái",dataIndex:"campaign_status",render:(a,t)=>e.jsxs(e.Fragment,{children:[t.campaign_status==="Open"&&e.jsxs(B,{color:"green",children:[e.jsx("div",{className:"dot-tag-green"})," Hoạt động"]}),t.campaign_status==="Close"&&e.jsxs(B,{color:"red",children:[e.jsx("div",{className:"dot-tag-red"})," Không hoạt động"]})]})},{title:"Thời gian bắt đầu",dataIndex:"start_date",render:a=>Y(a).format("DD/MM/YYYY")},{title:"Thời gian kết thúc",dataIndex:"end_date",render:a=>Y(a).format("DD/MM/YYYY")},{title:"Hành động",key:"action",render:(a,t)=>e.jsxs(Ce,{size:"middle",children:[e.jsx("a",{children:e.jsx(_e,{onClick:()=>N(t)})}),e.jsx("a",{children:e.jsx(X,{onClick:()=>q(t)})})]})}],J={onChange:(a,t)=>{k(t),t.length>0?x(!0):x(!1)}},[W,h]=i.useState([]),K={onRemove:()=>{h([]),I([])},action:"https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",multiple:!1,beforeUpload:async a=>{try{const t=a.name.toLowerCase();if(t.endsWith(".xls")||t.endsWith(".xlsx")||t.endsWith(".xlsm")||t.endsWith(".xlsb")||t.endsWith(".csv")||t.endsWith(".ods")){let o=[{uid:"-1",name:a.name,status:"done",url:""}];h(o);const l=new FileReader;l.onload=c=>{const se=c.target.result,E=ke(se,{type:"buffer"}),ne=E.SheetNames[0],ie=E.Sheets[ne],s=be.sheet_to_json(ie,{header:1});let M=[];if(s.length>=2)for(let n=1;n<s.length;n++){if(!s[n][0])continue;const F=new Date(1899,11,31),le=(s[n][2]-1)*24*60*60*1e3;let ce=new Date(F.getTime()+le);const re=(s[n][2]-1)*24*60*60*1e3;let oe=new Date(F.getTime()+re),me={campaign_name:s[n][0],campaign_description:s[n][1],campaign_start:(ce.getTime()/1e3).toString(),campaign_end:(oe.getTime()/1e3).toString(),campaign_status:s[n][4]!=""?s[n][4]:"Open",campaign_categories:s[n][5]?JSON.parse(s[n][5].replace("“",'"').replace("”",'"')).toString():"",campaign_employees:s[n][5]?JSON.parse(s[n][5].replace("“",'"').replace("”",'"')).toString():"",campaign_customers:s[n][5]?JSON.parse(s[n][5].replace("“",'"').replace("”",'"')).toString():""};M.push(me)}I(M)},l.readAsArrayBuffer(a)}else return r.error("Đã xảy ra lỗi, không đúng định dạng file: xls, xlsx, xlsm, xlsb, csv, ods"),!1}catch{r.error("File không chính xác, tải dữ liệu mẫu để tiếp tục")}return!1}},[U,D]=i.useState([]),[d,V]=i.useState(""),[u,S]=i.useState({}),[$,_]=i.useState(!1),[m,k]=i.useState([]),[z,x]=i.useState(!1),[G,b]=i.useState(!1),[R,f]=i.useState(!1),[O,I]=i.useState([]);i.useState([]),i.useEffect(()=>{p()},[]),i.useEffect(()=>{p()},[d]);const p=async()=>{let a='/api/resource/VGM_Campaign?fields=["*"]';d!=null&&d!=""&&(a+=`&filters=[["campaign_name","like","%${d}%"]]`);let t=await g.get(a);if(t&&t.data){let o=t.data.map(l=>({...l,key:l.name}));D(o)}else D([])},Z=a=>{V(a.target.value)},N=a=>{y(`/campaign-edit/${a.name}`)},q=a=>{S(a),_(!0)},Q=async()=>{let a=j+".api.deleteListByDoctype",t=[u.name];for(let c=0;c<m.length;c++)t.push(m[c].name);let o={doctype:"VGM_Campaign",items:JSON.stringify(t)},l=await g.post(a,o);l!=null&&l.message!=null&&l.message.status=="success"?(r.success("Xóa thành công"),p(),S({}),T()):r.error("Xóa thất bại, Chiến dịch đã tồn tại ở báo cáo")},T=()=>{_(!1)},ee=()=>{b(!0)},te=async()=>{let a=j+".api.deleteListByDoctype",t=[];for(let c=0;c<m.length;c++)t.push(m[c].name);let o={doctype:"VGM_Campaign",items:JSON.stringify(t)},l=await g.post(a,o);l!=null&&l.message!=null&&l.message.status=="success"?(r.success("Xóa thành công"),k([]),x(!1),p(),w()):r.error("Xóa thất bại")},w=()=>{b(!1)},ae=()=>{f(!0),h([])},L=async()=>{let a=j+".api.import_campaign";if(O.length==0){r.warning("Thêm file để tiếp tục");return}let t={listcampaign:JSON.stringify(O)};(await g.post(a,t)).message.status=="success"?(r.success("Thêm chiến dịch thành công"),f(!1),p()):r.error("Thêm chiến dịch thất bại")},v=()=>{f(!1),h([])};return e.jsxs(e.Fragment,{children:[e.jsx(pe,{title:"Chiến dịch",buttons:[z&&{label:"Xóa",type:"primary",icon:e.jsx(X,{}),size:"20px",className:"flex items-center mr-2",danger:!0,action:ee},{label:"Nhập file",icon:e.jsx(ye,{className:"text-xl"}),size:"20px",className:"flex items-center mr-2",action:ae},{label:"Thêm mới",type:"primary",icon:e.jsx(De,{className:"text-xl"}),size:"20px",className:"flex items-center",action:()=>y("/campaign-create")}]}),e.jsxs("div",{className:"bg-white rounded-xl pt-4 border-[#DFE3E8] border-[0.2px] border-solid",children:[e.jsx(he,{className:"w-[320px] border-none p-4",children:e.jsx(ge,{value:d,onChange:Z,placeholder:"Tìm kiếm chiến dịch",prefix:e.jsx(ue,{})})}),e.jsx("div",{children:e.jsx(xe,{rowSelection:{type:P,...J},columns:A,dataSource:U})})]}),e.jsxs(C,{title:`Xóa ${u.campaign_name}?`,open:$,onOk:Q,onCancel:T,okText:"Xác nhận",cancelText:"Hủy",children:[e.jsxs("div",{children:["Bạn có chắc muốn xóa ",u.campaign_name," ra khỏi hệ thống không?"]}),e.jsx("div",{children:"Khi thực hiện hành động này, sẽ không thể hoàn tác."})]}),e.jsxs(C,{title:`Xóa ${m.length} chiến dịch?`,open:G,onOk:te,onCancel:w,okText:"Xác nhận",cancelText:"Hủy",children:[e.jsxs("div",{children:["Bạn có chắc muốn xóa ",m.length," chiến dịch ra khỏi hệ thống không?"]}),e.jsx("div",{children:"Khi thực hiện hành động này, sẽ không thể hoàn tác."})]}),e.jsxs(C,{title:"Nhập dữ liệu từ tệp excel",open:R,width:777,onOk:L,onCancel:v,footer:[e.jsx(H,{onClick:v,children:"Hủy"},"back"),e.jsx(H,{type:"primary",onClick:L,children:"Lưu lại"},"submit")],children:[e.jsxs("p",{className:"text-[#637381] font-normal text-sm",children:["Chọn file excel có định dạng .xlsx để thực hiện nhập dữ liệu. Tải dữ liệu mẫu ",e.jsx("a",{target:"_blank",href:"/mbw_audit/data_sample/campaign_sample.xlsx",children:"tại đây"})]}),e.jsxs(Se,{...K,fileList:W,children:[e.jsx("p",{className:"ant-upload-drag-icon",children:e.jsx(fe,{})}),e.jsx("p",{className:"ant-upload-text",children:"Kéo, thả hoặc chọn tệp để tải lên"})]})]})]})}function ve(){return e.jsxs(e.Fragment,{children:[e.jsx(je,{children:e.jsx("title",{children:" Campaign"})}),e.jsx(Ie,{})]})}export{ve as default};
