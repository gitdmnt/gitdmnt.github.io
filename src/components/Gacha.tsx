import React from "react";
import { useState } from "react";

interface prop {
  WordList: string;
}

const Gacha: React.FC = () => {
  const wordList = "aaa, a b".split(",");
  const max = wordList.length;
  const [result, setResult] = useState("");
  const roll = () => {
    const number = Math.floor(Math.random() * max);
    setResult(wordList[number]);

  };
  return (
    <div className="gacha">
      <ul className="result">
        <li>{result}</li>
      </ul>
      <button className="button" onClick={() => console.log("a")}>引く</button>
    </div >
  );
}

export default Gacha;