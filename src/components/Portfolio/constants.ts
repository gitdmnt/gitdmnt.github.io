import type { PortfolioTags } from "./types";

export const TAG_COLORS: Record<PortfolioTags, string> = {
  CD: "bg-purple-400/30 text-purple-100 border-purple-300/40",
  Comic: "bg-pink-400/30 text-pink-100 border-pink-300/40",
  "Web App": "bg-sky-400/30 text-sky-100 border-sky-300/40",
  "Tech Blog": "bg-emerald-400/30 text-emerald-100 border-emerald-300/40",
  "Electron plugin": "bg-yellow-400/30 text-yellow-100 border-yellow-300/40",
  "Native App": "bg-indigo-400/30 text-indigo-100 border-indigo-300/40",
  "Backend App": "bg-rose-400/30 text-rose-100 border-rose-300/40",
};

export const STATUS_COLOR: Record<string, string> = {
  運用中: "bg-green-400/30 text-green-100 border-green-300/40",
  beta: "bg-yellow-400/30 text-yellow-100 border-yellow-300/40",
  開発中: "bg-gray-400/30 text-gray-100 border-gray-300/40",
  絶版: "bg-red-400/30 text-red-100 border-red-300/40",
  在庫あり: "bg-green-400/30 text-green-100 border-green-300/40",
};
