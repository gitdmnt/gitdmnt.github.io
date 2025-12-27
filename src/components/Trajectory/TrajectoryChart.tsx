import React from "react";
import { ParentSize } from "@visx/responsive";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { LinePath } from "@visx/shape";
import { GridRows, GridColumns } from "@visx/grid";
import { curveNatural } from "d3-shape";
import type { Condition } from "./type";

type Props = {
  results: { x_list: number[]; y_list: number[]; condition: Condition }[];
};

const margin = { top: 0, right: 0, bottom: 40, left: 48 };

export const TrajectoryChart: React.FC<Props> = ({ results }) => {
  const title = "弾道軌跡";

  const xMin = Math.min(...results.flatMap((r) => r.x_list));
  const xMax = Math.max(...results.flatMap((r) => r.x_list));
  const yMin = Math.min(...results.flatMap((r) => r.y_list));
  const yMax = Math.max(...results.flatMap((r) => r.y_list));
  const xMargin = (xMax - xMin) * 0.1;
  const yMargin = (yMax - yMin) * 0.1;

  const x = results[0]?.x_list || [];
  const y = results[0]?.y_list || [];
  const xLabel = "distance";
  const xUnit = "m";
  const yLabel = "height";
  const yUnit = "m";

  return (
    <div style={{ width: "100%", height: 360 }}>
      <ParentSize>
        {({ width, height }) => {
          // 必要領域が描画可能領域に収まるようにする。

          const availableWidth = Math.max(
            0,
            width - margin.left - margin.right
          );
          const availableHeight = Math.max(
            0,
            height - margin.top - margin.bottom
          );

          if (x.length === 0 || y.length === 0) {
            return <div className="caption">データがありません</div>;
          }

          const _xScale = availableWidth / (xMax - xMin + xMargin);
          const _yScale = availableHeight / (yMax - yMin + yMargin);
          const scale = Math.min(_xScale, _yScale);

          const xDomainMin = xMin;
          const xDomainMax = xMin + availableWidth / scale;
          const yDomainMin = yMin;
          const yDomainMax = yMin + availableHeight / scale;

          const xScale = scaleLinear({
            domain: [xDomainMin, xDomainMax],
            range: [0, availableWidth],
          });
          const yScale = scaleLinear({
            domain: [yDomainMin, yDomainMax],
            range: [availableHeight, 0],
          });

          const points = x.map((vx, i) => ({ x: vx, y: y[i] ?? 0 }));

          return (
            <svg width={width} height={height}>
              <g transform={`translate(${margin.left},${margin.top})`}>
                <GridRows
                  scale={yScale}
                  width={availableWidth}
                  height={availableHeight}
                  stroke="#e6e6e6"
                />
                <GridColumns
                  scale={xScale}
                  width={availableWidth}
                  height={availableHeight}
                  stroke="#e6e6e6"
                />

                <LinePath
                  curve={curveNatural}
                  data={points}
                  x={(d) => xScale(d.x) ?? 0}
                  y={(d) => yScale(d.y) ?? 0}
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="none"
                />

                <AxisLeft
                  scale={yScale}
                  left={0}
                  tickStroke="#666"
                  tickLabelProps={() => ({
                    fill: "#666",
                    fontSize: 10,
                    textAnchor: "end",
                    dx: "-0.25em",
                  })}
                />
                <AxisBottom
                  scale={xScale}
                  top={availableHeight}
                  tickLabelProps={() => ({ fill: "#666", fontSize: 10 })}
                />

                {/* X軸ラベル */}
                <text
                  x={availableWidth / 2}
                  y={availableHeight + 32}
                  textAnchor="middle"
                  style={{ fontSize: 12, fill: "#333" }}
                >
                  {xLabel && xUnit
                    ? `${xLabel} (${xUnit})`
                    : xLabel
                    ? xLabel
                    : `(${xUnit})`}
                </text>

                {/* Y軸ラベル */}

                <text
                  transform={`translate(${-36},${
                    availableHeight / 2
                  }) rotate(-90)`}
                  textAnchor="middle"
                  style={{ fontSize: 12, fill: "#333" }}
                >
                  {yLabel && yUnit
                    ? `${yLabel} (${yUnit})`
                    : yLabel
                    ? yLabel
                    : `(${yUnit})`}
                </text>

                {title ? (
                  <text
                    x={innerWidth / 2}
                    y={-6}
                    textAnchor="middle"
                    style={{ fontSize: 14, fontWeight: 700 }}
                  >
                    {title}
                  </text>
                ) : null}
              </g>
            </svg>
          );
        }}
      </ParentSize>
    </div>
  );
};
