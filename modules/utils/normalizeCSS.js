/**
* Removes every line-break and tab from a CSS string
* @param {string} CSS - CSS string that gets normalized
*/
export default CSS => CSS.replace(/(?:\r\n|\r|\n)|/g, '')
