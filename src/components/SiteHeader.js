import React from 'react'
import { Link } from 'gatsby'
import useSiteTitle from './useSiteTitle'
import * as styles from './SiteHeader.module.css'

const SiteHeader = () => {
  const { title } = useSiteTitle()
  return (
    <nav className={styles.siteNav}>
      <div className={styles.main}>
        <h1 className={styles.siteHeader}>
          <a className={styles.mainLink} href="/">
            {title}
          </a>
        </h1>
        <div>
          <Link className={styles.siteLink} to="/tags">
            Tags
          </Link>
          <Link className={styles.siteLink} to="/about">
            About
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default SiteHeader
