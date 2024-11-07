import { get } from "svelte/store";
import { x } from "../../../dist/_astro/index.DKfXzplx";

const color = {
  blue: "#90ccf7",
  green: "#2b867e",
  yellow: "#eeae4c",
  red: "#d56a8a",
};

export class Board {
  // Logic members
  private _board: number[][];
  private _width: number;
  private _height: number;

  // Graphics members
  private _colors: string[];
  private _cellSize: number;
  private _cellPadding: number;
  private _fps: number;
  private _boardCanvas: HTMLCanvasElement;
  private _boardCtx: CanvasRenderingContext2D;
  private _animationCanvas: HTMLCanvasElement;
  private _animationCtx: CanvasRenderingContext2D;

  constructor(
    width: number,
    height: number,
    cellSize: number,
    cellPadding: number,
    boardCanvas: HTMLCanvasElement,
    animationCanvas: HTMLCanvasElement
  ) {
    this._width = Math.floor(width / (cellSize + 2 * cellPadding));
    this._height = Math.floor(height / (cellSize + 2 * cellPadding));

    this._colors = [color.blue, color.green, color.yellow, color.red];
    this._cellSize = cellSize;
    this._cellPadding = cellPadding;
    this._fps = 60;
    this._boardCanvas = boardCanvas;
    this._boardCtx = boardCanvas.getContext("2d");
    this._animationCanvas = animationCanvas;
    this._animationCtx = animationCanvas.getContext("2d");

    this.initBoard();
  }

  newCell() {
    return Math.floor(Math.random() * this._colors.length);
  }

  async initBoard() {
    console.log("initalize board");

    this._board = Array.from({ length: this._width }, () =>
      Array(this._height).fill(0)
    ).map((row) => row.map(() => this.newCell()));

    console.log("board initialized");
    this.getBoard();

    // マッチしなくなるまでコンボを続ける

    console.log("starting initial update");

    let b = await this.update();
    this.getBoard();
    while (b) {
      b = await this.update();
    }

    console.log("initial update finished");

    console.log("starting initial draw");

    // 描画
    await this.draw();
    console.log("initial draw finished");
  }

  // 全てを消して描画する
  async draw() {
    this._boardCtx.clearRect(
      0,
      0,
      this._boardCanvas.width,
      this._boardCanvas.height
    );

    console.log("starting drawing board");

    this._board.forEach((col, x) => {
      col.forEach((_, y) => {
        this.drawCell(this._boardCtx, x, y);
      });
    });

    console.log("finished drawing board");
  }

  // 1つのセルを描画する
  async drawCell(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = this._colors[this._board[x][y]];
    ctx.fillRect(
      x * (this._cellSize + 2 * this._cellPadding) + this._cellPadding,
      y * (this._cellSize + 2 * this._cellPadding) + this._cellPadding,
      this._cellSize,
      this._cellSize
    );
  }

  // 1つのセルを消す
  async clearCell(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.clearRect(
      x * (this._cellSize + 2 * this._cellPadding) + this._cellPadding,
      y * (this._cellSize + 2 * this._cellPadding) + this._cellPadding,
      this._cellSize + 2 * this._cellPadding,
      this._cellSize + 2 * this._cellPadding
    );
  }

  //1操作ごとに呼び出す
  async oneStep(x1: number, y1: number, x2: number, y2: number) {
    // 入力されたキャンバス内の座標をセルの座標に変換
    x1 = Math.floor(
      (x1 - this._cellPadding) / (this._cellSize + 2 * this._cellPadding)
    );
    y1 = Math.floor(
      (y1 - this._cellPadding) / (this._cellSize + 2 * this._cellPadding)
    );
    x2 = Math.floor(
      (x2 - this._cellPadding) / (this._cellSize + 2 * this._cellPadding)
    );
    y2 = Math.floor(
      (y2 - this._cellPadding) / (this._cellSize + 2 * this._cellPadding)
    );

    // プレイヤーの操作を解決
    await this.swap(x1, y1, x2, y2);

    // マッチしなくなるまでコンボを続ける
    await (async () => {
      let b = await this.update();
      while (b) {
        b = await this.update();
      }
    })();

    // 描画
    await this.draw();
  }

