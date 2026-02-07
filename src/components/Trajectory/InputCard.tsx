import React, { useEffect, useState } from "react";
import type { Condition } from "./type";
import { reynoldsNumber, dragCoefficient } from "./utils";

export const InputCard = ({
  setCondition,
}: {
  setCondition: React.Dispatch<React.SetStateAction<Condition | undefined>>;
}) => {
  // 発射諸元
  const [initV, setInitV] = useState(1);
  const [angle, setAngle] = useState(45);
  const [yoffset, setYoffset] = useState(0);

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
      yoffset,
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
    yoffset,
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
            <div>
              <label className="caption">発射高さ (m): </label>
              <input
                type="number"
                value={yoffset}
                onChange={(e) => setYoffset(parseFloat(e.target.value))}
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
