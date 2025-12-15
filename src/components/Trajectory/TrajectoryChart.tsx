import React from "react";
import { ParentSize } from "@visx/responsive";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { LinePath } from "@visx/shape";
import { GridRows, GridColumns } from "@visx/grid";
import { curveMonotoneX } from "d3-shape";

type Props = {
  x: number[];
  y: number[];
  title?: string;
};

const margin = { top: 16, right: 16, bottom: 40, left: 48 };

export const TrajectoryChart: React.FC<Props> = ({ x, y, title }) => {
  const xLabel = "distance";
  const xUnit = "m";
  const yLabel = "height";
  const yUnit = "m";
  return (
    <div style={{ width: "100%", height: 360 }}>
      <ParentSize>
        {({ width, height }) => {
          const outerInnerWidth = Math.max(
            0,
            width - margin.left - margin.right
          );
          const outerInnerHeight = Math.max(
            0,
            height - margin.top - margin.bottom
          );

          if (x.length === 0 || y.length === 0) {
            return <div className="caption">データがありません</div>;
          }

          const xMin = 0;
          const xMax = Math.max(...x) * 1.1;
          const yMin = 0;
          const yMax = Math.max(...y) * 1.1;

          // 保持したいアスペクト比（domain 比）
          const dx = xMax - xMin || 1;
          const dy = yMax - yMin || 1;
          const targetRatio = dx / dy;

          // outerInnerWidth/Height は利用可能な描画領域（余白を除いたもの）
          // targetRatio に合わせて innerWidth/innerHeight を決める。
          // コンテナが横長すぎる場合は幅を縮め、縦長すぎる場合は高さを縮める。
          let innerWidth = outerInnerWidth;
          let innerHeight = outerInnerHeight;
          const containerRatio =
            outerInnerWidth / Math.max(1, outerInnerHeight);
          if (containerRatio > targetRatio) {
            // コンテナが横長 → 幅を縮める
            innerWidth = Math.max(
              0,
              Math.floor(outerInnerHeight * targetRatio)
            );
            innerHeight = outerInnerHeight;
          } else {
            // コンテナが縦長 → 高さを縮める
            innerWidth = outerInnerWidth;
            innerHeight = Math.max(
              0,
              Math.floor(outerInnerWidth / targetRatio)
            );
          }

          // 中央寄せのためのオフセット
          const offsetX =
            margin.left + Math.floor((outerInnerWidth - innerWidth) / 2);
          const offsetY =
            margin.top + Math.floor((outerInnerHeight - innerHeight) / 2);

          const xScale = scaleLinear({
            domain: [xMin, xMax],
            range: [0, innerWidth],
          });
          const yScale = scaleLinear({
            domain: [yMin, yMax],
            range: [innerHeight, 0],
          });

          const points = x.map((vx, i) => ({ x: vx, y: y[i] ?? 0 }));

          return (
            <svg width={width} height={height}>
              <g transform={`translate(${offsetX},${offsetY})`}>
                <GridRows
                  scale={yScale}
                  width={innerWidth}
                  height={innerHeight}
                  stroke="#e6e6e6"
                />
                <GridColumns
                  scale={xScale}
                  width={innerWidth}
                  height={innerHeight}
                  stroke="#e6e6e6"
                />

                <LinePath
                  curve={curveMonotoneX}
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
                  top={innerHeight}
                  tickLabelProps={() => ({ fill: "#666", fontSize: 10 })}
                />

                {/* X軸ラベル */}
                <text
                  x={innerWidth / 2}
                  y={innerHeight + 28}
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
                  transform={`translate(${-36},${innerHeight / 2}) rotate(-90)`}
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

