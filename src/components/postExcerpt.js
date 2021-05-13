import React from 'react'
import { Link } from 'gatsby'
import DateDisplay from "./DateDisplay"
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
