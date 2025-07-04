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
  const [selected, setSelected] = useState(-1);
  const [isHard, setIsHard] = useState(false);
  const [num, setNum] = useState(10);
  const [visiblity, setVisiblity] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [history, setHistory] = useState([]);

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

  const bottleClick = (i) => {
    if (selected === -1) {
      // 1度目の選択
      setSelected(i);
    } else if (selected === i) {
      // 同じものを選択したとき
      setSelected(-1);
    } else {
      // 正常
      pour(selected, i);

      setIsClear(check());
      if (isClear) {
        // タイマーストップ
      }
    }
  };

  const pour = (i, j) => {
    const first_element_index_start = (() => {
      const a = bottle[i].findIndex((v) => v !== 0);
      if (a === -1) {
        return 3;
      } else {
        return a;
      }
    })();
    const first_element_index_end =
      (() => {
        const a = bottle[i]
          .slice(first_element_index_start, 4)
          .findIndex((v) => v !== bottle[i][first_element_index_start]);
        if (a === -1) {
          return bottle[i].slice(first_element_index_start, 4).length;
        } else {
          return a;
        }
      })() + first_element_index_start;
    const first_element_length =
      first_element_index_end - first_element_index_start;
    const space_length = (() => {
      const a = bottle[j].findIndex((v) => v !== 0);
      if (a === -1) {
        return 4;
      } else {
        return a;
      }
    })();
    // 違う色だったら弾く
    // console.log("host:  ", first_element_index_start, bottle[i][first_element_index_start])
    // console.log("client:", space_length, bottle[j][space_length === 4 ? 3 : space_length])
    if (
      space_length !== 4 &&
      bottle[i][first_element_index_start] !==
        bottle[j][space_length === 4 ? 3 : space_length]
    ) {
    } else {
      const amount = Math.min(first_element_length, space_length);
      let result_host = bottle[i].concat();
      let result_client = bottle[j].concat();
      let count = 0;
      let point_host = first_element_index_start;
      let point_client = 3;
      // console.log("amount:", amount, first_element_index_start, first_element_index_end, space_length)
      // 無理やり入れ替えててキモいと思う
      while (count < amount) {
        if (result_client[point_client] === 0) {
          result_host[point_host] = 0;
          result_client[point_client] = bottle[i][point_host];
          // console.log("replace", point_client, "with", point_host);
          count++;
          point_host++;
        }
        point_client--;
      }
      let result = bottle.concat();
      result[i] = result_host;
      result[j] = result_client;
      setBottle(result);
      setHistory([...history, result]);
    }
    // 1本目を適当に
    setSelected(-1);
  };

  const check = () => {
    const length = bottle.filter(
      (b) => b[0] === b[1] && b[0] === b[2] && b[0] === b[3]
    ).length;
    if (length === num) {
      return true;
    } else {
      return false;
    }
  };

  const init = (n, isHardTemp) => {
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

  const initHardStable = (n) => {};

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

