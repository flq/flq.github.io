import React, { useRef, useEffect } from "react";

export function Gist({ id, file }) {
    const scriptTarget = useRef()
    useEffect(() => {
        if (!scriptTarget.current || scriptTarget.current.innerHTML) {
            return
        }

        const script = scriptTarget.current;
        const query = file ? new URLSearchParams({ file }) : "";

        import('postscribe').then(({ default: postscribe }) =>
            postscribe(
                script,
                `<script async cross-origin="anonymous" src="https://gist.github.com/flq/${id}.js${query ? "?" + query.toString() : ""}"></script>`
            )
        )
        return () => (script.innerHTML = '')
    }, [id, file])

    return <div ref={scriptTarget} />
}