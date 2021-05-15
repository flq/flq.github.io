import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import PostExcerpt from '../components/postExcerpt'

const IndexPage = ({ data }) => {
  const posts = data.allMdx.edges
  return (
    <Layout>
      {posts.map(({ node: { fields: { slug }, frontmatter: { date, title }, excerpt } }) => (
        <PostExcerpt key={slug} slug={slug} title={title} date={date} excerpt={excerpt} />
      ))}
    </Layout>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { published: { eq: true } } }
      limit: 10
    ) {
      edges {
        node {
          excerpt(pruneLength: 200)
          fields {
            slug
            published
          }
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            title
          }
        }
      }
    }
  }
`
