<script lang="ts">
  import { onMount } from "svelte";
  import { Board } from "./board.ts";

  let canvas_base: HTMLCanvasElement;
  let canvas_animation: HTMLCanvasElement;
  const width = 400;
  const height = 400;
  let board;

  let startX: number | null = null;
  let startY: number | null = null;
  let isDragging = false;

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
    board = new Board(width, height, 20, 3, canvas_base, canvas_animation);
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
  <button on:click={() => board.checkMatch()}>check match</button>
  <button on:click={() => board.update()}>update</button>
  <button on:click={() => board.getBoard()}>get</button>
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
