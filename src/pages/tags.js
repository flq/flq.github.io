import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'

const TagsPage = ({ data }) => {
  const edges = data.allMdx.edges
  const allTags = Object.keys(
    edges.reduce((agg, val) => {
      val.node.frontmatter.tags.forEach(tag => (agg[tag] = ''))
      return agg
    }, {})
  ).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  const split = Math.floor(allTags.length / 2)

  return (
    <Layout>
      <h1>All known tags</h1>
      <div className="container">
        <div className="row">
          <div className="six columns">
            <TagBlock tags={allTags.slice(0,split)} />
          </div>
          <div className="six columns">
            <TagBlock tags={allTags.slice(split)} />
          </div>
        </div>
      </div>
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
  }`

function TagBlock({ tags }) {
  return (
    <ul>
      {tags.map(tag => (
        <li key={tag}>
          <Link to={`/tags/${tag}`}>{tag}</Link>
        </li>
      ))}
    </ul>
  )
}
