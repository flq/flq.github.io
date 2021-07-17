import React from 'react'
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import * as styles from './Math.module.css'

export function Math({left, children}) {
    return <div className={left && styles.left}><BlockMath>{children}</BlockMath></div>
}