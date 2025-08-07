import React from "react";

const defaultItem = [
  [
    "バナッハ=タルスキーのパラドックス",
    "宇宙定数",
    "熱的死",
    "生成文法",
    "脱構築",
  ],
  [
    "量子超越性",
    "利己的な遺伝子",
    "モナド",
    "ランダウアー限界",
    "ゼロ知識証明",
  ],
  ["人間原理", "ロシア構成主義", "爆発律", "自動微分", "作者の死"],
  [
    "世界システム論",
    "限界効用逓減則",
    "サバルタン",
    "超越論的転回",
    "サピア=ウォーフ仮説",
  ],
  [
    "反証可能性",
    "デミウルゴス",
    "不完全性定理",
    "後期重爆撃期",
    "不確定性原理",
  ],
];

export const BingoComponent = () => {
  const [item, setItem] = React.useState<string[][]>(defaultItem);
  const [bingoBools, setBingoBools] = React.useState<boolean[][]>(
    Array(5)
      .fill(null)
      .map(() => Array(5).fill(false))
  );
  const [isEditable, setIsEditable] = React.useState<boolean>(false);

  const handleClick = (row: number, col: number) => {
    const newBingoBools = bingoBools.map((r, rIndex) =>
      r.map((c, cIndex) => (rIndex === row && cIndex === col ? !c : c))
    );
    setBingoBools(newBingoBools);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center p-8 text-xs">
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} className="flex">
            {[0, 1, 2, 3, 4].map((col) => (
              <div
                key={col}
                className={
                  "md:w-20 md:h-20 w-17 h-17 flex items-center justify-center bg-white border border-amber-400 "
                }
              >
                {!isEditable && (
                  <button
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gridTemplateRows: "1fr",
                      placeItems: "normal",
                    }}
                    className="w-full h-full focus:outline-none"
                    onClick={() => handleClick(row, col)}
                  >
                    <div
                      style={{ gridColumn: "1", gridRow: "1", zIndex: 1 }}
                      className="w-full h-full flex items-center justify-center text-center font-bold"
                    >
                      {item[row][col]}
                    </div>
                    <div
                      style={{ gridColumn: "1", gridRow: "1" }}
                      className="w-full h-full opacity-75"
                    >
                      {bingoBools[row][col] && <MaruSVG />}
                    </div>
                  </button>
                )}
                {isEditable && (
                  <textarea
                    className="resize-none w-full h-full focus:outline-none p-2"
                    defaultValue={item[row][col]}
                    onChange={(e) => {
                      const newItem = [...item];
                      newItem[row][col] = e.target.value;
                      setItem(newItem);
                    }}
                  ></textarea>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={() => setIsEditable(!isEditable)}>
        {isEditable ? "保存" : "編集"}
      </button>
    </>
  );
};

interface MaruSVGProps {
  coeff?: number;
}

const MaruSVG = (props: MaruSVGProps) => {
  return (
    <svg
      width="66"
      height="66"
      viewBox="0 0 450 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M288.172 385.778C286.724 387.269 281.633 388.784 256.583 389.914C235.896 390.847 198.947 390.298 174.49 389.552C139.12 388.473 111.324 379.065 81.7428 365.538C58.6265 354.968 43.9329 333.162 31.8746 309.114C20.691 286.811 24.8195 260.092 32.4561 231.931C36.7585 216.066 46.6101 198.549 57.9663 181.124C69.3224 163.698 83.0814 147.29 99.2214 131.379C115.361 115.467 133.465 100.551 150.395 89.1371C167.325 77.7235 182.533 70.2651 200.143 63.4396C236.815 49.2257 271.933 43.7539 303.654 45.2343C341.109 46.9823 370.002 64.0272 387.525 77.1698C404.421 89.843 413.935 112.936 421.977 135.865C428.918 155.652 422.8 180.717 414.779 207.409C410.957 220.13 405.31 230.372 393.647 248.803C381.984 267.234 363.88 293.339 345.139 316.109C326.399 338.88 307.571 357.526 293.164 370.488C257.703 402.394 243.581 404.604 238.106 404.989C235.51 405.171 233.355 403.135 231.874 400.875C230.393 398.615 229.669 395.632 229.658 392.976C229.647 390.32 230.371 388.083 231.117 385.778"
        stroke="#FF0000"
        stroke-width="16"
        stroke-linecap="round"
      />
    </svg>
  );
};
