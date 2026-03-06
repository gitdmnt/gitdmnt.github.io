import React, { useEffect, useState } from "react";
import data from "./data.json";

type PortfolioTags = "CD" | "Comic" | "Web App" | "Tech Blog";

interface PortfolioLink {
  label: string;
  url: string;
}

interface PortfolioCardProps {
  tags: PortfolioTags[];
  title: string;
  description: string;
  additionalDescription: string;
  motivation: string;
  stack: string[];
  period: string;
  image: string;
  links: PortfolioLink[];
}

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
  }))
  .sort((a, b) => b.period.localeCompare(a.period));

const TAG_COLORS: Record<PortfolioTags, string> = {
  CD: "bg-purple-400/30 text-purple-100 border-purple-300/40",
  Comic: "bg-pink-400/30 text-pink-100 border-pink-300/40",
  "Web App": "bg-sky-400/30 text-sky-100 border-sky-300/40",
  "Tech Blog": "bg-emerald-400/30 text-emerald-100 border-emerald-300/40",
};

export const PortfolioRoot = () => {
  const [selectedTags, setSelectedTags] = useState<
    Record<PortfolioTags, boolean>
  >({
    CD: false,
    Comic: false,
    "Web App": false,
    "Tech Blog": false,
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

const PortfolioCard = ({ props }: { props: PortfolioCardProps }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: open
          ? "0 8px 40px rgba(0,0,0,0.35)"
          : "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      {/* ヘッダー（クリックで折り畳み） */}
      <button
        className="w-full flex items-center justify-between px-6 py-5 gap-4 cursor-pointer group"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex flex-col items-start gap-2 text-left">
          <span className="text-white font-semibold text-lg leading-tight group-hover:text-white/80 transition-colors">
            {props.title}
          </span>
          {props.period && (
            <span className="text-white/40 text-xs">{props.period}</span>
          )}
          <span className="text-white/60 text-sm leading-snug">
            {props.description}
          </span>
          <div className="flex flex-wrap gap-2 mt-1">
            {props.tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs px-2.5 py-0.5 rounded-full border ${TAG_COLORS[tag]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* 展開アイコン */}
        <span
          className="shrink-0 text-white/50 group-hover:text-white/80 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* 折り畳みコンテンツ */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "800px" : "0px", opacity: open ? 1 : 0 }}
      >
        <div
          className="px-6 pb-6 flex flex-col gap-4"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "1.25rem",
          }}
        >
          {/* サムネイル画像 */}
          {props.image && (
            <div className="rounded-xl overflow-hidden">
              <img
                src={props.image}
                alt={props.title}
                className="w-full object-cover max-h-64"
              />
            </div>
          )}
          {props.additionalDescription && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
                詳細
              </p>
              <p className="text-white/80 text-sm leading-relaxed">
                {props.additionalDescription}
              </p>
            </div>
          )}
          {props.motivation && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
                動機
              </p>
              <p className="text-white/80 text-sm leading-relaxed">
                {props.motivation}
              </p>
            </div>
          )}
          {props.stack.length > 0 && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {props.stack.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/70 border border-white/15"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* リンク */}
          {props.links.length > 0 && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">
                Links
              </p>
              <div className="flex flex-wrap gap-2">
                {props.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/10 text-white/80 border border-white/15 hover:bg-white/20 hover:text-white transition-all duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────
   Add New Entry — JSON ジェネレーター
─────────────────────────────────────────── */
const EMPTY_LINK = { label: "", url: "" };

const AddEntryForm = ({ allTags }: { allTags: PortfolioTags[] }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("");
  const [description, setDescription] = useState("");
  const [additionalDescription, setAdditionalDescription] = useState("");
  const [motivation, setMotivation] = useState("");
  const [image, setImage] = useState("");
  const [stack, setStack] = useState("");
  const [tags, setTags] = useState<Record<PortfolioTags, boolean>>(
    Object.fromEntries(allTags.map((t) => [t, false])) as Record<
      PortfolioTags,
      boolean
    >,
  );
  const [links, setLinks] = useState<{ label: string; url: string }[]>([
    { ...EMPTY_LINK },
  ]);

  const generated = JSON.stringify(
    {
      tags: allTags.filter((t) => tags[t]),
      title,
      period,
      description,
      additionalDescription,
      motivation,
      image,
      stack: stack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      links: links.filter((l) => l.label || l.url),
    },
    null,
    2,
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const updateLink = (i: number, key: "label" | "url", value: string) => {
    setLinks((prev) =>
      prev.map((l, idx) => (idx === i ? { ...l, [key]: value } : l)),
    );
  };

  const inputCls =
    "w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors";
  const labelCls = "block text-xs text-white/40 uppercase tracking-widest mb-1";

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      }}
    >
      {/* ヘッダー */}
      <button
        className="w-full flex items-center justify-between px-6 py-5 gap-4 cursor-pointer group"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-7 h-7 rounded-full border border-white/20 bg-white/5 text-white/50 group-hover:text-white/80 transition-colors"
            style={{ fontSize: "1.1rem", lineHeight: 1 }}
          >
            +
          </span>
          <div className="text-left">
            <p className="text-white/80 font-medium text-sm group-hover:text-white transition-colors">
              Add New Entry
            </p>
            <p className="text-white/30 text-xs">
              フォームを入力してJSONを生成
            </p>
          </div>
        </div>
        <span
          className="shrink-0 text-white/30 group-hover:text-white/60 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* フォーム本体 */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "3000px" : "0px", opacity: open ? 1 : 0 }}
      >
        <div
          className="px-6 pb-6 flex flex-col gap-5"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "1.25rem",
          }}
        >
          {/* タイトル・製作時期 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input
                className={inputCls}
                placeholder="プロジェクト名"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Period</label>
              <input
                className={inputCls}
                placeholder="2025年"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </div>
          </div>

          {/* タグ */}
          <div>
            <label className={labelCls}>Tags</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() =>
                    setTags((prev) => ({ ...prev, [t]: !prev[t] }))
                  }
                  className={`px-3 py-1 rounded-full text-xs border transition-all duration-200 cursor-pointer ${
                    tags[t]
                      ? TAG_COLORS[t] + " scale-105"
                      : "bg-white/5 text-white/40 border-white/15 hover:bg-white/10"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 概要 */}
          <div>
            <label className={labelCls}>Description</label>
            <input
              className={inputCls}
              placeholder="一行説明"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* 詳細 */}
          <div>
            <label className={labelCls}>Additional Description</label>
            <textarea
              className={inputCls + " min-h-20 resize-y"}
              placeholder="詳細説明"
              value={additionalDescription}
              onChange={(e) => setAdditionalDescription(e.target.value)}
            />
          </div>

          {/* 動機 */}
          <div>
            <label className={labelCls}>Motivation</label>
            <textarea
              className={inputCls + " min-h-20 resize-y"}
              placeholder="制作動機"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
            />
          </div>

          {/* 画像URL */}
          <div>
            <label className={labelCls}>Image URL</label>
            <input
              className={inputCls}
              placeholder="/thumbnail/xxx.png"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className={labelCls}>Tech Stack（カンマ区切り）</label>
            <input
              className={inputCls}
              placeholder="React, TypeScript, ..."
              value={stack}
              onChange={(e) => setStack(e.target.value)}
            />
          </div>

          {/* リンク */}
          <div>
            <label className={labelCls}>Links</label>
            <div className="flex flex-col gap-2">
              {links.map((link, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    className={inputCls + " w-28 shrink-0"}
                    placeholder="GitHub"
                    value={link.label}
                    onChange={(e) => updateLink(i, "label", e.target.value)}
                  />
                  <input
                    className={inputCls + " flex-1"}
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => updateLink(i, "url", e.target.value)}
                  />
                  <button
                    type="button"
                    className="shrink-0 text-white/30 hover:text-white/70 transition-colors text-lg leading-none cursor-pointer"
                    onClick={() =>
                      setLinks((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    aria-label="削除"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="self-start text-xs text-white/40 hover:text-white/70 border border-white/15 hover:border-white/30 px-3 py-1 rounded-full transition-all cursor-pointer"
                onClick={() => setLinks((prev) => [...prev, { ...EMPTY_LINK }])}
              >
                + リンクを追加
              </button>
            </div>
          </div>

          {/* JSON 出力 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelCls + " mb-0"}>Generated JSON</label>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre
              className="rounded-xl p-4 text-xs text-emerald-300 overflow-x-auto"
              style={{
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "Menlo, Monaco, 'Courier New', monospace",
              }}
            >
              {generated}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

