import React, { useEffect, useRef, useState } from "react";
import { repTime } from "./repTime.ts";
import { repDate } from "./repDate.ts";
import styles from "./RevoClock.module.css";

const RevoClock = () => {
  const [[[year, month_index, date, day], [year_roman, month_name, left_day]], setDate] = useState(repDate());
  const [[hour, minute, second], setTime] = useState(repTime());
  const callback = () => {
    setDate(repDate());
    setTime(repTime());
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