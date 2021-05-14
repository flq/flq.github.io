import React, { useMemo } from 'react'
import { graphql } from 'gatsby'
import { Disqus } from 'gatsby-plugin-disqus'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Helmet from 'react-helmet'
import { MDXProvider } from '@mdx-js/react'
import Gist from 'react-gist'
import Layout from '../components/layout'
import useSiteMetadata from '../hooks/useSiteMetadata'
import Tags from '../components/Tag'
import { YouTubeEmbed } from '../components/YouTubeEmbed'
import { Tweet } from '../components/Tweet'
import { Info } from '../components/Info'
import DateDisplay from '../components/DateDisplay'
import { TopicToc } from '../components/TopicToc'
import { Alpha, Beta } from '../components/Discussion'
import * as styles from './articleTemplate.module.css'

export default function Template({
  location,
  data, // this prop will be injected by the GraphQL query below.
  pageContext,
}) {
  const { siteUrl } = useSiteMetadata()
  const {
    mdx: { body, frontmatter },
  } = data
  const { previous, next } = pageContext

  const components = useMemo(
    () => ({ YouTubeEmbed, Tweet, Info, TopicToc, Gist, Alpha, Beta }),
    []
  )

  return (
    <Layout>
      <Helmet
        title={frontmatter.title}
        meta={[{ name: 'keywords', content: frontmatter.tags.join(', ') }]}
      />

      <article>
        <header className={styles.header}>
          <DateDisplay className={styles.date} dateStr={frontmatter.date} />
          <h1 className={styles.h1}>{frontmatter.title}</h1>
          <Tags className={styles.tags} tags={frontmatter.tags} />
        </header>
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
          <Disqus
            config={{
              url: siteUrl + location.pathname,
              title: frontmatter.title,
            }}
          />
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
        date(formatString: "YYYY-MM-DD")
        path
        title
        tags
      }
    }
  }
`
