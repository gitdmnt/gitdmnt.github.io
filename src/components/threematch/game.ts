type Cell = Color | Bomb | null;
type Color = "red" | "green" | "blue" | "yellow" | "purple";
type Bomb = "row" | "column" | "propeller" | "tnt" | "light";
type Position = [number, number];
type Match = Position[];

class Board {
  cells: Cell[][];
  activateBombQueue: Position[] = [];
  constructor(public cols: number, public rows: number) {
    this.cells = Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => null)
    );
  }

  // プリミティブな操作

  getCell([col, row]: Position): Cell {
    return this.cells[col][row];
  }
  setCell([col, row]: Position, cell: Cell) {
    this.cells[col][row] = cell;
  }
  removeCell([col, row]: Position) {
    this.cells[col][row] = null;
  }

  // チェック

  isValidCell([col, row]: Position) {
    return (
      0 <= col &&
      col < this.cols &&
      0 <= row &&
      row < this.rows &&
      this.getCell([col, row]) !== null
    );
  }

  isBomb([col, row]: Position) {
    return (
      this.getCell([col, row]) === "row" ||
      this.getCell([col, row]) === "column" ||
      this.getCell([col, row]) === "propeller" ||
      this.getCell([col, row]) === "tnt" ||
      this.getCell([col, row]) === "light"
    );
  }

  // 条件付きgetter

  getMostValuableCell(): Position {
    const randCol = Math.floor(Math.random() * this.cols);
    const randRow = Math.floor(Math.random() * this.rows);
    return [randCol, randRow];
  }

  getMostValuableColor(): Color {
    const colorCount = {
      red: 0,
      green: 0,
      blue: 0,
      yellow: 0,
      purple: 0,
    };
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        const cell = this.getCell([col, row]);
        if (cell !== null) {
          colorCount[cell]++;
        }
      }
    }

    const maxKey = Object.keys(colorCount).reduce((a, b) =>
      colorCount[a] > colorCount[b] ? a : b
    );
    return maxKey as Color;
  }

  // ボム操作

  addBombQueueOrRemove(pos: Position) {
    if (this.isValidCell(pos)) {
      if (this.isBomb(pos)) {
        this.activateBombQueue.push(pos);
      } else {
        this.removeCell(pos);
      }
    }
  }

  activateBomb([col, row]: Position) {
    const bomb = this.getCell([col, row]);
    this.removeCell([col, row]);

    if (bomb === "row") {
      for (let c = 0; c < this.cols; c++) {
        this.addBombQueueOrRemove([c, row]);
      }
    } else if (bomb === "column") {
      for (let r = 0; r < this.rows; r++) {
        this.addBombQueueOrRemove([col, r]);
      }
    } else if (bomb === "propeller") {
      for (let c = col - 1; c <= col + 1; c++) {
        this.addBombQueueOrRemove([c, row]);
      }
      for (let r = row - 1; r <= row + 1; r++) {
        this.addBombQueueOrRemove([col, r]);
      }
      this.activateBomb(this.getMostValuableCell());
    } else if (bomb === "tnt") {
      for (let c = col - 2; c <= col + 2; c++) {
        for (let r = row - 2; r <= row + 2; r++) {
          this.addBombQueueOrRemove([c, r]);
        }
      }
    } else if (bomb === "light") {
      const targetColor = this.getMostValuableColor();
      for (let c = 0; c < this.cols; c++) {
        for (let r = 0; r < this.rows; r++) {
          if (this.getCell([c, r]) === targetColor) {
            this.removeCell([c, r]);
          }
        }
      }
    }
  }

  // マッチ処理

  checkMatch(): boolean {
    // TODO
    return false;
  }

  removeOneMatch(): boolean {
    // TODO
    return false;
  }

  // セル操作

  tapCell([col, row]: Position) {
    if (this.isBomb([col, row])) {
      this.activateBomb([col, row]);
    }
  }

  swapCells(a: Position, b: Position) {
    const temp = this.getCell(a);
    this.setCell(a, this.getCell(b));
    this.setCell(b, temp);

    const isSwappable = (() => {
      return this.checkMatch() || this.isBomb(a) || this.isBomb(b);
    })();

    if (isSwappable) {
      return true;
    } else {
      const temp = this.getCell(a);
      this.setCell(a, this.getCell(b));
      this.setCell(b, temp);
      return false;
    }
  }

  fallDown(): boolean {
    //TODO
    return false;
  }

  // ステップ処理

  // 内部的な1ステップ
  update(): boolean {
    // 次の処理のうち1つだけを行う。
    // 1. 爆弾を1つ起動する。
    // 2. マッチを1つ検出して消す。
    // 処理が行われた場合はtrueを返す。
    let isProcessed = false;

    if (this.activateBombQueue.length > 0) {
      const pos = this.activateBombQueue.shift()!;
      this.activateBomb(pos);
      isProcessed = true;
    } else if (this.removeOneMatch()) {
      isProcessed = true;
    }
    return isProcessed;
  }

  // 連鎖を行う。
  combo() {
    // 1. 現在の盤面で可能な限りセルを消す。
    // 2. 落下を行う。
    // 3. 1に戻る。
    while (this.update()) {}
    while (this.fallDown()) {
      while (this.update()) {}
    }
  }

  // 操作可能な1ステップ
  step(a: Position, b: Position) {
    // TODO: swapCells または tapCell を受け付ける。
    this.combo();
  }
}

