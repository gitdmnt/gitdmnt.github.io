import React from "react";
import { useState } from "react";

type prop = {
  gachaItemLists: string[][];
}
const div: React.CSSProperties = {

}
const ul = {
  listStyle: "none",
  height: "4rem",
  marginBlock: "2rem",
  marginInline: "1rem",
  padding: "0",
};
const li = {
  margin: "0",
  padding: "0",
};
const button = {
  display: "block",
  margin: "auto",
  color: "#fff",
  backgroundColor: "#1d1d1d",
  border: "none",
  paddingBlock: "1rem",
  paddingInline: "2.5rem",
};

const Gacha: React.FC<prop> = ({ gachaItemLists }) => {
  const [result, setResult] = useState(["勢いよく", "このガチャを引くべき", "今", "ここ", "キミは", "世界の"]);
  const roll = () => {
    const result = [];
    gachaItemLists.forEach(e => {
      const number = Math.floor(Math.random() * e.length);
      result.push(e[number]);
    })
    setResult(result);

  };
  const sentence = result[4] + result[5] + "ため、" + result[2] + result[3] + "で、" + result[0] + result[1] + "だろう。";
  return (
    <div style={div}>
      <ul style={ul}>
        <li style={li}>{sentence}</li>
      </ul>
      <button style={button} onClick={() => roll()}>引く</button>
    </div >
  );
}

export default Gacha;