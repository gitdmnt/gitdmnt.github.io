import React, { useEffect, useState } from "react";
import type { Condition } from "./type";
import { InputCard } from "./InputCard";
import { ResultCard } from "./ResultCard";

export const TrajectoryCalculator = () => {
  const [condition, setCondition] = useState<Condition | undefined>(undefined);
  return (
    <div className="flex flex-col gap-4">
      <InputCard setCondition={setCondition} />
      <ResultCard condition={condition} />
    </div>
  );
};

export default TrajectoryCalculator;
