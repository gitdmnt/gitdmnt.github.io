---
title: Obisidianのプラグインを作る
author: 宇田
pubDate: 2024-07-10
description: 作ります
thumbnail:
---

<h2 style="font-size:40pt; font-weight:bold; color:#ff4040">Sharpen your thinking.</h2>
みなさん。
思考、尖らせていますか？

## はじめに

Obsidian という、Markdown ファイル群をいい感じに管理してくれるソフトウェアがあります。
ご存知の通り、Obsidian は Vault と呼ばれるディレクトリ中にあらゆる情報を集約して繋ぎ合わせることで、第二の脳として我々の生活や学習を強力に補助してくれます。
講義ノートから日記、あるいは家計簿まで、忘れたくないものはなんでも Obsidian に書いておけばよいのです。
そうすれば、たとえ第一の脳がすべてを忘れてしまっても、あなた(の記憶)は依然としてフリップフロップの上に残り続けるでしょう。

とはいえ、Obsidian は基本的には Markdown ファイル中のリンクを繋ぎ合わせるだけの非常にシンプルなアプリです。
そのため、愚直に書き、愚直に探すのならいざ知らず、すべての情報を Obsidian で一元的に管理するには、やはり少々機能が物足りない場合もあります。

しかし、一切の問題はありません。
Obsidian の大きな特徴として、シンプルさゆえの柔軟性が挙げられます。
外部から導入するサードパーティのプラグインによって、機能をいかようにも拡張することができるのです。
マインドマップやカンバンビューを表示するに飽き足らず、ファイルのテンプレート化、Notion ライクな AI による補助まで、柔軟さを遺憾なく発揮し、みなさんの自由な創造性を増幅し、その世界をどこまでも押し広げます。

以下では、サードパーティのプラグインを漁り尽くしてもなお足りず自分で開発したくなったみなさんのために、開発環境の構築について、また Dataview などの内部的なスクリプトによる処理と比べた差異について、いくらかの例を交えながら述べることとします。

## 想定される読者

- Obsidian ユーザーである。
- git clone が使える。
- TypeScript の読み書きが多少できる。

## 環境構築

