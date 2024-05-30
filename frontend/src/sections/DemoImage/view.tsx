
import { useEffect, useState } from "react";
import "./style.css";
import { AxiosService } from "../../services/server";
import ProductLabelling from "../common/product_labelling/view"

export default function DemoImage() {
    var canvas = null;
    var ctx = null;
    var imageLoader = null;
    var image = new Image();
    var locates = [];
    var bboxContainer = null;

    const [arrImageForLabel, setArrImageForLabel] = useState(["http://localhost:8001/public/gian.png"]);
    const [category, setCategory] = useState("fabc9eob62");

    useEffect(()=>{
        callService()
    })

    const callService = async () => {
        let urlCampaigns = `/api/method/mbw_audit.api.api.get_bbox_by_image`;
        let res = await AxiosService.get(urlCampaigns);
        locates = res.message.locates;
        canvas = document.getElementById('imageCanvas');
        ctx = canvas.getContext('2d');
        imageLoader = document.getElementById('imageLoader');
        imageLoader.addEventListener('change', handleImage, false);
        bboxContainer = document.getElementById('bboxContainer');
    }

    const handleImage = function(e){
        const reader = new FileReader();
            reader.onload = function(event) {
                image.onload = function() {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.drawImage(image, 0, 0);
                    drawBoundingBoxes();
                }
                image.src = event.target.result;
            }
            reader.readAsDataURL(e.target.files[0]);
    }

    const drawBoundingBoxes = function(){
        ctx.drawImage(image, 0, 0);  // Vẽ lại ảnh gốc
            ctx.strokeStyle = 'red';    // Màu viền bbox
            ctx.lineWidth = 2;          // Độ dày viền bbox

            locates.forEach(bbox => {
                const x = bbox.bbox[0];
                const y = bbox.bbox[1];
                const width = bbox.bbox[2] - bbox.bbox[0];
                const height = bbox.bbox[3] - bbox.bbox[1];
                ctx.strokeRect(x, y, width, height); // Vẽ bbox
            });
    }


    const handlerClickImage = function (event){
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const clickedBBox = locates.find(bbox => 
            x >= bbox.bbox[0] && x <= bbox.bbox[2] && y >= bbox.bbox[1] && y <= bbox.bbox[3]
        );
        console.log(clickedBBox);
        if(clickedBBox != null){
            let bbox = {'x_min': clickedBBox.bbox[0], 'y_min': clickedBBox.bbox[1], 'x_max': clickedBBox.bbox[2], 'y_max': clickedBBox.bbox[3]};
            createBBoxImage(bbox)
        }
    }

    const createBBoxImage = function (bbox) {
        const x = bbox.x_min;
        const y = bbox.y_min;
        const width = bbox.x_max - bbox.x_min;
        const height = bbox.y_max - bbox.y_min;

        // Tạo một canvas tạm để cắt ảnh
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = width;
        tempCanvas.height = height;

        // Cắt phần ảnh từ bbox
        tempCtx.drawImage(image, x, y, width, height, 0, 0, width, height);

        // Tạo một thẻ img để hiển thị ảnh cắt
        const img = document.createElement('img');
        img.src = tempCanvas.toDataURL();
        console.log(tempCanvas.toDataURL());
        img.classList.add('bbox-image');

        // Xóa các ảnh bbox cũ và hiển thị ảnh mới
        bboxContainer.innerHTML = '';
        bboxContainer.appendChild(img);
    }

  return (
    <>
        {/* <input type="file" id="imageLoader" name="imageLoader"/>
        <canvas id="imageCanvas" onClick={handlerClickImage}></canvas>
        <div id="bboxContainer"></div> */}
        <ProductLabelling category={category} arrImage={arrImageForLabel}></ProductLabelling>
    </>
  );
}
