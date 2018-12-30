import React from 'react'
import { graphql, Link } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/layout'

export default function Template({ data, pageContext }) {
  const { edges } = data.allMarkdownRemark
  const { tag } = pageContext
  const header = `Articles tagged «${tag}»`
  return (
    <Layout>
      <Helmet title={header} />
      <h1>{header}</h1>
      <h4><Link to="/tags">&#8612; All Tags</Link></h4>
      <ul>
        {edges.map(({ node }) => (
          <li key={node.fields.slug}>
            <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($tag: String!) {
    allMarkdownRemark(
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
