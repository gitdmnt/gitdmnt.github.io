import React, { useState } from "react";
import styles from "./WaterSort.module.css";

export const WaterSort = () => {
  const [bottle, setBottle] = useState([
    [1, 1, 1, 1],
    [2, 2, 2, 2],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [defaultBottle, setDefaultBottle] = useState([
    [1, 1, 1, 1],
    [2, 2, 2, 2],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [selected, setSelected] = useState<number | undefined>(-1);
  const [isHard, setIsHard] = useState(false);
  const [num, setNum] = useState(10);
  const [visiblity, setVisiblity] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [history, setHistory] = useState<number[][][]>([]);

  const color = [
    "#00000000",
    "#ffe600",
    "#0db8d9",
    "#a2ca0e",
    "#c84283",
    "#2660ac",
    "#ea5419",
    "#008442",
    "#f08a37",
    "#f8b800",
    "#de6c31",
    "#00a0e8",
    "#153692",
    "#ea6088",
    "#aecfed",
    "#efcf2e",
    "#34b496",
    "#3A3839",
    "#c4ca00",
    "#e40067",
    "#69c4d0",
  ];

  const fontColor = [
    "#1d1d1d",
    "#1d1d1d",
    "#1d1d1d",
    "#1d1d1d",
    "#fff",
    "#fff",
    "#fff",
    "#fff",
    "#1d1d1d",
    "#1d1d1d",
    "#fff",
    "#fff",
    "#fff",
    "#fff",
    "#1d1d1d",
    "#1d1d1d",
    "#fff",
    "#fff",
    "#1d1d1d",
    "#fff",
    "#1d1d1d",
  ];

  const bottleClick = (i: number) => {
    if (selected === undefined || selected === -1) {
      // 1度目の選択
      setSelected(i);
    } else if (selected === i) {
      // 同じものを選択したとき
      setSelected(undefined);
    } else {
      // 正常
      pour(selected, i);

      setIsClear(check());
      if (isClear) {
        // タイマーストップ
      }
    }
  };

  const pour = (i: number, j: number) => {
    // 1本目に選択されたボトルの空でない一番上の要素の一番上のインデックスを取得
    const first_element_start = (() => {
      const a = bottle[i].findIndex((v) => v !== 0);
      return a === -1 ? 3 : a;
    })();

    // 1本目に選択されたボトルの空でない一番上の要素の一番下のインデックスを取得
    const first_element_end =
      (() => {
        const a = bottle[i]
          .slice(first_element_start, 4)
          .findIndex((v) => v !== bottle[i][first_element_start]);
        return a === -1 ? bottle[i].slice(first_element_start, 4).length : a;
      })() + first_element_start;

    // 1本目に選択されたボトルの空でない一番上の要素の長さを取得
    const first_element_length = first_element_end - first_element_start;

    // 1本目に選択されたボトルの空でない一番上の要素の色を取得
    const first_element_color = bottle[i][first_element_start];

    // 2本目に選択されたボトルの空領域の長さを取得
    const space_length = (() => {
      const a = bottle[j].findIndex((v) => v !== 0);
      return a === -1 ? 4 : a;
    })();

    // 2本目に選択されたボトルの空でない一番上の要素の色を取得
    const second_element_color =
      space_length === 4 ? undefined : bottle[j][space_length];

    // 完全に空か、1本目の色と2本目の色が同じなら注ぐ
    if (space_length === 4 || first_element_color === second_element_color) {
      const pour_amount = Math.min(first_element_length, space_length);
      let result_host = bottle[i].concat();
      let result_client = bottle[j].concat();
      result_host.fill(
        0,
        first_element_start,
        first_element_start + pour_amount,
      );
      result_client.fill(
        first_element_color,
        space_length - pour_amount,
        space_length,
      );
      let result = bottle.concat();
      result[i] = result_host;
      result[j] = result_client;
      setBottle(result);
      setHistory([...history, result]);
    }

    // 選択を解除
    setSelected(undefined);
  };

  const check = () => {
    const length = bottle.filter(
      (b) => b[0] === b[1] && b[0] === b[2] && b[0] === b[3],
    ).length;
    if (length === num) {
      return true;
    } else {
      return false;
    }
  };

  const init = (n: number, isHardTemp: boolean) => {
    // 難易度設定
    if (isHardTemp) {
      setIsHard(true);
    } else {
      setIsHard(false);
    }

    // 盤面初期化
    const bottle = [];

    if (isHardTemp) {
      const arr = [];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < 4; j++) {
          arr.push(i + 1);
        }
      }
      for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      for (let i = 0; i < n; i++) {
        bottle.push([
          arr[4 * i],
          arr[4 * i + 1],
          arr[4 * i + 2],
          arr[4 * i + 3],
        ]);
      }
    } else {
      for (let i = 0; i < n; i++) {
        bottle.push([i + 1, i + 1, i + 1, i + 1]);
      }
      for (let i = 0; i < n * 100; i++) {
        const a = Math.floor(Math.random() * n);
        const b = Math.floor(Math.random() * n);
        const range = Math.floor(Math.random() * 4);
        for (let j = 0; j < range; j++) {
          let memo = bottle[a][j];
          bottle[a][j] = bottle[b][j];
          bottle[b][j] = memo;
        }
      }
    }
    bottle.push([0, 0, 0, 0]);
    bottle.push([0, 0, 0, 0]);
    setBottle(bottle);
    setDefaultBottle(bottle);
    setHistory([bottle]);

    setIsClear(false);
  };

  const initHardStable = (n: number) => {};

  const resetBottle = () => {
    setBottle(defaultBottle);
    setHistory([defaultBottle]);
  };

  const seed = defaultBottle
    .map((e) => e.reduce((str, cur) => str + cur.toString(), ""))
    .reduce((str, cur) => str + cur.toString(), "");

  const undo = () => {
    const last = history[history.length - 2];
    if (last) {
      setBottle(last);
      setHistory(history.slice(0, -1));
      setSelected(-1);
    }
  };

  return (
    <div className={styles.watersort}>
      <ul className={styles.container}>
        {bottle.map((b, i) => {
          return (
            <li className={styles.wrapper}>
              <ul
                className={styles.bottle}
                style={{
                  boxShadow: ((i) => {
                    if (selected === i) {
                      return "0 0 3px 2px rgba(0, 0, 0, 0.2)";
                    } else {
                      return "0 0 3px 2px rgba(0, 0, 0, 0)";
                    }
                  })(i),
                }}
                onClick={() => bottleClick(i)}
              >
                {b.map((j, k) => {
                  return (
                    <li
                      className={styles.water}
                      style={{
                        color: fontColor[j],
                        backgroundColor: color[j],
                        borderRadius: (() => {
                          if (k === 3) {
                            return "0 0 10px 10px";
                          }
                        })(),
                      }}
                    >
                      <div className={styles.water}>
                        {(() => {
                          if (visiblity) {
                            return j;
                          }
                        })()}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
        <li className={styles.wrapper}>
          <ul
            className={styles.bottle}
            style={{
              border: "2px dashed #888",
            }}
            onClick={() => {
              setBottle(bottle.concat([[0, 0, 0, 0]]));
            }}
          >
            {[0, 1, 2, 3].map((i, j) => {
              return (
                <li
                  className={styles.water}
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: (() => {
                      if (j === 3) {
                        return "0 0 10px 10px";
                      }
                    })(),
                  }}
                >
                  {(() => {
                    if (i == 0) {
                      return (
                        <p
                          style={{
                            margin: 0,
                            position: "relative",
                            top: "-10px",
                            left: "10px",
                            fontSize: "15pt",
                            fontWeight: "bolder",
                            textShadow:
                              "2px 0px 0px rgba(0, 0, 0, 1), -2px 0px 0px rgba(0, 0, 0, 1), 0px 2px 0px rgba(0, 0, 0, 1), 0px -2px 0px rgba(0, 0, 0, 1), 2px 2px 0px rgba(0, 0, 0, 1), -2px 2px 0px rgba(0, 0, 0, 1), 2px -2px 0px rgba(0, 0, 0, 1), -2px -2px 0px rgba(0, 0, 0, 1)",
                            color: "white",
                          }}
                        >
                          +
                        </p>
                      );
                    }
                  })()}
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
      <div className="ui">
        <div className="undoredo">
          <button type="button" className={styles.button} onClick={undo}>
            1つもどる
          </button>
        </div>
        <input
          type="range"
          min={2}
          max={20}
          step={1}
          value={num}
          className={styles.range}
          onChange={(e) => {
            setNum(Number(e.target.value));
            init(Number(e.target.value), isHard);
          }}
        />
        <div className={styles.button}>
          <button
            type="button"
            onClick={() => {
              init(num, false);
            }}
            className={styles.button}
            style={{
              backgroundColor: (() => {
                if (!isHard) {
                  return "#e07798";
                }
              })(),
            }}
          >
            かんたん
          </button>
          <button
            type="button"
            onClick={() => {
              init(num, true);
            }}
            className={styles.button}
            style={{
              backgroundColor: (() => {
                if (isHard) {
                  return "#e07798";
                }
              })(),
            }}
          >
            むずかしい
          </button>
          <button
            type="button"
            onClick={() => resetBottle()}
            className={styles.button}
          >
            リセット
          </button>
        </div>
        <label htmlFor="switch" className={styles.toggle}>
          <input
            type="checkbox"
            id="switch"
            className={styles.toggle}
            defaultChecked={false}
            onChange={(e) => {
              if (e.target.checked) {
                setVisiblity(true);
              } else {
                setVisiblity(false);
              }
            }}
          />
          <p className={styles.toggle}>色覚補助</p>
          <div className={styles.toggle}>
            <div className={styles.slider}></div>
          </div>
        </label>
      </div>
    </div>
  );
};

