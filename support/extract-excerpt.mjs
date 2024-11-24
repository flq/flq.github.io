import { toString, } from 'mdast-util-to-string';

export function extractExcerptPlugin() {
    return function (tree, file) {
        const textOnPage = toString(tree);
        const truncatedText = truncateToNearestWord(textOnPage, 200);
        file.data.astro.frontmatter.excerpt = truncatedText;
    }
}

function truncateToNearestWord(str, num) {
    if (str.length <= num) return str;
    
    let lastSpace = str.lastIndexOf(" ", num);
    return lastSpace === -1 ? str.substring(0, num) : str.substring(0, lastSpace) + "…";
}  