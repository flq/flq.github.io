import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { useLocation } from '@reach/router'
import * as styles from './TopicToc.module.css'

export function TopicToc({ header, topicId }) {
  const location = useLocation()
  const {
    allMdx: { edges },
  } = useStaticQuery(graphql`
    query PagesWithTopic {
      allMdx(
        sort: { order: ASC, fields: [frontmatter___date] }
        filter: {
          fields: { published: { eq: true } }
          frontmatter: { topic: { ne: null } }
        }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              topic
              title
            }
          }
        }
      }
    }
  `)

  return (
    <nav className={styles.container}>
      <h3 className={styles.header}>{header}</h3>
      <ol className={styles.list}>
        {edges
          .filter((e) => e.node.frontmatter.topic === topicId)
          .map(({ node: { fields, frontmatter } }) => {
            return (
              <li key={fields.slug}>
                {location.pathname
                  .toLowerCase()
                  .startsWith(fields.slug.toLowerCase()) ? (
                  <span>{frontmatter.title}</span>
                ) : (
                  <a href={fields.slug}>{frontmatter.title}</a>
                )}
              </li>
            )
          })}
      </ol>
    </nav>
  )
}