とは言っても解説すべきことは特段多くありません。
[Obsidian Developer Docs](https://docs.obsidian.md/Home)を読むだけです。

とは言ってもこれでは少々味気ないので、サンプルプラグインのインストールについて説明します。

Obsidian のプラグイン開発はホットリロードで動作確認をしながら行うことが推奨されていますが、公式ドキュメントではその方法がさもオプションかのように書かれており、明快さに欠ける部分があります。
実際にはホットリロードはほぼ必須ですから、それを統合した形の手順をここに書き記します。

開発は、サードパーティプラグインがインストールされるべきフォルダでそのまま行います。

```bash
$ cd path/to/vault
$ mkdir .obsidian/plugins
$ cd .obsidian/plugins
```

というわけでディレクトリを移動し、

```bash
$ git clone https://github.com/obsidianmd/obsidian-sample-plugin
```

サンプルプラグインを引っ張ってきます。

ホットリロード用のプラグインもクローンしましょう。

```bash
$ git clone https://github.com/pjeby/hot-reload
```

サンプルのリポジトリには npm や esbuild の設定も同梱されているため、

```bash
$ cd obsidian-sample-plugin
$ npm install
$ npm run dev
```

でそのまま動かすことができます。
bun や pnpm など、別のパッケージマネージャーを使いたい人は適宜自分でどうにかしましょう。

触るのはとりあえず以下のファイルだけで問題ありません。

- main.ts
  - エントリーポイントとなるファイル
- manifest.json
  - プラグインのメタデータが入っているファイル

この状態で main.ts を編集すると、保存のたびにプラグインがリロードされるようになります。

## プラグインでできること

プラグイン開発の具体的な内容について立ち入ると[公式ドキュメント](https://docs.obsidian.md/Home)の和訳焼き直しになってしまうので、それに関してはいったん置いておくことにして、さしあたり Dataview や Meta Bind などの Markdown ドキュメント内で JavaScript を書けるプラグインに任せた方がよい領域と、自作プラグインが必要な領域の線引きをおおまかにしておきたいと思います。

個人的な思想としては、データストレージとしての Markdown ファイルの純粋さを確保しておきたいので、一定の特別な立場に位置するファイルを除けば Markdown ファイル内に JavaScript を記述したくないのですが、逆に言えば、特別な立場に位置するファイル、すなわち下位ファイルの統計を自動で表示するファイルなどは、ファイル内部にスクリプトを書いてもよいと思います。

たとえば、Vault 内の特定ファイル群についてのデータを集めるようなプラグインを書く場合は公式ドキュメントの[Vault のページ](https://docs.obsidian.md/Plugins/Vault)などを見ることになるのだと思いますが、このページの記述は貧弱ですし、API もすこしプリミティブです。
これを見るくらいであれば、[Dataview の公式ドキュメント](https://blacksmithgu.github.io/obsidian-dataview/api/code-examples/)などの方がよっぽど充実しているし、API もよくまとまっているでしょう。

逆に、UI の領域については、Meta Bind でがんばるくらいなら、すなおにプラグインを開発した方がいいでしょう。
モーダル(排他的なポップアップウィンドウ)やサイドリボンなどを触れるのはプラグインの特権ですし、エディター内にボタンやフォームを用意するのは、デザインの観点から見ても不自然です(エディター内はなるべく文章を記述する場であるべきです)。

まとめると、

- エディタ外を触れるのはプラグインだけ。
- インタラクティブなことはプラグインにやらせよう。
- データクエリは Dataview に任せよう。

というような感じになります。

## 開発

とはいえ、全く開発をしないのであれば、このノートを作る意味もありません。
そこで、この項では試しに 1 つプラグインを作る様子を追ってみましょう。
今回は、ファイル名を入力するとその通りのタイトルを持つページを作成するだけの簡単なプラグインを作ります。

まず、論文情報を入力するウィンドウを定義します。
サンプルプラグインの挙動を、次のように置き換えます。

```typescript
export default class MyFinestPlugin extends Plugin {
  async onload() {
    new Notice("Hi!");
    this.addRibbonIcon("file-plus", "New file", (evt: MouseEvent) => {
      new SuperModal(this.app, (result) => {
        const filePath = result + ".md";
        this.app.vault.create(filePath, "This is a new file!");
      }).open();
    });
  }
  onunload() {
    new Notice("Bye!");
  }
}
```

`onload()`, `onunload()`関数内には、それぞれプラグイン読み込み時と無効化時に動くスクリプトを記述します。
今回は、読み込み時に "Hi!" と挨拶をし、サイドリボンにモーダルを開くアイコンを追加するスクリプトを、無効化時に "Bye!" と挨拶をするよう記述しました。

これに合わせて、`SampleModal`を次のように書き換えます。

```typescript
class SuperModal extends Modal {
  result: string;
  onSubmit: (result: string) => void;

  constructor(app: App, onSubmit: (result: string) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h1", { text: "Input a title" });

    // 入力欄
    new Setting(contentEl).setName("Title").addText((text) => {
      text.onChange((value) => {
        this.result = value;
      });
    });

    // 実行ボタン
    new Setting(contentEl).addButton((btn) =>
      btn
        .setButtonText("Create Page")
        .setCta()
        .onClick(() => {
          this.close();
          this.onSubmit(this.result);
        })
    );
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
```

Obsidian の設定から Sample plugin を有効化してみてください。
画面の右上に "Hi!" と現れましたね。
無効化すると "Bye!" と表示されます。

これだけでは寂しいので、設定から挨拶を日本語にできるようにしましょう。
プラグインを有効に戻し、`SuperSettingTab`クラスを次のように追加します。

```typescript
class SuperSettingTab extends PluginSettingTab {
  plugin: MyFinestPlugin;

  constructor(app: App, plugin: MyFinestPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    new Setting(containerEl)
      .setName("Language")
      .setDesc("My Finest Plugin greets you in this language.")
      .addDropdown((content) =>
        content
          .addOption("en", "English")
          .addOption("ja", "Japanese")
          .setValue(this.plugin.settings.language)
          .onChange(async (value: "en" | "ja") => {
            this.plugin.settings.language = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
```

これに合わせて、`MyFinestPlugin`クラスの挙動を次のように書き換えます。

```typescript
interface Settings {
  language: "en" | "ja";
}

const DEFAULT_SETTINGS: Settings = {
  language: "en",
};

export default class MyFinestPlugin extends Plugin {
  settings: Settings;

  async onload() {
    await this.loadSettings();
    if (this.settings.language === "en") {
      new Notice("Hi!");
    } else {
      new Notice("やあ！");
    }
    this.addRibbonIcon("file-plus", "New file", (evt: MouseEvent) => {
      new SuperModal(this.app, (result) => {
        const filePath = result + ".md";
        this.app.vault.create(filePath, "This is a new file!");
      }).open();
    });
    this.addSettingTab(new SuperSettingTab(this.app, this));
  }
  onunload() {
    if (this.settings.language === "en") {
      new Notice("Bye!");
    } else {
      new Notice("じゃあね！");
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
```

と言うわけで、コードの全容は次のようになります。

```typescript
import {
  App,
  Modal,
  Notice,
  Plugin,
  Setting,
  PluginSettingTab,
} from "obsidian";

interface Settings {
  language: "en" | "ja";
}

const DEFAULT_SETTINGS: Settings = {
  language: "en",
};

export default class MyFinestPlugin extends Plugin {
  settings: Settings;

  async onload() {
    await this.loadSettings();
    if (this.settings.language === "en") {
      new Notice("Hi!");
    } else {
      new Notice("やあ！");
    }
    this.addRibbonIcon("file-plus", "New file", (evt: MouseEvent) => {
      new SuperModal(this.app, (result) => {
        const filePath = result + ".md";
        this.app.vault.create(filePath, "This is a new file!");
      }).open();
    });
    this.addSettingTab(new SuperSettingTab(this.app, this));
  }
  onunload() {
    if (this.settings.language === "en") {
      new Notice("Bye!");
    } else {
      new Notice("じゃあね！");
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class SuperModal extends Modal {
  result: string;
  onSubmit: (result: string) => void;

  constructor(app: App, onSubmit: (result: string) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h1", { text: "Input a title" });

    // 入力欄
    new Setting(contentEl).setName("Title").addText((text) => {
      text.onChange((value) => {
        this.result = value;
      });
    });

    // 実行ボタン
    new Setting(contentEl).addButton((btn) =>
      btn
        .setButtonText("Create Page")
        .setCta()
        .onClick(() => {
          this.close();
          this.onSubmit(this.result);
        })
    );
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

class SuperSettingTab extends PluginSettingTab {
  plugin: MyFinestPlugin;

  constructor(app: App, plugin: MyFinestPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    new Setting(containerEl)
      .setName("Language")
      .setDesc("My Finest Plugin greets you in this language.")
      .addDropdown((content) =>
        content
          .addOption("en", "English")
          .addOption("ja", "Japanese")
          .setValue(this.plugin.settings.language)
          .onChange(async (value: "en" | "ja") => {
            this.plugin.settings.language = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
```

最後に、manifest.json を設定します。

```json
{
  "id": "finest-plugin",
  "name": "My Finest Plugin",
  "version": "1.0.0",
  "minAppVersion": "0.15.0",
  "description": "Metcha sugoi plugin desu.",
  "author": "Udachan",
  "authorUrl": "https://gitdmnt.github.io/",
  "fundingUrl": "",
  "isDesktopOnly": false
}
```

これで一番簡単なプラグインの完成です。

## おしまいに

今回は~~やむをえず~~非常に簡単な一例を取り上げましたが、基本的に Node.js の上で動くものはなんでもプラグインとして実装できます。

React や Svelte などのコンポーネントも利用できる([参考](https://docs.obsidian.md/Plugins/Getting+started/Use+React+in+your+plugin))ので、みなさんもぜひ色々開発し、思考をトキントキンに尖らせてください。

以上、宇田でした。

