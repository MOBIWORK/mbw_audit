import { useEffect, useRef, useState } from 'react';

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
    const clickX = event.nativeEvent.offsetX;
    const clickY = event.nativeEvent.offsetY;

    const parentWidth = canvas.parentNode.clientWidth;
    const parentHeight = canvas.parentNode.clientHeight;

    // Calculate the aspect ratio of the image
    const aspectRatio = image.width / image.height;

    // Calculate the width and height of the canvas to fit the container
    let canvasWidth = parentWidth;
    let canvasHeight = parentWidth / aspectRatio;

    const clickedBbox = bboxes.find(item => {
      const x = item.bbox[0] * (canvasWidth / image.width);
      const y = item.bbox[1] * (canvasHeight / image.height);
      const width = (item.bbox[2] - item.bbox[0]) * (canvasWidth / image.width);
      const height = (item.bbox[3] - item.bbox[1]) * (canvasHeight / image.height);

      return (
        clickX >= x &&
        clickX <= x + width &&
        clickY >= y &&
        clickY <= y + height
      );
    });
    if(clickedBbox != null){
        let bbox = {'x_min': clickedBbox.bbox[0], 'y_min': clickedBbox.bbox[1], 'x_max': clickedBbox.bbox[2], 'y_max': clickedBbox.bbox[3]};
        renderImageByBbox(bbox);
    }
  }

  const renderImageByBbox = function(bbox){
    if (image) {
      const xMin = bbox.x_min;
      const xMax = bbox.x_max;
      const yMin = bbox.y_min;
      const yMax = bbox.y_max;
      // Calculate cropped image dimensions
      const cropWidth = xMax - xMin;
      const cropHeight = yMax - yMin;
  
      // Create a new canvas for the cropped image
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = cropWidth;
      cropCanvas.height = cropHeight;
  
      // Get the context of the cropped canvas
      const cropCtx = cropCanvas.getContext('2d');
  
      // Draw the original image onto the cropped canvas, extracting the desired portion
      cropCtx.drawImage(
        image, // Original image
        xMin, // Source x-coordinate
        yMin, // Source y-coordinate
        cropWidth, // Source width
        cropHeight, // Source height
        0, // Destination x-coordinate
        0, // Destination y-coordinate
        cropWidth, // Destination width
        cropHeight // Destination height
      );
  
      // Convert the cropped canvas to an image URL
      const croppedImageURL = cropCanvas.toDataURL('image/png');
        clickBboxProductEmit(croppedImageURL)
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
