import React from 'react'
import Follow from './follow'

const Footer = () => (
  <>
    <div className="footer__twitter">
      <Follow />
      &nbsp;
    </div>

    <p className="footer__copyright">
      &copy; Frank Quednau {new Date().getFullYear()}
    </p>
  </>
)

export default Footer
