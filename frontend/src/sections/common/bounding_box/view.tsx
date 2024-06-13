import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Image, Line } from 'react-konva';

const BoundingBoxProduct = ({ imageSrc, objectBoxes, clickBboxProductEmit }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 540 });
  const [image, setImage] = useState(new window.Image());
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null); // Tạo ref sử dụng useRef
  const minScale = 0.4;
  const maxScale = 2;

  const handleWheel = (e) => {
    e.evt.preventDefault();
    let newScale = scale;
    if (e.evt.deltaY > 0) {
      newScale = Math.max(minScale, scale / 1.1);
    } else {
      newScale = Math.min(maxScale, scale * 1.1);
    }

    setScale(newScale);
  };

  const handleClickBoundingBox = async (box) => {
    const stage = stageRef.current.getStage(); // Sử dụng stageRef.current để truy cập vào Stage
    const imageNode = stage.findOne('Image');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const points = box.points;
    const minX = Math.min(points[0][0], points[1][0], points[2][0], points[3][0]);
    const minY = Math.min(points[0][1], points[1][1], points[2][1], points[3][1]);
    const maxX = Math.max(points[0][0], points[1][0], points[2][0], points[3][0]);
    const maxY = Math.max(points[0][1], points[1][1], points[2][1], points[3][1]);
    const width = maxX - minX;
    const height = maxY - minY;

    canvas.width = width * scale;
    canvas.height = height * scale;

    // Sử dụng OpenCV.js để cắt ảnh
    const src = cv.imread(imageNode.image()); // Đọc ảnh từ Image của Konva
    const mat = new cv.Mat();
    const rect = new cv.Rect(minX, minY, width, height);
    const dst = src.roi(rect);

    // Chuyển đổi ảnh từ OpenCV Mat thành canvas
    cv.imshow(canvas, dst);
    
    // Giải phóng bộ nhớ
    src.delete();
    dst.delete();
    mat.delete();

    // Chuyển đổi canvas thành dataURL
    const dataURL = canvas.toDataURL();
    console.log(dataURL);
    clickBboxProductEmit(dataURL);
  };

  useEffect(() => {
    const img = new window.Image();
    img.src = imageSrc;
    setImage(img);

    img.onload = () => {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setImageSize({ width: img.width, height: img.height });
    };
  }, [imageSrc]);

  return (
    <div>
      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        onWheel={handleWheel}
        draggable
        ref={stageRef} // Gắn ref vào Stage
      >
        <Layer>
          <Image
            image={image}
            width={imageSize.width}
            height={imageSize.height}
            x={position.x}
            y={position.y}
            scaleX={scale}
            scaleY={scale}
          />
          {objectBoxes.map((box, index) => {
            const points = box.points.flatMap(p => [
              p[0] * scale + position.x,
              p[1] * scale + position.y,
            ]);
            return (
              <Line
                key={index}
                points={[...points, points[0], points[1]]} // Close the box by connecting to the first point
                closed
                fill="rgba(0,0,0,0)"
                stroke="red"
                strokeWidth={2}
                onClick={() => handleClickBoundingBox(box)} // Pass box as argument
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default BoundingBoxProduct;
