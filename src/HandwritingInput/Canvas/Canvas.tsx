import React from "react";
import Box from "@mui/material/Box";
import { useRef } from "react";
import { Path } from "../Path";
import { Point, Stroke } from "../Types";

export interface CanvasProps {
  onPointerDown: (point: Point) => void;
  onPointerMove: (point: Point) => void;
  onPointerUp: () => void;
  strokes: Stroke[];
  currentStroke: Stroke | undefined;
  width: number;
  height: number;
  linewidth: number;
}

export const Canvas = (props: CanvasProps) => {
  const {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    strokes,
    currentStroke,
    width,
    height,
    linewidth,
  } = props;

  const canvasRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (
    event: PointerEvent | React.PointerEvent<HTMLDivElement>
  ) => {
    let point = getCoordinateInCanvas(event.pageX, event.pageY);
    onPointerDown(point);
  };

  const handlePointerMove = (
    event: PointerEvent | React.PointerEvent<HTMLDivElement>
  ) => {
    let point = getCoordinateInCanvas(event.pageX, event.pageY);
    onPointerMove(point);
  };

  const handlePointerUp = (
    event: PointerEvent | React.PointerEvent<HTMLDivElement>
  ) => {
    let point = getCoordinateInCanvas(event.pageX, event.pageY);
    onPointerUp();
  };

  const getCoordinateInCanvas = (x: number, y: number) => {
    if (canvasRef.current) {
      let canvasSizeData = canvasRef.current.getBoundingClientRect();

      const point: Point = {
        x: (x - canvasSizeData.left) * (width / canvasSizeData.width),
        y: (y - canvasSizeData.top) * (height / canvasSizeData.height),
      };
      return point;
    } else {
      const point: Point = { x: 0, y: 0 };
      return point;
    }
  };

  return (
    <Box
      ref={canvasRef}
      sx={{
        width: width,
        height: height,
        cursor: "crosshair",
        border: "1px solid grey",
        boxShadow: 1,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <svg
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {strokes?.map((stroke, index) => (
          <Path key={index} stroke={stroke.points} width={linewidth}></Path>
        ))}
        {currentStroke && (
          <Path
            key={strokes.length}
            stroke={currentStroke.points}
            width={linewidth}
          ></Path>
        )}
      </svg>
    </Box>
  );
};
