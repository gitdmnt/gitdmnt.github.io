import React from "react";
import { useState, useEffect } from "react";

export const RevoDate = () => {
  const [date, setDate] = useState(["", "", ""]);
  useEffect(() => {
    setInterval(
      () => {
        const today = new Date();
        const g_year = today.getFullYear();
        const g_month = today.getMonth();
        const g_date = today.getDate();
        const is_leap = g_year % 4 === 0 && (g_year % 100 !== 0 || g_year % 400 === 0) ? true : false;
        const g_day_from_new_year = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31].slice(0, g_month).reduce((sum, e) => sum + e, 0) + g_date + (is_leap ? 1 : 0);
        const r_year = g_year - 1722 + ((g_month >= 8 && g_date >= 22) || (g_month > 8) ? 1 : 0); // 1722年9月22日が1年1月1日
        const r_month = Math.floor(g_day_from_new_year)
      },
      864
    )
  })
}

