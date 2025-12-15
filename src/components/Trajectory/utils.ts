export const reynoldsNumber = (
  fluidDensity: number,
  velocity: number,
  diameter: number,
  viscosity: number
) => {
  return (fluidDensity * velocity * diameter) / viscosity;
};

export const dragCoefficient = (re: number) => {
  // Morrisonの式に基づくCdの計算
  let a_1 = 24 / re;
  let a_2 = (2.6 * (re / 5)) / (1 + (re / 5) ** 1.52);
  let a_3 = (0.411 * (re / 263000) ** -7.94) / (1 + (re / 263000) ** -8);
  let a_4 = (0.25 * (re / 1e6)) / (1 + re / 1e6);

  return a_1 + a_2 + a_3 + a_4;
};

