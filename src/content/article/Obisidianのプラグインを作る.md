---
layout: /src/layouts/Article.astro
title: Obisidianのプラグインを作る
author: 宇田
date: 2024-07-10
description: 作ります
thumbnail:
---
<h2 style="font-size:40pt; font-weight:bold; color:#ff4040">Sharpen your thinking.</h2>
みなさん。
思考、尖らせていますか？

ObsidianというMarkdownをいい感じに管理してくれるソフトウェアがあります。
ご存知の通り、ObsidianはVaultと呼ばれるディレクトリ中にあらゆる情報を集約して繋ぎ合わせることで、第二の脳として我々の生活や学習を強力に補助してくれます。
とはいえ、ObsidianはMarkdownファイル中のリンクを繋ぎ合わせるだけの非常にシンプルなアプリです。
そのため、すべての情報をObsidianで一元的に管理するには少々機能が物足りない場合もあります。

しかし、問題はありません。
Obsidianの特徴として、シンプルさゆえの柔軟性が挙げられます。
外部から導入するサードパーティのプラグインによって、機能をいかようにも拡張することができるのです。

以下では、そんなObsidianのプラグイン開発の環境構築や、Dataviewなどの内部的なスクリプト開発と比べた差異について述べます。
## 想定される読者

- Obsidianユーザーである。
- git cloneが使える。
- TypeScriptの読み書きが多少できる。

## 環境構築

とは言っても解説すべきことは特段多くありません。
[Obsidian Developer Docs](https://docs.obsidian.md/Home)を読むだけです。

……これでは少々味気ないので、サンプルプラグインのインストールについて説明します。
というのも、Obsidianのプラグイン開発はホットリロードで動作確認をしながら行うことが推奨されているのですが、公式ドキュメントではその方法がさもオプションかのように書かれているからです。
実際にはほぼ必須ですから、それを統合した形の手順を書き記します。

開発は、プラグインがインストールされるフォルダでそのまま行います。
```
cd path/to/vault
mkdir .obsidian/plugins
cd .obsidian/plugins
```
というわけでディレクトリを移動し、
```
git clone https://github.com/obsidianmd/obsidian-sample-plugin
```
サンプルプラグインを引っ張ってきます。

ホットリロード用のプラグインもクローンしましょう。
```
https://github.com/pjeby/hot-reload
```
サンプルのリポジトリにはnodeやeslintの設定も同梱されているため、
```
cd obsidian-sample-plugin
npm install
npm run dev
```
でそのまま動かすことができます。
bunやpnpmなど、別のパッケージマネージャーを使いたい人は適宜自分でどうにかしましょう。

触るのはとりあえず以下のファイルだけでOKです。

- main.ts
	- エントリーポイントとなるファイル
- manifest.json
	- プラグインのメタデータが入っているファイル

この状態でmain.tsを編集すると、保存のたびにプラグインがリロードされるようになります。
## プラグインでできること

プラグイン開発の具体的な内容について立ち入ると[公式ドキュメント](https://docs.obsidian.md/Home)の和訳焼き直しになってしまうので、それに関してはいったん置いておくことにして、さしあたりDataviewやMeta BindなどのMarkdownドキュメント内でJavaScriptを書けるプラグインに任せた方がよい領域と、自作プラグインが必要な領域の線引きをおおまかにしておきたいと思います。

個人的な思想としては、データストレージとしてのMarkdownファイルの純粋さを確保しておきたいので、一定の特別な立場に位置するファイルを除けばMarkdownファイル内にJavaScriptを記述したくないのですが、逆に言えば、特別な立場に位置するファイル、すなわち下位ファイルの統計を自動で表示するファイルなどは、ファイル内部にスクリプトを書いてもよいと思います。

たとえば、Vault内の特定ファイル群についてのデータを集めるようなプラグインを書く場合は公式ドキュメントの[Vaultのページ](https://docs.obsidian.md/Plugins/Vault)などを見ることになるのだと思いますが、このページの記述は貧弱ですし、APIもすこしプリミティブです。
これを見るくらいであれば、[Dataviewの公式ドキュメント](https://blacksmithgu.github.io/obsidian-dataview/api/code-examples/)などの方がよっぽど充実しているし、APIもよくまとまっているでしょう。

逆に、UIの領域については、Meta Bindでがんばるくらいなら、すなおにプラグインを開発した方がいいでしょう。
モーダル(排他的なポップアップウィンドウ)やサイドリボンなどを触れるのはプラグインの特権ですし、エディター内にボタンやフォームを用意するのは、デザインの観点から見ても不自然です(エディター内はなるべく文章を記述する場であるべきです)。

まとめると、
- エディタ外を触れるのはプラグインだけ。
- インタラクティブなことはプラグインにやらせよう。
- データクエリはDataviewに任せよう。

というような感じになります。

## 開発

とはいえ、全く開発をしないのであれば、このノートを作る意味もありません。
そこで、この項では試しに1つプラグインを作る様子を追ってみましょう。
今回は、ファイル名を入力するとその通りのタイトルを持つページを作成するだけの簡単なプラグインを作ります。

まず、論文情報を入力するウィンドウを定義します。
サンプルプラグインの挙動を、次のように置き換えます。
``` TypeScript
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
```TypeScript
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

Obsidianの設定からSample pluginを有効化してみてください。
画面の右上に "Hi!" と現れましたね。
無効化すると "Bye!" と表示されます。

これだけでは寂しいので、設定から挨拶を日本語にできるようにしましょう。
プラグインを有効に戻し、`SuperSettingTab`クラスを次のように追加します。
```TypeScript
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
```TypeScript
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
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
		await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
```
と言うわけで、コードの全容は次のようになります。
```TypeScript
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
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
		await this.loadData()
		);
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

最後に、manifest.jsonを設定します。
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

今回は~~やむをえず~~非常に簡単な一例を取り上げましたが、基本的にNode.jsの上で動くものはなんでもプラグインとして実装できます。

ReactやSvelteなどのコンポーネントも利用できる([参考](https://docs.obsidian.md/Plugins/Getting+started/Use+React+in+your+plugin))ので、みなさんもぜひ色々開発し、思考をトキントキンに尖らせてください。

以上、宇田でした。

