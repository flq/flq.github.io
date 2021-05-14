import React from 'react'
import classnames from "classnames"
import { Link } from 'gatsby'
import * as styles from './Tag.module.css'

export default function Tags({ tags, className }) {
  return (
    <nav className={classnames(styles.tags, className)}>
      {tags.map((t) => (
        <Tag key={t} tag={t} />
      ))}
    </nav>
  )
}

function Tag({ tag }) {
  return (
    <div className={styles.tagOuter}>
      <Link className={styles.tag} to={`/tags/${tag}`}>
        {tag}
      </Link>
    </div>
  )
}
