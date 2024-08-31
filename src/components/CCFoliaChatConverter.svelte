<!-- 

ココフォリアのチャットログはhtml形式で出力される。
このコンポーネントはそのhtml形式のファイルを受け取り、body部分を抽出してより適切なフォーマットに変換する。
その後、変換した内容を表示したり、html形式に再度変換してダウンロードさせたりする。 

-->

<script lang="ts">
  import Dropzone from "svelte-file-dropzone";

  interface ChatLog {
    room: string;
    name: string;
    color: string;
    messages: string[];
  }
  let files: FileList;
  let outputLogs: ChatLog[];
  let outputHtmlText: string;

  const handleDrop = (e) => {
    const { acceptedFiles, fileRejections } = e.detail;
    files = acceptedFiles;
  };

  $: {
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const logs = [];

        const file = files[i];
        const reader = new FileReader();

        // ファイルを読み込んだ後の処理を定義
        reader.onload = (e) => {
          // ファイルの内容を取得
          const html = e.target.result as string;
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const body = doc.body;
          const chatLogs = body.querySelectorAll("p");

          // チャットログを簡約しながら抽出
          let pointer = -1;
          chatLogs.forEach((chatLog) => {
            const color = chatLog.style.color;
            const spanElements = chatLog.querySelectorAll("span");
            const room = spanElements[0].textContent.slice(2, -1);
            const name = spanElements[1].textContent;
            const message = spanElements[2].textContent.slice(9, -8);

            // チャットログの簡約
            if (pointer === -1) {
              // 初回はそのまま追加
              logs.push({ room, name, color, messages: [message] });
              pointer++;
            } else {
              // 2回目以降は前回のログと比較して同じ部屋で同じ名前の場合は結合
              const latestLogId = [
                logs[pointer].room,
                logs[pointer].name,
                logs[pointer].color,
              ].join("___");
              const currentLogId = [room, name, color].join("___");
              if (latestLogId === currentLogId) {
                logs[pointer].messages.push(message);
              } else {
                logs.push({ room, name, color, messages: [message] });
                pointer++;
              }
            }
          });

          console.log(logs);

          // html化
          outputHtmlText = convertLogsToHtml(file.name, logs);
          outputLogs = logs;
        };

        // ファイルを読み込む
        reader.readAsText(file);
      }
    }
  }

  $: logs = logs;

  // チャットログをhtml形式に変換
  const convertLogsToHtml = (name: string, logs: ChatLog[]) => {
    return `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>${name}</title>
  </head>
  <body>
    <h1>${name}</h1>
    ${logs
      .map(
        (log) => `
    <div class="container">
      <div class="name" style="color:${log.color};">${log.name}</div>
      <div class="room">${log.room}</div>
      <div class="messages">
        ${log.messages.map((message) => `<p class="message">${message}</p>`).join("        \n")}
      </div>
    </div>`
      )
      .join("\n")}
    <p class="credit">このファイルは<a href="https://gitdmnt.github.io/ccfoliachatconverter">こころぐこんばーた</a>によって作成されました。</p>
    <style>
      :root {
        --black: #101010;
        --pink: rgba(213, 106, 138, 1);
        --light-pink: rgba(213, 106, 138, 0.5);
      }

      body {
        width: 50%;
        margin: auto;
        display: grid;
        place-items: start start;
      }

      h1 {
        width: 100%;
        border-block-end: 1px solid var(--light-pink);
      }
      
      .credit {
        width: 100%;
        border-block-start: 1px solid var(--light-pink);
        font-size: 0.5rem;
        font-color: var(--black);
      }

      a {
        color: var(--pink);
        text-decoration: none;
      }

      .container {
        margin-block: 0.5rem;
        display: grid;
        grid-template-columns: 5rem auto;
        grid-template-rows: minmax(1rem, auto) 1fr;
        column-gap: 0.5rem;
        place-items: start start;
      }

      .room {
        grid-column: 1 / 2;
        grid-row: 2 / 3;
        font-size: 0.5rem;
      }

      .name {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
      }

      .messages {
        grid-column: 2 / 3;
        grid-row: 1 / 3;
        padding: 1rem;
        border-radius: 1rem;
        border: 1px solid var(--light-pink);
      }

      .message {
        margin: 0;
      }
    </style>
  </body>
</html>`;
  };
</script>

<div class="wrapper">
  <div class="container">
    <h1 class="title">こころぐこんばーた</h1>
    <p class="description">
      ココフォリアのチャットログをより見やすい形に変換します。
    </p>

    <Dropzone
      on:drop={handleDrop}
      containerStyles="
      padding: 2rem;
    border-color: rgba(213, 106, 138, 0.2);
    background-color: rgba(213, 106, 138, 0.1);
    color: rgba(213, 106, 138, 0.5);
    "
      disableDefaultStyles={false}
    >
      出力したチャットログファイルを<wbr />ドラッグアンドドロップ
    </Dropzone>

    <div class="download-container">
      {#if outputHtmlText}
        <a
          href="data:text/html;charset=utf-8,{encodeURIComponent(
            outputHtmlText
          )}"
          download="chat-log.html">HTML形式でダウンロード</a
        >
      {/if}
    </div>

    <div class="output-container">
      {#if outputLogs}
        {#each outputLogs as log}
          <div class="log-container">
            <div class="log-name" style="color:{log.color};">{log.name}</div>
            <div class="log-room">{log.room}</div>
            <div class="log-messages">
              {#each log.messages as message}
                <p class="log-message">{message}</p>
              {/each}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  :root {
    --black: #101010;
    --pink: rgba(213, 106, 138, 1);
    --light-pink: rgba(213, 106, 138, 0.5);
  }
  .wrapper {
    display: grid;
    place-items: center;
    width: 100%;
  }

  .container {
    margin: 4rem 4rem 0rem 4rem;
    width: 60%;
    max-width: 640px;
    color: var(--black);
    border-block-end: 1px dashed var(--black);
    background-color: #fff;
  }

  .title {
    font-size: 2rem;
    padding: 0;
    margin: 0;
  }

  .description {
    margin-block: 1rem;
  }

  .download-container {
    margin-block: 2rem;
  }

  .output-container {
    margin-block: 2rem;
    padding-block: 2rem;
    min-height: 5rem;
    border-block: 1px solid var(--light-pink);
  }

  .log-container {
    margin-block: 0.5rem;
    display: grid;
    grid-template-columns: 5rem auto;
    grid-template-rows: minmax(1rem, auto) 1fr;
    column-gap: 0.5rem;
    place-items: start start;
  }

  .log-room {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    font-size: 0.5rem;
  }

  .log-name {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }
  .log-messages {
    grid-column: 2 / 3;
    grid-row: 1 / 3;
    padding: 1rem;
    border-radius: 1rem;
    border: 1px solid var(--light-pink);
  }
  .log-message {
  }

  p {
    margin: 0;
  }
</style>
