import { useState } from "react";

export const RevoTime = () => {
  const d = new Date();
  const now = d.getHours() * 3600000 + d.getMinutes() * 60000 + d.getSeconds() * 1000 + d.getMilliseconds();
  const rep_second_const = 864;
  const elapsed_time_gregorian_mili = now;
  const elapsed_time_rep = elapsed_time_gregorian_mili / rep_second_const;
  const hour = (Math.floor(elapsed_time_rep / 100 / 100).toString()).slice(-1);
  const minute = ("0" + (Math.floor(elapsed_time_rep / 100) % 100).toString()).slice(-2);
  const second = ("0" + (Math.floor(elapsed_time_rep) % 100).toString()).slice(-2);
  return [hour, minute, second];
};