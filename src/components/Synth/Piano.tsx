import React, { useEffect, useRef, useState } from "react";
import style from "./Synth.module.css"
import { PianoHandler } from "./SynthHandler";

/*
音量調整
キーバインドを下側に(自然だし、拡張可能性が高い)
左手に押すだけでコードが鳴るやつ
SynthHandlerのクラスを作り、そこでチャンネルを管理する
*/


const scaleArray = ["C", "C# Db", "D", "D# Eb", "E", "F", "F# Gb", "G", "G# Ab", "A", "A# Bb", "B", "C"]
const keyNumRightHandArray = ["KeyG", "KeyY", "KeyH", "KeyU", "KeyJ", "KeyK", "KeyO", "KeyL", "KeyP", "Semicolon", "BracketLeft", "Quote", "Backslash"];


export const KeyPiano = () => {
  const piano = new PianoHandler();

  const isKeyPressed = useRef([false, false, false, false, false, false, false, false, false, false, false, false]);
  const isAltPressed = useRef(false);
  const [scale, setScale] = useState(0);
  const scaleRef = useRef(scale);
  const velocity = useRef(100);


  const pianoFireHandler = (e) => {
    const i = keyNumRightHandArray.findIndex((element) => element === e.code);
    if (i !== -1) {
      // 右手の処理
      if (isKeyPressed.current[i]) {
        return;
      }

      console.log("down", e.code);
      const freqBasis = 440 * Math.pow(2, (-9 + scaleRef.current) / 12)
      const freq = freqBasis * Math.pow(2, i / 12) * (isAltPressed.current ? 2 : 1);
      // console.log(freqVar.current, freq);
      isKeyPressed.current[i] = true;

      piano.play(i, freq, velocity.current);
    }
    else {
      // 左手の処理

      // キーシフト
      if (e.code === "ShiftLeft") {
        isAltPressed.current = true;
      }
      return;
    }
  }
  const pianoStopHandler = (e) => {
    const i = keyNumRightHandArray.findIndex((element) => element === e.code);
    if (i !== -1) {

      // console.log("up");
      isKeyPressed.current[i] = false;
      piano.stop(i)

    } else {
      if (e.code === "ShiftLeft") {
        isAltPressed.current = false;
      }
      return;
    }


  }

  useEffect(() => {
    window.addEventListener("keydown", () => pianoFireHandler(event));
    window.addEventListener("keyup", () => pianoStopHandler(event));

    window.removeEventListener("keydown", () => pianoFireHandler(event))
    window.removeEventListener("keyup", () => pianoStopHandler(event));

  }, [])

  return (
    <div className={style.piano} >
      <h1>ピアノ工事中</h1>
      <ul>
        <li>Gキーから右の8鍵と上の5鍵で音が鳴る。</li>
        <li>左Shiftを押してる間はオクターブ上がる。</li>
        <li>バーをいじるとドが移動する。</li>
        <li>それだけ。</li>
      </ul>
      <p>スケール: {scaleArray[scale]}</p>
      <input type="range" defaultValue={0} min={0} max={12} step={1} onChange={(e) => { setScale(Number(e.target.value)); scaleRef.current = Number(e.target.value); }} />
      <p>音量</p>
      <input type="range" defaultValue={100} min={0} max={100} step={1} onChange={(e) => velocity.current = Number(e.target.value)} />
    </div >

  )
}