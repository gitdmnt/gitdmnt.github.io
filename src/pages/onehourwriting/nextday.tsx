import React from "react";
import { Temporal } from "temporal-polyfill";

export const NextDay = () => {
  const today = Temporal.Now.plainDateISO();
  const nextSaturday = today.add({ days: (13 - today.dayOfWeek) % 7 });
  const date = `${nextSaturday.year}年${nextSaturday.month}月${nextSaturday.day}日`;
  const theme = ["今週学んだこと", "去年の今週", "呪い(のろい/まじない)"]
    .map((s) => "「" + s + "」")
    .join("、");
  return (
    <div>
      <div>
        <h2>次回の開催情報</h2>
        <p>
          次回は {date} 土曜日の 22 時から開催します。 お題は{theme}です。
        </p>
      </div>
    </div>
  );
};

