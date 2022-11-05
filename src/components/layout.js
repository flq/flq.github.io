import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import useSiteTitle from './useSiteTitle'

import './normalize.css'
import './base.css'
import * as styles from './layout.module.css'

import SiteHeader from './SiteHeader'
import Footer from './Footer'

const Layout = ({ children }) => {
  const { title, description } = useSiteTitle()
  return (
    <>
      <Helmet
        title={title}
        meta={[
          {
            name: 'description',
            content: description,
          },
        ]}
      >
        <html lang="en" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="me" href="https://freiburg.social/@flq" />
        <link
          href="//fonts.googleapis.com/css?family=Raleway:400,300,600"
          rel="stylesheet"
        />
        <link
          href="//fonts.googleapis.com/css2?family=Lora:ital,wght@1,500&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className={styles.layout}>
        <SiteHeader />
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
