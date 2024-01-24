import React, { useState } from "react";
import styles from "./WaterSort.module.css";

const color = [
  "#00000000",
  "#ffe600", "#0db8d9", "#a2ca0e", "#c84283", "#2660ac",
  "#ea5419", "#008442", "#f08a37", "#f8b800", "#de6c31",
  "#00a0e8", "#153692", "#ea6088", "#aecfed", "#efcf2e",
  "#34b496", "#3A3839", "#c4ca00", "#e40067", "#69c4d0",
];

const fontColor = [
  "#1d1d1d",
  "#1d1d1d", "#1d1d1d", "#1d1d1d", "#fff", "#fff",
  "#fff", "#fff", "#1d1d1d", "#1d1d1d", "#fff",
  "#fff", "#fff", "#fff", "#1d1d1d", "#1d1d1d",
  "#fff", "#fff", "#1d1d1d", "#fff", "#1d1d1d",
]

// 1つだけ移す
const pourOne = (server: number[], client: number[]) => {
  const serverIsEmpty = server[server.length - 1] === 0;
  const clientIsFull = client[0] !== 0;
  if (serverIsEmpty || clientIsFull) { return; }

  const serverFirstNonZeroIndex = server.findIndex(e => e !== 0);
  const clientLastZeroIndex = client.findIndex(e => e !== 0) - 1;

  const element = server[serverFirstNonZeroIndex];
  server[serverFirstNonZeroIndex] = 0;
  client[clientLastZeroIndex] = element;
}

// n回だけ移すpourOneを返す
const pourN = (n: number) => {
  return (s: number[], c: number[]) => { for (let i = 0; i < n; i++) { pourOne(s, c); } }
}

// 先頭の色を返す
const top = (bottle: number[]) => {
  const isEmpty = bottle.filter(e => e !== 0).length === 0 ? true : false;
  if (isEmpty) {
    return 0;
  }
  else {
    return bottle.find(e => e !== 0);
  }
}

