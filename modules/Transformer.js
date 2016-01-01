import camelToDashCase from './utils/camelToDashCase'
import dashToCamelCase from './utils/dashToCamelCase'
import isUnitlessProperty from './utils/isUnitlessProperty'
import normalizeCSS from './utils/normalizeCSS'

export default {
  /**
   * Creates a valid CSS string out of an object of styles
   * @param {Object} styles - an object with CSS styles
   * @param {string} unit - unit that gets applied to number values
   */
  toCSS(styles, unit = 'px') {
    // early return false if styles is not an object
    if (!styles || styles instanceof Object === false) {
      return false
    }

    let rules = ''

    Object.keys(styles).forEach(property => {
      let value = styles[property]
      // resolve multi values passed as an array
      if (value instanceof Array) {
        value = value.join(';' + property + ':')
      }
      if (value instanceof Object) {
        // prerender nested style objects
        rules += camelToDashCase(property) + '{' + cssifyObject(value) + '}' // eslint-disable-line
      } else {
        if (rules !== '') {
          rules += ';'
        }

        // automatically adds units to CSS properties that are not unitless
        // but are provided as a plain number
        if (!isUnitlessProperty(property) && !isNaN(parseFloat(value)) && isFinite(value) && value !== 0) {
          value = value + unit
        }

        rules += camelToDashCase(property) + ':' + value
      }
    })

    return rules
  },

  /**
   * Adds an !important flag to every value
   * @param {Object} styles - an object with CSS styles
   */
  importantify(styles) {
    // early return false if styles is not an object
    if (!styles || styles instanceof Object === false) {
      return false
    }

    Object.keys(styles).forEach(property => {
      const value = styles[property]
      // add !important flag to achieve higher priority than inline styles
      if (value.toString().indexOf('!important') === -1) {
        styles[property] = value + '!important'
      }
    })

    return styles
  },

  /**
   * Generates a object with CSS key-value pairs out of a CSS string
   * @param {string} CSS - CSS string that gets objectified
   */
  toObject(CSS) {
    // early return false if no CSS string is provided
    if (!CSS || typeof CSS !== 'string') {
      return false
    }

    const rules = {}

    normalizeCSS(CSS).split(';').forEach(rule => {
      let [property, value] = rule.split(':')

      property = dashToCamelCase(property.trim())
      value = value.trim()

      if (value) {
        // convert number strings to real numbers if possible
        // Improves usability and developer experience
        const numberValue = parseFloat(value)
        if (numberValue == value || numberValue == value.replace('px', '')) { // eslint-disable-line
          value = numberValue
        }

        // mutiple values / fallback values get added to an array
        // order stays the same
        if (rules.hasOwnProperty(property)) {
          let priorValue = rules[property]
          // arrayify prior value
          if (priorValue instanceof Array !== true) {
            priorValue = [priorValue]
          }

          // add the new value and assign the array
          priorValue.push(value)
          value = priorValue
        }

        rules[property] = value
      }
    })

    return rules
  }
}
