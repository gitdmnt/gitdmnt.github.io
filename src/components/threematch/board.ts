

// 0-3 が色、10-14がそれぞれrow, coliumn, propeller, tnt, light
type Cell = number | null;

type CellCoordinate = [number, number];
type Match = {
  movedCell: CellCoordinate;
  matchedCells: CellCoordinate[];
  bombType: Bomb | null;
};
type Bomb = "row" | "column" | "propeller" | "tnt" | "light";

const color = {
  blue: "#90ccf7",
  green: "#2b867e",
  yellow: "#eeae4c",
  pink: "#d56a8a",
  red: "#751919",
};

class CellElement {}

export class Board {
  // Logic members
  private _board: Cell[][];
  private _width: number;
  private _height: number;
  private _dropColorCount: number;
  private _isLocking: boolean;

  // Graphics members
  private _colors: string[];
  private _cellInnerSize: number;
  private _cellPadding: number;
  private _cellOuterSize: number;
  private _fps: number;
  private _boardCanvas: HTMLCanvasElement;
  private _boardCtx: CanvasRenderingContext2D;
  private _animationCanvas: HTMLCanvasElement;
  private _animationCtx: CanvasRenderingContext2D;

  constructor(
    dropColorCount: number,
    width: number,
    height: number,
    cellSize: number,
    cellPadding: number,
    boardCanvas: HTMLCanvasElement,
    animationCanvas: HTMLCanvasElement
  ) {
    this._isLocking = false;

    this._cellInnerSize = cellSize;
    this._cellPadding = cellPadding;
    this._cellOuterSize = cellSize + 2 * cellPadding;
    this._width = Math.floor(width / this._cellOuterSize);
    this._height = Math.floor(height / this._cellOuterSize);
    this._dropColorCount = dropColorCount;

    this._colors = [
      // color block
      color.blue,
      color.green,
      color.yellow,
      color.pink,
      "black",
      "black",
      "black",
      "black",
      "black",
      "black",
      // bomb
      "row",
      "column",
      "propeller",
      "tnt",
      "light",
    ];
    this._fps = 60;
    this._boardCanvas = boardCanvas;
    this._boardCtx = boardCanvas.getContext("2d");
    this._animationCanvas = animationCanvas;
    this._animationCtx = animationCanvas.getContext("2d");

    this.initBoard();
  }

  newCell() {
    return Math.floor(Math.random() * this._dropColorCount);
  }

  async initBoard() {
    console.log("threematch: initalize board");
    this._isLocking = true;
    this._boardCtx.clearRect(
      0,
      0,
      this._boardCanvas.width,
      this._boardCanvas.height
    );
    this._animationCtx.clearRect(
      0,
      0,
      this._animationCanvas.width,
      this._animationCanvas.height
    );

    this._board = Array.from({ length: this._width }, () =>
      Array(this._height).fill(0)
    ).map((row) => row.map(() => this.newCell()));

    await this.draw();

    console.log("threematch: board initialized");
    this.getBoard();

    // マッチしなくなるまでコンボを続ける

    console.log("threematch: starting initial update");

    let b = await this.update(null);
    while (b) {
      b = await this.update(null);
    }

    console.log("threematch: initial update finished");
    // 描画
    await this.draw();
    this._isLocking = false;
  }

  //
  //
  // 描画関連
  //
  //

  // 全てを消して描画する
  async draw() {
    this._boardCtx.clearRect(
      0,
      0,
      this._boardCanvas.width,
      this._boardCanvas.height
    );

    console.log("threematch: starting drawing board");

    this._board.forEach((col, x) => {
      col.forEach((_, y) => {
        this.drawCell(this._boardCtx, [x, y]);
      });
    });

    console.log("threematch: finished drawing board");
  }