  // 2つのセルを入れ替える
  async swap(x1: number, y1: number, x2: number, y2: number) {
    // 隣接していない場合は入れ替えない
    if (Math.abs(x1 - x2) + Math.abs(y1 - y2) !== 1) {
      return;
    }

    let tmp = this._board[x1][y1];
    this._board[x1][y1] = this._board[x2][y2];
    this._board[x2][y2] = tmp;

    // アニメーション
    const duration = 30;
    await this.swapAnimation(x1, y1, x2, y2, duration);

    // いれかえてもマッチしない場合は元に戻す
    if (!this.checkMatch()) {
      await this.swap(x1, y1, x2, y2);
    }

    console.log("swapped");
  }

  // 入れ替えアニメーション
  async swapAnimation(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    duration: number
  ) {
    // アニメーションセル上でアニメーションを行う
    this.clearCell(this._boardCtx, x1, y1);
    this.clearCell(this._boardCtx, x2, y2);

    const durPerFrame = duration / this._fps;
    const frameCount = Math.floor((duration * this._fps) / 1000);
    let x1_i = x1;
    let y1_i = y1;
    let x2_i = x2;
    let y2_i = y2;
    for (let i = 0; i < frameCount; i++) {
      this.clearCell(this._animationCtx, x1_i, y1_i);
      this.clearCell(this._animationCtx, x2_i, y2_i);

      x1_i += (x2 - x1) * (1 / frameCount);
      y1_i += (y2 - y1) * (1 / frameCount);
      x2_i += (x1 - x2) * (1 / frameCount);
      y2_i += (y1 - y2) * (1 / frameCount);

      this._animationCtx.fillStyle = this._colors[this._board[x1][y1]];
      this._animationCtx.fillRect(
        x1_i * (this._cellSize + 2 * this._cellPadding) + this._cellPadding,
        y1_i * (this._cellSize + 2 * this._cellPadding) + this._cellPadding,
        this._cellSize,
        this._cellSize
      );
      this._animationCtx.fillStyle = this._colors[this._board[x2][y2]];
      this._animationCtx.fillRect(
        x2_i * (this._cellSize + 2 * this._cellPadding) + this._cellPadding,
        y2_i * (this._cellSize + 2 * this._cellPadding) + this._cellPadding,
        this._cellSize,
        this._cellSize
      );
      await new Promise((resolve) => setTimeout(resolve, durPerFrame));
    }
  }

  async update(): Promise<boolean> {
    // 変更があったらtrueを返す

    console.log("start updating board");

    let b = false;

    console.log("update: checking match");

    let match = this.checkMatch();
    while (match) {
      console.log(`update: match found at ${match}`);
      b = true;
      this.removeMatch(match);
      console.log("update: removed match");
      match = this.checkMatch();
    }

    if (b) {
      console.log("update: finish removing");
      const isDropped = await this.dropElement();
      console.log("updated");
      this.getBoard();
      return true;
    }
    console.log("nothing updated");
    this.getBoard();
    return false;
  }

  checkMatch(): [number, number][] | null {
    console.log("checking match");
    let match = this.checkLineMatch();
    if (match) {
      console.log(`match found at ${match}`);
      return match;
    } else null;
  }

