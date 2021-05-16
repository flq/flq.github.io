import React from 'react'
import * as styles from './Footer.module.css'

const Footer = () => (
  <footer className={styles.footer}>
      &copy; Frank Quednau {new Date().getFullYear()}
  </footer>
)

export default Footer
