import React from 'react'
import { graphql, Link } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import * as styles from './tagTemplate.module.css'

export default function Template({ data, pageContext }) {
  const { edges } = data.allMdx
  const { tag } = pageContext
  const header = `Articles tagged «${tag}»`
  return (
    <Layout>
      <Helmet title={header} />
      <h1>{header}</h1>
      <nav>
        <h2 className={styles.articleListHeader}>
          <Link to="/tags">&#8612; All Tags</Link>
        </h2>
        <ul class={styles.articleList}>
          {edges.map(({ node }) => (
            <li key={node.fields.slug}>
              <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($tag: String!) {
    allMdx(
      filter: { frontmatter: { tags: { in: [$tag] } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
