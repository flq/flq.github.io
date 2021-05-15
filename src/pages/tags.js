import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'
import * as styles from './tags.module.css'

const TagsPage = ({ data }) => {
  const edges = data.allMdx.edges
  const allTags = Object.keys(
    edges.reduce((agg, val) => {
      val.node.frontmatter.tags.forEach((tag) => (agg[tag] = ''))
      return agg
    }, {})
  ).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

  return (
    <Layout>
      <h1>All known tags</h1>
      <ul className={styles.columnList}>
        {allTags.map((tag) => (
          <li key={tag}>
            <Link to={`/tags/${tag}`}>{tag}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default TagsPage

export const pageQuery = graphql`
  query {
    allMdx {
      edges {
        node {
          frontmatter {
            tags
          }
        }
      }
    }
  }
`
