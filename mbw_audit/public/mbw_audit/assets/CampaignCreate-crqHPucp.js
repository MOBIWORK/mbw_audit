import{r as s,j as e,aG as ie,C as G,g as O,Z as z,D as me,S as qe,E as Me,A as B,a0 as Y,T as M,aH as ue,a1 as Z,$ as U,a2 as X,a3 as Re,Y as le,aI as he,aJ as Ae,u as Ke,F as pe,H as Ve,aK as Le,aL as ze,s as Q,d as $e}from"./main--OB17fI9.js";const He=[{label:"Hoạt động",value:"Open"},{label:"Đóng",value:"Close"}];function Ge({form:h,onCampaignStatusChange:j}){const[p,i]=s.useState("Open"),v=u=>{i(u),j(u)};return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"p-4 pt-6 pb-[58px]",children:[e.jsxs(ie,{children:[e.jsx(G,{span:8,children:e.jsx(O,{label:"Tên chiến dịch",name:"campaign_name",required:!0,children:e.jsx(z,{})})}),e.jsx(G,{span:8,children:e.jsx(O,{label:"Thời gian bắt đầu",name:"campaign_start",required:!0,children:e.jsx(me,{className:"!bg-[#F4F6F8]",showTime:!0})})}),e.jsx(G,{span:8,children:e.jsx(O,{label:"Thời gian kết thúc",name:"campaign_end",required:!0,children:e.jsx(me,{className:"!bg-[#F4F6F8]",showTime:!0})})})]}),e.jsxs(ie,{className:"pt-2",children:[e.jsx(G,{span:8,children:e.jsx(O,{label:"Trạng thái",name:"campaign_status",children:e.jsx(qe,{defaultValue:"Open",options:He,onChange:v})})}),e.jsx(G,{span:8,children:e.jsx(O,{label:"Mô tả",name:"campaign_description",children:e.jsx(Me,{className:"bg-[#F5F7FA]",autoSize:{minRows:3,maxRows:5}})})})]})]})})}function Be({onChangeCategory:h,onChangeCheckExistProduct:j,onChangeCheckSequenceProduct:p,onChangeSequenceProducts:i}){const[v,u]=s.useState(!1),[P,_]=s.useState(!1),[C,x]=s.useState([]),[g,y]=s.useState([]),[N,R]=s.useState([]),[F,b]=s.useState([]),[I,E]=s.useState([]),[A,w]=s.useState([]),[f,q]=s.useState(""),[K,V]=s.useState(""),[n,c]=s.useState([]),[d,m]=s.useState([]),[ee,o]=s.useState(!0),[k,$]=s.useState(!1),[H,T]=s.useState([]);s.useState({}),s.useEffect(()=>{J()},[]),s.useEffect(()=>{J()},[f]);const J=async()=>{let t='/api/resource/VGM_Category?fields=["*"]';f!=null&&f!=""&&(t+=`&filters=[["category_name", "like", "%${f}%"]]`);const l=await B.get(t);if(l&&l.data){let a=l.data.map(r=>({...r,key:r.name}));for(let r=0;r<a.length;r++){let S=`/api/resource/VGM_Product?fields=["name","product_code","product_name"]&&filters=[["category","=","${a[r].name}"]]`,D=await B.get(S);if(D!=null&&D.data!=null){a[r].product_num=D.data.length;let ce=D.data.map(de=>({...de,key:de.name}));a[r].products=ce}else a[r].product_num=0,a[r].products=[]}R(a)}},te=t=>{q(t.target.value)},se=t=>{const l=t.target.value.toLowerCase();V(l);const a=[...I];if(l===""){b(I);return}else{const r=a.filter(S=>S.product_name.toLowerCase().includes(l));b(r)}},ne=(t,l)=>{x(t)},ae=(t,l)=>{const a=I.map((r,S)=>{const D=t.indexOf(r.name),ce=D!==-1?D+1:null;return{...r,sequence_product:ce}});b(a),y(t)},W={selectedRowKeys:C,onChange:ne},L={selectedProductRowKeys:g,onChange:ae},xe=()=>{let t=[],l=[];for(let a=0;a<C.length;a++){let r=N.filter(S=>S.name===C[a]);if(r!=null&&r.length>0){r[0].stt=t.length+1;let S={...r[0]};S.products=S.products.map(D=>({...D,cate_name:S.category_name,product_num:"1"})),l=l.concat(S.products),t.push(S)}}m(l),c(t),h(t),re()},ge=()=>{const t=F.filter(a=>g.includes(a.name));let l=t.map(a=>a.name);i(l),w(t),oe()},ye=C.length>0,Se=g.length>0,je=()=>{u(!0)},Ce=()=>{_(!0);const t=[];n.forEach(l=>{t.push(...l.products.map(a=>({...a,cate_name:l.category_name})))}),b(t),E(t)},fe=()=>{u(!1)},re=()=>{u(!1)},oe=()=>{_(!1)},ke=t=>{const l=n.filter(r=>r.name!==t.name),a=d.filter(r=>r.cate_name!==t.category_name);m(a),c(l),h(l)},_e=t=>{o(t.target.checked),j(t.target.checked)},be=t=>{$(t.target.checked),p(t.target.checked)},we=(t,l)=>{const a=[{title:"Mã sản phẩm",dataIndex:"product_code",key:"product_code"},{title:"Tên sản phẩm",dataIndex:"product_name",key:"product_name"}];return e.jsx(e.Fragment,{children:e.jsx("div",{style:{margin:5},children:e.jsx(Re,{columns:a,dataSource:t.products,pagination:!1})})})},ve=[{title:"STT",dataIndex:"stt",key:"stt"},{title:"Danh mục sản phẩm",dataIndex:"category_name",key:"category_name"},{title:"Số lượng sản phẩm",dataIndex:"product_num",key:"product_num"},{title:"",key:"",render:t=>e.jsx(le,{onClick:()=>ke(t)})}],Pe=[{title:"Mã sản phẩm",dataIndex:"product_code"},{title:"Tên sản phẩm",dataIndex:"product_name"},{title:"Danh mục",dataIndex:"cate_name"},{title:"Số lượng ít nhất",dataIndex:"product_num",render:(t,l,a)=>e.jsx(z,{style:{width:"120px"},defaultValue:t,onChange:r=>Ie(a,parseInt(r.target.value))})}],Ne=[{key:"sort"},{title:"STT",dataIndex:"sequence_product"},{title:"Mã sản phẩm",dataIndex:"product_code"},{title:"Tên sản phẩm",dataIndex:"product_name"},{title:"Danh mục",dataIndex:"cate_name"}],Ie=(t,l)=>{const a=[...d];a[t].product_num=l,m(a),h(n)},Ee=(t,l)=>{},Te=t=>{let l=t.map(a=>a.name);T(l),i(l)},De=[{key:"1",label:e.jsxs(he,{checked:ee,onChange:_e,children:[" ",e.jsxs("span",{style:{fontWeight:700,fontSize:"15px"},children:[" ","1. Tiêu chí tồn tại sản phẩm"]})," "]}),children:e.jsx("div",{className:"m-3",children:e.jsx(M,{columns:Pe,dataSource:d})})},{key:"2",label:e.jsxs(he,{checked:k,onChange:be,children:[" ",e.jsxs("span",{style:{fontWeight:700,fontSize:"15px"},children:[" ","2. Tiêu chí sắp xếp sản phẩm"]})," "]}),children:e.jsxs("div",{children:[e.jsxs("div",{onClick:Ce,className:"flex justify-center h-9 cursor-pointer items-center ml-4 mt-4 mb-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px] ",children:[e.jsx("p",{className:"mr-2",children:e.jsx(Y,{})}),e.jsx("p",{className:"text-sm font-bold text-[#1877F2]",children:"Chọn sản phẩm"})]}),e.jsx("div",{className:"ml-4 mb-4 mr-4 mt-4",style:{fontSize:"17px",fontStyle:"italic",fontWeight:400,lineHeight:"21px",letterSpacing:"0em",textAlign:"left",color:"rgba(99, 115, 129, 1)"},children:e.jsx("span",{children:"Di chuyển (kéo, thả) các sản phẩm để sắp xếp thứ tự sản phẩm"})}),e.jsx(Ae,{columnsTable:Ne,datasTable:A,keyPros:"sequence_product",onDragRowEvent:Te})]})}],Oe=[{key:"1",label:e.jsxs("span",{style:{fontWeight:700,fontSize:"15px"},children:[" ","Thiết lập tiêu chí chấm điểm trưng bày sản phẩm"]}),children:e.jsx(ue,{items:De,defaultActiveKey:["1","2"],className:"custom-collapse-audit"})}],Fe=t=>{};return e.jsxs("div",{className:"pt-4",children:[e.jsx("p",{className:"ml-4 font-semibold text-sm text-[#212B36]",children:"Danh sách sản phẩm"}),e.jsxs("div",{onClick:je,className:"flex justify-center h-9 cursor-pointer items-center ml-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px]",children:[e.jsx("p",{className:"mr-2",children:e.jsx(Y,{})}),e.jsx("p",{className:"text-sm font-bold text-[#1877F2]",children:"Chọn danh mục"})]}),e.jsxs("div",{className:"pt-6 mx-4",children:[e.jsx(M,{columns:ve,expandable:{expandedRowRender:we,defaultExpandedRowKeys:["0"]},dataSource:n}),e.jsx(ue,{items:Oe,defaultActiveKey:["1","2"],onChange:Fe,className:"custom-collapse-parent"})]}),e.jsxs(Z,{width:990,title:"Chọn danh mục sản phẩm",open:v,onOk:fe,onCancel:re,footer:!1,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(O,{className:"w-[320px] border-none pt-4",children:e.jsx(z,{value:f,onChange:te,placeholder:"Tìm kiếm danh mục sản phẩm",prefix:e.jsx(U,{})})}),e.jsxs("div",{children:[e.jsx("span",{style:{marginRight:8},children:ye?`Đã chọn ${C.length} danh mục`:""}),e.jsx(X,{type:"primary",onClick:xe,children:"Thêm"})]})]}),e.jsx("div",{className:"pt-4",children:e.jsx(M,{rowSelection:W,columns:[{title:"Danh mục sản phẩm",dataIndex:"category_name",key:"category_name"},{title:"Số lượng sản phẩm",dataIndex:"product_num",key:"product_num"}],dataSource:N})})]}),e.jsxs(Z,{width:990,title:"Sắp xếp sản phẩm",open:P,onCancel:oe,footer:!1,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(O,{className:"w-[320px] border-none pt-4",children:e.jsx(z,{value:K,onChange:se,placeholder:"Tìm kiếm sản phẩm",prefix:e.jsx(U,{})})}),e.jsxs("div",{children:[e.jsx("span",{style:{marginRight:8},children:Se?`Đã chọn ${g.length} sản phẩm`:""}),e.jsx(X,{type:"primary",onClick:ge,children:"Thêm"})]})]}),e.jsx("div",{className:"pt-4",children:e.jsx(M,{rowSelection:L,columns:[{title:"Mã sản phẩm",dataIndex:"product_code",key:"product_code"},{title:"Tên sản phẩm",dataIndex:"product_name",key:"product_name"},{title:"Danh mục",dataIndex:"cate_name",key:"cate_name"},{title:"Chọn thứ tự",dataIndex:"sequence_product",dataIndex:"sequence_product",render:(t,l,a)=>e.jsx(z,{style:{width:"120px"},defaultValue:t,value:t,onChange:r=>Ee(a,parseInt(r.target.value))})}],dataSource:F})})]})]})}function Je({onChangeCustomer:h}){const[j,p]=s.useState(!1),[i,v]=s.useState([]),[u,P]=s.useState([]),[_,C]=s.useState([]),[x,g]=s.useState([]),[y,N]=s.useState(""),R=[{title:"ID",dataIndex:"customer_code",key:"customer_code"},{title:"Tên khách hàng",key:"customer_name",dataIndex:"customer_name"},{title:"Nhóm khách hàng",dataIndex:"customer_group",key:"customer_group"},{title:"Địa chỉ",key:"customer_primary_address",dataIndex:"customer_primary_address"},{title:"",key:"action",render:(n,c)=>e.jsx("a",{children:e.jsx(le,{onClick:()=>q(c)})})}];s.useEffect(()=>{F()},[]),s.useEffect(()=>{let n=_;y!=null&&y!=""&&(n=_.filter(c=>c.customer_name.toLowerCase().includes(y.toLowerCase()))),P(n)},[y]);const F=async()=>{let c=await B.get("/api/method/mbw_dms.api.selling.customer.list_customer"),d=[];c!=null&&c.message=="ok"&&(d=c.result.data.map(m=>({...m,key:m.name}))),P(d),C(d)},b=()=>{p(!0)},I=()=>{p(!1)},E=()=>{p(!1)},A=n=>{N(n.target.value)},w=n=>{v(n)},f=()=>{let n=[];for(let c=0;c<i.length;c++){let d=u.filter(m=>m.name==i[c]);d!=null&&d.length>0&&n.push(d[0])}g(n),h(n),E()},q=n=>{const c=x.filter(d=>d.name!==n.name);g(c),h(c)},K={selectedRowKeys:i,onChange:w},V=i.length>0;return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"pt-4",children:[e.jsx("p",{className:"ml-4 font-semibold text-sm text-[#212B36]",children:"Danh sách khách hàng"}),e.jsxs("div",{onClick:b,className:"flex justify-center h-9 cursor-pointer items-center ml-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px]",children:[e.jsx("p",{className:"mr-2",children:e.jsx(Y,{})}),e.jsx("p",{className:"text-sm font-bold text-[#1877F2]",children:"Chọn khách hàng"})]}),e.jsx("div",{className:"pt-6 mx-4",children:e.jsx(M,{columns:R,dataSource:x})}),e.jsxs(Z,{width:990,title:"Chọn khách hàng",open:j,onOk:I,onCancel:E,footer:!1,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(O,{className:"w-[320px] border-none pt-4",children:e.jsx(z,{value:y,onChange:A,placeholder:"Tìm kiếm tên khách hàng",prefix:e.jsx(U,{})})}),e.jsxs("div",{children:[e.jsx("span",{style:{marginRight:8},children:V?`Đã chọn ${i.length} khách hàng`:""}),e.jsx(X,{type:"primary",onClick:f,children:"Thêm"})]})]}),e.jsx("div",{className:"pt-4",children:e.jsx(M,{rowSelection:K,columns:[{title:"ID",dataIndex:"customer_code",key:"customer_code"},{title:"Tên khách hàng",key:"customer_name",dataIndex:"customer_name"},{title:"Nhóm khách hàng",dataIndex:"customer_group",key:"customer_group"},{title:"Địa chỉ",key:"customer_primary_address",dataIndex:"customer_primary_address"}],dataSource:u})})]})]})})}const We=[{title:"Mã nhân viên",dataIndex:"name",key:"name"},{title:"Tên nhân viên",dataIndex:"employee_name",key:"employee_name"},{title:"Email",dataIndex:"email",key:"email"}];function Qe({onChangeEmployees:h}){const[j,p]=s.useState(!1),[i,v]=s.useState([]),[u,P]=s.useState([]),[_,C]=s.useState([]),[x,g]=s.useState(""),[y,N]=s.useState([]),R=[{title:"Mã nhân viên",dataIndex:"name",key:"name"},{title:"Tên nhân viên",dataIndex:"employee_name",key:"employee_name"},{title:"Email",dataIndex:"email",key:"email"},{title:"",key:"",render:n=>e.jsx("a",{children:e.jsx(le,{onClick:()=>q(n)})})}];s.useEffect(()=>{F()},[]),s.useEffect(()=>{let n=_;x!=null&&x!=""&&(n=_.filter(c=>c.employee_name.toLowerCase().includes(x.toLowerCase()))),P(n)},[x]);const F=async()=>{let c=await B.get("/api/method/mbw_service_v2.api.ess.employee.get_list_employee"),d=[];c!=null&&c.result!=null&&c.result.data!=null&&(d=c.result.data.map(m=>({...m,key:m.name}))),P(d),C(d)},b=()=>{p(!0)},I=()=>{p(!1)},E=()=>{p(!1)},A=n=>{v(n)},w=n=>{g(n.target.value)},f=()=>{let n=[];for(let c=0;c<i.length;c++){let d=u.filter(m=>m.name==i[c]);d!=null&&d.length>0&&n.push(d[0])}N(n),h(n),E()},q=n=>{const c=y.filter(d=>d.name!==n.name);N(c),h(c)},K={selectedRowKeys:i,onChange:A},V=i.length>0;return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"pt-4",children:[e.jsx("p",{className:"ml-4 font-semibold text-sm text-[#212B36]",children:"Danh sách nhân viên"}),e.jsxs("div",{onClick:b,className:"flex justify-center h-9 cursor-pointer items-center ml-4 border-solid border-[1px] border-indigo-600 rounded-xl w-[160px]",children:[e.jsx("p",{className:"mr-2",children:e.jsx(Y,{})}),e.jsx("p",{className:"text-sm font-bold text-[#1877F2]",children:"Chọn nhân viên"})]}),e.jsx("div",{className:"pt-6 mx-4",children:e.jsx(M,{columns:R,dataSource:y})}),e.jsxs(Z,{width:990,title:"Chọn nhân viên",open:j,onOk:I,onCancel:E,footer:!1,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(O,{className:"w-[320px] border-none pt-4",children:e.jsx(z,{value:x,onChange:w,placeholder:"Tìm kiếm tên nhân viên",prefix:e.jsx(U,{})})}),e.jsxs("div",{children:[e.jsx("span",{style:{marginRight:8},children:V?`Đã chọn ${i.length} nhân viên`:""}),e.jsx(X,{type:"primary",onClick:f,children:"Thêm"})]})]}),e.jsx("div",{className:"pt-4",children:e.jsx(M,{rowSelection:K,columns:We,dataSource:u})})]})]})})}function Ye(){const h=Ke(),[j]=pe.useForm(),[p,i]=s.useState("Open"),[v,u]=s.useState([]),[P,_]=s.useState([]),[C,x]=s.useState([]),[g,y]=s.useState({}),[N,R]=s.useState(!0),[F,b]=s.useState(!1),[I,E]=s.useState([]),[A,w]=s.useState(!1),f=async()=>{try{w(!0);let o=j.getFieldsValue(),k=q(o.campaign_start),$=q(o.campaign_end);if(k>=$){Q.error("Thời gian bắt đầu phải nhỏ hơn Thời gian kết thúc");return}let H={},T=Object.getOwnPropertyNames(g);N&&(H.min_product=g.min_product),F&&(H.sequence_product=I);let J=v.map(L=>L.name),te=P.map(L=>L.name),se=C.map(L=>L.name),ne="/api/resource/VGM_Campaign",ae={campaign_name:o.campaign_name,campaign_description:o.campaign_description,start_date:k,end_date:$,campaign_status:p,categories:JSON.stringify(J),employees:JSON.stringify(te),retails:JSON.stringify(se),setting_score_audit:H},W=await B.post(ne,ae);W!=null&&W.data!=null?(Q.success("Thêm mới thành công"),w(!1),h("/campaign")):(Q.error("Thêm mới thất bại"),w(!1))}catch{Q.error("Không thể thêm mới. Vui lòng kiểm tra lại thông tin thời gian, sản phẩm, nhân viên, khách hàng"),w(!1)}},q=o=>new Date(o).toISOString().slice(0,19).replace("T"," "),K=o=>{i(o)},V=o=>{u(o);const k={};o.forEach(H=>{H.products.forEach(T=>{k.hasOwnProperty(T.key)?k[T.key]=Math.min(k[T.key],parseInt(T.product_num)):k[T.key]=parseInt(T.product_num)})}),y({min_product:k})},n=o=>{_(o)},c=o=>{x(o)},d=o=>{R(o)},m=o=>{b(o)},ee=o=>{E(o)};return e.jsxs(e.Fragment,{children:[e.jsx(Ve,{title:"Thêm mới chiến dịch",icon:e.jsx("p",{onClick:()=>h("/campaign"),className:"mr-2 cursor-pointer",children:e.jsx(Le,{})}),buttons:[{label:"Thêm mới",type:"primary",size:"20px",className:"flex items-center",loading:A,action:f}]}),e.jsx("div",{className:"bg-white pt-4 rounded-xl border-[#DFE3E8] border-[0.2px] border-solid",children:e.jsx(pe,{layout:"vertical",form:j,children:e.jsx(ze,{defaultActiveKey:"1",items:[{label:e.jsx("p",{className:"px-4 mb-0",children:" Thông tin chung"}),key:"1",children:e.jsx(Ge,{form:j,onCampaignStatusChange:K})},{label:e.jsx("p",{className:"px-4 mb-0",children:"Sản phẩm"}),key:"2",children:e.jsx(Be,{onChangeCategory:V,onChangeCheckExistProduct:d,onChangeCheckSequenceProduct:m,onChangeSequenceProducts:ee})},{label:e.jsx("p",{className:"px-4 mb-0",children:"Nhân viên bán hàng"}),key:"3",children:e.jsx(Qe,{onChangeEmployees:n})},{label:e.jsx("p",{className:"px-4 mb-0",children:"Khách hàng"}),key:"4",children:e.jsx(Je,{onChangeCustomer:c})}],indicatorSize:o=>o-18})})})]})}function Ue(){return e.jsxs(e.Fragment,{children:[e.jsx($e,{children:e.jsx("title",{children:" Campaign Create"})}),e.jsx(Ye,{})]})}export{Ue as default};