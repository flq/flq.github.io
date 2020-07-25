import React from 'react'
import { graphql, Link } from 'gatsby'
import { Disqus } from 'gatsby-plugin-disqus'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import useSiteMetadata from '../hooks/useSiteMetadata'

export default function Template({
  location,
  data, // this prop will be injected by the GraphQL query below.
  pageContext,
}) {
  const { siteUrl } = useSiteMetadata();
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
          className="blog-post__content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <h2>Previous &amp; Next</h2>
        <div className="blog-post__pagination">
          {previous && (
            <a
              className="blog-post__pagination--previous"
              href={previous.fields.slug}
            >
              {previous.frontmatter.title}
            </a>
          )}
          {next && (
            <a className="blog-post__pagination--next" href={next.fields.slug}>
              {next.frontmatter.title}
            </a>
          )}
        </div>
        <h2>Comments</h2>
        <div className="blog-post__footer">
          <Disqus config={{ url: siteUrl + location.pathname, title: frontmatter.title }} />
        </div>
      </article>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($title: String!) {
    markdownRemark(frontmatter: { title: { eq: $title } }) {
      html
      fields {
        slug
      }
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        tags
      }
    }
  }
`
