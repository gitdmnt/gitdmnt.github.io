import React from "react";

const item = [
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
  const [bingoBools, setBingoBools] = React.useState<boolean[][]>(
    Array(5)
      .fill(null)
      .map(() => Array(5).fill(false))
  );

  const handleClick = (row: number, col: number) => {
    const newBingoBools = bingoBools.map((r, rIndex) =>
      r.map((c, cIndex) => (rIndex === row && cIndex === col ? !c : c))
    );
    setBingoBools(newBingoBools);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-xs">
      {[0, 1, 2, 3, 4].map((row) => (
        <div key={row} className="flex">
          {[0, 1, 2, 3, 4].map((col) => (
            <div
              key={col}
              className={
                "w-20 h-20 flex items-center justify-center bg-white border border-amber-400 "
              }
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "1fr",
              }}
              onClick={() => handleClick(row, col)}
            >
              <div
                style={{ gridColumn: "1", gridRow: "1" }}
                className="w-20 h-20 opacity-75"
              >
                {bingoBools[row][col] && <MaruSVG />}
              </div>
              <p style={{ gridColumn: "1", gridRow: "1" }}>{item[row][col]}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const MaruSVG = () => {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 378 425"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M290.455 331.091C270.955 337.091 251.455 343.091 223.034 346.557C194.614 350.023 157.864 350.773 135.557 350.409C106.444 349.935 83.0454 340.25 54.2954 326.648C32.6183 316.392 20.0682 293.341 9.4659 268.023C-0.188893 244.967 7.8409 213.091 18.7727 176.818C24.4381 158.02 36.4545 140.545 47.1136 124.898C57.7727 109.25 68.2727 96.5 82.3068 83.1818C112.196 54.8173 145.614 34.9545 176.58 20.9659C210.625 5.58614 244.114 3.81818 272.807 6.81818C308.454 10.5453 334.318 29.5 348.682 46.8636C364.851 66.4098 369.977 92.3409 372.261 118.011C375.075 149.634 363.977 180.955 347.42 219.409C336.328 245.172 312.864 280.364 289.659 311.659C266.455 342.955 242.455 368.455 225.591 384.966C199.727 408.227 185.205 417.432 174.625 418.966C169.295 418.25 164.045 414.5 158.636 410.636"
        stroke="#FF0000"
        stroke-width="24"
        stroke-linecap="round"
      />
    </svg>
  );
};
