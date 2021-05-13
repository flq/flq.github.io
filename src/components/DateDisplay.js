import React, { useMemo } from 'react'
import * as styles from './DateDisplay.module.css'

export default function DateDisplay({ dateStr }) {
    const [date, month, year] = useMemo(() => {
      const d = new Date(dateStr)
      return [
        d.getDate(),
        d.toLocaleString('en', { month: 'short' }),
        d.getFullYear(),
      ]
    }, [dateStr])
    return (
      <time className={styles.dateContainer} datetime={dateStr}>
        <span className={styles.month}>{month}</span>
        <span className={styles.date}>{date}</span>
        <span className={styles.year}>{year}</span>
      </time>
    )
  }