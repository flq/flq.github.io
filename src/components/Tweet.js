import React from 'react'
import * as styles from './Tweet.module.css'

export function Tweet({ tweet }) {
  const theTweet = { __html: tweet }
  return <div className={styles.tweet} dangerouslySetInnerHTML={theTweet}></div>
}
