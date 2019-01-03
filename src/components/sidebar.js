import React from 'react'
import { Link } from 'gatsby'
import Follow from './follow';

const Sidebar = ({ title, description }) => (
  <div className="sidebar">
    <h1>
      <a className="sidebar__sitetitle" href="/">
        {title}
      </a>
    </h1>
    <p>{description}</p>
    <nav>
      <Link to="/tags">Tags</Link>
    </nav>
    <div className="sidebar__twitter">
      <Follow />
    </div>
  </div>
)

export default Sidebar
