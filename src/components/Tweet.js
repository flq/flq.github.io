import React from 'react'

export function Tweet({ tweet }) {
    const theTweet = { __html: tweet }
    return (<div dangerouslySetInnerHTML={theTweet}></div>)
}