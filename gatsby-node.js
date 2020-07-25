const path = require('path')
const format = require('date-fns/format')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  const articleTemplate = path.resolve('src/templates/articleTemplate.js')
  const tagTemplate = path.resolve('src/templates/tagTemplate.js')

  return graphql(`
    {
      allMdx(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: { fields: { published:{eq:true} } }
        limit: 1000
      ) {
        edges {
          node {
            fields {
              slug
              published
            }
            frontmatter {
              title
              tags
              date(formatString: "YYYY/MM/DD")
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const { edges } = result.data.allMdx

    // Content pages
    edges.forEach(({ node }, index) => {
      const previous = index === edges.length - 1 ? null : edges[index + 1].node
      const next = index === 0 ? null : edges[index - 1].node
      createPage({
        path: node.fields.slug,
        component: articleTemplate,
        context: {
          title: node.frontmatter.title,
          previous,
          next,
        }, // additional data can be passed via context
      })
    })

    // Tag pages
    const allTags = edges.reduce((agg, val) => {
      val.node.frontmatter.tags.forEach(tag => (agg[tag] = ''))
      return agg
    }, {})

    Object.keys(allTags).forEach(tag => {
      createPage({
        path: `tags/${tag}`,
        component: tagTemplate,
        context: {
          tag,
        },
      })
    })
  })
}

const prod = process.env.NODE_ENV === 'production'

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = `/${slugifyDate(node.frontmatter.date)}/${slugify(
      node.frontmatter.title
    )}`
    createNodeField({
      name: 'slug',
      node,
      value,
    })
    createNodeField({
      name: 'published',
      node,
      value: prod
        ? node.frontmatter.published !== undefined
          ? node.frontmatter.published
          : true
        : true,
    })
  }
}

/**
 * Replaces funny chars with - to create the slug from the title
 * @param {string} value
 */
function slugify(value) {
  return value
    .replace(/[\'’"“”]/g, '') // Things replaced with nothing
    .replace(/[ ?<>*=!,'\'':\/\(\)\+\.\[\]&#]/g, '-') // Things replaced with -
    .replace(/-{2,}/g, '-') // Consecutive - replaced with one -
    .replace(/-$/, '') // trailing -
    .toLowerCase()
}

/**
 * Slugifies the date
 * @param {string} value
 */
function slugifyDate(value) {
  return format(value, 'YYYY/MM/DD')
}
