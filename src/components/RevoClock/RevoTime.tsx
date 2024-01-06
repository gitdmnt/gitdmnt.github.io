import React from "react";
import { useState, useEffect } from "react";

export const RevoTime = () => {
  const [now, setNow] = useState(Date.now());
  const d = new Date();
  const midnight = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  const revo_second_const = 864;
  function getTime() {
    const elapsed_time_gregorian_mili = now + 9 * 60 * 60 * 1000 - midnight; //UTC+9
    const elapsed_time_revo = elapsed_time_gregorian_mili / revo_second_const;
    const hour = (Math.floor(elapsed_time_revo / 100 / 100).toString()).slice(-1);
    const minute = ("0" + (Math.floor(elapsed_time_revo / 100) % 100).toString()).slice(-2);
    const second = ("0" + (Math.floor(elapsed_time_revo) % 100).toString()).slice(-2);
    return [hour, minute, second];
  }
  const [time, setTime] = useState(getTime());

  useEffect(() => {
    setInterval(
      () => {
        setNow(Date.now());
        setTime(getTime());
      },
      revo_second_const
    )
  });

  return time;
};