  // 1つのセルを描画する
  async drawCell(
    ctx: CanvasRenderingContext2D,
    [x, y]: CellCoordinate,
    cellColor?: string
  ) {
    let cellStyle;
    if (cellColor) {
      cellStyle = cellColor;
    } else {
      cellStyle = this._colors[this._board[x][y]];
    }

    switch (cellStyle) {
      case null:
        ctx.clearRect(
          x * this._cellOuterSize,
          y * this._cellOuterSize,
          this._cellOuterSize,
          this._cellOuterSize
        );
        break;
      case "row":
        ctx.fillStyle = color.red;
        ctx.fillRect(
          x * this._cellOuterSize + this._cellPadding,
          y * this._cellOuterSize + 2 * this._cellPadding,
          this._cellInnerSize,
          this._cellInnerSize - 2 * this._cellPadding
        );
        break;
      case "column":
        ctx.fillStyle = color.red;
        ctx.fillRect(
          x * this._cellOuterSize + 2 * this._cellPadding,
          y * this._cellOuterSize + this._cellPadding,
          this._cellInnerSize - 2 * this._cellPadding,
          this._cellInnerSize
        );
        break;
      case "propeller":
        ctx.fillStyle = color.red;
        ctx.fillRect(
          x * this._cellOuterSize + 2 * this._cellPadding,
          y * this._cellOuterSize + 2 * this._cellPadding,
          this._cellInnerSize - 2 * this._cellPadding,
          this._cellInnerSize - 2 * this._cellPadding
        );

        break;
      case "tnt":
        ctx.fillStyle = "red";
        ctx.fillRect(
          x * this._cellOuterSize + this._cellPadding,
          y * this._cellOuterSize + this._cellPadding,
          this._cellInnerSize,
          this._cellInnerSize
        );
        ctx.fillStyle = "black";
        ctx.fillRect(
          x * this._cellOuterSize,
          y * this._cellOuterSize + 3 * this._cellPadding,
          this._cellInnerSize,
          this._cellInnerSize - 4 * this._cellPadding
        );
        break;
      case "light":
        ctx.fillStyle = color.red;
        ctx.fillRect(
          x * this._cellOuterSize + this._cellPadding,
          y * this._cellOuterSize + this._cellPadding,
          this._cellInnerSize,
          this._cellInnerSize
        );
        ctx.fillStyle = "white";
        ctx.fillRect(
          x * this._cellOuterSize + 3 * this._cellPadding,
          y * this._cellOuterSize + 3 * this._cellPadding,
          this._cellInnerSize - 4 * this._cellPadding,
          this._cellInnerSize - 4 * this._cellPadding
        );
        break;
      default:
        ctx.fillStyle = cellStyle;
        ctx.fillRect(
          x * this._cellOuterSize + this._cellPadding,
          y * this._cellOuterSize + this._cellPadding,
          this._cellInnerSize,
          this._cellInnerSize
        );
    }
  }

  // 1つのセルを消す
  async clearCell(ctx: CanvasRenderingContext2D, [x, y]: CellCoordinate) {
    ctx.clearRect(
      x * this._cellOuterSize,
      y * this._cellOuterSize,
      this._cellOuterSize,
      this._cellOuterSize
    );
  }

  //
  //
  // 外部に公開する関数
  //
  //

  //1操作ごとに呼び出す
  async oneStep(x1: number, y1: number, x2: number, y2: number) {
    if (this._isLocking) {
      return;
    }
    this._isLocking = true;

    // 入力されたキャンバス内の座標から方向を判定
    const dx = x2 - x1;
    const dy = y2 - y1;

    x1 = Math.floor(x1 / this._cellOuterSize);
    y1 = Math.floor(y1 / this._cellOuterSize);

    let movedCells: CellCoordinate[] | null = null;

    // クリックかスワイプかを判定
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      movedCells = await this.click([x1, y1]);
    } else {
      const theta = Math.atan2(dy, dx);
      const pi = Math.PI;
      if ((3 / 4) * pi >= theta && theta > pi / 4) {
        // 下
        x2 = x1;
        y2 = y1 + 1;
      } else if (pi / 4 >= theta && theta > -pi / 4) {
        // 右
        x2 = x1 + 1;
        y2 = y1;
      } else if (-pi / 4 >= theta && theta > (-3 / 4) * pi) {
        // 上
        x2 = x1;
        y2 = y1 - 1;
      } else {
        // 左
        x2 = x1 - 1;
        y2 = y1;
      }

      // プレイヤーの操作を解決
      movedCells = await this.swap([x1, y1], [x2, y2]);
    }
    // マッチしなくなるまでコンボを続ける
    await (async () => {
      let b = await this.update(movedCells);
      while (b) {
        b = await this.update(null);
      }
    })();

