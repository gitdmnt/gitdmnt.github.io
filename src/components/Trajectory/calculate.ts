import type { Condition } from "./type";
import { reynoldsNumber, dragCoefficient } from "./utils";

// 空気抵抗ありの弾道計算
// m d^2x/dt^2 = - 1/2 ρ sqrt(dx/dt^2 + dy/dt^2) dx/dt Cd A
// m d^2y/dt^2 = - mg - 1/2 ρ sqrt(dx/dt^2 + dy/dt^2) dy/dt Cd A
// ただし A = πr^2
export const calculate = (condition: Condition) => {
  let x = 0;
  let y = condition.yoffset ?? 0;

  const deltaT = condition.deltaT;

  let vx = condition.initV * Math.cos((condition.angle * Math.PI) / 180);
  let vy = condition.initV * Math.sin((condition.angle * Math.PI) / 180);

  const x_list = [x];
  const y_list = [y];

  while (y >= 0 && x_list.length < 100000) {
    // 空気抵抗の計算
    const v = Math.sqrt(vx * vx + vy * vy);

    const re = reynoldsNumber(
      condition.fluidDensity,
      v,
      condition.radius * 2,
      condition.viscosity
    );

    let dragForceX = 0;
    let dragForceY = 0;

    if (re > 0) {
      const cd = dragCoefficient(re);
      const area = Math.PI * condition.radius * condition.radius;

      dragForceX = 0.5 * condition.fluidDensity * v * vx * cd * area;
      dragForceY = 0.5 * condition.fluidDensity * v * vy * cd * area;
    }

    // 加速度の計算
    const ax = -dragForceX / condition.mass;
    const ay = -dragForceY / condition.mass - condition.g;

    // 速度の更新
    vx += ax * deltaT;
    vy += ay * deltaT;

    // 位置の更新
    x += vx * deltaT;
    y += vy * deltaT;

    // リストへの追加
    x_list.push(x);
    y_list.push(y);
  }

  return {
    x_list,
    y_list,
    finalVelocity: Math.sqrt(vx * vx + vy * vy),
    flightTime: (x_list.length - 1) * deltaT,
  };
};
