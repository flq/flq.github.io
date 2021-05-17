import React from 'react'
import * as styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.main}>
      <a
        rel="license noopener noreferrer"
        target="_new"
        href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
      >
        <img
          alt="Creative Commons License"
          src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png"
        />
      </a>
      <p>Frank Quednau {new Date().getFullYear()}</p>
    </footer>
  )
}
