import React from 'react'
import { graphql, Link } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/layout'

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
  pageContext,
}) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark
  const { previous, next } = pageContext
  return (
    <Layout>
      <Helmet
        title={frontmatter.title}
        meta={[{ name: 'keywords', content: frontmatter.tags.join(', ') }]}
      />

      <article>
        <h1>{frontmatter.title}</h1>
        <div className="page-info">
          <span>{frontmatter.date}</span> in
          <span className="article-tags">
            {frontmatter.tags.map(t => (
              <Link key={t} className="article-tags--tag" to={`/tags/${t}`}>
                {t}
              </Link>
            ))}
          </span>
        </div>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="article-pagination">
          {previous && (
            <a className="article-pagination--previous" href={previous.fields.slug}>
              {previous.frontmatter.title}
            </a>
          )}
          {next && (
            <a className="article-pagination--next" href={next.fields.slug}>
              {next.frontmatter.title}
            </a>
          )}
        </div>
      </article>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($title: String!) {
    markdownRemark(frontmatter: { title: { eq: $title } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        tags
      }
    }
  }
`
