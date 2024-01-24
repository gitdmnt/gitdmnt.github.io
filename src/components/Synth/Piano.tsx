import React, { useEffect, useRef, useState } from "react";
import style from "./Synth.module.css"
import { play, stop } from "./SynthHandler";

/*
左手に押すだけでコードが鳴るやつ
SynthHandlerのクラスを作り、そこでチャンネルを管理する
*/


const scaleArray = ["C", "C# Db", "D", "D# Eb", "E", "F", "F# Gb", "G", "G# Ab", "A", "A# Bb", "B", "C"]
const keyNumRightHandArray = ["KeyG", "KeyY", "KeyH", "KeyU", "KeyJ", "KeyK", "KeyO", "KeyL", "KeyP", "Semicolon", "BracketLeft", "Quote", "Backslash"];


export const KeyPiano = () => {
  const scaleVar = useRef(0);
  const isKeyPressed = useRef([false, false, false, false, false, false, false, false, false, false, false, false]);
  const isAltPressed = useRef(false);

  const pianoFireHandler = (e) => {
    const i = keyNumRightHandArray.findIndex((element) => element === e.code);
    if (i !== -1) {
      // 右手の処理
      if (isKeyPressed.current[i]) {
        return;
      }

      // console.log("down", e.code);
      const freqBasis = 440 * Math.pow(2, (-9 + scaleVar.current) / 12)
      const freq = freqBasis * Math.pow(2, i / 12) * (isAltPressed.current ? 2 : 1);
      // console.log(freqVar.current, freq);
      isKeyPressed.current[i] = true;

      play(i, freq);
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
      stop(i)
    }
    else {
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
      ぴあの
      <input type="range" min={0} max={12} step={1} onChange={(e) => scaleVar.current = Number(e.target.value)}></input>
    </div >
  )
}