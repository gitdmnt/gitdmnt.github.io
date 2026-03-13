export type PortfolioTags =
  | "CD"
  | "Comic"
  | "Web App"
  | "Tech Blog"
  | "Electron plugin"
  | "Native App"
  | "Backend App";

export interface PortfolioLink {
  label: string;
  url: string;
}

export interface PortfolioCardProps {
  tags: PortfolioTags[];
  title: string;
  description: string;
  additionalDescription: string;
  motivation: string;
  stack: string[];
  period: string;
  image: string;
  links: PortfolioLink[];
  /**
   * ツールや作品の状態を表す自由テキスト。例: 「運用中」「beta」「開発中」「絶版」「在庫あり」
   */
  status?: string;
}