  checkLineMatch(): [number, number][] | null {
    // 横方向のマッチをチェック
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width - 2; x++) {
        if (this._board[x][y] === null) {
          continue;
        }
        if (
          this._board[x][y] === this._board[x + 1][y] &&
          this._board[x][y] === this._board[x + 2][y]
        ) {
          return [
            [x, y],
            [x + 1, y],
            [x + 2, y],
          ];
        }
      }
    }

    // 縦方向のマッチをチェック
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height - 2; y++) {
        if (this._board[x][y] === null) {
          continue;
        }
        if (
          this._board[x][y] === this._board[x][y + 1] &&
          this._board[x][y] === this._board[x][y + 2]
        ) {
          return [
            [x, y],
            [x, y + 1],
            [x, y + 2],
          ];
        }
      }
    }
    return null;
  }

  removeMatch(match: [number, number][]) {
    console.log("removing match");

    match.forEach(([x, y]) => {
      this._board[x][y] = null;
    });
  }
  async dropElement(): Promise<boolean> {
    /*
    方針
    1. 動く予定のあるセルを別の配列に詰める。元の配列にはnullを入れておく。
    2. 各セルが次に入る位置を計算する。
    3. 足りない分は新たに生成して詰める。
    4. 落下アニメーションを行う。
    5. 落下後の盤面を反映する。
    */

    // あるx座標について、[null, a, b, c, null, d] という行があるとする。
    // これは落下によって [f, e, a, b, c, d] に変わる。
    // ここでe, fは新たに生成されるセルである。
    // それぞれのセルは、アニメーションのために、次のようにそのセルがどのセルから落ちてきたのかを記録する。
    // [[f, -2], [e, -1], [a, 1], [b, 2], [c, 3], [d, 5]]
    // このような行列を生成する。

    let fallBoard: [number, number][][] = [];
    for (let x = 0; x < this._width; x++) {
      let result = [];
      let emptyCount = 0; // 空のセルのカウント

      // 元のセルを下から詰めていく
      for (let y = this._height - 1; y >= 0; y--) {
        if (this._board[x][y] !== null) {
          result.unshift([this._board[x][y], y]);
        } else {
          emptyCount++;
        }
      }

      // 新しいセルを追加（空の数だけ）
      for (let i = 1; i <= emptyCount; i++) {
        const newCell = this.newCell();
        result.unshift([newCell, -i]); // 新しいセルを上に追加し、インデックスは -i とする
      }
      fallBoard.push(result);
    }

    // アニメーション
    await Promise.all(
      Array.from({ length: this._width }, (_, x) =>
        this.fallAnimation(x, fallBoard[x])
      )
    );
    return true;
  }

  async fallAnimation(x: number, fallBoard: [number, number][]) {
    const fps = this._fps;
    const msecPerFrame = 1000 / fps;

    for (let y = 0; y < this._height; y++) {
      this.clearCell(this._boardCtx, x, y);
    }

    let velocity = 0;
    let acceleration = 0.01;

    let fallBoard2 = fallBoard.map(([cell, y], i) => [cell, y, i]);

    // いま、fallBoard2の各要素は、[セルの値, そのセルがどの位置にいるか, そのセルの目標地点]である。
    // 各セルについて、そのセルがどの位置にいるかを更新しながら、フレームごとにそれを描画する。
    // すべてのセルが目的の位置に到達するまで続ける。
    while (fallBoard2.some(([_, currY, targetY]) => currY < targetY)) {
      fallBoard2.forEach(([cell, currY, targetY], i) => {
        if (currY < targetY) {
          currY += velocity;
          if (currY >= targetY) {
            currY = targetY;
          }
        }
        fallBoard2[i][1] = currY;
      });
      velocity += acceleration;

      // 描画
      this._animationCtx.clearRect(
        x * (this._cellSize + 2 * this._cellPadding) + this._cellPadding,
        0,
        this._cellSize,
        this._height * (this._cellSize + 2 * this._cellPadding)
      );
      fallBoard2.forEach(([cell, currY, targetY], i) => {
        this._animationCtx.fillStyle = this._colors[cell];
        this._animationCtx.fillRect(
          x * (this._cellSize + 2 * this._cellPadding) + this._cellPadding,
          currY * (this._cellSize + 2 * this._cellPadding) + this._cellPadding,
          this._cellSize,
          this._cellSize
        );
      });

      await new Promise((resolve) => setTimeout(resolve, msecPerFrame));
    }

    for (let y = 0; y < this._height; y++) {
      this.clearCell(this._animationCtx, x, y);
      this._board[x][y] = fallBoard2[y][0];
      this.drawCell(this._boardCtx, x, y);
    }
  }

  getBoard() {
    // 転置する
    let str = "";
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        str += (this._board[x][y] ?? "n") + " ";
      }
      str += "\n";
    }
    console.log(str);
  }
}

