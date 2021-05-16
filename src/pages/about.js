import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../components/layout'

export default function AboutPage() {
  return (
    <Layout>
      <Helmet
        title={'Frank L. Quednau'}
        meta={[
          { name: 'keywords', content: 'cv, info, overview, references' },
          {
            name: 'description',
            content:
              'Something about the person making this website. References, person-related links',
          },
        ]}
      />
      <article>
        <h1>Frank L. Quednau</h1>
        <p>Upcoming page about me.</p>
      </article>
    </Layout>
  )
}
