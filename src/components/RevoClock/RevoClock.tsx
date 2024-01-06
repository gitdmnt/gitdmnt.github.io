import React from "react";
import { RevoTime } from "./RevoTime.tsx";
import styles from "./RevoClock.module.css";

const RevoClock = () => {
  const time = RevoTime();
  return (
    <div className={styles.clock}>
      <div className={styles.date}>
      </div>
      <div className={styles.time}>
        <p className={styles.day}>&nbsp;</p>
        <p className={styles.hour}>{time[0]}</p>
        <p className={styles.minute}>{time[1]}</p>
        <p className={styles.second}>{time[2]}</p>
      </div>
    </div>
  )
}

export default RevoClock;