import React, { useEffect, useState } from "react";
import data from "./data.json";

import type { PortfolioTags, PortfolioCardProps, PortfolioLink } from "./types";
import { TAG_COLORS } from "./constants";
import { PortfolioCard } from "./PortfolioCard";
import { AddEntryForm } from "./AddEntryForm";

const products: PortfolioCardProps[] = data
  .map((item) => ({
    tags: item.tags as PortfolioTags[],
    title: item.title,
    description: item.description,
    additionalDescription: item.additionalDescription,
    motivation: item.motivation,
    stack: item.stack,
    period: item.period ?? "",
    image: item.image ?? "",
    links: (item.links ?? []) as PortfolioLink[],
    status: item.status ?? "",
  }))
  .sort((a, b) => a.period.localeCompare(b.period));

export const PortfolioRoot: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<
    Record<PortfolioTags, boolean>
  >({
    CD: false,
    Comic: false,
    "Web App": false,
    "Tech Blog": false,
    "Electron plugin": false,
    "Native App": false,
    "Backend App": false,
  });

  const handleTagSelect = (tag: PortfolioTags) => {
    setSelectedTags((prev) => ({ ...prev, [tag]: !prev[tag] }));
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tags = urlParams.get("tags");
    if (!tags) return;
    const tagsArray = tags.split(",");
    setSelectedTags((prev) => {
      const next = { ...prev };
      tagsArray.forEach((t) => {
        if (t in next) next[t as PortfolioTags] = true;
      });
      return next;
    });
  }, []);

  const anySelected = Object.values(selectedTags).some(Boolean);
  const filtered = anySelected
    ? products.filter((p) => p.tags.some((t) => selectedTags[t]))
    : products;

  return (
    <main
      className="min-h-screen px-4 py-12"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)",
      }}
    >
      {/* ページタイトル */}
      <div className="max-w-3xl mx-auto mb-10">
        <h1
          className="text-4xl font-bold text-white mb-2 tracking-wide"
          style={{ textShadow: "0 2px 16px rgba(120,80,255,0.4)" }}
        >
          Portfolio
        </h1>
        <p className="text-white/50 text-sm">作ったものたち</p>
      </div>

      {/* タグフィルター */}
      <div className="max-w-3xl mx-auto mb-8">
        <div
          className="flex flex-wrap gap-3 p-4 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
          }}
        >
          {(Object.keys(selectedTags) as PortfolioTags[]).map((t) => (
            <button
              key={t}
              onClick={() => handleTagSelect(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
                selectedTags[t]
                  ? TAG_COLORS[t] + " shadow-lg scale-105"
                  : "bg-white/5 text-white/40 border-white/15 hover:bg-white/10 hover:text-white/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* カード一覧 */}
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {filtered.map((p) => (
          <PortfolioCard key={p.title} props={p} />
        ))}
        {anySelected && filtered.length === 0 && (
          <p className="text-white/40 text-center py-12">
            該当するプロダクトがありません
          </p>
        )}
      </div>

      {/* データ入力フォーム */}
      <div className="max-w-3xl mx-auto mt-16">
        <AddEntryForm allTags={Object.keys(selectedTags) as PortfolioTags[]} />
      </div>
    </main>
  );
};