// 先頭の色の量を返す
const topLen = (bottle: number[]) => {
  const isEmpty = bottle.filter(e => e !== 0).length === 0 ? true : false;
  if (isEmpty) {
    return 0;
  } else {
    const firstIndex = bottle.findIndex(e => e !== 0);
    const color = bottle[firstIndex];
    const lastIndex = bottle.findIndex(e => e !== 0 && e !== color);
    return lastIndex - firstIndex + 1;
  }
}

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
  const [first, setFirst] = useState(-1);
  const [isHard, setIsHard] = useState(false);
  const [num, setNum] = useState(10);
  const [visiblity, setVisiblity] = useState(false);
  const [isClear, setIsClear] = useState(false);



  const bottleClick = (i) => {
    if (first === -1) {
      // 1度目の選択
      setFirst(i)
    } else if (first === i) {
      // 同じものを選択したとき
      setFirst(-1)
    }
    else {
      // 正常
      pour(first, i)

      setIsClear(check());
      if (isClear) {
        // タイマーストップ
      }
    }
  }

  const pour = (i, j) => {
    const first_element_index_start = (() => { const a = bottle[i].findIndex(v => v !== 0); if (a === -1) { return 3; } else { return a; } })();
    const first_element_index_end = (() => { const a = bottle[i].slice(first_element_index_start, 4).findIndex(v => v !== bottle[i][first_element_index_start]); if (a === -1) { return bottle[i].slice(first_element_index_start, 4).length; } else { return a; } })() + first_element_index_start;
    const first_element_length = first_element_index_end - first_element_index_start;
    const space_length = (() => { const a = bottle[j].findIndex(v => v !== 0); if (a === -1) { return 4; } else { return a; } })();
    // 違う色だったら弾く
    // console.log("host:  ", first_element_index_start, bottle[i][first_element_index_start])
    // console.log("client:", space_length, bottle[j][space_length === 4 ? 3 : space_length])
    if (space_length !== 4 && bottle[i][first_element_index_start] !== bottle[j][space_length === 4 ? 3 : space_length]) {
    }
    else {
      const amount = Math.min(first_element_length, space_length);
      for (let k = 0; k < amount; k++) {
        pourOne(bottle[i], bottle[j])
      }
      setBottle(bottle);
    }

    // 1本目を適当に
    setFirst(-1);
  }

  const check = () => {
    const length = bottle.filter((b) => b[0] === b[1] && b[0] === b[2] && b[0] === b[3]).length;
    if (length === num) {
      return true;
    }
    else {
      return false;
    }
  }

  const init = (n, isHardTemp) => {

    // 難易度設定
    if (isHardTemp) { setIsHard(true) } else { setIsHard(false) }

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
        bottle.push([arr[4 * i], arr[4 * i + 1], arr[4 * i + 2], arr[4 * i + 3]])
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

    setIsClear(false);
  }

  // 動かない！
  const initStable = (n) => {
    // 初期化
    const bottle = [[0, 0, 0, 0], [0, 0, 0, 0]];
    for (let i = 0; i < n; i++) {
      bottle.push([i + 1, i + 1, i + 1, i + 1]);
    }

    // 逆回しで入れ替える
    for (let i = 0; i < bottle.length * 1; i++) {
      console.log(i)
      const a = Math.floor(Math.random() * bottle.length);
      const b = Math.floor(Math.random() * bottle.length);

      const serverSpace = bottle[a].filter((e) => e === 0).length;
      const serverAmount = 4 - serverSpace;
      const clientSpace = bottle[b].filter((e) => e === 0).length;

      /*
        順：連結している色はまとめて動く→
        逆：下に同じ色があるところへは移動できない
      */
      if (top(bottle[a]) === top(bottle[b])) { continue; }

      /*
        順：下に同じ色がある場所、または空の瓶にしか移せない→
        逆：連続する色の途中、または瓶を空にする移動だけが可能
      */

      const maxLen = Math.min(serverAmount, clientSpace);
      const len = Math.floor(Math.random() * maxLen);
      if (!(bottle[a][serverSpace + len - 1] === bottle[a][serverSpace + len] || len === serverAmount)) {
        continue;
      }

      for (let j = 0; j < len; j++) {
        /* 
          最終的に（つまり初期盤面状態で）空の瓶が空になるようにするにはもうすこし工夫が必要で、
          最終的に空の瓶にしたい2つの瓶に対してのみ、
          「空でなければすでに入っている色と異なる色を入れてはいけない」ルールが要るかも
        */
        console.log("b")
        if (b === n || b === n + 1) {
          const isEmpty = bottle[b].filter(e => e !== 0).length === 0 ? true : false;
          if (!isEmpty && (bottle[b][clientSpace - j] !== bottle[a][serverSpace + len])) {
            continue;
          }
        }
        pourOne(bottle[a], bottle[b]);
      }
    }

    // 最後の2本を空にする。
    while (true) {
      console.log("c")
      for (let i = 0; i < n; i++) {
        console.log("d")
        if (bottle[i][0] !== 0) {
          continue;
        }
        if (top(bottle[n]) !== top(bottle[i])) {
          bottle[n].forEach(() => pourOne(bottle[n], bottle[i]));
        }
      }
      for (let i = 0; i < n; i++) {
        console.log("e")
        if (bottle[i][0] !== 0) {
          continue;
        }
        if (top(bottle[n + 1]) !== top(bottle[i])) {
          bottle[n + 1].forEach(() => pourOne(bottle[n + 1], bottle[i]));
        }
      }
      if (bottle[n][3] !== 0 || bottle[n + 1][3] !== 0) {
        pourN(3)(bottle[n], bottle[n + 1]);
        const a = Math.floor(Math.random() * bottle.length);
        const len = topLen(bottle[a]);
        pourN(len)(bottle[a], bottle[n]);
      }
      else {
        break;
      }
    }
    setBottle(bottle)
    setDefaultBottle(bottle);

    setIsClear(false);
  }

  const resetBottle = () => {
    setBottle(defaultBottle);
  }

  const seed = defaultBottle.map(e => e.reduce((str, cur) => str + cur.toString(), "")).reduce((str, cur) => str + cur.toString(), "");

  return (
    <div className={styles.watersort} >
      <ul className={styles.container}>
        {
          bottle.map((b, i) => {
            return (
              <li className={styles.wrapper}>
                <ul
                  className={styles.bottle}
                  style={{
                    boxShadow: ((i) => { if (first === i) { return "0 0 3px 2px rgba(0, 0, 0, 0.2)" } else { return "0 0 3px 2px rgba(0, 0, 0, 0)" } })(i)
                  }}
                  onClick={() => bottleClick(i)}
                >
                  {
                    b.map((j, k) => {
                      return (
                        <li
                          className={styles.water}
                          style={{
                            color: fontColor[j],
                            backgroundColor: color[j],
                            width: "20px",
                            height: "20px",
                            borderRadius: (() => { if (k === 3) { return "0 0 10px 10px" } })()
                          }}
                        >
                          <div className={styles.water}>{
                            (() => { if (visiblity) { return j; } })()
                          }</div>
                        </li>
                      )
                    }

                    )
                  }
                </ul>
              </li>
            )
          })
        }
        <li className={styles.wrapper}>
          <ul
            className={styles.bottle}
            style={{
              border: "2px dashed #888",
            }}
            onClick={() => { setBottle(bottle.concat([[0, 0, 0, 0]])) }}
          >
            {
              [0, 1, 2, 3].map((i, j) => {
                return (
                  <li
                    className={styles.water}
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: (() => { if (j === 3) { return "0 0 10px 10px" } })()
                    }}
                  >
                    {(() => {
                      if (i == 0) {
                        return (
                          <p style={{
                            margin: 0,
                            position: "relative",
                            top: "-10px",
                            left: "10px",
                            fontSize: "15pt",
                            fontWeight: "bolder",
                            textShadow: "2px 0px 0px rgba(0, 0, 0, 1), -2px 0px 0px rgba(0, 0, 0, 1), 0px 2px 0px rgba(0, 0, 0, 1), 0px -2px 0px rgba(0, 0, 0, 1), 2px 2px 0px rgba(0, 0, 0, 1), -2px 2px 0px rgba(0, 0, 0, 1), 2px -2px 0px rgba(0, 0, 0, 1), -2px -2px 0px rgba(0, 0, 0, 1)",
                            color: "white",
                          }}>
                            +
                          </p>
                        );
                      }
                    })()}
                  </li>
                )
              })
            }
          </ul>
        </li>
      </ul>
      <div className="ui">
        <input type="range" min={2} max={20} step={1} value={num} className={styles.range} onChange={(e) => { setNum(Number(e.target.value)); init(Number(e.target.value), isHard) }} />
        <div className={styles.button}>
          <button type="button" onClick={() => { init(num, false) }} className={styles.button} style={{ backgroundColor: (() => { if (!isHard) { return "#e07798" } })() }} >かんたん</button>
          <button type="button" onClick={() => { init(num, true) }} className={styles.button} style={{ backgroundColor: (() => { if (isHard) { return "#e07798" } })() }}>むずかしい</button>
          <button type="button" onClick={() => resetBottle()} className={styles.button}>リセット</button>
        </div>
        <label htmlFor="switch" className={styles.toggle}>
          <input type="checkbox" id="switch" className={styles.toggle} defaultChecked={false} onChange={(e) => { if (e.target.checked) { setVisiblity(true) } else { setVisiblity(false) } }} />
          <p className={styles.toggle}>色覚補助</p>
          <div className={styles.toggle}>
            <div className={styles.slider}></div>
          </div>
        </label>
      </div>
    </div >
  );
}
