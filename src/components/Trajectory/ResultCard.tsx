import React, { useEffect, useState } from "react";
import { TrajectoryChart } from "./TrajectoryChart";
import type { Condition } from "./type";
import { calculate } from "./calculate";

export const ResultCard = ({ condition }: { condition: Condition }) => {
  const [results, setResults] = useState<
    { x_list: number[]; y_list: number[]; condition: Condition }[]
  >([]);
  useEffect(() => {
    if (!condition) return;
    setResults((prev) => {
      const exists = prev.some((r) => isSameCondition(r.condition, condition));
      if (exists) return prev;
      const res = calculate(condition);
      let len = res.x_list.length;
      res.x_list = res.x_list.filter((_, i) => i % Math.ceil(len / 500) === 0);
      res.y_list = res.y_list.filter((_, i) => i % Math.ceil(len / 500) === 0);
      return [...prev, { ...res, condition }];
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
              className="rounded-full px-3 py-1 text-white flex items-center justify-center gap-2 hover:shadow-lg hover:opacity-80 transition-all duration-200 ease-in-out"
              style={{ backgroundColor: color }}
            >
              <div>{idx}</div>
              <div
                className="bg-white w-3 h-3 rounded-full flex items-center justify-center font-bold"
                style={{ color: color }}
                onClick={() => {
                  const newResults = results.filter((_, i) => i !== idx);
                  setResults(newResults);
                }}
              >
                ×
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
