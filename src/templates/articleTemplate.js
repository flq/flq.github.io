import React, { useMemo } from 'react'
import { graphql, Link } from 'gatsby'
import { Disqus } from 'gatsby-plugin-disqus'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { MDXProvider } from "@mdx-js/react"
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import useSiteMetadata from '../hooks/useSiteMetadata'
import { YouTubeEmbed } from '../components/YouTubeEmbed'

export default function Template({
  location,
  data, // this prop will be injected by the GraphQL query below.
  pageContext,
}) {
  const { siteUrl } = useSiteMetadata();
  const { mdx: { body, frontmatter } } = data
  const { previous, next } = pageContext

  const components = useMemo(()=> ({YouTubeEmbed}), [])

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
        <MDXProvider components={components}>
          <MDXRenderer className="blog-post__content">{body}</MDXRenderer>
        </MDXProvider>
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
    mdx(frontmatter: { title: { eq: $title } }) {
      body
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
