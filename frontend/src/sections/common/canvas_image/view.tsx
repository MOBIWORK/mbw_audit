import React, { useEffect, useRef, useState } from 'react';

export default function CanvasImage({ src, bboxes, clickBboxProductEmit }) {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      // Get the width and height of the parent container
      const parentWidth = canvas.parentNode.clientWidth;
      const parentHeight = canvas.parentNode.clientHeight;

      // Calculate the aspect ratio of the image
      const aspectRatio = img.width / img.height;

      // Calculate the width and height of the canvas to fit the container
      let canvasWidth = parentWidth;
      let canvasHeight = parentWidth / aspectRatio;

      // If the calculated height exceeds the container height, recalculate canvas size based on height
      if (canvasHeight > parentHeight) {
        canvasHeight = parentHeight;
        canvasWidth = parentHeight * aspectRatio;
      }

      // Set the canvas size
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Clear the canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draw the image
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      // Draw the bounding boxes
      ctx.strokeStyle = 'red'; // Set the color for the bounding boxes
      ctx.lineWidth = 1; // Set the line width for the bounding boxes

      bboxes.forEach(item => {
        const x = item.bbox[0] * (canvasWidth / img.width);
        const y = item.bbox[1] * (canvasHeight / img.height);
        const width = (item.bbox[2] - item.bbox[0]) * (canvasWidth / img.width);
        const height = (item.bbox[3] - item.bbox[1]) * (canvasHeight / img.height);
        ctx.strokeRect(x, y, width, height); // Vẽ bbox
      });
    };
    setImage(img);
  }, [src, bboxes]);

  const handleClickBboxImage = function (event){
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const parentWidth = canvas.parentNode.clientWidth;
    const parentHeight = canvas.parentNode.clientHeight;

    // Calculate the aspect ratio of the image
    const aspectRatio = canvas.width / canvas.height;

    // Calculate the width and height of the canvas to fit the container
    let canvasWidth = parentWidth;
    let canvasHeight = parentWidth / aspectRatio;

    // If the calculated height exceeds the container height, recalculate canvas size based on height
    if (canvasHeight > parentHeight) {
      canvasHeight = parentHeight;
      canvasWidth = parentHeight * aspectRatio;
    }

    const clickedBbox = bboxes.find(item => {
      const bboxX = item.bbox[0] * (canvasWidth / canvas.width);
      const bboxY = item.bbox[1] * (canvasHeight / canvas.height);
      const bboxWidth = (item.bbox[2] - item.bbox[0]) * (canvasWidth / canvas.width);
      const bboxHeight = (item.bbox[3] - item.bbox[1]) * (canvasHeight / canvas.height);

      return x >= bboxX && x <= bboxX + bboxWidth && y >= bboxY && y <= bboxY + bboxHeight;
    });
    if(clickedBbox != null){
        let bbox = {'x_min': clickedBbox.bbox[0], 'y_min': clickedBbox.bbox[1], 'x_max': clickedBbox.bbox[2], 'y_max': clickedBbox.bbox[3]};
        renderImageByBbox(bbox);
    }
  }

  const renderImageByBbox = function(bbox){
    if (image) {
        const x = bbox.x_min;
        const y = bbox.y_min;
        const width = bbox.x_max - bbox.x_min;
        const height = bbox.y_max - bbox.y_min;
  
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = width;
        tempCanvas.height = height;
  
        tempCtx.drawImage(image, x, y, width, height, 0, 0, width, height);
        clickBboxProductEmit(tempCanvas.toDataURL())
    }
  }


  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Make the image fit the canvas while preserving aspect ratio
        cursor: 'pointer',
        borderRadius: '10px',
      }}
      onClick={handleClickBboxImage}
    />
  );
};
