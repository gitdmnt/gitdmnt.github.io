import React, { useEffect, useState } from "react";
import { TrajectoryChart } from "./TrajectoryChart";
import type { Condition } from "./type";
import { reynoldsNumber, dragCoefficient } from "./utils";
import { calculate } from "./calculate";

export const TrajectoryCalculator = () => {
  const [condition, setCondition] = useState<Condition | undefined>(undefined);
  return (
    <div className="flex flex-col gap-4">
      <InputCard setCondition={setCondition} />
      <ResultCard condition={condition} />
    </div>
  );
};

const InputCard = ({
  setCondition,
}: {
  setCondition: React.Dispatch<React.SetStateAction<Condition | undefined>>;
}) => {
  // 発射諸元
  const [initV, setInitV] = useState(1);
  const [angle, setAngle] = useState(45);

  // 球の諸元
  const [radius, setRadius] = useState(1);
  const [bulletDensity, setBulletDensity] = useState(1); // t/m^3 = g/cm^3
  const [mass, setMass] = useState(
    (4 / 3) * Math.PI * radius ** 3 * bulletDensity * 1000
  );

  // 環境の諸元
  const [g, setG] = useState(9.81);
  const [fluidDensity, setFluidDensity] = useState(1.205); // kg/m^3 20℃1気圧の空気
  const [viscosity, setViscosity] = useState(1.822e-5); // Pa s  20℃1気圧の空気

  // シミュレーション諸元
  const [deltaT, setDeltaT] = useState(1e-3);

  // conditionの更新
  useEffect(() => {
    setCondition({
      initV,
      angle,
      radius,
      bulletDensity,
      mass,
      g,
      fluidDensity,
      viscosity,
      deltaT,
    });
  }, [
    initV,
    angle,
    radius,
    bulletDensity,
    mass,
    g,
    fluidDensity,
    viscosity,
    deltaT,
  ]);

  return (
    <div className="card flex flex-col gap-4">
      <h2 className="font-bold text-xl">諸元入力</h2>
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-bold">発射諸元</h3>
          <div className="flex flex-row gap-4">
            <div>
              <label className="caption">初速 (m/s): </label>
              <input
                type="number"
                value={initV}
                onChange={(e) => setInitV(parseFloat(e.target.value))}
                className="border p-1 rounded w-full"
              />
            </div>
            <div>
              <label className="caption">発射角度 (度): </label>
              <input
                type="number"
                value={angle}
                onChange={(e) => setAngle(parseFloat(e.target.value))}
                className="border p-1 rounded w-full"
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-bold">球の諸元</h3>
          <div className="flex flex-row gap-4">
            <div>
              <label className="caption">球の半径 (m): </label>
              <input
                type="number"
                value={radius}
                onChange={(e) => {
                  const r = parseFloat(e.target.value);
                  setRadius(r);
                  setMass((4 / 3) * Math.PI * r ** 3 * bulletDensity * 1000);
                }}
                className="border p-1 rounded w-full"
              />
            </div>
            <div>
              <label className="caption">球の密度 (g/cm³): </label>
              <input
                type="number"
                value={bulletDensity}
                onChange={(e) => {
                  const d = parseFloat(e.target.value);
                  setBulletDensity(d);
                  setMass((4 / 3) * Math.PI * radius ** 3 * d * 1000);
                }}
                className="border p-1 rounded w-full"
              />
            </div>
            <div>
              <label className="caption">球の質量 (kg): </label>
              <input
                type="number"
                value={mass}
                onChange={(e) => {
                  const m = parseFloat(e.target.value);
                  setMass(m);
                  setBulletDensity(
                    m / ((4 / 3) * Math.PI * radius ** 3) / 1000
                  );
                }}
                className="border p-1 rounded w-full"
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-bold">環境諸元</h3>
          <div className="flex flex-row gap-4">
            <div>
              <label className="caption">重力加速度 (m/s²): </label>
              <input
                type="number"
                value={g}
                onChange={(e) => setG(parseFloat(e.target.value))}
                className="border p-1 rounded w-full"
              />
            </div>
            <div>
              <label className="caption">流体密度 (kg/m³): </label>
              <input
                type="number"
                value={fluidDensity}
                onChange={(e) => setFluidDensity(parseFloat(e.target.value))}
                className="border p-1 rounded w-full"
              />
            </div>
            <div>
              <label className="caption">粘性係数 (Pa·s): </label>
              <input
                type="number"
                value={viscosity}
                onChange={(e) => setViscosity(parseFloat(e.target.value))}
                className="border p-1 rounded w-full"
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-bold">シミュレーション諸元</h3>
          <div>
            <label className="caption">Δt (s): </label>
            <input
              type="number"
              value={deltaT}
              onChange={(e) => setDeltaT(parseFloat(e.target.value))}
              className="border p-1 rounded w-full"
            />
          </div>
        </div>
        <div className="hidden">
          <h3>debug</h3>
          <div>
            レイノルズ数:
            {reynoldsNumber(fluidDensity, initV, radius * 2, viscosity).toFixed(
              2
            )}
          </div>
          <div>
            抗力係数:
            {dragCoefficient(
              reynoldsNumber(fluidDensity, initV, radius * 2, viscosity)
            ).toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultCard = ({ condition }: { condition: Condition }) => {
  const [result, setResult] = useState<{ x_list: number[]; y_list: number[] }>({
    x_list: [],
    y_list: [],
  });
  useEffect(() => {
    if (condition) {
      const res = calculate(condition);
      let len = res.x_list.length;
      res.x_list = res.x_list.filter((_, i) => i % Math.ceil(len / 500) === 0);
      res.y_list = res.y_list.filter((_, i) => i % Math.ceil(len / 500) === 0);
      setResult(res);
    }
  }, [condition]);

  const x_vals = result.x_list;
  const y_vals = result.y_list;
  const x_max = x_vals.length > 0 ? Math.max(...x_vals) : 1;
  const y_max = y_vals.length > 0 ? Math.max(...y_vals) : 1;

  return (
    <div className="card flex flex-col gap-4">
      <h2 className="font-bold text-xl">計算結果</h2>
      <div className="caption w-full min-h-60">
        <TrajectoryChart x={x_vals} y={y_vals} title="弾道軌跡" />
      </div>
    </div>
  );
};

export default TrajectoryCalculator;

