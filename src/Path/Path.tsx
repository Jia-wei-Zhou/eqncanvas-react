import React from "react";
import { Point } from "../Types";

export interface PathProps {
  stroke: Point[];
  width: number;
}

export const Path = (props: PathProps) => {
  const { stroke, width } = props;
  if (stroke.length === 0 || !stroke) return <div></div>;
  if (stroke.length === 1) {
    const radius = width / 2;
    const x = stroke[0].x;
    const y = stroke[0].y;
    return (
      <circle cx={x} cy={y} r={radius} stroke="black" fill="black"></circle>
    );
  }
  const pathData =
    "M " +
    stroke
      .map((s) => {
        return `${s.x} ${s.y}`;
      })
      .join(" L ");

  return (
    <path
      fill="none"
      strokeLinecap="round"
      stroke="black"
      strokeWidth={width}
      d={pathData}
    ></path>
  );
};
