import React from 'react'
import { Link } from "gatsby"

const Sidebar = ({ title, description }) => (
  <div className="sidebar">
    <h1>
      <a href="/">{title}</a>
    </h1>
    <p>{description}</p>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/tags">Tags</Link>
    </nav>
  </div>
)

export default Sidebar
