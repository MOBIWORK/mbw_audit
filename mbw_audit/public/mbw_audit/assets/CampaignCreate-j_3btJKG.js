import{r as n,j as e,aH as ie,C as B,h as O,$,D as me,S as qe,G as Me,A as J,a1 as Z,T as M,aI as ue,a2 as U,a0 as X,a3 as Y,a4 as Re,Z as re,aJ as he,aK as Ae,u as Ke,F as pe,H as Ve,aL as Le,aM as ze,s as z,d as $e}from"./main-iKPneAyp.js";const He=[{label:"Hoạt động",value:"Open"},{label:"Đóng",value:"Close"}];function Ge({form:x,onCampaignStatusChange:C}){const[g,i]=n.useState("Open"),v=h=>{i(h),C(h)};return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"p-4 pt-6 pb-[58px]",children:[e.jsxs(ie,{children:[e.jsx(B,{span:8,children:e.jsx(O,{label:"Tên chiến dịch",name:"campaign_name",required:!0,children:e.jsx($,{})})}),e.jsx(B,{span:8,children:e.jsx(O,{label:"Thời gian bắt đầu",name:"campaign_start",required:!0,children:e.jsx(me,{className:"!bg-[#F4F6F8]",showTime:!0})})}),e.jsx(B,{span:8,children:e.jsx(O,{label:"Thời gian kết thúc",name:"campaign_end",required:!0,children:e.jsx(me,{className:"!bg-[#F4F6F8]",showTime:!0})})})]}),e.jsxs(ie,{className:"pt-2",children:[e.jsx(B,{span:8,children:e.jsx(O,{label:"Trạng thái",name:"campaign_status",children:e.jsx(qe,{defaultValue:"Open",options:He,onChange:v})})}),e.jsx(B,{span:8,children:e.jsx(O,{label:"Mô tả",name:"campaign_description",children:e.jsx(Me,{className:"bg-[#F5F7FA]",autoSize:{minRows:3,maxRows:5}})})})]})]})})}function Be({onChangeCategory:x,onChangeCheckExistProduct:C,onChangeCheckSequenceProduct:g,onChangeSequenceProducts:i}){const[v,h]=n.useState(!1),[P,N]=n.useState(!1),[y,S]=n.useState([]),[f,j]=n.useState([]),[I,R]=n.useState([]),[F,k]=n.useState([]),[T,E]=n.useState([]),[A,p]=n.useState([]),[_,q]=n.useState(""),[K,V]=n.useState(""),[s,r]=n.useState([]),[d,u]=n.useState([]),[ee,o]=n.useState(!0),[b,H]=n.useState(!1),[G,D]=n.useState([]);n.useState({}),n.useEffect(()=>{W()},[]),n.useEffect(()=>{W()},[_]);const W=async()=>{let t='/api/resource/VGM_Category?fields=["*"]';_!=null&&_!=""&&(t+=`&filters=[["category_name", "like", "%${_}%"]]`);const l=await J.get(t);if(l&&l.data){let a=l.data.map(c=>({...c,key:c.name}));for(let c=0;c<a.length;c++){let m=`/api/resource/VGM_Product?fields=["name","product_code","product_name"]&&filters=[["category","=","${a[c].name}"]]`,w=await J.get(m);if(w!=null&&w.data!=null){a[c].product_num=w.data.length;let ce=w.data.map(de=>({...de,key:de.name}));a[c].products=ce}else a[c].product_num=0,a[c].products=[]}R(a)}},te=t=>{q(t.target.value)},ne=t=>{const l=t.target.value.toLowerCase();V(l);const a=[...T];if(l===""){k(T);return}else{const c=a.filter(m=>m.product_name.toLowerCase().includes(l));k(c)}},se=(t,l)=>{S(t)},ae=(t,l)=>{const a=T.map((c,m)=>{const w=t.indexOf(c.name),ce=w!==-1?w+1:null;return{...c,sequence_product:ce}});k(a),j(t)},Q={selectedRowKeys:y,onChange:se},L={selectedProductRowKeys:f,onChange:ae},xe=()=>{let t=[],l=[];for(let a=0;a<y.length;a++){let c=I.filter(m=>m.name===y[a]);if(c!=null&&c.length>0){c[0].stt=t.length+1;let m={...c[0]};m.products=m.products.map(w=>({...w,cate_name:m.category_name,product_num:"1"})),l=l.concat(m.products),t.push(m)}}u(l),r(t),x(t),le()},ge=()=>{const t=F.filter(a=>f.includes(a.name));let l=t.map(a=>a.name);i(l),p(t),oe()},ye=y.length>0,Se=f.length>0,fe=()=>{h(!0)},je=()=>{N(!0);const t=[];s.forEach(l=>{t.push(...l.products.map(a=>({...a,cate_name:l.category_name})))}),k(t),E(t)},Ce=()=>{h(!1)},le=()=>{h(!1)},oe=()=>{N(!1)},ke=t=>{const l=s.filter(c=>c.name!==t.name).map((c,m)=>({...c,stt:m+1})),a=d.filter(c=>c.cate_name!==t.category_name);u(a),r(l),x(l)},_e=t=>{t.stopPropagation(),o(t.target.checked),C(t.target.checked)},be=t=>{H(t.target.checked),g(t.target.checked)},we=(t,l)=>{const a=[{title:"Mã sản phẩm",dataIndex:"product_code",key:"product_code"},{title:"Tên sản phẩm",dataIndex:"product_name",key:"product_name"}];return e.jsx(e.Fragment,{children:e.jsx("div",{style:{margin:5},children:e.jsx(Re,{columns:a,dataSource:t.products,pagination:!1})})})},ve=[{title:"STT",dataIndex:"stt",key:"stt"},{title:"Danh mục sản phẩm",dataIndex:"category_name",key:"category_name"},{title:"Số lượng sản phẩm",dataIndex:"product_num",key:"product_num"},{title:"",key:"",render:t=>e.jsx(re,{onClick:()=>ke(t)})}],Pe=[{title:"Mã sản phẩm",dataIndex:"product_code"},{title:"Tên sản phẩm",dataIndex:"product_name"},{title:"Danh mục",dataIndex:"cate_name"},{title:"Số lượng ít nhất",dataIndex:"product_num",render:(t,l,a)=>e.jsx($,{style:{width:"120px"},defaultValue:t,onChange:c=>Ie(a,parseInt(c.target.value))})}],Ne=[{key:"sort"},{title:"STT",dataIndex:"sequence_product"},{title:"Mã sản phẩm",dataIndex:"product_code"},{title:"Tên sản phẩm",dataIndex:"product_name"},{title:"Danh mục",dataIndex:"cate_name"}],Ie=(t,l)=>{const a=[...d];a[t].product_num=l,u(a),x(s)},Te=(t,l)=>{k(a=>a.map((c,m)=>{if(m===t){const w=c.sequence_product||0;return{...c,sequence_product:w+l}}return c}))},Ee=t=>{let l=t.map(a=>a.name);D(l),i(l)},De=[{key:"1",label:e.jsxs(he,{checked:ee,onClick:t=>{t.stopPropagation()},onChange:_e,children:[" ",e.jsxs("span",{style:{fontWeight:700,fontSize:"15px"},children:[" ","1. Tiêu chí tồn tại sản phẩm"]})," "]}),children:e.jsx("div",{className:"m-3",children:e.jsx(M,{columns:Pe,dataSource:d})})},{key:"2",label:e.jsxs(he,{onClick:t=>{t.stopPropagation()},checked:b,onChange:be,children:[" ",e.jsxs("span",{style:{fontWeight:700,fontSize:"15px"},children:[" ","2. Tiêu chí sắp xếp sản phẩm"]})," "]}),children:e.jsxs("div",{children:[e.jsxs("div",{onClick:je,className:"flex justify-center h-9 cursor-pointer items-center ml-4 mt-4 mb-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px] ",children:[e.jsx("p",{className:"mr-2",children:e.jsx(Z,{})}),e.jsx("p",{className:"text-sm font-bold text-[#1877F2]",children:"Chọn sản phẩm"})]}),e.jsx("div",{className:"ml-4 mb-4 mr-4 mt-4",style:{fontSize:"17px",fontStyle:"italic",fontWeight:400,lineHeight:"21px",letterSpacing:"0em",textAlign:"left",color:"rgba(99, 115, 129, 1)"},children:e.jsx("span",{children:"Di chuyển (kéo, thả) các sản phẩm để sắp xếp thứ tự sản phẩm"})}),e.jsx(Ae,{columnsTable:Ne,datasTable:A,keyPros:"sequence_product",onDragRowEvent:Ee})]})}],Oe=[{key:"1",label:e.jsxs("span",{style:{fontWeight:700,fontSize:"15px"},children:[" ","Thiết lập tiêu chí chấm điểm trưng bày sản phẩm"]}),children:e.jsx(ue,{items:De,defaultActiveKey:["1","2"],className:"custom-collapse-audit"})}],Fe=t=>{};return e.jsxs("div",{className:"pt-4",children:[e.jsx("p",{className:"ml-4 font-semibold text-sm text-[#212B36]",children:"Danh sách sản phẩm"}),e.jsxs("div",{onClick:fe,className:"flex justify-center h-9 cursor-pointer items-center ml-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px]",children:[e.jsx("p",{className:"mr-2",children:e.jsx(Z,{})}),e.jsx("p",{className:"text-sm font-bold text-[#1877F2]",children:"Chọn danh mục"})]}),e.jsxs("div",{className:"pt-6 mx-4",children:[e.jsx(M,{columns:ve,expandable:{expandedRowRender:we,defaultExpandedRowKeys:["0"]},dataSource:s}),e.jsx(ue,{items:Oe,defaultActiveKey:["1","2"],onChange:Fe,className:"custom-collapse-parent"})]}),e.jsxs(U,{width:990,title:"Chọn danh mục sản phẩm",open:v,onOk:Ce,onCancel:le,footer:!1,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(O,{className:"w-[320px] border-none pt-4",children:e.jsx($,{value:_,onChange:te,placeholder:"Tìm kiếm danh mục sản phẩm",prefix:e.jsx(X,{})})}),e.jsxs("div",{children:[e.jsx("span",{style:{marginRight:8},children:ye?`Đã chọn ${y.length} danh mục`:""}),e.jsx(Y,{type:"primary",onClick:xe,children:"Thêm"})]})]}),e.jsx("div",{className:"pt-4",children:e.jsx(M,{rowSelection:Q,columns:[{title:"Danh mục sản phẩm",dataIndex:"category_name",key:"category_name"},{title:"Số lượng sản phẩm",dataIndex:"product_num",key:"product_num"}],dataSource:I})})]}),e.jsxs(U,{width:990,title:"Sắp xếp sản phẩm",open:P,onCancel:oe,footer:!1,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(O,{className:"w-[320px] border-none pt-4",children:e.jsx($,{value:K,onChange:ne,placeholder:"Tìm kiếm sản phẩm",prefix:e.jsx(X,{})})}),e.jsxs("div",{children:[e.jsx("span",{style:{marginRight:8},children:Se?`Đã chọn ${f.length} sản phẩm`:""}),e.jsx(Y,{type:"primary",onClick:ge,children:"Thêm"})]})]}),e.jsx("div",{className:"pt-4",children:e.jsx(M,{rowSelection:L,columns:[{title:"Mã sản phẩm",dataIndex:"product_code",key:"product_code"},{title:"Tên sản phẩm",dataIndex:"product_name",key:"product_name"},{title:"Danh mục",dataIndex:"cate_name",key:"cate_name"},{title:"Chọn thứ tự",dataIndex:"sequence_product",render:(t,l,a)=>e.jsx($,{style:{width:"120px"},defaultValue:t,value:t,onChange:c=>Te(a,parseInt(c.target.value))})}],dataSource:F})})]})]})}function Je({onChangeCustomer:x}){const[C,g]=n.useState(!1),[i,v]=n.useState([]),[h,P]=n.useState([]),[N,y]=n.useState([]),[S,f]=n.useState([]),[j,I]=n.useState(""),R=[{title:"ID",dataIndex:"customer_code",key:"customer_code"},{title:"Tên khách hàng",key:"customer_name",dataIndex:"customer_name"},{title:"Nhóm khách hàng",dataIndex:"customer_group",key:"customer_group"},{title:"Địa chỉ",key:"customer_primary_address",dataIndex:"customer_primary_address"},{title:"",key:"action",render:(s,r)=>e.jsx("a",{children:e.jsx(re,{onClick:()=>q(r)})})}];n.useEffect(()=>{F()},[]),n.useEffect(()=>{let s=N;j!=null&&j!=""&&(s=N.filter(r=>r.customer_name.toLowerCase().includes(j.toLowerCase()))),P(s)},[j]);const F=async()=>{let r=await J.get("/api/method/mbw_dms.api.selling.customer.list_customer"),d=[];r!=null&&r.message=="ok"&&(d=r.result.data.map(u=>({...u,key:u.name}))),P(d),y(d)},k=()=>{g(!0)},T=()=>{g(!1)},E=()=>{g(!1)},A=s=>{I(s.target.value)},p=s=>{v(s)},_=()=>{let s=[];for(let r=0;r<i.length;r++){let d=h.filter(u=>u.name==i[r]);d!=null&&d.length>0&&s.push(d[0])}f(s),x(s),E()},q=s=>{const r=S.filter(d=>d.name!==s.name);f(r),x(r)},K={selectedRowKeys:i,onChange:p},V=i.length>0;return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"pt-4",children:[e.jsx("p",{className:"ml-4 font-semibold text-sm text-[#212B36]",children:"Danh sách khách hàng"}),e.jsxs("div",{onClick:k,className:"flex justify-center h-9 cursor-pointer items-center ml-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px]",children:[e.jsx("p",{className:"mr-2",children:e.jsx(Z,{})}),e.jsx("p",{className:"text-sm font-bold text-[#1877F2]",children:"Chọn khách hàng"})]}),e.jsx("div",{className:"pt-6 mx-4",children:e.jsx(M,{columns:R,dataSource:S})}),e.jsxs(U,{width:990,title:"Chọn khách hàng",open:C,onOk:T,onCancel:E,footer:!1,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(O,{className:"w-[320px] border-none pt-4",children:e.jsx($,{value:j,onChange:A,placeholder:"Tìm kiếm tên khách hàng",prefix:e.jsx(X,{})})}),e.jsxs("div",{children:[e.jsx("span",{style:{marginRight:8},children:V?`Đã chọn ${i.length} khách hàng`:""}),e.jsx(Y,{type:"primary",onClick:_,children:"Thêm"})]})]}),e.jsx("div",{className:"pt-4",children:e.jsx(M,{rowSelection:K,columns:[{title:"ID",dataIndex:"customer_code",key:"customer_code"},{title:"Tên khách hàng",key:"customer_name",dataIndex:"customer_name"},{title:"Nhóm khách hàng",dataIndex:"customer_group",key:"customer_group"},{title:"Địa chỉ",key:"customer_primary_address",dataIndex:"customer_primary_address"}],dataSource:h})})]})]})})}const We=[{title:"Mã nhân viên",dataIndex:"name",key:"name"},{title:"Tên nhân viên",dataIndex:"employee_name",key:"employee_name"},{title:"Email",dataIndex:"email",key:"email"}];function Qe({onChangeEmployees:x}){const[C,g]=n.useState(!1),[i,v]=n.useState([]),[h,P]=n.useState([]),[N,y]=n.useState([]),[S,f]=n.useState(""),[j,I]=n.useState([]),R=[{title:"Mã nhân viên",dataIndex:"name",key:"name"},{title:"Tên nhân viên",dataIndex:"employee_name",key:"employee_name"},{title:"Email",dataIndex:"email",key:"email"},{title:"",key:"",render:s=>e.jsx("a",{children:e.jsx(re,{onClick:()=>q(s)})})}];n.useEffect(()=>{F()},[]),n.useEffect(()=>{let s=N;S!=null&&S!=""&&(s=N.filter(r=>r.employee_name.toLowerCase().includes(S.toLowerCase()))),P(s)},[S]);const F=async()=>{let r=await J.get("/api/method/mbw_service_v2.api.ess.employee.get_list_employee"),d=[];r!=null&&r.result!=null&&r.result.data!=null&&(d=r.result.data.map(u=>({...u,key:u.name}))),P(d),y(d)},k=()=>{g(!0)},T=()=>{g(!1)},E=()=>{g(!1)},A=s=>{v(s)},p=s=>{f(s.target.value)},_=()=>{let s=[];for(let r=0;r<i.length;r++){let d=h.filter(u=>u.name==i[r]);d!=null&&d.length>0&&s.push(d[0])}I(s),x(s),E()},q=s=>{const r=j.filter(d=>d.name!==s.name);I(r),x(r)},K={selectedRowKeys:i,onChange:A},V=i.length>0;return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"pt-4",children:[e.jsx("p",{className:"ml-4 font-semibold text-sm text-[#212B36]",children:"Danh sách nhân viên"}),e.jsxs("div",{onClick:k,className:"flex justify-center h-9 cursor-pointer items-center ml-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px]",children:[e.jsx("p",{className:"mr-2",children:e.jsx(Z,{})}),e.jsx("p",{className:"text-sm font-bold text-[#1877F2]",children:"Chọn nhân viên"})]}),e.jsx("div",{className:"pt-6 mx-4",children:e.jsx(M,{columns:R,dataSource:j})}),e.jsxs(U,{width:990,title:"Chọn nhân viên",open:C,onOk:T,onCancel:E,footer:!1,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(O,{className:"w-[320px] border-none pt-4",children:e.jsx($,{value:S,onChange:p,placeholder:"Tìm kiếm tên nhân viên",prefix:e.jsx(X,{})})}),e.jsxs("div",{children:[e.jsx("span",{style:{marginRight:8},children:V?`Đã chọn ${i.length} nhân viên`:""}),e.jsx(Y,{type:"primary",onClick:_,children:"Thêm"})]})]}),e.jsx("div",{className:"pt-4",children:e.jsx(M,{rowSelection:K,columns:We,dataSource:h})})]})]})})}function Ze(){const x=Ke(),[C]=pe.useForm(),[g,i]=n.useState("Open"),[v,h]=n.useState([]),[P,N]=n.useState([]),[y,S]=n.useState([]),[f,j]=n.useState({}),[I,R]=n.useState(!0),[F,k]=n.useState(!1),[T,E]=n.useState([]),[A,p]=n.useState(!1),_=async()=>{try{p(!0);let o=C.getFieldsValue(),b=q(o.campaign_start),H=q(o.campaign_end);if(b>=H){z.error("Thời gian bắt đầu phải nhỏ hơn Thời gian kết thúc"),p(!1);return}let G={},D=Object.getOwnPropertyNames(f);if(I&&(G.min_product=f.min_product),F&&(G.sequence_product=T),v.length===0){z.error("Vui lòng điền thông tin sản phẩm"),p(!1);return}if(P.length===0){z.error("Vui lòng chọn ít nhất một nhân viên."),p(!1);return}if(y.length===0){z.error("Vui lòng chọn ít nhất một khách hàng."),p(!1);return}let W=v.map(L=>L.name),te=P.map(L=>L.name),ne=y.map(L=>L.name),se="/api/resource/VGM_Campaign",ae={campaign_name:o.campaign_name,campaign_description:o.campaign_description,start_date:b,end_date:H,campaign_status:g,categories:JSON.stringify(W),employees:JSON.stringify(te),retails:JSON.stringify(ne),setting_score_audit:G},Q=await J.post(se,ae);Q!=null&&Q.data!=null?(z.success("Thêm mới thành công"),p(!1),x("/campaign")):(z.error("Thêm mới thất bại"),p(!1))}catch{z.error("Không thể thêm mới. Vui lòng kiểm tra lại thông tin thời gian, sản phẩm, nhân viên, khách hàng"),p(!1)}},q=o=>new Date(o).toISOString().slice(0,19).replace("T"," "),K=o=>{i(o)},V=o=>{h(o);const b={};o.forEach(G=>{G.products.forEach(D=>{b.hasOwnProperty(D.key)?b[D.key]=Math.min(b[D.key],parseInt(D.product_num)):b[D.key]=parseInt(D.product_num)})}),j({min_product:b})},s=o=>{N(o)},r=o=>{S(o)},d=o=>{R(o)},u=o=>{k(o)},ee=o=>{E(o)};return e.jsxs(e.Fragment,{children:[e.jsx(Ve,{title:"Thêm mới chiến dịch",icon:e.jsx("p",{onClick:()=>x("/campaign"),className:"mr-2 cursor-pointer",children:e.jsx(Le,{})}),buttons:[{label:"Thêm mới",type:"primary",size:"20px",className:"flex items-center",loading:A,action:_}]}),e.jsx("div",{className:"bg-white pt-4 rounded-xl border-[#DFE3E8] border-[0.2px] border-solid",children:e.jsx(pe,{layout:"vertical",form:C,children:e.jsx(ze,{defaultActiveKey:"1",items:[{label:e.jsx("p",{className:"px-4 mb-0",children:" Thông tin chung"}),key:"1",children:e.jsx(Ge,{form:C,onCampaignStatusChange:K})},{label:e.jsx("p",{className:"px-4 mb-0",children:"Sản phẩm"}),key:"2",children:e.jsx(Be,{onChangeCategory:V,onChangeCheckExistProduct:d,onChangeCheckSequenceProduct:u,onChangeSequenceProducts:ee})},{label:e.jsx("p",{className:"px-4 mb-0",children:"Nhân viên bán hàng"}),key:"3",children:e.jsx(Qe,{onChangeEmployees:s})},{label:e.jsx("p",{className:"px-4 mb-0",children:"Khách hàng"}),key:"4",children:e.jsx(Je,{onChangeCustomer:r})}],indicatorSize:o=>o-18})})})]})}function Xe(){return e.jsxs(e.Fragment,{children:[e.jsx($e,{children:e.jsx("title",{children:" Campaign Create"})}),e.jsx(Ze,{})]})}export{Xe as default};