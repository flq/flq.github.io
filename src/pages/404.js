import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'

const NotFoundPage = () => (
  <Layout>
    <h1>NOT FOUND</h1>
    <p>
      I recently moved my content to a new site generator. I don't really have
      many visitors - some URLs have changed and I didn't bother setting up
      redirects, which is why you're here now. Below you find a list of my most
      visited content
    </p>
    <ul>
      <li>
        <Link to="/2009/11/26/use-32-and-64bit-oracle-client-in-parallel-on-windows-7-64-bit-for-e-g-net-apps">
          Use 32 and 64bit Oracle Client in parallel on Windows 7 64-bit for
          e.g. .NET Apps
        </Link>
      </li>
      <li>
        <Link to="/2007/12/02/applying-attributes-to-method-parameters">
          Applying Attributes to method parameters
        </Link>
      </li>
      <li>
        <Link to="/2010/04/17/a-http-file-server-in-130-lines-of-code">
          A HTTP file server in 130 lines of code
        </Link>
      </li>
      <li>
        <Link to="/2008/05/20/a-simple-way-to-start-your-code-in-a-different-appdomain">
          A simple way to start your code in a different AppDomain
        </Link>
      </li>
    </ul>
  </Layout>
)

export default NotFoundPage
