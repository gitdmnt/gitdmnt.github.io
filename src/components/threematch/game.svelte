<script lang="ts">
  import { onMount } from "svelte";
  import { Board } from "./board.ts";

  let canvas_base: HTMLCanvasElement;
  let canvas_animation: HTMLCanvasElement;
  let xNum = 10;
  let yNum = 10;
  let blockSize = 20;
  let board;
  let width = xNum * 20;
  let height = yNum * 20;
  let dropColorCount = 4;
  let isLocking = false;

  let startX: number | null = null;
  let startY: number | null = null;
  let isDragging = false;

  const handleValueChange = async () => {
    console.log("Value changed to ", xNum, yNum);

    width = xNum * 20;
    height = yNum * 20;

    board = new Board(
      dropColorCount,
      width,
      height,
      blockSize,
      3,
      canvas_base,
      canvas_animation
    );
  };

  function handleMouseDown(event: MouseEvent) {
    const rect = canvas_base.getBoundingClientRect();
    startX = event.clientX - rect.left;
    startY = event.clientY - rect.top;
    isDragging = true;
  }

  function handleMouseUp(event: MouseEvent) {
    if (!isDragging || startX === null || startY === null) return;

    const rect = canvas_base.getBoundingClientRect();
    const endX = event.clientX - rect.left;
    const endY = event.clientY - rect.top;

    board.oneStep(startX, startY, endX, endY);

    // 初期化
    startX = null;
    startY = null;
    isDragging = false;
  }

  onMount(async () => {
    isLocking = true;
    new Promise(() => {
      board = new Board(
        dropColorCount,
        width,
        height,
        blockSize,
        3,
        canvas_base,
        canvas_animation
      );
    }).then(() => {
      isLocking = false;
    });
  });
</script>

<main>
  <div class="container">
    <canvas bind:this={canvas_base} {width} {height} class="canvas"></canvas>
    <canvas
      bind:this={canvas_animation}
      {width}
      {height}
      class="canvas"
      on:mousedown={handleMouseDown}
      on:mouseup={handleMouseUp}
    ></canvas>
  </div>
  <button on:click={() => board.draw()}>draw</button>
  <button on:click={() => board.update()}>update</button>
  <button on:click={() => board.getBoard()}>get</button>
  <input
    type="range"
    id="width"
    min="1"
    max="40"
    step="1"
    bind:value={xNum}
    on:change={handleValueChange}
  />
  <input
    type="range"
    id="height"
    min="1"
    max="40"
    step="1"
    bind:value={yNum}
    on:change={handleValueChange}
  />
  <input
    type="range"
    id="height"
    min="1"
    max="4"
    step="1"
    bind:value={dropColorCount}
    on:change={handleValueChange}
  />
</main>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    & .canvas {
      grid-row: 1/1;
      grid-column: 1/1;
    }
  }
</style>
