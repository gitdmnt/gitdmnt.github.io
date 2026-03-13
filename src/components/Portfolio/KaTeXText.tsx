import React, { useEffect, useRef } from "react";

// KaTeX auto-render script is loaded globally via CDN in pages/portfolio.astro
// This component wraps text content and triggers KaTeX rendering when mounted
// or when the text changes.

declare global {
  interface Window {
    renderMathInElement?: (element: Element, options?: any) => void;
  }
}

interface KaTeXTextProps {
  text: string;
  className?: string;
}

export const KaTeXText: React.FC<KaTeXTextProps> = ({ text, className }) => {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // We may mount before the KaTeX auto-render script has finished loading.
    // Keep retrying until the helper becomes available.
    const tryRender = () => {
      if (window.renderMathInElement) {
        window.renderMathInElement(el, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
          ],
        });
      } else {
        // try again shortly
        setTimeout(tryRender, 100);
      }
    };

    tryRender();
  }, [text]);

  // Render as plain text so that KaTeX can later replace delimiters.
  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  );
};
