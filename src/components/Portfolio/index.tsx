import React, { useEffect, useState } from "react";

type PortfolioTags = "cd" | "comic" | "webApp" | "techblog";

interface PortfolioCardProps {
  tags: PortfolioTags[];
  title: string;
  description: string;
  additionalDescription: string;
  motivation: string;
  stack: string[];
}

const products: PortfolioCardProps[] = [
  {
    tags: ["webApp"],
    title: "bookie clicker",
    description:
      "読書記録を取り、統計情報を閲覧するために設計された仮想書架のWebアプリ。",
    additionalDescription:
      "ユーザーは自分の読書履歴をISBNに紐付けて記録することができます。履歴は読書開始時と終了時にアプリ上のストップウォッチを操作することで記録されます。読書中にはページに紐付けてメモや感想も保存でき、振り返りや分析の補助に使えます。さらに、自分の読書傾向を把握するため、蓄積した読書履歴にもとづく統計データが閲覧できます。",
    motivation:
      '読書メーターなどの既存のサービスを使っていましたが、統計情報を閲覧する機能が乏しかったりと、UI/UXに不満があったため、自分で作ることにしました。タイトルの "bookie clicker" は、開発を始めた当時、個人的に熱中していた名作クリッカーゲーム「cookie clicker」のように、読書ページ量や累計読書時間をどんどん積み重ねて増大させていくことに喜びを見出す補助ツールにしたいという思いから名付けました。',
    stack: [
      "React",
      "TypeScript",
      "Cloudflare Pages",
      "Cloudflare Workers",
      "Cloudflare R2",
    ],
  },
];

export const PortfolioRoot = () => {
  const [selectedTags, setSelectedTags] = useState({
    cd: false,
    comic: false,
    webApp: false,
    techblog: false,
  });
  const handleTagSelect = (tag: PortfolioTags) => {
    const newTags = { ...selectedTags };
    newTags[tag] = !newTags[tag];
    setSelectedTags(newTags);
    console.log(selectedTags);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tags = urlParams.get("tags");
    if (!tags) return;
    const tagsArray = tags.split(",");
    const newSelectedTags = { ...selectedTags };
    tagsArray.forEach((t) => {
      if (t in newSelectedTags) {
        newSelectedTags[t as PortfolioTags] = true;
      }
    });
    setSelectedTags(newSelectedTags);
  }, []);

  return (
    <main>
      <ul>
        {Object.keys(selectedTags).map((t) => (
          <li
            key={t}
            className={`${
              selectedTags[t as PortfolioTags]
                ? "text-black"
                : "text-neutral-300"
            }`}
            onClick={() => handleTagSelect(t as PortfolioTags)}
          >
            {t}
          </li>
        ))}
      </ul>
      <ul>
        {products
          .filter((p) => p.tags.some((t) => selectedTags[t]))
          .map((p) => (
            <PortfolioCard props={p} />
          ))}
      </ul>
    </main>
  );
};

const PortfolioCard = ({ props }: { props: PortfolioCardProps }) => {
  return (
    <li>
      <div>{props.title}</div>
      <div>{props.description}</div>
      <div>{props.additionalDescription}</div>
      <div>{props.motivation}</div>
      <div>{props.stack.join(", ")}</div>
    </li>
  );
};

