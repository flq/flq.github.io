import React, { useEffect, useRef } from 'react'

/**
 * Uses https://emgithub.com and some trickery to make it play nice with react to embed files from github
 * @param {repo: string; file: string; branch?: string; user?: string; start?: number; end?: number} param0 
 */
export function GHEmbed({
  repo,
  file,
  branch = 'develop',
  user = 'flq',
  start,
  end,
}) {
  const scriptTarget = useRef()
  useEffect(() => {
    if (!scriptTarget.current || scriptTarget.current.innerHTML) {
      return
    }

    const script = scriptTarget.current
    const lines = start && end ? `#L${start}-L${end}` : ''

    // kindly lifted out of Eli Gundry's personal website code over here:
    // https://github.com/eligundry/eligundry.com/blob/main/next/components/Embeds/GitHubFile/index.tsx
    const query = new URLSearchParams({
      target: `https://github.com/${user}/${repo}/blob/${branch}/${file}${lines}`,
      style: 'night-owl',
      showBorder: 'on',
      showLineNumbers: 'on',
      showFileMeta: 'on',
      showCopy: 'on',
    })

    // emgithub uses document.write, which doesn't work well with React post
    // render. postscribe patches document.write to document.appendChild,
    // which makes it work with this effect.
    import('postscribe').then(({ default: postscribe }) =>
      postscribe(
        script,
        `<script async cross-origin="anonymous" src="https://emgithub.com/embed.js?${query.toString()}"></script>`
      )
    )
    return () => (script.innerHTML = '')
  }, [repo, file, branch, user])

  return <div ref={scriptTarget} />
}
