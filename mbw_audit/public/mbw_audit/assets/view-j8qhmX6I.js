import{r as l,z as G,E as Q,j as t,A as L,y as J,az as K,a as tt,C as E,a5 as O,a6 as et,B as R,aI as nt,g as st,S as it,s as z}from"./main-i-Wvj7V3.js";import{I as M}from"./index-pgmYbc7I.js";var ot={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M904 512h-56c-4.4 0-8 3.6-8 8v320H184V184h320c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V520c0-4.4-3.6-8-8-8z"}},{tag:"path",attrs:{d:"M355.9 534.9L354 653.8c-.1 8.9 7.1 16.2 16 16.2h.4l118-2.9c2-.1 4-.9 5.4-2.3l415.9-415c3.1-3.1 3.1-8.2 0-11.3L785.4 114.3c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-415.8 415a8.3 8.3 0 00-2.3 5.6zm63.5 23.6L779.7 199l45.2 45.1-360.5 359.7-45.7 1.1.7-46.4z"}}]},name:"form",theme:"outlined"};const at=ot;var lt=function(g,_){return l.createElement(G,Q({},g,{ref:_,icon:at}))};const gt=l.forwardRef(lt);function rt({src:v,bboxes:g,clickBboxProductEmit:_}){const S=l.useRef(null),[c,B]=l.useState(null);l.useEffect(()=>{const o=S.current,h=o.getContext("2d"),s=new Image;s.crossOrigin="anonymous",s.src=v,s.onload=()=>{const p=o.parentNode.clientWidth,x=o.parentNode.clientHeight,u=s.width/s.height;let e=p,n=p/u;n>x&&(n=x,e=x*u),o.width=e,o.height=n,h.clearRect(0,0,e,n),h.drawImage(s,0,0,e,n),h.strokeStyle="red",h.lineWidth=1,g.forEach(r=>{const d=r.bbox[0]*(e/s.width),b=r.bbox[1]*(n/s.height),w=(r.bbox[2]-r.bbox[0])*(e/s.width),k=(r.bbox[3]-r.bbox[1])*(n/s.height);h.strokeRect(d,b,w,k)})},B(s)},[v,g]);const f=function(o){const h=S.current,s=o.nativeEvent.offsetX,p=o.nativeEvent.offsetY,x=h.parentNode.clientWidth;h.parentNode.clientHeight;const u=c.width/c.height;let e=x,n=x/u;const r=g.find(d=>{const b=d.bbox[0]*(e/c.width),w=d.bbox[1]*(n/c.height),k=(d.bbox[2]-d.bbox[0])*(e/c.width),I=(d.bbox[3]-d.bbox[1])*(n/c.height);return s>=b&&s<=b+k&&p>=w&&p<=w+I});if(r!=null){let d={x_min:r.bbox[0],y_min:r.bbox[1],x_max:r.bbox[2],y_max:r.bbox[3]};P(d)}},P=function(o){if(c){const h=o.x_min,s=o.x_max,p=o.y_min,x=o.y_max,u=s-h,e=x-p,n=document.createElement("canvas");n.width=u,n.height=e,n.getContext("2d").drawImage(c,h,p,u,e,0,0,u,e);const d=n.toDataURL("image/png");_(d)}};return t.jsx("canvas",{ref:S,style:{width:"100%",height:"100%",objectFit:"cover",cursor:"pointer",borderRadius:"10px"},onClick:f})}function pt({category:v,arrImage:g,backPageEmit:_,completeProductLabelling:S}){const[c,B]=l.useState([]),[f,P]=l.useState(0),[o,h]=l.useState(!1),[s,p]=l.useState(!1),[x,u]=l.useState(0),[e,n]=l.useState([]),[r,d]=l.useState([]),[b,w]=l.useState(""),[k,I]=l.useState(!1);l.useEffect(()=>{V()},[g]),l.useEffect(()=>{Y()},[v]);const V=async()=>{p(!0),g.length>1?h(!0):h(!1);let a={lst_image:g};const y=await L.post("/api/method/mbw_audit.api.api.get_bbox_by_image",a);if(y.message=="ok"){let m=[];for(let C=0;C<y.result.length;C++){let j=y.result[C].locates,F={url:g[C],bboxes:j};m.push(F)}B(m)}p(!1)},Y=async()=>{let a=`/api/method/mbw_audit.api.api.get_products_by_category?category=${v}`,i=await L.get(a);if(i.message=="ok"){let y=[];for(let m=0;m<i.result.length;m++){let C={label:i.result[m].product_name,value:i.result[m].name};y.push(C)}d(y)}},T=function(){_(g)},H=()=>{f>0&&P(f-1)},W=()=>{f<c.length-1&&P(f+1)},$=function(a){n(i=>[...i,a])},U=function(a){n(i=>i.filter((y,m)=>m!==a))},X=a=>{w(a)},q=async()=>{if(b==null||b==""){z.warning("Vui lòng chọn tên sản phẩm để thực hiện gán nhãn");return}if(e.length==0){z.warning("Vui lòng chọn ảnh sản phẩm trong ảnh trưng bày để thực hiện gán nhãn");return}I(!0);let a=[],i={name_product:b,name_category:v,lst_base64:[]};for(let j=0;j<e.length;j++){let F=e[j].split(",")[1];if(i.lst_base64.push(F),j>0&&j%5==0||j==e.length-1){let N=await L.post("api/method/mbw_audit.api.api.render_image_by_base64",i);if(N.message=="ok"){for(let A=0;A<N.result.length;A++)a.push(N.result[A]);i.lst_base64=[]}else{z.error("Tạo ảnh cho sản phẩm lỗi. Vui lòng liên hệ quản trị hệ thống để tiếp tục"),I(!1);return}}}let y={name_product:b,name_category:v,lst_image:a};if((await L.post("/api/method/mbw_audit.api.api.assign_image_to_product",y)).message=="ok")I(!1),w(""),n([]),u(1);else{z.error("Gán nhãn cho sản phẩm lỗi. Vui lòng liên hệ quản trị hệ thống để tiếp tục"),I(!1);return}},D=()=>{u(0)},Z=()=>{S(g)};return t.jsxs(t.Fragment,{children:[s&&t.jsx("div",{style:{position:"fixed",width:"100%",height:"100%",backgroundColor:"rgba(0, 0, 0, 0.5)",zIndex:9999,display:"flex",justifyContent:"center",alignItems:"center"},children:t.jsx(J,{indicator:t.jsx(K,{style:{fontSize:30,color:"#fff"},spin:!0})})}),t.jsxs(tt,{style:{height:"100%"},children:[t.jsxs(E,{span:15,style:{padding:"0px 24px 20px"},children:[t.jsxs("div",{className:"py-3",children:[t.jsxs("div",{className:"flex items-center cursor-pointer",style:{width:"fit-content",paddingBottom:"13px"},onClick:T,children:[t.jsx(O,{style:{color:"#1877F2",fontSize:"23px"}}),t.jsx("span",{style:{fontWeight:700,fontSize:"15px",lineHeight:"36px",color:"#1877F2"},className:"mx-2",children:"Quay lại trang"})]}),t.jsx("div",{className:"font-semibold leading-[21px]",style:{fontSize:"1.4rem"},children:"Nhận diện sản phẩm"})]}),t.jsxs("div",{className:"py-2",children:[t.jsxs("div",{style:{position:"relative",width:"100%",height:"auto",overflow:"hidden",display:"flex",justifyContent:"center",alignItems:"center"},children:[c.length>0&&t.jsx(rt,{src:c[f].url,bboxes:c[f].bboxes,clickBboxProductEmit:$},f),o&&t.jsx("div",{onClick:H,style:{height:"50px",width:"35px",display:"flex",justifyContent:"center",borderRadius:"5px",position:"absolute",top:"50%",left:"10px",transform:"translateY(-50%)",cursor:"pointer",fontSize:"24px",zIndex:1,backgroundColor:"rgba(0, 0, 0, 0.2)"},children:t.jsx(O,{onClick:H,style:{color:"white"}})}),o&&t.jsx("div",{onClick:W,style:{height:"50px",width:"35px",display:"flex",justifyContent:"center",borderRadius:"5px",position:"absolute",top:"50%",right:"10px",transform:"translateY(-50%)",cursor:"pointer",fontSize:"24px",zIndex:1,backgroundColor:"rgba(0, 0, 0, 0.2)"},children:t.jsx(et,{onClick:W,style:{color:"white"}})})]}),t.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:"10px",overflowX:"hidden",marginTop:"10px"},children:c.map((a,i)=>t.jsx(M,{src:a.url,style:{width:"80px",height:"80px",objectFit:"cover",cursor:"pointer",borderRadius:"10px"},preview:!1},i))})]})]}),t.jsx(E,{span:9,children:t.jsxs("div",{className:"bg-white h-full",style:{padding:"20px",position:"relative"},children:[t.jsx("div",{style:{fontWeight:600,fontSize:"18px",lineHeight:"36px"},children:"Thêm hình ảnh vào sản phẩm"}),x==0&&t.jsxs(t.Fragment,{children:[t.jsx("div",{style:{display:"flex",flexWrap:"wrap",maxHeight:"490px",overflowY:"auto"},className:"py-3",children:e.map((a,i)=>t.jsxs("div",{style:{marginRight:"15px",marginBottom:"15px",position:"relative"},children:[t.jsx(M,{width:80,height:80,src:a,style:{width:"80px",height:"80px",objectFit:"cover",borderRadius:"10px"},preview:!1}),t.jsx(R,{shape:"circle",size:"small",icon:t.jsx(nt,{style:{fontSize:"10px"}}),style:{position:"absolute",top:"0px",right:"2px"},onClick:()=>U(i)})]},i))}),t.jsxs(st,{name:"campaign_status",children:[t.jsx("div",{className:"py-1",style:{fontWeight:500,fontSize:"14px",lineHeight:"21px"},children:"Chọn sản phẩm"}),t.jsx(it,{options:r,onChange:X})]}),t.jsx("div",{className:"py-5",children:t.jsx(R,{type:"primary",ghost:!0,loading:k,onClick:q,children:"Lưu hình ảnh"})})]}),x==1&&t.jsx(t.Fragment,{children:t.jsx("div",{style:{width:"100%",height:"210px",position:"relative"},children:t.jsxs("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"},children:[t.jsxs("svg",{width:"220",height:"180",viewBox:"0 0 200 180",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[t.jsx("path",{d:"M17.5743 87.1166C18.8488 82.6547 61.0786 103.951 70.8568 116.036C70.8568 116.036 79.054 160.661 72.7339 164.644C69.0218 165.991 53.812 143.926 50.2319 138.536C49.7742 137.847 47.7984 134.586 47.2186 134.079C28.6694 107.598 16.3144 91.5272 17.5743 87.1166Z",fill:"#007867"}),t.jsx("path",{d:"M160.423 26.3935C156.674 22.6435 77.2958 100.652 70.3126 115.313C70.3126 115.313 62.1276 163.417 72.1881 165C77.6308 165 93.7501 135.938 97.5001 129.375C117.188 99.3751 164.13 30.1003 160.423 26.3935Z",fill:"#00A76F"})]}),t.jsx("div",{style:{fontWeight:700,fontSize:"14px",lineHeight:"24px"},children:"Ảnh đã được lưu vào sản phẩm"}),t.jsx("div",{className:"py-5",children:t.jsx(R,{type:"primary",ghost:!0,onClick:D,children:"Thêm sản phẩm khác"})})]})})}),t.jsx("div",{style:{position:"absolute",bottom:"20px",width:"92%"},children:t.jsx(R,{type:"primary",onClick:Z,block:!0,children:"Hoàn thành nhận diện"})})]})})]})]})}export{gt as F,pt as P};