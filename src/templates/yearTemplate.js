import React, { useMemo } from 'react'
import { graphql, Link } from 'gatsby'
import format from 'date-fns/format'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import * as styles from './yearTemplate.module.css'

export default function Template({ data, pageContext }) {
  const { edges } = data.allMdx
  const { year } = pageContext
  const header = `Articles from the year «${year}»`

  const months = useMemo(() => {

    const groups = edges.reduce((agg, { node: { fields, frontmatter } }) => {
      const date = new Date(frontmatter.date);
      const month = format(date, 'LLLL');
      if (!agg[month]) agg[month] = [];
      agg[month].push({
        day: format(date, "dd"),
        title: frontmatter.title,
        slug: fields.slug,
        tags: frontmatter.tags
      })
      return agg;
    }, {});

    return groups;

  }, [edges]);

  return (
    <Layout>
      <Helmet title={header} />
      <h1>{header}</h1>
      <nav>
        <h2 className={styles.articleListHeader}>
          <Link to="/archive">&#8612; Archive</Link>
        </h2>
        {Object.keys(months).map(month => (<>
          <h2 className={styles.month}>{month}</h2>
          <ul class={styles.list}>
            {months[month].map(({ day, title, slug, tags }) => (
              <li key={day}>
                <span>{day}</span> <Link to={slug}>{title}</Link>
              </li>
            ))}
          </ul>
        </>))}
      </nav>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($yearStart: Date!, $yearEnd: Date!) {
    allMdx(
      filter: {frontmatter: {date: {gte: $yearStart, lte: $yearEnd}}}
      sort: { order: ASC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date
            tags
            title
          }
        }
      }
    }
  }
`
