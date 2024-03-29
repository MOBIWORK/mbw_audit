import{r as c,j as t,e as fe,u as ye,A as k,H as _e,S as g,f as je,T as D,D as Se,d as Ce}from"./main-7WFdHOCx.js";import{V as ve,e as G,F as Ie}from"./FileSaver.min-hfGCMSIP.js";import{C as I,a as w}from"./CloseCircleOutlined-6P0pEmbN.js";import{I as U}from"./index-NR367k8g.js";const{RangePicker:we}=Se;function be(){const[y,O]=c.useState("all"),[_,Y]=c.useState([]),[x,Q]=c.useState("all"),[j,Z]=c.useState("all"),[S,ee]=c.useState("all");c.useState(!1);const[B,Ae]=c.useState([{label:"Đạt",value:1},{label:"Không đạt",value:0}]),[b,$]=c.useState(!1),[z,P]=c.useState([{title:"STT",dataIndex:"stt",fixed:"left",width:100},{title:"Khách hàng",dataIndex:"customer_name",fixed:"left"},{title:"Tên chiến dịch",dataIndex:"campaign_name",fixed:"left"},{title:"Nhân viên thực hiện",dataIndex:"employee_name"},{title:"Số lượng danh mục",dataIndex:"quantity_cate"},{title:"Số lượng sản phẩm AI đếm",children:[]},{title:"Số lượng sản phẩm giám sát đếm",children:[]},{title:"Ảnh gian hàng",dataIndex:"images",render:e=>t.jsx("a",{onClick:l=>{l.stopPropagation(),A(e)},children:"Xem hình ảnh"})},{title:"Ảnh gian hàng AI",dataIndex:"images_ai",render:e=>t.jsx("a",{onClick:l=>{l.stopPropagation(),A(e)},children:"Xem hình ảnh"})},{title:"Thời gian thực hiện",dataIndex:"images_time"},{title:"Điểm trưng bày AI chấm",dataIndex:"scoring_machine",render:e=>t.jsxs(t.Fragment,{children:[e===1&&t.jsxs("span",{style:{display:"flex"},children:[t.jsx(I,{style:{fontSize:"17px",color:"green",paddingRight:"3px"}})," ",t.jsx("span",{style:{color:"green",verticalAlign:"middle"},children:"Đạt"})]}),e===0&&t.jsxs("span",{style:{display:"flex"},children:[t.jsx(w,{style:{fontSize:"17px",color:"red",paddingRight:"3px"}})," ",t.jsx("span",{style:{color:"red",verticalAlign:"middle"},children:"Không đạt"})]})]})},{title:"Điểm trưng bày giám sát chấm",dataIndex:"scoring_human",render:e=>t.jsxs(t.Fragment,{children:[e===1&&t.jsxs("span",{style:{display:"flex"},children:[t.jsx(I,{style:{fontSize:"17px",color:"green",paddingRight:"3px"}})," ",t.jsx("span",{style:{color:"green",verticalAlign:"middle"},children:"Đạt"})]}),e===0&&t.jsxs("span",{style:{display:"flex"},children:[t.jsx(w,{style:{fontSize:"17px",color:"red",paddingRight:"3px"}})," ",t.jsx("span",{style:{color:"red",verticalAlign:"middle"},children:"Không đạt"})]})]})}]),[F,H]=c.useState([]),{search:te}=fe();new URLSearchParams(te).get("campaign");const le=ye(),[T,K]=c.useState([]),[ae,ne]=c.useState([]),[ie,M]=c.useState([]),X=e=>{localStorage.setItem("recordData",JSON.stringify(e)),localStorage.setItem("dataReports",JSON.stringify(T)),le("/report-view")};c.useEffect(()=>{oe(),de(),J()},[]);const se=[{title:"STT",dataIndex:"stt",fixed:"left",width:"5%"},{title:"Khách hàng",dataIndex:"customer_name",fixed:"left"},{title:"Tên chiến dịch",dataIndex:"campaign_name",fixed:"left"},{title:"Nhân viên thực hiện",dataIndex:"employee_name"},{title:"Số lượng danh mục",dataIndex:"quantity_cate"},{title:"Ảnh gian hàng",dataIndex:"images",render:e=>t.jsx("a",{onClick:l=>{l.stopPropagation(),A(e)},children:"Xem hình ảnh"})},{title:"Ảnh gian hàng AI",dataIndex:"images_ai",render:e=>t.jsx("a",{onClick:l=>{l.stopPropagation(),A(e)},children:"Xem hình ảnh"})},{title:"Thời gian thực hiện",dataIndex:"images_time",render:e=>{const l=new Date(e),m=l.getDate(),a=l.getMonth()+1,s=l.getFullYear(),r=l.getHours(),o=l.getMinutes(),i=`${m.toString().padStart(2,"0")}/${a.toString().padStart(2,"0")}/${s} ${r.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}`;return t.jsx("div",{children:i})}},{title:"Điểm trưng bày AI chấm",dataIndex:"scoring_machine",render:e=>t.jsxs(t.Fragment,{children:[e===1&&t.jsxs("span",{style:{display:"flex"},children:[t.jsx(I,{style:{fontSize:"17px",color:"green",paddingRight:"3px"}})," ",t.jsx("span",{style:{color:"green",verticalAlign:"middle"},children:"Đạt"})]}),e===0&&t.jsxs("span",{style:{display:"flex"},children:[t.jsx(w,{style:{fontSize:"17px",color:"red",paddingRight:"3px"}})," ",t.jsx("span",{style:{color:"red",verticalAlign:"middle"},children:"Không đạt"})]})]})},{title:"Điểm trưng bày giám sát chấm",dataIndex:"scoring_human",render:e=>t.jsxs(t.Fragment,{children:[e===1&&t.jsxs("span",{style:{display:"flex"},children:[t.jsx(I,{style:{fontSize:"17px",color:"green",paddingRight:"3px"}})," ",t.jsx("span",{style:{color:"green",verticalAlign:"middle"},children:"Đạt"})]}),e===0&&t.jsxs("span",{style:{display:"flex"},children:[t.jsx(w,{style:{fontSize:"17px",color:"red",paddingRight:"3px"}})," ",t.jsx("span",{style:{color:"red",verticalAlign:"middle"},children:"Không đạt"})]})]})}],re=[{title:"Tên sản phẩm",dataIndex:"product_name"},{title:"Số lượng sản phẩm AI đếm",dataIndex:"sum_product"},{title:"Số lượng sản phẩm giám sát đếm",dataIndex:"sum_product_human"},{title:"Điểm trưng bày AI chấm",dataIndex:"scoring_machine",render:e=>t.jsxs(t.Fragment,{children:[e===1&&t.jsxs("span",{style:{display:"flex"},children:[t.jsx(I,{style:{fontSize:"17px",color:"green",paddingRight:"3px"}})," ",t.jsx("span",{style:{color:"green",verticalAlign:"middle"},children:"Đạt"})]}),e===0&&t.jsxs("span",{style:{display:"flex"},children:[t.jsx(w,{style:{fontSize:"17px",color:"red",paddingRight:"3px"}})," ",t.jsx("span",{style:{color:"red",verticalAlign:"middle"},children:"Không đạt"})]})]})}],J=async()=>{const e=JSON.parse(localStorage.getItem("campaign_dashboard"));e&&(O(e.campaign_code),$(!0),localStorage.removeItem("campaign_dashboard"));let l="/api/method/mbw_audit.api.api.get_reports_by_filter";if(y!=null&&y!=""&&y!="all"&&(l=`${l}?campaign_code=${y}`),_!=null&&_.length==2){let a=Math.round(new Date(_[0]).getTime()/1e3),s=Math.round(new Date(_[1]).getTime()/1e3);l.includes("?")?l=`${l}&start_date=${a}&end_date=${s}`:l=`${l}?start_date=${a}&end_date=${s}`}x!=null&&x!=""&&x!="all"&&(l.includes("?")?l=`${l}&employee_id=${x}`:l=`${l}?employee_id=${x}`),j!=null&&j!="all"&&(l.includes("?")?l=`${l}&status_scoring_ai=${j}`:l=`${l}?status_scoring_ai=${j}`,console.log(l)),S!=null&&S!="all"&&(l.includes("?")?l=`${l}&status_scoring_human=${S}`:l=`${l}?status_scoring_human=${S}`);let m=await k.get(l);if(m!=null&&m.message=="ok"&&m.result!=null&&m.result.data!=null){let a=m.result.data.map((s,r)=>{let o=(r+1).toString().padStart(2,"0"),i=JSON.parse(s.categories).length.toString().padStart(2,"0");return{...s,key:s.name,stt:o,quantity_cate:i}});if(!b)K(a);else{let s=!1,r=[],o=[];for(let i=0;i<a.length;i++){for(let n=0;n<a[i].info_products_ai.length;n++){if(!s){let f={title:a[i].info_products_ai[n].product_name,dataIndex:`${a[i].info_products_ai[n].product_name}_ai`,key:`${a[i].info_products_ai[n].product_name}_ai`,width:100},h={title:a[i].info_products_ai[n].product_name,dataIndex:`${a[i].info_products_ai[n].product_name}_human`,key:`${a[i].info_products_ai[n].product_name}_human`,width:100};r.push(f),o.push(h)}a[i][`${a[i].info_products_ai[n].product_name}_ai`]=a[i].info_products_ai[n].sum,a[i][`${a[i].info_products_human[n].product_name}_human`]=a[i].info_products_human[n].sum}r.length>0&&(s=!0)}P(i=>(i[5].children=r,i[6].children=o,i)),H(a)}}else b?(P(a=>(a[5].children=[],a[6].children=[],a)),H([])):K([])},oe=async()=>{try{const l=await k.get("/api/method/mbw_service_v2.api.ess.employee.get_list_employee");l&&l.result&&l.result.data&&ne(l.result.data)}catch(e){console.error("Error fetching employee data:",e)}},de=async()=>{const l=await k.get("/api/method/mbw_audit.api.api.get_all_campaigns");l!=null&&l.message=="ok"&&l.result!=null?M(l.result.data):M([])};c.useEffect(()=>{J()},[y,_,x,j,S]);const ce=()=>{b?me(F,z):he(T,"Báo cáo chấm điểm trưng bày")},N=(e,l=!1)=>{const m={font:{bold:!0,name:"Times New Roman",size:12},alignment:{vertical:"middle",horizontal:"center"}};l&&(m.border={top:{style:"medium"},left:{style:"medium"},bottom:{style:"medium"},right:{style:"medium"}}),e.style=m},me=async(e,l,m)=>{console.log(e),console.log(l);const a=new G.Workbook,s=a.addWorksheet("Sheet1");let r=1;l.forEach((n,f)=>{const h=r;r===1?s.getColumn(r).width=10:s.getColumn(r).width=n.width||20;const u=s.getCell(1,r);if(u.value=n.title,N(u,!0),n.children&&n.children.length>0){const d=n.children.length;u.isMerged||s.mergeCells(1,r,1,r+d-1),n.children.forEach((v,E)=>{const q=h+E,C=s.getCell(2,q);C.value=v.title,N(C)}),r+=d}else r++});const o=3;e.forEach((n,f)=>{r=1,l.forEach((h,u)=>{const d=h.dataIndex;let p=n[d];if(h.children&&h.children.length>0)return;if(d.endsWith("_ai")||d.endsWith("_human")){const[E,q]=h.title.split(" "),C=n[E.toLowerCase()];C&&Array.isArray(C)&&(p=C.filter(R=>R.product_name===E).map(R=>`${R.product_name}: ${R.sum}`).join(`
`))}const v=s.getCell(o+f,r);v.value=p,N(v,!1),r++})});const i=await a.xlsx.writeBuffer();V(i,"report")},he=async(e,l)=>{const m=new G.Workbook,a=m.addWorksheet("Sheet1");a.properties.defaultColWidth=20,a.getColumn("A").width=30,a.mergeCells("A2:J2"),a.getCell("A2").value=l,a.getCell("A2").style={font:{bold:!0,name:"Times New Roman",size:12}},a.getCell("A2").alignment={vertical:"middle",horizontal:"center"};let s=a.getRow(4),r=a.getRow(5),o=[{title:"Khách hàng",field:"customer_name"},{title:"Tên chiến dịch",field:"campaign_name"},{title:"Nhân viên thực hiện",field:"employee_name"},{title:"Số lượng danh mục",field:"categories"},{title:"Ảnh gian hàng",field:"images"},{title:"Ảnh gian hàng AI",field:"images_ai"},{title:"Thời gian thực hiện",field:"images_time"},{title:"Điểm trưng bày AI chấm",field:"scoring_machine"},{title:"Điểm trưng bày giám sát chấm",field:"scoring_human"}];for(let n=0;n<o.length;n++){let f=s.getCell(n+1),h=r.getCell(n+1);a.mergeCells(`${f._address}:${h._address}`),s.getCell(n+1).style={font:{bold:!0,name:"Times New Roman",size:12,italic:!0}},s.getCell(n+1).alignment={vertical:"middle",horizontal:"center"},s.getCell(n+1).value=o[n].title}for(let n=0;n<e.length;n++){let h=a.getRow(n+6),u=1;for(let d=0;d<o.length;d++){h.getCell(u).style={font:{name:"Times New Roman",size:12,italic:!0}};let p="";o[d].field=="categories"?e[n][o[d].field]!=null&&e[n][o[d].field]!=""&&(p=JSON.parse(e[n][o[d].field]).length):o[d].field=="scoring_machine"||o[d].field=="scoring_human"?e[n][o[d].field]==0?p="Không đạt":p="Đạt":p=e[n][o[d].field],h.getCell(u).value=p,u+=1}}const i=await m.xlsx.writeBuffer();V(i,"report")},V=(e,l)=>{let m="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",a=".xlsx";const s=new Blob([e],{type:m});Ie.saveAs(s,l+"_export_"+new Date().getTime()+a)},ge=e=>{O(e),e=="all"?$(!1):$(!0)},[pe,W]=c.useState([]),[ue,L]=c.useState(!1),xe=e=>{L(!1),W([])},A=e=>{const l=JSON.parse(e);W(l),L(!0)};return t.jsxs(t.Fragment,{children:[t.jsx(_e,{title:"Báo cáo",buttons:[{label:"Xuất dữ liệu",type:"primary",icon:t.jsx(ve,{className:"text-xl"}),size:"20px",className:"flex items-center",action:ce}]}),t.jsxs("div",{className:"bg-white rounded-xl",children:[t.jsxs("div",{className:"flex p-4",style:{alignItems:"flex-end"},children:[t.jsxs("div",{style:{display:"flex",flexDirection:"column",paddingRight:"15px"},children:[t.jsx("label",{style:{paddingBottom:"5px"},children:"Chiến dịch:"}),t.jsxs(g,{className:"w-[150px] h-[36px]",value:y,onChange:e=>ge(e),defaultValue:"all",children:[t.jsx(g.Option,{value:"all",children:"Tất cả"}),ie.map(e=>t.jsx(g.Option,{value:e.name,children:e.campaign_name},e.name))]})]}),t.jsx(je,{className:"w-[250px] border-none mr-4",label:"Thời gian thực hiện",children:t.jsx(we,{value:_,onChange:e=>Y(e)})}),t.jsxs("div",{style:{display:"flex",flexDirection:"column"},className:"mr-4",children:[t.jsx("label",{style:{paddingBottom:"5px"},children:"Nhân viên:"}),t.jsxs(g,{className:"w-[150px] h-[36px]",value:x,onChange:e=>Q(e),defaultValue:"all",children:[t.jsx(g.Option,{value:"all",children:"Tất cả"}),ae.map(e=>t.jsx(g.Option,{value:e.name,children:e.employee_name},e.name))]})]}),t.jsxs("div",{style:{display:"flex",flexDirection:"column"},className:"mr-4",children:[t.jsx("label",{style:{paddingBottom:"5px"},children:"Điểm AI chấm:"}),t.jsxs(g,{className:"w-[150px] h-[36px]",value:j,onChange:e=>Z(e),defaultValue:"all",children:[t.jsx(g.Option,{value:"all",children:"Tất cả"}),B.map(e=>t.jsx(g.Option,{value:e.value,children:e.label},e.value))]})]}),t.jsxs("div",{style:{display:"flex",flexDirection:"column"},className:"mr-4",children:[t.jsx("label",{style:{paddingBottom:"5px"},children:"Điểm giám sát chấm:"}),t.jsxs(g,{className:"w-[150px] h-[36px]",value:S,onChange:e=>ee(e),defaultValue:"all",children:[t.jsx(g.Option,{value:"all",children:"Tất cả"}),B.map(e=>t.jsx(g.Option,{value:e.value,children:e.label},e.value))]})]})]}),t.jsx("div",{children:b?t.jsx(D,{bordered:!0,columns:z,dataSource:F,scroll:{y:540,x:2e3},onRow:(e,l)=>({onClick:()=>X(e)}),rowHoverBg:"#f0f0f0"}):t.jsx(D,{bordered:!0,columns:se,dataSource:T,scroll:{y:540,x:1300},onRow:(e,l)=>({onClick:()=>X(e)}),rowHoverBg:"#f0f0f0",expandable:{expandedRowRender:(e,l)=>t.jsx("div",{style:{margin:5},children:t.jsx(D,{columns:re,dataSource:e.detail_skus,pagination:!1})})}})})]}),t.jsx(U.PreviewGroup,{preview:{visible:ue,onVisibleChange:xe},children:pe.map((e,l)=>t.jsx(U,{style:{display:"none"},width:50,src:e},l))})]})}function De(){return t.jsxs(t.Fragment,{children:[t.jsx(Ce,{children:t.jsx("title",{children:"BÁO CÁO"})}),t.jsx(be,{})]})}export{De as default};
