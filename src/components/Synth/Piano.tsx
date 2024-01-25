import React, { useEffect, useRef, useState } from "react";
import style from "./Synth.module.css"
import { PianoHandler } from "./SynthHandler";

/*
*/


const scaleArray = ["C", "C# Db", "D", "D# Eb", "E", "F", "F# Gb", "G", "G# Ab", "A", "A# Bb", "B", "C"]
const keyNumRightHandArray = ["KeyG", "KeyY", "KeyH", "KeyU", "KeyJ", "KeyK", "KeyO", "KeyL", "KeyP", "Semicolon", "BracketLeft", "Quote", "Backslash"];
const keyNumLeftHandArray = ["KeyQ", "KeyW", "KeyE", "KeyA", "KeyS", "KeyD", "KeyZ", "KeyX", "KeyC"];

export const KeyPiano = () => {
  const piano = new PianoHandler();

  const isKeyPressed = useRef([false, false, false, false, false, false, false, false, false, false, false, false]);
  const isAltPressed = useRef(false);
  const isCodePressed = useRef(false);
  const [scale, setScale] = useState(0);
  const scaleRef = useRef(scale);

  const pianoFireHandler = (e) => {
    // console.log("down", e.code);
    const r = keyNumRightHandArray.findIndex((element) => element === e.code);
    const l = keyNumLeftHandArray.findIndex((element) => element === e.code);

    if (r !== -1) {
      // 右手の処理
      if (isKeyPressed.current[r]) {
        return;
      }
      const freqBasis = 440 * Math.pow(2, (-9 + scaleRef.current) / 12)
      const freq = freqBasis * Math.pow(2, r / 12) * (isAltPressed.current ? 2 : 1);
      // console.log(freqVar.current, freq);
      isKeyPressed.current[r] = true;

      piano.play(r, freq);
    }
    else if (l !== -1) {
      // 左手の処理
      if (isCodePressed.current) {
        return;
      }
      let code = [0, 0, 0, 0];
      switch (l) {
        case 0: // I
          code = [0, 4, 7, null];
          break;
        case 1: // IV
          code = [0, 5, 9, null];
          break;
        case 2: // V7
          code = [-1, 2, 5, 7];
          break;
        case 3: // VIm
          code = [0, 4, 9, null];
          break;
        case 6: //IIIm
          code = [-1, 4, 7, 11];
          break;
      }
      const freqBasis = 440 * Math.pow(2, (-9 + scaleRef.current) / 12);
      const freqs = code.map(e => { return freqBasis * Math.pow(2, e / 12); });
      isCodePressed.current = true;

      piano.playCode(freqs);
    } else {
      // キーシフト
      if (e.code === "ShiftLeft") {
        isAltPressed.current = true;
      }
      return;
    }
  }
  const pianoStopHandler = (e) => {
    const r = keyNumRightHandArray.findIndex((element) => element === e.code);
    const l = keyNumLeftHandArray.findIndex((element) => element === e.code);

    if (r !== -1) {

      // console.log("up");
      isKeyPressed.current[r] = false;
      piano.stop(r)

    } else if (l !== -1) {

      isCodePressed.current = false;
      piano.stopCode();

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
        <li>QWEにI IV V7が入ってて、あとAとZにVImとIIImが入ってる。</li>
        <li>それだけ。</li>
      </ul>
      <p>スケール: {scaleArray[scale]}</p>
      <input type="range" defaultValue={0} min={0} max={12} step={1} onChange={(e) => { setScale(Number(e.target.value)); scaleRef.current = Number(e.target.value); }} />
      <p>音量</p>
      <input type="range" defaultValue={100} min={0} max={100} step={1} onChange={(e) => piano.setMasterGain(Number(e.target.value))} />

      <p>Attack</p>
      <input type="range" defaultValue={0.01} min={0} max={1} step={0.01} onChange={(e) => piano.setAttack(Number(e.target.value))} />
      <p>Decay</p>
      <input type="range" defaultValue={0} min={0} max={1} step={0.01} onChange={(e) => piano.setDecay(Number(e.target.value))} />
      <p>Sustain</p>
      <input type="range" defaultValue={1} min={0} max={1} step={0.01} onChange={(e) => piano.setSustain(Number(e.target.value))} />
      <p>Release</p>
      <input type="range" defaultValue={0.1} min={0} max={1} step={0.01} onChange={(e) => piano.setRelease(Number(e.target.value))} />

    </div >

  )
}