import React, { useEffect, useState } from "react";
import type { Condition } from "./type";
import { InputCard } from "./InputCard";
import { ResultCard } from "./ResultCard";

export const TrajectoryCalculator = () => {
  const [condition, setCondition] = useState<Condition | undefined>(undefined);
  return (
    <div className="flex flex-col gap-4 w-full md:flex-row-reverse">
      <div className="flex flex-col gap-4 w-full md:w-1/3">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold">簡易弾道計算機</h1>
          <p className="text-sm text-neutral-500">ティータイムのおともに。</p>
        </div>
        <InputCard setCondition={setCondition} />
      </div>
      <div className="w-full md:w-2/3">
        <ResultCard condition={condition} />
      </div>
    </div>
  );
};

export default TrajectoryCalculator;
