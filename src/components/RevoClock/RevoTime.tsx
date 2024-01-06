import React from "react";
import { useState, useEffect } from "react";

export const RevoTime = () => {
  const d = new Date();
  const [now, setNow] = useState(d.getMilliseconds());
  const midnight = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  const rep_second_const = 864;
  function getTime() {
    const elapsed_time_gregorian_mili = now - midnight; //UTC+9
    const elapsed_time_rep = elapsed_time_gregorian_mili / rep_second_const;
    const hour = (Math.floor(elapsed_time_rep / 100 / 100).toString()).slice(-1);
    const minute = ("0" + (Math.floor(elapsed_time_rep / 100) % 100).toString()).slice(-2);
    const second = ("0" + (Math.floor(elapsed_time_rep) % 100).toString()).slice(-2);
    return [hour, minute, second];
  }
  const [time, setTime] = useState(getTime());

  useEffect(() => {
    setInterval(
      () => {
        const d = new Date();
        setNow(d.getMilliseconds());
        setTime(getTime());
      },
      rep_second_const
    )
  });

  return time;
};