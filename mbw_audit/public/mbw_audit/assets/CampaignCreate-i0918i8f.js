import{r as n,j as e,aJ as ie,C as Y,g as O,Z as $,D as me,S as Fe,G as Me,A as J,a0 as Z,T as M,aK as ue,a1 as U,$ as X,a2 as ee,a5 as Ae,Y as re,aL as he,aM as Re,u as Ke,F as pe,H as Ve,a3 as Le,aN as ze,s as H,a8 as He,d as $e}from"./main-mmrtcI-f.js";const Be=[{label:"Hoạt động",value:"Open"},{label:"Đóng",value:"Close"}];function Ge({form:x,onCampaignStatusChange:_}){const[S,i]=n.useState("Open"),P=h=>{i(h),_(h)};return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"p-4 pt-6 pb-[58px]",children:[e.jsxs(ie,{children:[e.jsx(Y,{span:8,children:e.jsx(O,{label:"Tên chiến dịch",name:"campaign_name",required:!0,children:e.jsx($,{})})}),e.jsx(Y,{span:8,children:e.jsx(O,{label:"Thời gian bắt đầu",name:"campaign_start",required:!0,children:e.jsx(me,{className:"!bg-[#F4F6F8]",showTime:!0})})}),e.jsx(Y,{span:8,children:e.jsx(O,{label:"Thời gian kết thúc",name:"campaign_end",required:!0,children:e.jsx(me,{className:"!bg-[#F4F6F8]",showTime:!0})})})]}),e.jsxs(ie,{className:"pt-2",children:[e.jsx(Y,{span:8,children:e.jsx(O,{label:"Trạng thái",name:"campaign_status",children:e.jsx(Fe,{defaultValue:"Open",options:Be,onChange:P})})}),e.jsx(Y,{span:8,children:e.jsx(O,{label:"Mô tả",name:"campaign_description",children:e.jsx(Me,{className:"bg-[#F5F7FA]",autoSize:{minRows:3,maxRows:5}})})})]})]})})}function Ye({onChangeCategory:x,onChangeCheckExistProduct:_,onChangeCheckSequenceProduct:S,onChangeSequenceProducts:i}){const[P,h]=n.useState(!1),[v,N]=n.useState(!1),[f,j]=n.useState([]),[C,k]=n.useState([]),[I,A]=n.useState([]),[q,b]=n.useState([]),[T,E]=n.useState([]),[R,p]=n.useState([]),[w,F]=n.useState(""),[K,V]=n.useState(""),[a,r]=n.useState([]),[d,u]=n.useState([]),[te,o]=n.useState(!0),[g,L]=n.useState(!1),[B,D]=n.useState([]);n.useState({}),n.useEffect(()=>{W()},[]),n.useEffect(()=>{W()},[w]);const W=async()=>{let t='/api/resource/VGM_Category?fields=["*"]';w!=null&&w!=""&&(t+=`&filters=[["category_name", "like", "%${w}%"]]`);const l=await J.get(t);if(l&&l.data){let c=l.data.map(s=>({...s,key:s.name}));for(let s=0;s<c.length;s++){let m=`/api/resource/VGM_Product?fields=["name","product_code","product_name"]&&filters=[["category","=","${c[s].name}"]]`,y=await J.get(m);if(y!=null&&y.data!=null){c[s].product_num=y.data.length;let G=y.data.map(de=>({...de,key:de.name}));c[s].products=G}else c[s].product_num=0,c[s].products=[]}A(c)}},ne=t=>{F(t.target.value)},se=t=>{const l=t.target.value.toLowerCase();V(l);const c=[...T];if(l===""){b(T);return}else{const s=c.filter(m=>m.product_name.toLowerCase().includes(l));b(s)}},ae=(t,l)=>{j(t)},ce=(t,l)=>{const c=T.map((s,m)=>{const y=t.indexOf(s.name),G=y!==-1?y+1:null;return{...s,sequence_product:G}});b(c),k(t)},Q={selectedRowKeys:f,onChange:ae},z={selectedProductRowKeys:C,onChange:ce},xe=()=>{let t=[],l=[];for(let c=0;c<f.length;c++){let s=I.filter(m=>m.name===f[c]);if(s!=null&&s.length>0){s[0].stt=t.length+1;let m={...s[0]};m.products=m.products.map(y=>({...y,cate_name:m.category_name,product_num:"1"})),l=l.concat(m.products),t.push(m)}}u(l),r(t),x(t),le()},ge=()=>{const t=q.filter(s=>C.includes(s.name));let l=t.map(s=>s.name);i(l);const c=t.sort((s,m)=>{const y=parseInt(s.sequence_product),G=parseInt(m.sequence_product);return y-G});p(c),oe()},ye=f.length>0,Se=C.length>0,fe=()=>{h(!0)},je=()=>{N(!0);const t=[];a.forEach(l=>{t.push(...l.products.map(c=>({...c,cate_name:l.category_name})))}),b(t),E(t)},Ce=()=>{h(!1)},le=()=>{h(!1)},oe=()=>{N(!1)},ke=t=>{const l=a.filter(s=>s.name!==t.name).map((s,m)=>({...s,stt:m+1})),c=d.filter(s=>s.cate_name!==t.category_name);u(c),r(l),x(l)},_e=t=>{t.stopPropagation(),o(t.target.checked),_(t.target.checked)},be=t=>{L(t.target.checked),S(t.target.checked)},we=(t,l)=>{const c=[{title:"Mã sản phẩm",dataIndex:"product_code",key:"product_code"},{title:"Tên sản phẩm",dataIndex:"product_name",key:"product_name"}];return e.jsx(e.Fragment,{children:e.jsx("div",{style:{margin:5},children:e.jsx(Ae,{columns:c,dataSource:t.products,pagination:!1})})})},Pe=[{title:"STT",dataIndex:"stt",key:"stt"},{title:"Danh mục sản phẩm",dataIndex:"category_name",key:"category_name"},{title:"Số lượng sản phẩm",dataIndex:"product_num",key:"product_num"},{title:"",key:"",render:t=>e.jsx(re,{onClick:()=>ke(t)})}],ve=[{title:"Mã sản phẩm",dataIndex:"product_code"},{title:"Tên sản phẩm",dataIndex:"product_name"},{title:"Danh mục",dataIndex:"cate_name"},{title:"Số lượng ít nhất",dataIndex:"product_num",render:(t,l,c)=>e.jsx($,{style:{width:"120px"},defaultValue:t,onChange:s=>Ie(c,parseInt(s.target.value))})}],Ne=[{key:"sort"},{title:"STT",dataIndex:"sequence_product"},{title:"Mã sản phẩm",dataIndex:"product_code"},{title:"Tên sản phẩm",dataIndex:"product_name"},{title:"Danh mục",dataIndex:"cate_name"}],Ie=(t,l)=>{const c=[...d];c[t].product_num=l,u(c),x(a)},Te=(t,l)=>{b(c=>c.map((s,m)=>{if(m===t){const y=s.sequence_product||0;return{...s,sequence_product:y+l}}return s}))},Ee=t=>{let l=t.map(c=>c.name);D(l),i(l)},De=[{key:"1",label:e.jsxs(he,{checked:te,onClick:t=>{t.stopPropagation()},onChange:_e,children:[" ",e.jsxs("span",{style:{fontWeight:700,fontSize:"15px"},onClick:t=>{t.stopPropagation()},children:[" ","1. Tiêu chí tồn tại sản phẩm"]})," "]}),children:e.jsx("div",{className:"m-3",children:e.jsx(M,{columns:ve,dataSource:d})})},{key:"2",label:e.jsxs(he,{onClick:t=>{t.stopPropagation()},checked:g,onChange:be,children:[" ",e.jsxs("span",{style:{fontWeight:700,fontSize:"15px"},onClick:t=>{t.stopPropagation()},children:[" ","2. Tiêu chí sắp xếp sản phẩm"]})," "]}),children:e.jsxs("div",{children:[e.jsxs("div",{onClick:je,className:"flex justify-center h-9 cursor-pointer items-center ml-4 mt-4 mb-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px] ",children:[e.jsx("p",{className:"mr-2",children:e.jsx(Z,{})}),e.jsx("p",{className:"text-sm font-bold text-[#1877F2]",children:"Chọn sản phẩm"})]}),e.jsx("div",{className:"ml-4 mb-4 mr-4 mt-4",style:{fontSize:"17px",fontStyle:"italic",fontWeight:400,lineHeight:"21px",letterSpacing:"0em",textAlign:"left",color:"rgba(99, 115, 129, 1)"},children:e.jsx("span",{children:"Di chuyển (kéo, thả) các sản phẩm để sắp xếp thứ tự sản phẩm"})}),e.jsx(Re,{columnsTable:Ne,datasTable:R,keyPros:"sequence_product",onDragRowEvent:Ee})]})}],Oe=[{key:"1",label:e.jsxs("span",{style:{fontWeight:700,fontSize:"15px"},children:[" ","Thiết lập tiêu chí chấm điểm trưng bày sản phẩm"]}),children:e.jsx(ue,{items:De,defaultActiveKey:["1","2"],className:"custom-collapse-audit"})}],qe=t=>{};return e.jsxs("div",{className:"pt-4",children:[e.jsx("p",{className:"ml-4 font-semibold text-sm text-[#212B36]",children:"Danh sách sản phẩm"}),e.jsxs("div",{onClick:fe,className:"flex justify-center h-9 cursor-pointer items-center ml-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px]",children:[e.jsx("p",{className:"mr-2",children:e.jsx(Z,{})}),e.jsx("p",{className:"text-sm font-bold text-[#1877F2]",children:"Chọn danh mục"})]}),e.jsxs("div",{className:"pt-6 mx-4",children:[e.jsx(M,{columns:Pe,expandable:{expandedRowRender:we,defaultExpandedRowKeys:["0"]},dataSource:a}),e.jsx(ue,{items:Oe,defaultActiveKey:["1","2"],onChange:qe,className:"custom-collapse-parent"})]}),e.jsxs(U,{width:990,title:"Chọn danh mục sản phẩm",open:P,onOk:Ce,onCancel:le,footer:!1,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(O,{className:"w-[320px] border-none pt-4",children:e.jsx($,{value:w,onChange:ne,placeholder:"Tìm kiếm danh mục sản phẩm",prefix:e.jsx(X,{})})}),e.jsxs("div",{children:[e.jsx("span",{style:{marginRight:8},children:ye?`Đã chọn ${f.length} danh mục`:""}),e.jsx(ee,{type:"primary",onClick:xe,children:"Thêm"})]})]}),e.jsx("div",{className:"pt-4",children:e.jsx(M,{rowSelection:Q,columns:[{title:"Danh mục sản phẩm",dataIndex:"category_name",key:"category_name"},{title:"Số lượng sản phẩm",dataIndex:"product_num",key:"product_num"}],dataSource:I})})]}),e.jsxs(U,{width:990,title:"Sắp xếp sản phẩm",open:v,onCancel:oe,footer:!1,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(O,{className:"w-[320px] border-none pt-4",children:e.jsx($,{value:K,onChange:se,placeholder:"Tìm kiếm sản phẩm",prefix:e.jsx(X,{})})}),e.jsxs("div",{children:[e.jsx("span",{style:{marginRight:8},children:Se?`Đã chọn ${C.length} sản phẩm`:""}),e.jsx(ee,{type:"primary",onClick:ge,children:"Thêm"})]})]}),e.jsx("div",{className:"pt-4",children:e.jsx(M,{rowSelection:z,columns:[{title:"Mã sản phẩm",dataIndex:"product_code",key:"product_code"},{title:"Tên sản phẩm",dataIndex:"product_name",key:"product_name"},{title:"Danh mục",dataIndex:"cate_name",key:"cate_name"},{title:"Chọn thứ tự",dataIndex:"sequence_product",render:(t,l,c)=>e.jsx($,{style:{width:"120px"},defaultValue:t,value:t,onChange:s=>Te(c,parseInt(s.target.value))})}],dataSource:q})})]})]})}function Je({onChangeCustomer:x}){const[_,S]=n.useState(!1),[i,P]=n.useState([]),[h,v]=n.useState([]),[N,f]=n.useState([]),[j,C]=n.useState([]),[k,I]=n.useState(""),A=[{title:"ID",dataIndex:"customer_code",key:"customer_code"},{title:"Tên khách hàng",key:"customer_name",dataIndex:"customer_name"},{title:"Nhóm khách hàng",dataIndex:"customer_group",key:"customer_group"},{title:"Địa chỉ",key:"customer_primary_address",dataIndex:"customer_primary_address"},{title:"",key:"action",render:(a,r)=>e.jsx("a",{children:e.jsx(re,{onClick:()=>F(r)})})}];n.useEffect(()=>{q()},[]),n.useEffect(()=>{let a=N;k!=null&&k!=""&&(a=N.filter(r=>r.customer_name.toLowerCase().includes(k.toLowerCase()))),v(a)},[k]);const q=async()=>{let r=await J.get("/api/method/mbw_dms.api.selling.customer.list_customer"),d=[];r!=null&&r.message=="ok"&&(d=r.result.data.map(u=>({...u,key:u.name}))),v(d),f(d)},b=()=>{S(!0)},T=()=>{S(!1)},E=()=>{S(!1)},R=a=>{I(a.target.value)},p=a=>{P(a)},w=()=>{let a=[];for(let r=0;r<i.length;r++){let d=h.filter(u=>u.name==i[r]);d!=null&&d.length>0&&a.push(d[0])}C(a),x(a),E()},F=a=>{const r=j.filter(d=>d.name!==a.name);C(r),x(r)},K={selectedRowKeys:i,onChange:p},V=i.length>0;return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"pt-4",children:[e.jsx("p",{className:"ml-4 font-semibold text-sm text-[#212B36]",children:"Danh sách khách hàng"}),e.jsxs("div",{onClick:b,className:"flex justify-center h-9 cursor-pointer items-center ml-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px]",children:[e.jsx("p",{className:"mr-2",children:e.jsx(Z,{})}),e.jsx("p",{className:"text-sm font-bold text-[#1877F2]",children:"Chọn khách hàng"})]}),e.jsx("div",{className:"pt-6 mx-4",children:e.jsx(M,{columns:A,dataSource:j})}),e.jsxs(U,{width:990,title:"Chọn khách hàng",open:_,onOk:T,onCancel:E,footer:!1,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(O,{className:"w-[320px] border-none pt-4",children:e.jsx($,{value:k,onChange:R,placeholder:"Tìm kiếm tên khách hàng",prefix:e.jsx(X,{})})}),e.jsxs("div",{children:[e.jsx("span",{style:{marginRight:8},children:V?`Đã chọn ${i.length} khách hàng`:""}),e.jsx(ee,{type:"primary",onClick:w,children:"Thêm"})]})]}),e.jsx("div",{className:"pt-4",children:e.jsx(M,{rowSelection:K,columns:[{title:"ID",dataIndex:"customer_code",key:"customer_code"},{title:"Tên khách hàng",key:"customer_name",dataIndex:"customer_name"},{title:"Nhóm khách hàng",dataIndex:"customer_group",key:"customer_group"},{title:"Địa chỉ",key:"customer_primary_address",dataIndex:"customer_primary_address"}],dataSource:h})})]})]})})}const We=[{title:"Mã nhân viên",dataIndex:"name",key:"name"},{title:"Tên nhân viên",dataIndex:"employee_name",key:"employee_name"},{title:"Email",dataIndex:"email",key:"email"}];function Qe({onChangeEmployees:x}){const[_,S]=n.useState(!1),[i,P]=n.useState([]),[h,v]=n.useState([]),[N,f]=n.useState([]),[j,C]=n.useState(""),[k,I]=n.useState([]),A=[{title:"Mã nhân viên",dataIndex:"name",key:"name"},{title:"Tên nhân viên",dataIndex:"employee_name",key:"employee_name"},{title:"Email",dataIndex:"email",key:"email"},{title:"",key:"",render:a=>e.jsx("a",{children:e.jsx(re,{onClick:()=>F(a)})})}];n.useEffect(()=>{q()},[]),n.useEffect(()=>{let a=N;j!=null&&j!=""&&(a=N.filter(r=>r.employee_name.toLowerCase().includes(j.toLowerCase()))),v(a)},[j]);const q=async()=>{let r=await J.get("/api/method/mbw_service_v2.api.ess.employee.get_list_employee"),d=[];r!=null&&r.result!=null&&r.result.data!=null&&(d=r.result.data.map(u=>({...u,key:u.name}))),v(d),f(d)},b=()=>{S(!0)},T=()=>{S(!1)},E=()=>{S(!1)},R=a=>{P(a)},p=a=>{C(a.target.value)},w=()=>{let a=[];for(let r=0;r<i.length;r++){let d=h.filter(u=>u.name==i[r]);d!=null&&d.length>0&&a.push(d[0])}I(a),x(a),E()},F=a=>{const r=k.filter(d=>d.name!==a.name);I(r),x(r)},K={selectedRowKeys:i,onChange:R},V=i.length>0;return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"pt-4",children:[e.jsx("p",{className:"ml-4 font-semibold text-sm text-[#212B36]",children:"Danh sách nhân viên"}),e.jsxs("div",{onClick:b,className:"flex justify-center h-9 cursor-pointer items-center ml-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px]",children:[e.jsx("p",{className:"mr-2",children:e.jsx(Z,{})}),e.jsx("p",{className:"text-sm font-bold text-[#1877F2]",children:"Chọn nhân viên"})]}),e.jsx("div",{className:"pt-6 mx-4",children:e.jsx(M,{columns:A,dataSource:k})}),e.jsxs(U,{width:990,title:"Chọn nhân viên",open:_,onOk:T,onCancel:E,footer:!1,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(O,{className:"w-[320px] border-none pt-4",children:e.jsx($,{value:j,onChange:p,placeholder:"Tìm kiếm tên nhân viên",prefix:e.jsx(X,{})})}),e.jsxs("div",{children:[e.jsx("span",{style:{marginRight:8},children:V?`Đã chọn ${i.length} nhân viên`:""}),e.jsx(ee,{type:"primary",onClick:w,children:"Thêm"})]})]}),e.jsx("div",{className:"pt-4",children:e.jsx(M,{rowSelection:K,columns:We,dataSource:h})})]})]})})}function Ze(){const x=Ke(),[_]=pe.useForm(),[S,i]=n.useState("Open"),[P,h]=n.useState([]),[v,N]=n.useState([]),[f,j]=n.useState([]),[C,k]=n.useState({}),[I,A]=n.useState(!0),[q,b]=n.useState(!1),[T,E]=n.useState([]),[R,p]=n.useState(!1),w=async()=>{try{p(!0);let o=_.getFieldsValue(),g=F(o.campaign_start),L=F(o.campaign_end);if(g>=L){H.error("Thời gian bắt đầu phải nhỏ hơn Thời gian kết thúc"),p(!1);return}let B={},D=Object.getOwnPropertyNames(C);if(I&&(B.min_product=C.min_product),q&&(B.sequence_product=T),P.length===0){H.error("Vui lòng điền thông tin sản phẩm"),p(!1);return}if(v.length===0){H.error("Vui lòng chọn ít nhất một nhân viên."),p(!1);return}if(f.length===0){H.error("Vui lòng chọn ít nhất một khách hàng."),p(!1);return}let W=P.map(z=>z.name),ne=v.map(z=>z.name),se=f.map(z=>z.name),ae="/api/resource/VGM_Campaign",ce={campaign_name:o.campaign_name,campaign_description:o.campaign_description,start_date:g,end_date:L,campaign_status:S,categories:JSON.stringify(W),employees:JSON.stringify(ne),retails:JSON.stringify(se),setting_score_audit:B},Q=await J.post(ae,ce);Q!=null&&Q.data!=null?(H.success("Thêm mới thành công"),p(!1),x("/campaign")):(H.error("Thêm mới thất bại"),p(!1))}catch{H.error("Không thể thêm mới. Vui lòng kiểm tra lại thông tin thời gian, sản phẩm, nhân viên, khách hàng"),p(!1)}},F=o=>{const g=new Date(o),L=He(g).format("YYYY-MM-DD HH:mm:ss");return g.toISOString().slice(0,19).replace("T"," "),L},K=o=>{i(o)},V=o=>{h(o);const g={};o.forEach(B=>{B.products.forEach(D=>{g.hasOwnProperty(D.key)?g[D.key]=Math.min(g[D.key],parseInt(D.product_num)):g[D.key]=parseInt(D.product_num)})}),k({min_product:g})},a=o=>{N(o)},r=o=>{j(o)},d=o=>{A(o)},u=o=>{b(o)},te=o=>{E(o)};return e.jsxs(e.Fragment,{children:[e.jsx(Ve,{title:"Thêm mới chiến dịch",icon:e.jsx("p",{onClick:()=>x("/campaign"),className:"mr-2 cursor-pointer",children:e.jsx(Le,{})}),buttons:[{label:"Thêm mới",type:"primary",size:"20px",className:"flex items-center",loading:R,action:w}]}),e.jsx("div",{className:"bg-white pt-4 rounded-xl border-[#DFE3E8] border-[0.2px] border-solid",children:e.jsx(pe,{layout:"vertical",form:_,children:e.jsx(ze,{defaultActiveKey:"1",items:[{label:e.jsx("p",{className:"px-4 mb-0",children:" Thông tin chung"}),key:"1",children:e.jsx(Ge,{form:_,onCampaignStatusChange:K})},{label:e.jsx("p",{className:"px-4 mb-0",children:"Sản phẩm"}),key:"2",children:e.jsx(Ye,{onChangeCategory:V,onChangeCheckExistProduct:d,onChangeCheckSequenceProduct:u,onChangeSequenceProducts:te})},{label:e.jsx("p",{className:"px-4 mb-0",children:"Nhân viên bán hàng"}),key:"3",children:e.jsx(Qe,{onChangeEmployees:a})},{label:e.jsx("p",{className:"px-4 mb-0",children:"Khách hàng"}),key:"4",children:e.jsx(Je,{onChangeCustomer:r})}],indicatorSize:o=>o-18})})})]})}function Xe(){return e.jsxs(e.Fragment,{children:[e.jsx($e,{children:e.jsx("title",{children:" Campaign Create"})}),e.jsx(Ze,{})]})}export{Xe as default};