import React, { useMemo } from 'react'
import { Link } from 'gatsby'
import * as styles from './postExcerpt.module.css'

export default function PostExcerpt({ slug, title, date, excerpt }) {
  return (
    <article className={styles.article}>
      <header className={styles.headerContainer}>
        <DateDisplay dateStr={date} />
        <h2 className={styles.header}>
          <Link to={slug}>{title}</Link>
        </h2>
      </header>
      <p className={styles.excerpt}>{excerpt}</p>
    </article>
  )
}

function DateDisplay({ dateStr }) {
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
