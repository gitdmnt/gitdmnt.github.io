import React from "react";
import { useState } from "react";

type prop = {
  gachaItemLists: string[][];
}

const Gacha: React.FC<prop> = ({ gachaItemLists }) => {
  const [result, setResult] = useState(["勢いよく", "このガチャを引くべきだ", "今", "ここ", "キミは", "世界の"]);
  const roll = () => {
    const result = [];
    gachaItemLists.forEach(e => {
      const number = Math.floor(Math.random() * e.length);
      result.push(e[number]);
    })
    setResult(result);

  };
  const sentence = result[4] + result[5] + "ため、" + result[2] + result[3] + "で、" + result[0] + result[1] + "。";
  return (
    <div className="gacha">
      <ul className="result">
        <li>{sentence}</li>
      </ul>
      <button className="button" onClick={() => roll()}>引く</button>
    </div >
  );
}

export default Gacha;