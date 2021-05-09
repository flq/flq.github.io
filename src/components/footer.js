import React from 'react'
import Follow from './follow'
import * as styles from './footer.module.css'

const Footer = () => (
  <footer className={styles.footer}>
    <p className="footer__copyright">
      &copy; Frank Quednau {new Date().getFullYear()}
    </p>
    <Follow />
  </footer>
)

export default Footer
