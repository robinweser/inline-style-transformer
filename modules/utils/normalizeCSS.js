/**
* Removes every line-break and tab from a CSS string
* @param {string} CSS - CSS string that gets normalized
*/
export default CSS => CSS.replace(/.[a-zA-z0-9 ]*{/g, match => match.substr(1, match.length - 1)).replace(/(?:\r\n|\r|\n|\t|  )|/g, '').replace(/ {/g, '{') // eslint-disable-line
