import React, { useEffect, useState } from "react";
import { TrajectoryChart } from "./TrajectoryChart";
import type { Condition } from "./type";
import { calculate } from "./calculate";

export const ResultCard = ({ condition }: { condition: Condition }) => {
  const [results, setResults] = useState<
    {
      x_list: number[];
      y_list: number[];
      condition: Condition;
      finalVelocity: number;
      flightTime: number;
    }[]
  >([]);
  useEffect(() => {
    if (!condition) return;
    if (!isValidCondition(condition)) return;
    setResults((prev) => {
      const exists = prev.some((r) => isSameCondition(r.condition, condition));
      if (exists) return prev;
      const res = calculate(condition);
      const finalVelocity = res.finalVelocity;
      const flightTime = res.flightTime;
      let len = res.x_list.length;
      res.x_list = res.x_list.filter((_, i) => i % Math.ceil(len / 500) === 0);
      res.y_list = res.y_list.filter((_, i) => i % Math.ceil(len / 500) === 0);
      return [...prev, { ...res, condition, finalVelocity, flightTime }];
    });
  }, [condition]);
  return (
    <div className="card flex flex-col gap-4">
      <h2 className="font-bold text-xl">計算結果</h2>
      <ol className="list-none list-inside flex flex-row flex-wrap gap-4 text-xs">
        {results.map((res, idx) => {
          const color = `hsl(${(idx * 251) % 360}, 80%, ${
            ((Math.floor(idx / 5) * 5 * 23 + 40) % 60) + 30
          }%)`;
          return (
            <li
              key={idx}
              className="relative group rounded-full px-3 py-1 text-white flex items-center justify-center gap-2 hover:shadow-lg hover:opacity-80 transition-all duration-200 ease-in-out"
              style={{ backgroundColor: color }}
            >
              <div>{idx}</div>
              <div
                className="bg-white w-3 h-3 rounded-full flex items-center justify-center font-bold cursor-pointer"
                style={{ color: color }}
                onClick={() => {
                  const newResults = results.filter((_, i) => i !== idx);
                  setResults(newResults);
                }}
              >
                ×
              </div>

              {/* Tooltip: shows condition on parent hover */}
              <div className="absolute top-full left-[200%] mb-2 transform -translate-x-1/2 w-56 p-2 rounded shadow bg-white text-neutral-800 text-xs opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-10">
                <div className="font-semibold">Condition</div>
                <div>初速: {res.condition.initV} m/s</div>
                <div>角度: {res.condition.angle}°</div>
                <div>発射高さ: {res.condition.yoffset} m</div>
                <div>飛翔体半径: {res.condition.radius} m</div>
                <div>質量: {res.condition.mass.toFixed(4)} kg</div>
                <div>Δt: {res.condition.deltaT}</div>
                <div>飛距離: {Math.max(...res.x_list).toFixed(4)} m</div>
                <div>最高高度: {Math.max(...res.y_list).toFixed(4)} m</div>
                <div>到達時間: {res.flightTime.toFixed(4)} s</div>
                <div>着弾速度: {res.finalVelocity.toFixed(2)} m/s</div>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="caption w-full min-h-60">
        <TrajectoryChart results={results} />
      </div>
    </div>
  );
};

const isSameCondition = (a: Condition, b: Condition) =>
  a.initV === b.initV &&
  a.angle === b.angle &&
  a.yoffset === b.yoffset &&
  a.radius === b.radius &&
  a.bulletDensity === b.bulletDensity &&
  a.mass === b.mass &&
  a.g === b.g &&
  a.fluidDensity === b.fluidDensity &&
  a.viscosity === b.viscosity &&
  a.deltaT === b.deltaT;

const isValidCondition = (c: Condition) =>
  c.initV > 0 &&
  c.mass > 0 &&
  c.bulletDensity > 0 &&
  c.radius > 0 &&
  c.g > 0 &&
  c.fluidDensity >= 0 &&
  c.viscosity > 0 &&
  c.deltaT > 0;
