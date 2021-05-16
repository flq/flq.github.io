import React from 'react'
import * as styles from './Discussion.module.css'

export function Alpha({ children }) {
  return <p className={styles.alpha}>{children}</p>
}

export function Beta({ children }) {
  return <p className={styles.beta}>{children}</p>
}
