import React from 'react'
import * as styles from './Info.module.css'

export function Info({ children }) {
  return (
    <aside className={styles.infoContainer}>
      <div className={styles.info}>{children}</div>
    </aside>
  )
}
