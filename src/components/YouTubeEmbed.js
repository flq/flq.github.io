import React from 'react'

export function YouTubeEmbed({ link }) {
    return (<iframe 
        title={`Youtube embed for ${link}`}
        width="560" 
        height="315" 
        src={link} 
        frameborder="0" 
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen></iframe>)
}