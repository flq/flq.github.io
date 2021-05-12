import React from 'react'
import * as styles from "./YouTubeEmbed.module.css"

export function YouTubeEmbed({ link }) {
    return (<iframe 
        title={`Youtube embed for ${link}`}
        className={styles.frame}
        src={link} 
        frameborder="0" 
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen></iframe>)
}