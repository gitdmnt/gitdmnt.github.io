import React, { useEffect, useRef, useState } from "react";
import { RevoTime } from "./RevoTime.ts";
import { RevoDate } from "./RevoDate.ts";
import styles from "./RevoClock.module.css";

const RevoClock = () => {
  const [[[year, month_index, date, day], [year_roman, month_name, left_day]], setDate] = useState(RevoDate());
  const [[hour, minute, second], setTime] = useState(RevoTime());
  const callback = () => {
    setDate(RevoDate());
    setTime(RevoTime());
  };

  const callbackRef = useRef<() => void>(callback);
  useEffect(() => {
    callbackRef.current = callback;
  })
  useEffect(() => {
    const id = setInterval(() => callbackRef.current(), 864)
    return () => clearInterval(id);
  }, [])

  return (
    <div className={styles.clock}>
      <p className={styles.date}>{month_index !== 12 ? date + " " + month_name + ", an " + year_roman : left_day}</p>
      <p className={styles.time}>{day.toString() + hour + minute + second}</p>
    </div>
  )
}

export default RevoClock;