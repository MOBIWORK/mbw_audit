import{r as o,j as e,aH as H,C as f,h as b,$ as C,S as T,aL as K,aN as U,T as P,a4 as V,u as E,F,H as J,aI as L,A as $,s as z,d as W}from"./main-iKPneAyp.js";import{I as A,C as Y,a as M}from"./CloseCircleOutlined-9WLotESU.js";function B({form:c,recordData:n,onChangeScoringHuman:m}){const[_,I]=o.useState([]),[y,v]=o.useState([]),[u,S]=o.useState(0),[s,a]=o.useState(0),[r,g]=o.useState(0),[i,x]=o.useState([{label:"Đạt",value:1},{label:"Không đạt",value:0}]);o.useEffect(()=>{if(n){c.setFieldsValue({store:n.customer_name,campaign_name:n.campaign_name,employee_code:n.employee_name,quatity:n.quantity_cate,time_report:n.images_time,scoring_machine:n.scoring_machine==1?"Đạt":n.scoring_machine==0?"Không đạt":"",scoring_human:n.scoring_human}),g(n.scoring_human);let t=[];n.images!=null&&n.images!=""&&(t=JSON.parse(n.images));let l=[];n.images_ai!=null&&n.images_ai!=""&&(l=JSON.parse(n.images_ai)),I(t),v(l)}},[n]);const k=t=>{S(t)},O=t=>{a(t)},N=()=>{u>0&&S(u-1)},w=()=>{u<_.length-1&&S(u+1)},d=()=>{s>0&&a(s-1)},p=()=>{s<y.length-1&&a(s+1)},j=t=>{g(t),m(t)};return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"p-4 pt-6 pb-[40px]",children:[e.jsxs(H,{children:[e.jsx(f,{span:8,children:e.jsx(b,{label:"Khách hàng",name:"store",className:"pt-3",required:!0,children:e.jsx(C,{readOnly:!0})})}),e.jsx(f,{span:8,children:e.jsx(b,{label:"Chiến dịch",name:"campaign_name",className:"pt-3",required:!0,children:e.jsx(C,{readOnly:!0})})}),e.jsx(f,{span:8,children:e.jsx(b,{label:"Nhân viên thực hiện",name:"employee_code",className:"pt-3",required:!0,children:e.jsx(C,{readOnly:!0})})})]}),e.jsxs(H,{children:[e.jsx(f,{span:8,children:e.jsx(b,{label:"Thời gian thực hiện",name:"time_report",className:"pt-3",required:!0,children:e.jsx(C,{readOnly:!0})})}),e.jsx(f,{span:8,children:e.jsx(b,{label:"Điểm trưng bày AI chấm",name:"scoring_machine",className:"pt-3",required:!0,children:e.jsx(C,{readOnly:!0,style:{color:n&&n.scoring_machine===1?"green":n&&n.scoring_machine===0?"red":"black"}})})}),e.jsx(f,{span:8,children:e.jsx(b,{label:"Giám sát chấm",name:"scoring_human",className:"pt-3",required:!0,children:e.jsx(T,{className:"w-[200px] h-[36px]",value:r,onChange:t=>j(t),defaultValue:r,children:i.map(t=>e.jsx(T.Option,{value:t.value,children:t.label},t.value))})})})]}),e.jsxs(H,{children:[e.jsx(f,{span:8,children:e.jsxs(b,{label:"Hình ảnh cửa hàng",className:"pt-3",required:!0,children:[e.jsxs("div",{style:{position:"relative",width:"100%",height:"auto",overflow:"hidden",display:"flex",justifyContent:"center",alignItems:"center"},children:[e.jsx(A,{src:_[u],style:{maxWidth:"100%",maxHeight:"100%",objectFit:"cover",alignSelf:"center",borderRadius:"10px"}}),e.jsx("div",{onClick:N,style:{height:"50px",width:"35px",display:"flex",justifyContent:"center",borderRadius:"5px",position:"absolute",top:"50%",left:"10px",transform:"translateY(-50%)",cursor:"pointer",fontSize:"24px",zIndex:1,backgroundColor:"rgba(0, 0, 0, 0.2)"},children:e.jsx(K,{onClick:N,style:{color:"white"}})}),e.jsx("div",{onClick:w,style:{height:"50px",width:"35px",display:"flex",justifyContent:"center",borderRadius:"5px",position:"absolute",top:"50%",right:"10px",transform:"translateY(-50%)",cursor:"pointer",fontSize:"24px",zIndex:1,backgroundColor:"rgba(0, 0, 0, 0.2)"},children:e.jsx(U,{onClick:w,style:{color:"white"}})})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:"10px",overflowX:"hidden",marginTop:"10px"},children:_.map((t,l)=>e.jsx(A,{src:t,onClick:()=>k(l),style:{width:"80px",height:"80px",objectFit:"cover",cursor:"pointer",borderRadius:"10px"},preview:!1},l))})]})}),e.jsx(f,{span:8,children:e.jsxs(b,{label:"Hình ảnh AI trả về",className:"pt-3",required:!0,children:[e.jsxs("div",{style:{position:"relative",width:"100%",height:"auto",overflow:"hidden",display:"flex",justifyContent:"center",alignItems:"center"},children:[e.jsx(A,{src:y[s],style:{maxWidth:"100%",maxHeight:"100%",objectFit:"cover",alignSelf:"center",borderRadius:"10px"}}),e.jsx("div",{onClick:d,style:{height:"50px",width:"35px",display:"flex",justifyContent:"center",borderRadius:"5px",position:"absolute",top:"50%",left:"10px",transform:"translateY(-50%)",cursor:"pointer",fontSize:"24px",zIndex:1,backgroundColor:"rgba(0, 0, 0, 0.2)"},children:e.jsx(K,{onClick:d,style:{color:"white"}})}),e.jsx("div",{onClick:p,style:{height:"50px",width:"35px",display:"flex",justifyContent:"center",borderRadius:"5px",position:"absolute",top:"50%",right:"10px",transform:"translateY(-50%)",cursor:"pointer",fontSize:"24px",zIndex:1,backgroundColor:"rgba(0, 0, 0, 0.2)"},children:e.jsx(U,{onClick:p,style:{color:"white"}})})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:"10px",overflowX:"hidden",marginTop:"10px"},children:y.map((t,l)=>e.jsx(A,{src:t,onClick:()=>O(l),style:{width:"80px",height:"80px",objectFit:"cover",cursor:"pointer",borderRadius:"10px"},preview:!1},l))})]})}),e.jsx(f,{span:8})]})]})})}function G(c){const n={},[m,_]=o.useState([]);o.useState([{label:"Đạt",value:1},{label:"Không đạt",value:0}]),c.recordData?.detail_skus.forEach(s=>{const a=s.category,r=1;n[a]=(n[a]||0)+r});const I=(s,a,r)=>{_(g=>{let i=m.filter(x=>x.report_sku_id==r.name);if(i!=null&&i.length>0){let x=m.findIndex(k=>k.report_sku_id==r.name);m[x].sum_product_human=a}else m.push({report_sku_id:r.name,sum_product_human:a,scoring_human:r.scoring_human});return c.onChangeValReportSKU(m),m})},y=c.recordData?.category_names.map((s,a)=>{const r=Object.keys(s)[0];return{key:a.toString(),stt:(a+1).toString(),categoryName:Object.values(s)[0],number_product:n[r]||0}}),v=[{title:"STT",dataIndex:"stt"},{title:"Tên sản phẩm",dataIndex:"name_product"},{title:"Số lượng sản phẩm AI đếm",dataIndex:"sum_product"},{title:"Số lượng sản phẩm giám sát đếm",dataIndex:"sum_product_human",render:(s,a,r)=>e.jsx(C,{style:{width:"120px"},defaultValue:s,onChange:g=>I(r,parseInt(g.target.value),a)})},{title:"Điểm trưng bày AI chấm",dataIndex:"scoring_machine",render:s=>e.jsxs(e.Fragment,{children:[s===1&&e.jsxs("span",{style:{display:"flex"},children:[e.jsx(Y,{style:{fontSize:"17px",color:"green",paddingRight:"3px"}})," ",e.jsx("span",{style:{color:"green",verticalAlign:"middle"},children:"Đạt"})]}),s===0&&e.jsxs("span",{style:{display:"flex"},children:[e.jsx(M,{style:{fontSize:"17px",color:"red",paddingRight:"3px"}})," ",e.jsx("span",{style:{color:"red",verticalAlign:"middle"},children:"Không đạt"})]})]})}],u=[{title:"STT",dataIndex:"stt"},{title:"Danh mục sản phẩm",dataIndex:"categoryName"},{title:"Số lượng sản phẩm",dataIndex:"number_product"}],S=c.recordData?.category_names.map((s,a)=>{const r=Object.keys(s)[0];return(c.recordData?.detail_skus.filter(i=>i.category===r)).map((i,x)=>({key:`${a}-${x}`,stt:`${(x+1).toString().padStart(2,"0")}`,name_product:i.product_name,sum_product:i.sum_product.toString(),image:i.images,creation:i.creation,scoring_machine:i.scoring_machine,scoring_human:i.scoring_human,sum_product_human:i.sum_product_human,name:i.name,index_category:a}))});return e.jsx(e.Fragment,{children:e.jsx(P,{columns:u,expandable:{expandedRowRender:(s,a)=>e.jsx("div",{style:{margin:5},children:e.jsx(V,{columns:v,dataSource:S[a],pagination:!1})}),rowExpandable:s=>S[s.key].length>0},dataSource:y})})}function X(){const[c,n]=o.useState(null),[m,_]=o.useState(0),[I,y]=o.useState([]),[v,u]=o.useState(!1),[S,s]=o.useState(!1),a=E(),r=d=>{},[g]=F.useForm(),i=d=>{_(d)},x=d=>{y(d)},k=[{key:"1",label:e.jsx("span",{style:{fontWeight:700},children:"Thông tin chung"}),children:e.jsx(B,{form:g,recordData:c,onChangeScoringHuman:i})},{key:"2",label:e.jsx("span",{style:{fontWeight:700},children:"Sản phẩm"}),children:e.jsx(G,{recordData:c,onChangeValReportSKU:x})}];o.useEffect(()=>{let d=localStorage.getItem("recordData");if(d){let p=JSON.parse(d);n(p),_(p.scoring_human);let j=[];for(let t=0;t<p.detail_skus.length;t++){let l={report_sku_id:p.detail_skus[t].name,sum_product_human:p.detail_skus[t].sum_product_human,scoring_human:p.detail_skus[t].scoring_human};j.push(l)}y(j)}},[S]);const O=async()=>{u(!0);let d={name:c.name,scoring:m,arr_product:I};const j=await $.post("/api/method/mbw_audit.api.api.update_report",d);if(j!=null&&j.message=="ok"&&j.result!=null&&j.result.data=="success"){z.success("Cập nhật thành công"),u(!1);let t=JSON.parse(localStorage.getItem("dataReports")),l=JSON.parse(localStorage.getItem("recordData"));for(let h=0;h<l.detail_skus.length;h++)l.detail_skus[h].sum_product_human=I[h].sum_product_human,l.detail_skus[h].scoring_human=I[h].scoring_human;const R=t.findIndex(h=>h.name===l.name);if(R!==null&&R<t.length-1){const h=t[R+1];localStorage.setItem("recordData",JSON.stringify(h)),s(q=>!q)}else return}else z.error("Cập nhật thất bại"),u(!1)},N=()=>c?`${c.customer_name} - ${c.campaign_name}`:"Tiêu đề",w=()=>{a("/reports"),localStorage.removeItem("recordData"),localStorage.removeItem("dataReports")};return e.jsxs(e.Fragment,{children:[e.jsx(J,{title:N(),icon:e.jsx("p",{onClick:()=>w(),className:"mr-2 cursor-pointer",children:e.jsx(K,{})}),buttons:[{label:"Lưu lại",type:"primary",size:"20px",className:"flex items-center",loading:v,action:O}]}),e.jsx("div",{className:"bg-white  rounded-xl",children:e.jsx(F,{layout:"vertical",form:g,children:e.jsx(L,{items:k,defaultActiveKey:["1","2"],onChange:r,className:"custom-collapse"})})})]})}function D(){return e.jsxs(e.Fragment,{children:[e.jsx(W,{children:e.jsx("title",{children:"BÁO CÁO"})}),e.jsx(X,{})]})}export{D as default};
