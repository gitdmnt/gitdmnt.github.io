import React, { useState } from "react";
import styles from "./WaterSort.module.css";

export const WaterSort = () => {
  const [bottle, setBottle] = useState([
    [1, 1, 1, 1],
    [2, 2, 2, 2],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [num, setNum] = useState(10);

  const color = [
    "#00000000",
    "#ffe600", "#0db8d9", "#a2ca0e", "#c84283", "#2660ac",
    "#ea5419", "#008442", "#f08a37", "#f8b800", "#de6c31",
    "#00a0e8", "#153692", "#ea6088", "#aecfed", "#efcf2e",
    "#34b496", "#3A3839", "#c4ca00", "#e40067", "#69c4d0",
  ];

  const [first, setFirst] = useState(-1);

  const bottleClick = (i) => {
    if (first === -1) {
      setFirst(i)
    } else if (first === i) {
      setFirst(-1)
    }
    else {
      pour(first, i)
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
      let result_host = bottle[i].concat();
      let result_client = bottle[j].concat();
      let count = 0;
      let point_host = first_element_index_start
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
    }

    // 1本目を適当に
    setFirst(-1);
  }

  const init = (n) => {
    const bottle = [];
    for (let i = 0; i < n; i++) {
      bottle.push([i + 1, i + 1, i + 1, i + 1]);
    }

    for (let i = 0; i < 100; i++) {
      const a = Math.floor(Math.random() * n);
      const b = Math.floor(Math.random() * n);
      const range = Math.floor(Math.random() * 4);
      for (let j = 0; j < range; j++) {
        let memo = bottle[a][j];
        bottle[a][j] = bottle[b][j];
        bottle[b][j] = memo;
      }
    }

    bottle.push([0, 0, 0, 0]);
    bottle.push([0, 0, 0, 0]);
    setBottle(bottle)
  }

  return (
    <div className={styles.watersort}>
      <ul className={styles.container}>
        {
          bottle.map((b, i) => {
            const shadow = ((i) => { if (first === i) { return "0 0 3px 2px rgba(0, 0, 0, 0.2)" } else { return "0 0 3px 2px rgba(0, 0, 0, 0)" } })(i)
            return (
              <li className={styles.wrapper}>
                <ul className={styles.bottle} style={{ boxShadow: shadow }} onClick={() => bottleClick(i)}>
                  {
                    b.map((j, k) => {
                      if (k !== 3) {
                        return (
                          <li className={styles.water} style={{ backgroundColor: color[j], width: "20px", height: "20px" }}></li>
                        )
                      } else {
                        return (<li className={styles.water} style={{ backgroundColor: color[j], width: "20px", height: "20px", borderRadius: "0 0 10px 10px" }}></li>)

                      }
                    }

                    )
                  }
                </ul>
              </li>
            )
          })
        }
      </ul>
      <div className="ui">
        <input type="range" min={2} max={20} step={1} className={styles.range} onChange={(e) => setNum(Number(e.target.value))} />
        <button type="button" onClick={() => init(num)} className={styles.button}>生成</button>
      </div>
    </div>
  );
}