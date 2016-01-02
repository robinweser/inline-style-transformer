import camelToDashCase from './utils/camelToDashCase'
import dashToCamelCase from './utils/dashToCamelCase'
import isUnitlessProperty from './utils/isUnitlessProperty'
import normalizeCSS from './utils/normalizeCSS'

/**
* Creates a valid CSS string out of an object of styles
* @param {Object} styles - an object with CSS styles
* @param {string} unit - unit that gets applied to number values
*/
const toCSS = (styles, unit = 'px') => {
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
      rules += camelToDashCase(property) + '{' + toCSS(value) + '}' // eslint-disable-line
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
}

/**
 * Generates a object with CSS key-value pairs out of a CSS string
 * @param {string} CSS - CSS string that gets objectified
 */
const toObject = (str) => {
  // early return false if no CSS string is provided
  if (!str || typeof str !== 'string') {
    return false
  }

  const CSS = normalizeCSS(str)

  const rules = {}
  // this checks if the string is made of selectors
  const selectors = CSS.match(/[.]?[a-z0-9 ]*{[^}]*}/g)

  if (selectors && selectors.length > 1) {
    selectors.forEach(rule => {
      // seperate selector (className) and its styles
      // then run the actual to Object transformation
      const className = rule.match(/[^{]*/)[0]
      const styles = rule.replace(className, '')

      rules[className] = toObject(styles.substr(1, styles.length - 2))
    })
  } else {
    // splitting the rules to single statements
    CSS.split(';').forEach(rule => {
      let [property, value] = rule.split(':')

      // dash-casing the property
      // trimming both to remove padding whitespace
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
  }
  return rules
}


/**
 * Adds an !important flag to every value
 * @param {Object} styles - an object with CSS styles
 */
const importantify = (styles) => {
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
}

export default {
  toCSS,
  toObject,
  importantify
}
