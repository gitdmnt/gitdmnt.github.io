<script lang="ts">
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;
  let width = 800;
  let height = 800;
  let game;

  onMount(async () => {});
</script>

<main>
  <select bind:value={game}>
    <option value="Sudoku">数独</option>
  </select>
  <canvas bind:this={canvas} {width} {height} />
</main>
