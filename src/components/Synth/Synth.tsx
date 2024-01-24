import React, { useEffect, useState } from "react";
import style from "./Synth.module.css"
import { play, stop } from "./SynthHandler";

export const NodeSynth = () => {

  useEffect(() => initCanvas())
  return (
    <div className={style.synth}>
      <button
        className={style.node}
        onMouseDown={() => play(440)}
        onMouseUp={() => stop()}
      >
        ラ
      </button>
      <button
        className={style.node}
        onMouseDown={() => play(880)}
        onMouseUp={() => stop()}
      >
        ラ 2
      </button>
      <canvas id="canvas" className={style.canvas}></canvas>
    </div>
  );
}

const initCanvas = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl");
  if (gl == null) {
    alert(
      "WebGL を初期化できません。ブラウザーまたはマシンが対応していない可能性があります。",
    );
    return;
  }
  gl.clearColor(0.9, 0.9, 0.9, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}