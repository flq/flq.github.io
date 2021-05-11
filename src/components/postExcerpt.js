import React from 'react'
import { Link } from 'gatsby'
import * as styles from './postExcerpt.module.css'

export default function PostExcerpt({ slug, title, date, excerpt }) {
  return (
    <article className={styles.article}>
      <h2 className={styles.header}>
        <Link to={slug}>{title}</Link>
      </h2>
      <time className={styles.date} datetime={date}>{date}</time>
      <p className={styles.excerpt}>{excerpt}</p>
    </article>
  )
}
