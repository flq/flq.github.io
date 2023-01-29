import { toString, } from 'mdast-util-to-string';

export function extractExcerptPlugin() {
    return function (tree, file) {
        const textOnPage = toString(tree);
        const truncatedText = truncateToNearestWord(textOnPage, 200);
        file.data.astro.frontmatter.excerpt = truncatedText;
    }
}

function truncateToNearestWord(str, num) {
    // Check if the string is shorter than the specified number of characters
    if (str.length <= num) {
        return str;
    }
    // Find the last index of a space within the specified number of characters
    let lastSpace = str.lastIndexOf(" ", num);
    // If no space is found, return the specified number of characters
    if (lastSpace === -1) {
        return str.substring(0, num);
    }
    // Otherwise, return the substring up to the nearest whole word
    return str.substring(0, lastSpace);
}  