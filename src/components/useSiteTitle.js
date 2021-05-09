import { graphql, useStaticQuery } from 'gatsby'

export default function useSiteTitle() {
    const { site: { siteMetadata: { title, description } } } = useStaticQuery(graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `);
    return { title, description }
}