import React from 'react'
import { Link } from 'gatsby'
import * as styles from './Tag.module.css'

export default function Tag({ tag }) {
  return (
    <div className={styles.tagOuter}>
      <Link className={styles.tag} to={`/tags/${tag}`}>
        {tag}
      </Link>
    </div>
  )
}
