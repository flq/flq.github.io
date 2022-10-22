import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'
import * as styles from './archive.module.css'

const ArchivePage = ({ data }) => {
  const edges = data.allMdx.edges
  const allYears = edges.reduce((agg, val) => {
    const year = val.node.frontmatter.date;
    if (agg[year]) agg[year]++;
    else agg[year] = 1;
    return agg;
  }, {})


  return (
    <Layout>
      <h1>Archive</h1>
      <ul className={styles.list}>
        {Object.keys(allYears).sort((b, a) => a.toLowerCase().localeCompare(b.toLowerCase())).map((year) => (
          <li key={year}>
            <Link className={styles.year} to={`/years/${year}`}>
              <span>{year}</span>
              <span>({allYears[year]} posts)</span>
              </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default ArchivePage

export const pageQuery = graphql`
  query {
    allMdx {
      edges {
        node {
          frontmatter {
            date(formatString: "YYYY")
          }
        }
      }
    }
  }
`
