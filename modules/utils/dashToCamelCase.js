/**
 * Converts a dash-case string to a camel-case string
 * @param {string} str - str that gets converted to camel-case
 */
export default str => str.replace(/-([a-z])/g, match => match[1].toUpperCase()).replace(/^Ms/g, 'ms')
