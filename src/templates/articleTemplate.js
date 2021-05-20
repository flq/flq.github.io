import React, { useMemo } from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Helmet from 'react-helmet'
import { MDXProvider } from '@mdx-js/react'
import Gist from 'react-gist'
import Layout from '../components/layout'
import Tags from '../components/Tag'
import { YouTubeEmbed } from '../components/YouTubeEmbed'
import { Tweet } from '../components/Tweet'
import { Info } from '../components/Info'
import DateDisplay from '../components/DateDisplay'
import { TopicToc } from '../components/TopicToc'
import { Alpha, Beta } from '../components/Discussion'
import * as styles from './articleTemplate.module.css'
import PreviousAndNext from '../components/PreviousAndNext'

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
  pageContext,
}) {
  const {
    mdx: { excerpt, body, frontmatter },
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
        meta={[
          { name: 'keywords', content: frontmatter.tags.join(', ') },
          { name: 'twitter:card', content: "summary" },
          { name: 'twitter:title', content: frontmatter.title },
          { name: 'twitter:site:id', content: "fquednau" },
          { name: 'twitter:description', content: excerpt },
          { name: 'twitter:image', content: "https://realfiction.net/icons/icon-72x72.png" },
        ]}
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
      </article>
      <PreviousAndNext 
          previous={previous && { slug: previous.fields.slug, title: previous.frontmatter.title }}
          next={next && { slug: next.fields.slug, title: next.frontmatter.title }} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query($title: String!) {
    mdx(frontmatter: { title: { eq: $title } }) {
      excerpt(pruneLength: 150)
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
