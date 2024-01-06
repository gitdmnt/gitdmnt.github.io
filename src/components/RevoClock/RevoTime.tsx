import React from "react";
import { useState, useEffect } from "react";

export const RevoTime = () => {
  const d = new Date();
  const [now, setNow] = useState(d.getHours() * 3600000 + d.getMinutes() * 60000 + d.getSeconds() * 1000 + d.getMilliseconds());
  const rep_second_const = 864;
  function getRepTime() {
    const elapsed_time_gregorian_mili = now;
    const elapsed_time_rep = elapsed_time_gregorian_mili / rep_second_const;
    const hour = (Math.floor(elapsed_time_rep / 100 / 100).toString()).slice(-1);
    const minute = ("0" + (Math.floor(elapsed_time_rep / 100) % 100).toString()).slice(-2);
    const second = ("0" + (Math.floor(elapsed_time_rep) % 100).toString()).slice(-2);
    return [hour, minute, second];
  }
  const [repTime, setRepTime] = useState(getRepTime());
  useEffect(() => {
    setInterval(
      () => {
        const d = new Date();
        setNow(d.getHours() * 3600000 + d.getMinutes() * 60000 + d.getSeconds() * 1000 + d.getMilliseconds());
        setRepTime(getRepTime());
      },
      rep_second_const
    )
  });

  return repTime;
};