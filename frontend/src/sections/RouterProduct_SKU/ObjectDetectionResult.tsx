import React, { useEffect, useState } from 'react';
import { Stage, Layer, Image, Rect, Text } from 'react-konva';
// import './css/canvas.css'


const ObjectDetectionResult = ({ imageSrc, objectBoxes, labelColors }) => {
  // Đối tượng để ánh xạ các nhãn với màu viền tương ứng

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 450, height: 450 })

  const [image, setImage] = useState(new window.Image());

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    const newScale = e.evt.deltaY > 0 ? scale / 1.1 : scale * 1.1;

    setScale(newScale);

    const newPos = {
      x: pointerPosition.x - (pointerPosition.x - position.x) * (newScale / scale),
      y: pointerPosition.y - (pointerPosition.y - position.y) * (newScale / scale),
    };

    setPosition(newPos);
  };

  const handleDragMove = (e) => {
    setPosition({ x: e.target.x(), y: e.target.y() });
  };

  useEffect(() => {
    const img = new window.Image();
    img.src = imageSrc;
    setImage(img);

    img.onload = () => {
      const imageAspectRatio = img.width / img.height;
      const canvasAspectRatio = canvasSize.width / canvasSize.height;
      let newImageWidth = img.width, newImageHeight = img.height;
      //   if(img.width > canvasSize.width || img.height > canvasSize.height){

      //     if (imageAspectRatio > canvasAspectRatio) {
      //       newImageWidth = canvasSize.width;
      //       newImageHeight = canvasSize.width / imageAspectRatio;
      //     } else {
      //       newImageHeight = canvasSize.height;
      //       newImageWidth = canvasSize.height * imageAspectRatio;
      //     }

      // }
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setImageSize({ width: newImageWidth, height: newImageHeight });


    };

    // img.onload = () => {
    //   const maxImageWidth = canvasSize.width;
    //   const maxImageHeight = canvasSize.height;

    //   let newImageWidth, newImageHeight;

    //   if (img.width <= maxImageWidth && img.height <= maxImageHeight) {
    //     newImageWidth = img.width;
    //     newImageHeight = img.height;
    //   } else {
    //     const imageAspectRatio = img.width / img.height;
    //     const canvasAspectRatio = maxImageWidth / maxImageHeight;

    //     if (imageAspectRatio > canvasAspectRatio) {
    //       newImageWidth = maxImageWidth;
    //       newImageHeight = maxImageWidth / imageAspectRatio;
    //     } else {
    //       newImageHeight = maxImageHeight;
    //       newImageWidth = maxImageHeight * imageAspectRatio;
    //     }
    //   }
    // }
  }, [imageSrc]);




  // x={(canvasSize.width - imageSize.width) / 2} y={(canvasSize.height - imageSize.height) / 2}
  return (
    <div>
      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        onWheel={handleWheel}
        draggable>
        <Layer>
          <Image
            image={image}
            width={imageSize.width}
            height={imageSize.height}
            x={position.x}
            y={position.y}
            scaleX={scale}
            scaleY={scale} />
          {objectBoxes.map((box, index) => (
            <React.Fragment key={index}>
              <Rect
                x={box.x * scale + position.x}
                y={box.y * scale + position.y}
                width={box.width * scale}
                height={box.height * scale}
                fill="rgba(0,0,0,0)"
                stroke={labelColors[box.label]}
                strokeWidth={2}
              />
              <Text
                text={box.label}
                x={box.x * scale + position.x}
                y={box.y * scale + position.y}
                fontSize={12}
                fill={labelColors[box.label]}
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default ObjectDetectionResult;
