import React, { useState } from "react";
import type { PortfolioCardProps } from "./types";
import { TAG_COLORS, STATUS_COLOR } from "./constants";
import { KaTeXText } from "./KaTeXText";

interface Props {
  props: PortfolioCardProps;
}

export const PortfolioCard: React.FC<Props> = ({ props }) => {
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
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-lg leading-tight group-hover:text-white/80 transition-colors">
              {props.title}
            </span>

            {/* 状態ラベル */}
            <span
              className={`text-white/80 text-xs rounded-full px-2.5 py-0.5 border ${STATUS_COLOR[props.status] || "border-white/15"}`}
            >
              {props.status}
            </span>
          </div>
          {props.period && (
            <span className="text-white/40 text-xs">{props.period}</span>
          )}
          <KaTeXText
            text={props.description}
            className="text-white/60 text-sm leading-snug"
          />
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
              <KaTeXText
                text={props.additionalDescription}
                className="text-white/80 text-sm leading-relaxed"
              />
            </div>
          )}
          {props.motivation && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
                動機
              </p>
              <KaTeXText
                text={props.motivation}
                className="text-white/80 text-sm leading-relaxed"
              />
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
