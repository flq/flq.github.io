import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import './normalize.css'
import './skeleton.css'
import './syntax.css'
import './own.css'

import Sidebar from './sidebar'
import Footer from './footer'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            {
              name: 'description',
              content: data.site.siteMetadata.description,
            },
          ]}
        >
          <html lang="en" />
          <link
            href="//fonts.googleapis.com/css?family=Raleway:400,300,600"
            rel="stylesheet"
            type="text/css"
          />
        </Helmet>
        <div className="container">
          <div className="row">
            <div className="two columns right-padded">
              <Sidebar
                title={data.site.siteMetadata.title}
                description={data.site.siteMetadata.description}
              />
            </div>
            <div className="nine columns">{children}</div>
          </div>
          <div className="row">
            <Footer />
          </div>
        </div>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
