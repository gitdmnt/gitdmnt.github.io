<script>
  import { Canvas, Layer } from "svelte-canvas";

  const col = 3;
  //  const grids = [...Array(col)].map();
</script>

<main>
  <div class="canvas">
    <Canvas>
      <Layer />
    </Canvas>
  </div>
  <p>
    canvasを使って何かゲームを作りたい。
    https://developer.mozilla.org/ja/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_getting_started
    https://svelte.dev/repl/434e0b14546747688401e8808c060a23?version=3.47.0
    https://dnass.github.io/svelte-canvas/examples/resize Local
    Storageを使ってデータを保存しておくことも学ぶ。
    3マッチパズルを作ることにした。
  </p>
</main>

<style>
  .canvas {
    margin: auto;
    height: 320px;
    width: 240px;
  }
</style>
