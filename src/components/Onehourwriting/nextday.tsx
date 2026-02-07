import React from "react";
import { Temporal } from "temporal-polyfill";
import theme from "../../data/onehourwriting/themes.json";

export const NextDay = () => {
  const today = Temporal.Now.plainDateISO();
  const nextSaturday = today.add({ days: (13 - today.dayOfWeek) % 7 });
  const date = `${nextSaturday.year}年${nextSaturday.month}月${nextSaturday.day}日`;
  const themeText = theme.themes.map((s) => "「" + s + "」").join("、");
  return (
    <div>
      <div>
        <h2>次回の開催情報</h2>
        <p>
          次回は {date} 土曜日の 22 時から開催します。 お題は{themeText}です。
        </p>
      </div>
    </div>
  );
};