    // 描画
    await this.draw();
    this._isLocking = false;
  }

  // 選択したセルをハイライトする
  highlightCell([x, y]: CellCoordinate) {}

  // デバッグ用
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

  //
  //
  // あとなんかいろいろ
  //
  //

  async click([x, y]: CellCoordinate): Promise<null> {
    console.log("threematch: clicked", x, y);
    if (this.isBomb([x, y])) {
      // ボムをクリックした場合
      // ボムを爆発させる
      await this.explode([x, y]);
    }
    return null;
  }

  isBomb([x, y]: CellCoordinate): boolean {
    return 10 <= this._board[x][y] && this._board[x][y] <= 14;
  }

  async explode([x, y]: CellCoordinate) {
    if (!this.isBomb([x, y])) {
      this._board[x][y] = null;
      return;
    }

    const bombType = this._colors[this._board[x][y]];

    this._board[x][y] = null;

    switch (bombType) {
      case "row":
        // row
        for (let i = 0; i < this._width; i++) {
          await this.explode([i, y]);
        }
        break;
      case "column":
        // column
        for (let i = 0; i < this._height; i++) {
          await this.explode([x, i]);
        }
        break;
      case "propeller":
        // propeller
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (
              0 <= x + i &&
              x + i < this._width &&
              0 <= y + j &&
              y + j < this._height
            ) {
              await this.explode([x + i, y + j]);
            }
          }
        }

        const random_x = Math.floor(Math.random() * this._width);
        const random_y = Math.floor(Math.random() * this._height);
        this._board[random_x][random_y] = null;

        break;
      case "tnt":
        // tnt
        const range = 2;
        for (let i = -range; i <= range; i++) {
          for (let j = -range; j <= range; j++) {
            if (
              0 <= x + i &&
              x + i < this._width &&
              0 <= y + j &&
              y + j < this._height
            ) {
              await this.explode([x + i, y + j]);
            }
          }
        }

        break;
      case "light":
        // light
        const random_color = Math.floor(Math.random() * this._dropColorCount);
        for (let i = 0; i < this._width; i++) {
          for (let j = 0; j < this._height; j++) {
            if (this._board[i][j] === random_color) {
              this._board[i][j] = null;
            }
          }
        }
        break;
    }
  }

  async specialExplode([x1, y1]: CellCoordinate, [x2, y2]: CellCoordinate) {
    const bombType = [
      this._colors[this._board[x1][y1]],
      this._colors[this._board[x2][y2]],
    ].sort();
    this._board[x1][y1] = null;
    this._board[x2][y2] = null;

    let random_color;
    let memo;
    let random_x;
    let random_y;

    const twoRockets = async () => {
      for (let i = 0; i < this._width; i++) {
        await this.explode([i, y2]);
      }
      for (let i = 0; i < this._height; i++) {
        await this.explode([x2, i]);
      }
    };
    const tntRockets = async () => {
      const range = 1;
      for (let i = 0; i < this._width; i++) {
        for (let j = -range; j <= range; j++) {
          if (0 <= y1 + j && y1 + j < this._height) {
            await this.explode([i, y1 + j]);
          }
        }
      }
      for (let i = 0; i < this._height; i++) {
        for (let j = -range; j <= range; j++) {
          if (0 <= x1 + j && x1 + j < this._width) {
            await this.explode([x1 + j, i]);
          }
        }
      }
    };
    const lightRockets = async () => {
      random_color = Math.floor(Math.random() * this._dropColorCount);
      memo = [];

      for (let i = 0; i < this._width; i++) {
        for (let j = 0; j < this._height; j++) {
          if (this._board[i][j] === random_color) {
            this._board[i][j] = Math.floor(Math.random() * 2) + 10;
            memo.push([i, j]);
          }
        }
      }
      await memo.forEach(async ([i, j]) => {
        this.explode([i, j]);
      });
    };

    switch (bombType.join(";")) {
      case "column;column":
        await twoRockets();
        break;
      case "column;row":
        await twoRockets();
        break;
      case "column;propeller":
        random_x = Math.floor(Math.random() * this._width);
        for (let i = 0; i < this._height; i++) {
          await this.explode([random_x, i]);
        }
        break;
      case "column;tnt":
        await tntRockets();
        break;
      case "column;light":
        await lightRockets();
        break;

      case "light;light":
        for (let x = 0; x < this._width; x++) {
          for (let y = 0; y < this._height; y++) {
            if (this._board[x][y] === 10) {
              await this.explode([x, y]);
            }
          }
        }
        break;
      case "light;propeller":
        random_color = Math.floor(Math.random() * this._dropColorCount);
        memo = [];
        for (let i = 0; i < this._width; i++) {
          for (let j = 0; j < this._height; j++) {
            if (this._board[i][j] === random_color) {
              this._board[i][j] = 12;
              memo.push([i, j]);
            }
          }
        }
        memo.forEach(async ([i, j]) => {
          await this.explode([i, j]);
        });
        break;
      case "light;tnt":
        random_color = Math.floor(Math.random() * this._dropColorCount);
        memo = [];
        for (let i = 0; i < this._width; i++) {
          for (let j = 0; j < this._height; j++) {
            if (this._board[i][j] === random_color) {
              this._board[i][j] = 13;
              memo.push([i, j]);
            }
          }
        }
        memo.forEach(async ([i, j]) => {
          await this.explode([i, j]);
        });
        break;
      case "light;row":
        await lightRockets();
        break;

      case "propeller;propeller":
        for (let i = 0; i < 3; i++) {
          random_x = Math.floor(Math.random() * this._width);
          random_y = Math.floor(Math.random() * this._height);
          await this.explode([random_x, random_y]);
        }
        break;
      case "propeller;tnt":
        random_x = Math.floor(Math.random() * this._width);
        random_y = Math.floor(Math.random() * this._height);
        this._board[random_x][random_y] = 13;
        await this.explode([random_x, random_y]);
        break;
      case "propeller;row":
        random_y = Math.floor(Math.random() * this._height);
        for (let i = 0; i < this._width; i++) {
          this.explode([i, random_y]);
        }
        break;

      case "row;row":
        await twoRockets();
        break;
      case "row;tnt":
        await tntRockets();
        break;

      case "tnt;tnt":
        const range = 4;
        for (let i = -range; i <= range; i++) {
          for (let j = -range; j <= range; j++) {
            if (
              0 <= x1 + i &&
              x1 + i < this._width &&
              0 <= y1 + j &&
              y1 + j < this._height
            ) {
              await this.explode([x1 + i, y1 + j]);
            }
          }
        }
        break;
    }
  }

  // 2つのセルを入れ替える。マッチした場合は触ったセルを返す
  async swap(
    [x1, y1]: CellCoordinate,
    [x2, y2]: CellCoordinate
  ): Promise<CellCoordinate[] | null> {
    // 隣接していない場合は入れ替えない
    if (Math.abs(x1 - x2) + Math.abs(y1 - y2) !== 1) {
      return null;
    }

    let tmp = this._board[x1][y1];
    this._board[x1][y1] = this._board[x2][y2];
    this._board[x2][y2] = tmp;

    // アニメーション
    const duration = 300;
    await this.swapAnimation([x1, y1], [x2, y2], duration);

    // ボムだった場合の処理
    if (this.isBomb([x1, y1]) || this.isBomb([x2, y2])) {
      if (this.isBomb([x1, y1]) && this.isBomb([x2, y2])) {
        console.log("threematch: special explodion!!");
        await this.specialExplode([x1, y1], [x2, y2]);
      } else {
        if (this.isBomb([x1, y1])) {
          await this.explode([x1, y1]);
        }
        if (this.isBomb([x2, y2])) {
          await this.explode([x2, y2]);
        }
      }

      return [
        [x1, y1],
        [x2, y2],
      ];
    }

    // いれかえてもマッチしない場合は元に戻す
    if (
      !this.checkMatch([
        [x1, y1],
        [x2, y2],
      ])
    ) {
      tmp = this._board[x1][y1];
      this._board[x1][y1] = this._board[x2][y2];
      this._board[x2][y2] = tmp;

      // アニメーション
      return null;
    }
    return [
      [x1, y1],
      [x2, y2],
    ];
  }

  // 入れ替えアニメーション
  async swapAnimation(
    [x1, y1]: CellCoordinate,
    [x2, y2]: CellCoordinate,
    duration: number
  ) {
    // アニメーションセル上でアニメーションを行う
    this.clearCell(this._boardCtx, [x1, y1]);
    this.clearCell(this._boardCtx, [x2, y2]);

    const durPerFrame = duration / this._fps;
    const frameCount = Math.floor((duration * this._fps) / 1000);
    let x1_i = x1;
    let y1_i = y1;
    let x2_i = x2;
    let y2_i = y2;
    for (let i = 0; i < frameCount; i++) {
      this.clearCell(this._animationCtx, [x1_i, y1_i]);
      this.clearCell(this._animationCtx, [x2_i, y2_i]);

      x1_i += (x2 - x1) * (1 / frameCount);
      y1_i += (y2 - y1) * (1 / frameCount);
      x2_i += (x1 - x2) * (1 / frameCount);
      y2_i += (y1 - y2) * (1 / frameCount);

      this.drawCell(
        this._animationCtx,
        [x1_i, y1_i],
        this._colors[this._board[x1][y1]]
      );
      this.drawCell(
        this._animationCtx,
        [x2_i, y2_i],
        this._colors[this._board[x2][y2]]
      );

      await new Promise((resolve) => setTimeout(resolve, durPerFrame));
    }
  }

  async update(movedCells: CellCoordinate[]): Promise<boolean> {
    // 変更があったらtrueを返す

    let b = false;

    let match = this.checkMatch(movedCells);
    while (match) {
      b = true;
      this.removeMatch(match);
      match = this.checkMatch(movedCells);
    }

    // null check for all cells
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        if (this._board[x][y] === null) {
          b = true;
        }
      }
    }

    if (b) {
      await this.dropElement();
      return true;
    }
    console.log("threematch: nothing updated");
    return false;
  }

  //
  //
  // マッチング関連
  //
  //

  checkMatch(movedCells: CellCoordinate[] | null): Match | null {
    let match = this.checkFiveLineMatch(movedCells);
    if (match) {
      return match;
    }

    match = this.checkFourLineMatch(movedCells);
    if (match) {
      return match;
    }

    match = this.checkThreeLineMatch(movedCells);
    if (match) {
      return match;
    }

    return null;
  }

  checkThreeLineMatch(movedCells: CellCoordinate[] | null): Match | null {
    // 横方向のマッチをチェック
    let match: Match = {
      movedCell: [0, 0],
      matchedCells: [],
      bombType: null,
    };

    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width - 2; x++) {
        if (this._board[x][y] === null) {
          continue;
        }
        if (this._board[x][y] >= 10) {
          continue;
        }
        if (
          this._board[x][y] === this._board[x + 1][y] &&
          this._board[x][y] === this._board[x + 2][y]
        ) {
          match.matchedCells = [
            [x, y],
            [x + 1, y],
            [x + 2, y],
          ];
          match.movedCell = [x, y];
          return match;
        }
      }
    }

    // 縦方向のマッチをチェック
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height - 2; y++) {
        if (this._board[x][y] === null) {
          continue;
        }

        if (this._board[x][y] >= 10) {
          continue;
        }
        if (
          this._board[x][y] === this._board[x][y + 1] &&
          this._board[x][y] === this._board[x][y + 2]
        ) {
          match.matchedCells = [
            [x, y],
            [x, y + 1],
            [x, y + 2],
          ];
          match.movedCell = [x, y];
          return match;
        }
      }
    }
    return null;
  }

  checkFourLineMatch(movedCells: CellCoordinate[] | null): Match | null {
    // 横方向のマッチをチェック
    let match: Match = {
      movedCell: [0, 0],
      matchedCells: [],
      bombType: null,
    };

    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width - 3; x++) {
        if (this._board[x][y] === null) {
          continue;
        }

        if (this._board[x][y] >= 10) {
          continue;
        }
        if (
          this._board[x][y] === this._board[x + 1][y] &&
          this._board[x][y] === this._board[x + 2][y] &&
          this._board[x][y] === this._board[x + 3][y]
        ) {
          match.matchedCells = [
            [x, y],
            [x + 1, y],
            [x + 2, y],
            [x + 3, y],
          ];
          match.bombType = "column";
          match.movedCell = [x, y];
          return match;
        }
      }
    }

    // 縦方向のマッチをチェック
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height - 3; y++) {
        if (this._board[x][y] === null) {
          continue;
        }

        if (this._board[x][y] >= 10) {
          continue;
        }
        if (
          this._board[x][y] === this._board[x][y + 1] &&
          this._board[x][y] === this._board[x][y + 2] &&
          this._board[x][y] === this._board[x][y + 3]
        ) {
          match.matchedCells = [
            [x, y],
            [x, y + 1],
            [x, y + 2],
            [x, y + 3],
          ];
          match.bombType = "row";
          match.movedCell = [x, y];
          return match;
        }
      }
    }
    return null;
  }

  checkFiveLineMatch(movedCells: CellCoordinate[] | null): Match | null {
    let match: Match = {
      movedCell: [0, 0],
      matchedCells: [],
      bombType: "light",
    };

    // 横方向のマッチをチェック
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width - 4; x++) {
        if (this._board[x][y] === null) {
          continue;
        }

        if (this._board[x][y] >= 10) {
          continue;
        }
        if (
          this._board[x][y] === this._board[x + 1][y] &&
          this._board[x][y] === this._board[x + 2][y] &&
          this._board[x][y] === this._board[x + 3][y] &&
          this._board[x][y] === this._board[x + 4][y]
        ) {
          match.matchedCells = [
            [x, y],
            [x + 1, y],
            [x + 2, y],
            [x + 3, y],
            [x + 4, y],
          ];
          match.bombType = "light";
          match.movedCell = [x, y];
          return match;
        }
      }
    }

    // 縦方向のマッチをチェック
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height - 4; y++) {
        if (this._board[x][y] === null) {
          continue;
        }

        if (this._board[x][y] >= 10) {
          continue;
        }
        if (
          this._board[x][y] === this._board[x][y + 1] &&
          this._board[x][y] === this._board[x][y + 2] &&
          this._board[x][y] === this._board[x][y + 3] &&
          this._board[x][y] === this._board[x][y + 4]
        ) {
          match.matchedCells = [
            [x, y],
            [x, y + 1],
            [x, y + 2],
            [x, y + 3],
            [x, y + 4],
          ];
          match.bombType = "light";
          match.movedCell = [x, y];
          return match;
        }
      }
    }
    return null;
  }

  /*
  checkTLXMatch(movedCells: CellCoordinate[] | null): Match | null {
    // L字型のマッチをチェック
    let match: Match = {
      movedCell: [0, 0],
      matchedCells: [],
      bombType: null,
    };

  }
    */

  removeMatch(match: Match) {
    match.matchedCells.forEach(([x, y]) => {
      this._board[x][y] = null;
    });

    let [x, y] = match.movedCell;
    switch (match.bombType) {
      case null:
        break;
      case "row":
        this._board[x][y] = 10;
        break;
      case "column":
        this._board[x][y] = 11;
        break;
      case "propeller":
        this._board[x][y] = 12;
        break;
      case "tnt":
        this._board[x][y] = 13;
        break;
      case "light":
        this._board[x][y] = 14;
        break;
    }
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

    let fallBoard: [Cell, number][][] = [];
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

  async fallAnimation(x: number, fallBoard: [Cell, number][]) {
    const fps = this._fps;
    const msecPerFrame = 1000 / fps;

    for (let y = 0; y < this._height; y++) {
      this.clearCell(this._boardCtx, [x, y]);
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
        x * this._cellOuterSize,
        0,
        this._cellOuterSize,
        this._height * this._cellOuterSize
      );
      fallBoard2.forEach(([cell, currY, targetY], i) => {
        this.drawCell(this._animationCtx, [x, currY], this._colors[cell]);
      });

      await new Promise((resolve) => setTimeout(resolve, msecPerFrame));
    }

    for (let y = 0; y < this._height; y++) {
      this.clearCell(this._animationCtx, [x, y]);
      this._board[x][y] = fallBoard2[y][0];
      this.drawCell(this._boardCtx, [x, y]);
    }
  }
}

