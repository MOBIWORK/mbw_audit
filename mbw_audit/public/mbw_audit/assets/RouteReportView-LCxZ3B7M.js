import{r as i,j as e,aJ as z,C as f,g as I,Z as v,S as J,a3 as q,a4 as $,T as V,a5 as M,u as Y,F as P,H as W,aO as B,aK as G,A as X,s as E,d as Z}from"./main-mmrtcI-f.js";import{I as F}from"./index-Y0O_0VS8.js";import{C as Q,a as D}from"./CloseCircleOutlined-jy_bMYpD.js";function ee({form:c,recordData:a,onChangeScoringHuman:g}){const[j,C]=i.useState([]),[S,R]=i.useState([]),[p,y]=i.useState(0),[n,r]=i.useState(0),[o,_]=i.useState(0),[l,x]=i.useState([{label:"Đạt",value:1},{label:"Không đạt",value:0}]);i.useEffect(()=>{if(a){c.setFieldsValue({store:a.customer_name,campaign_name:a.campaign_name,employee_code:a.employee_name,quatity:a.quantity_cate,time_report:U(a.images_time),scoring_machine:a.scoring_machine==1?"Đạt":a.scoring_machine==0?"Không đạt":"",scoring_human:a.scoring_human}),_(a.scoring_human);let s=[];a.images!=null&&a.images!=""&&(s=JSON.parse(a.images));let t=[];a.images_ai!=null&&a.images_ai!=""&&(t=JSON.parse(a.images_ai)),C(s),R(t)}},[a]);const k=s=>{y(s)},O=s=>{r(s)},w=()=>{p>0&&y(p-1)},A=()=>{p<j.length-1&&y(p+1)},T=()=>{n>0&&r(n-1)},K=()=>{n<S.length-1&&r(n+1)},H=s=>{_(s),g(s)},U=s=>{let t=new Date(s),d=t.getDate(),u=t.getMonth()+1,m=t.getFullYear(),b=t.getHours(),N=t.getMinutes();return`${d.toString().padStart(2,"0")}/${u.toString().padStart(2,"0")}/${m} ${b.toString().padStart(2,"0")}:${N.toString().padStart(2,"0")}`};return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"p-4 pt-6 pb-[40px]",children:[e.jsxs(z,{children:[e.jsx(f,{span:8,children:e.jsx(I,{label:"Khách hàng",name:"store",className:"pt-3",required:!0,children:e.jsx(v,{readOnly:!0})})}),e.jsx(f,{span:8,children:e.jsx(I,{label:"Chiến dịch",name:"campaign_name",className:"pt-3",required:!0,children:e.jsx(v,{readOnly:!0})})}),e.jsx(f,{span:8,children:e.jsx(I,{label:"Nhân viên thực hiện",name:"employee_code",className:"pt-3",required:!0,children:e.jsx(v,{readOnly:!0})})})]}),e.jsxs(z,{children:[e.jsx(f,{span:8,children:e.jsx(I,{label:"Thời gian thực hiện",name:"time_report",className:"pt-3",required:!0,children:e.jsx(v,{readOnly:!0})})}),e.jsx(f,{span:8,children:e.jsx(I,{label:"Điểm trưng bày AI chấm",name:"scoring_machine",className:"pt-3",required:!0,children:e.jsx(v,{readOnly:!0,style:{color:a&&a.scoring_machine===1?"green":a&&a.scoring_machine===0?"red":"black"}})})}),e.jsx(f,{span:8,children:e.jsx(I,{label:"Giám sát chấm",name:"scoring_human",className:"pt-3",required:!0,children:e.jsx(J,{className:"w-[200px] h-[36px]",value:o,onChange:s=>H(s),defaultValue:o,children:l.map(s=>e.jsx(J.Option,{value:s.value,children:s.label},s.value))})})})]}),e.jsxs(z,{children:[e.jsx(f,{span:8,children:e.jsxs(I,{label:"Hình ảnh cửa hàng",className:"pt-3",required:!0,children:[e.jsxs("div",{style:{position:"relative",width:"100%",height:"auto",overflow:"hidden",display:"flex",justifyContent:"center",alignItems:"center"},children:[e.jsx(F,{src:j[p],style:{maxWidth:"100%",maxHeight:"100%",objectFit:"cover",alignSelf:"center",borderRadius:"10px"}}),e.jsx("div",{onClick:w,style:{height:"50px",width:"35px",display:"flex",justifyContent:"center",borderRadius:"5px",position:"absolute",top:"50%",left:"10px",transform:"translateY(-50%)",cursor:"pointer",fontSize:"24px",zIndex:1,backgroundColor:"rgba(0, 0, 0, 0.2)"},children:e.jsx(q,{onClick:w,style:{color:"white"}})}),e.jsx("div",{onClick:A,style:{height:"50px",width:"35px",display:"flex",justifyContent:"center",borderRadius:"5px",position:"absolute",top:"50%",right:"10px",transform:"translateY(-50%)",cursor:"pointer",fontSize:"24px",zIndex:1,backgroundColor:"rgba(0, 0, 0, 0.2)"},children:e.jsx($,{onClick:A,style:{color:"white"}})})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:"10px",overflowX:"hidden",marginTop:"10px"},children:j.map((s,t)=>e.jsx(F,{src:s,onClick:()=>k(t),style:{width:"80px",height:"80px",objectFit:"cover",cursor:"pointer",borderRadius:"10px"},preview:!1},t))})]})}),e.jsx(f,{span:8,children:e.jsxs(I,{label:"Hình ảnh AI trả về",className:"pt-3",required:!0,children:[e.jsxs("div",{style:{position:"relative",width:"100%",height:"auto",overflow:"hidden",display:"flex",justifyContent:"center",alignItems:"center"},children:[e.jsx(F,{src:S[n],style:{maxWidth:"100%",maxHeight:"100%",objectFit:"cover",alignSelf:"center",borderRadius:"10px"}}),e.jsx("div",{onClick:T,style:{height:"50px",width:"35px",display:"flex",justifyContent:"center",borderRadius:"5px",position:"absolute",top:"50%",left:"10px",transform:"translateY(-50%)",cursor:"pointer",fontSize:"24px",zIndex:1,backgroundColor:"rgba(0, 0, 0, 0.2)"},children:e.jsx(q,{onClick:T,style:{color:"white"}})}),e.jsx("div",{onClick:K,style:{height:"50px",width:"35px",display:"flex",justifyContent:"center",borderRadius:"5px",position:"absolute",top:"50%",right:"10px",transform:"translateY(-50%)",cursor:"pointer",fontSize:"24px",zIndex:1,backgroundColor:"rgba(0, 0, 0, 0.2)"},children:e.jsx($,{onClick:K,style:{color:"white"}})})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:"10px",overflowX:"hidden",marginTop:"10px"},children:S.map((s,t)=>e.jsx(F,{src:s,onClick:()=>O(t),style:{width:"80px",height:"80px",objectFit:"cover",cursor:"pointer",borderRadius:"10px"},preview:!1},t))})]})}),e.jsx(f,{span:8})]})]})})}function te(c){const a={},[g,j]=i.useState([]);i.useState([{label:"Đạt",value:1},{label:"Không đạt",value:0}]),c.recordData?.detail_skus.forEach(n=>{const r=n.category,o=1;a[r]=(a[r]||0)+o});const C=(n,r,o)=>{j(_=>{let l=g.filter(x=>x.report_sku_id==o.name);if(l!=null&&l.length>0){let x=g.findIndex(k=>k.report_sku_id==o.name);g[x].sum_product_human=r}else g.push({report_sku_id:o.name,sum_product_human:r,scoring_human:o.scoring_human});return c.onChangeValReportSKU(g),g})},S=c.recordData?.category_names.map((n,r)=>{const o=Object.keys(n)[0];return{key:r.toString(),stt:(r+1).toString(),categoryName:Object.values(n)[0],number_product:a[o]||0}}),R=[{title:"STT",dataIndex:"stt"},{title:"Tên sản phẩm",dataIndex:"name_product"},{title:"Số lượng sản phẩm AI đếm",dataIndex:"sum_product"},{title:"Số lượng sản phẩm giám sát đếm",dataIndex:"sum_product_human",render:(n,r,o)=>e.jsx(v,{style:{width:"120px"},defaultValue:n,onChange:_=>C(o,parseInt(_.target.value),r)})},{title:"Điểm trưng bày AI chấm",dataIndex:"scoring_machine",render:n=>e.jsxs(e.Fragment,{children:[n===1&&e.jsxs("span",{style:{display:"flex"},children:[e.jsx(Q,{style:{fontSize:"17px",color:"green",paddingRight:"3px"}})," ",e.jsx("span",{style:{color:"green",verticalAlign:"middle"},children:"Đạt"})]}),n===0&&e.jsxs("span",{style:{display:"flex"},children:[e.jsx(D,{style:{fontSize:"17px",color:"red",paddingRight:"3px"}})," ",e.jsx("span",{style:{color:"red",verticalAlign:"middle"},children:"Không đạt"})]})]})}],p=[{title:"STT",dataIndex:"stt"},{title:"Danh mục sản phẩm",dataIndex:"categoryName"},{title:"Số lượng sản phẩm",dataIndex:"number_product"}],y=c.recordData?.category_names.map((n,r)=>{const o=Object.keys(n)[0];return(c.recordData?.detail_skus.filter(l=>l.category===o)).map((l,x)=>({key:`${r}-${x}`,stt:`${(x+1).toString().padStart(2,"0")}`,name_product:l.product_name,sum_product:l.sum_product.toString(),image:l.images,creation:l.creation,scoring_machine:l.scoring_machine,scoring_human:l.scoring_human,sum_product_human:l.sum_product_human,name:l.name,index_category:r}))});return e.jsx(e.Fragment,{children:e.jsx(V,{columns:p,expandable:{expandedRowRender:(n,r)=>e.jsx("div",{style:{margin:5},children:e.jsx(M,{columns:R,dataSource:y[r],pagination:!1})}),rowExpandable:n=>y[n.key].length>0},dataSource:S})})}function ae(){const[c,a]=i.useState(null),[g,j]=i.useState(0),[C,S]=i.useState([]),[R,p]=i.useState(!1),[y,n]=i.useState(!1),[r,o]=i.useState(!1),[_,l]=i.useState(!1),x=Y(),k=t=>{},[O]=P.useForm(),w=t=>{j(t)},A=t=>{S(t)},T=[{key:"1",label:e.jsx("span",{style:{fontWeight:700},children:"Thông tin chung"}),children:e.jsx(ee,{form:O,recordData:c,onChangeScoringHuman:w})},{key:"2",label:e.jsx("span",{style:{fontWeight:700},children:"Sản phẩm"}),children:e.jsx(te,{recordData:c,onChangeValReportSKU:A})}];i.useEffect(()=>{let t=localStorage.getItem("recordData");if(t){let d=JSON.parse(t);a(d),j(d.scoring_human);let u=[];for(let m=0;m<d.detail_skus.length;m++){let b={report_sku_id:d.detail_skus[m].name,sum_product_human:d.detail_skus[m].sum_product_human,scoring_human:d.detail_skus[m].scoring_human};u.push(b)}S(u)}},[y]),i.useEffect(()=>{let t=JSON.parse(localStorage.getItem("dataReports"));if(t){const d=t.findIndex(u=>u.name===c?.name);d===0?o(!0):d===t.length-1?l(!0):(o(!1),l(!1))}},[c]);const K=async()=>{p(!0);let t={name:c.name,scoring:g,arr_product:C};const u=await X.post("/api/method/mbw_audit.api.api.update_report",t);if(u!=null&&u.message=="ok"&&u.result!=null&&u.result.data=="success"){E.success("Cập nhật thành công"),p(!1);let m=JSON.parse(localStorage.getItem("dataReports")),b=JSON.parse(localStorage.getItem("recordData"));for(let h=0;h<b.detail_skus.length;h++)b.detail_skus[h].sum_product_human=C[h].sum_product_human,b.detail_skus[h].scoring_human=C[h].scoring_human;const N=m.findIndex(h=>h.name===b.name);if(N!==null&&N<m.length-1){const h=m[N+1];localStorage.setItem("recordData",JSON.stringify(h)),n(L=>!L)}else return}else E.error("Cập nhật thất bại"),p(!1)},H=()=>{let t=JSON.parse(localStorage.getItem("dataReports"));const d=t.findIndex(u=>u.name===c.name);if(d>0){const u=t[d-1];localStorage.setItem("recordData",JSON.stringify(u)),n(m=>!m)}},U=()=>c?`${c.customer_name} - ${c.campaign_name}`:"Tiêu đề",s=()=>{x("/reports"),localStorage.removeItem("recordData"),localStorage.removeItem("dataReports")};return e.jsxs(e.Fragment,{children:[e.jsx(W,{title:U(),icon:e.jsx("p",{onClick:()=>s(),className:"mr-2 cursor-pointer",children:e.jsx(q,{})}),buttons:[{label:"trước",type:"default",size:"20px",className:"flex items-center mr-2",icon:e.jsx(B,{}),action:H,disabled:r},{label:"Lưu lại và Tiếp",type:"primary",size:"20px",className:"flex items-center",loading:R,action:K,disabled:_}]}),e.jsx("div",{className:"bg-white  rounded-xl",children:e.jsx(P,{layout:"vertical",form:O,children:e.jsx(G,{items:T,defaultActiveKey:["1","2"],onChange:k,className:"custom-collapse"})})})]})}function oe(){return e.jsxs(e.Fragment,{children:[e.jsx(Z,{children:e.jsx("title",{children:"BÁO CÁO"})}),e.jsx(ae,{})]})}export{oe as default};
