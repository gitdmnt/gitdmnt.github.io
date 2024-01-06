import React from "react";
import { RevoTime } from "./RevoTime.tsx";
import { RevoDate } from "./RevoDate.tsx";
import styles from "./RevoClock.module.css";

export const RevoClock = () => {
  const [[year, month_index, date, day], [year_roman, month_name, left_day]] = RevoDate();
  const [hour, minute, second] = RevoTime();
  return (
    <div className={styles.clock}>
      <p className={styles.date}>{month_index !== 12 ? date + " " + month_name + ", an " + year_roman : left_day}</p>
      <p className={styles.time}>{day.toString() + hour + minute + second}</p>
    </div>
  )
}

