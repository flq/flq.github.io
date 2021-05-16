import { Link } from 'gatsby'
import React from 'react'
import * as styles from './PreviousAndNext.module.css'

/**
 * Render previous and next links
 * @param {{previous?: { title: string, slug: string }, next?: { title: string, slug: string}}} props the props
 */
export default function PreviousAndNext({ previous, next }) {
  return (
    <nav className={styles.navigation}>
      {previous ? (
        <Link
          className={styles.linkPrevious}
          aria-describedby="previousTitle"
          to={previous.slug}
        >
          &lt;
        </Link>
      ) : (
        <span className={`${styles.linkPrevious} ${styles.disabled}`}>
          &lt;
        </span>
      )}
      {
        <span id="previousTitle" className={styles.title}>
          {previous ? previous.title : ''}
        </span>
      }
      {
        <span id="nextTitle" className={`${styles.title} ${styles.border}`}>
          {next ? next.title : ''}
        </span>
      }
      {next ? (
        <Link
          className={styles.linkNext}
          aria-describedby="nextTitle"
          to={next.slug}
        >
          &gt;
        </Link>
      ) : (
        <span className={`${styles.linkNext} ${styles.disabled}`}>&gt;</span>
      )}
    </nav>
  )
}
