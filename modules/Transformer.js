import camelToDashCase from './utils/camelToDashCase'
import dashToCamelCase from './utils/dashToCamelCase'
import isNumber from './utils/isNumber'

/**
* Creates a valid CSS string out of an object of styles
* @param {Object} styles - an object with CSS styles
* @param {string} unit - unit that gets applied to number values
*/
export function toCSS(styles, options = { }) {
  const unit = options.unit || 'px'
  const ruleSeparator = options.ruleSeparator || ''
  const selectorSeparator = options.selectorSeparator || ''
  const indent = options.indent || ''

  return Object.keys(styles).reduce((rules, property) => {
    let value = styles[property]
    // resolve multi values passed as an array
    if (value instanceof Array) {
      value = value.join(';' + property + ':' + ruleSeparator + indent)
    }
    if (value instanceof Object) {
      // prerender nested style objects
      rules += camelToDashCase(property) + '{' + selectorSeparator + toCSS(value, options) + selectorSeparator + '}' + selectorSeparator // eslint-disable-line
    } else {
      // add an semicolon at the end of each rule (if not the last one)
      if (rules !== '') {
        rules += ';' + ruleSeparator
      }
      // automatically adds units to CSS properties that are not unitless
      // but are provided as a plain number
      if (isNumber(property, value)) {
        value = value + unit
      }

      rules += indent + camelToDashCase(property) + ':' + value
    }
    return rules
  }, '')
}

/**
 * Generates a object with CSS key-value pairs out of a CSS string
 * @param {string} CSS - CSS string that gets objectified
 */
export function toObject(CSS, options = { }) {
  const replacer = options.replacer || { '.': '' }

  // this checks if the string is made of selectors
  const replacePrefixes = Object.keys(replacer)
  const replacerRegExp = replacePrefixes.map(prefix => '[' + prefix + ']').join('|')
  const selectors = CSS.match(new RegExp('(' + replacerRegExp + ')?[a-z0-9-_:\(\) ]*{[^}]*}', 'g'))

  // Resolve nested CSS selector strings
  if (selectors && selectors.length > 0) {
    return selectors.reduce((rules, rule) => {
      // seperate selector (className) and its styles
      // replace selector prefixes according the replacer settings
      const selector = rule.match(/[^{]*/)[0]
      const styles = rule.replace(selector, '')

      const className = replacePrefixes.reduce((transformedClassName, prefix) => {
        if (transformedClassName.indexOf(prefix) === 0) {
          transformedClassName = transformedClassName.replace(prefix, replacer[prefix])
        }
        return transformedClassName
      }, selector.trim())

      // recursive objectify on pure styles string (without wrapping brackets)
      rules[className] = toObject(styles.replace(new RegExp('{|}', 'g'), ''))
      return rules
    }, { })
  }

  // splitting the rules to single statements
  return CSS.split(';').reduce((rules, rule) => {
    let [ property, value ] = rule.split(':')

    // trimming both to remove padding whitespace
    value = value.trim()

    if (value) {
      // convert number strings to real numbers if possible
      // Improves usability and developer experience
      const numberValue = parseFloat(value)
      if (numberValue == value || numberValue == value.replace('px', '')) { // eslint-disable-line
        value = numberValue
      }

      // dash-casing the property
      property = dashToCamelCase(property.trim())

      // mutiple values / fallback values get added to an array
      // while the order stays the exact same order
      if (rules.hasOwnProperty(property)) {
        value = [ rules[property] ].concat(value)
      }
      rules[property] = value
    }
    return rules
  }, { })
}

const setDotProp = (obj, path, value) => {
  const props = path.split('.')
  const majorPseudo = props.pop()

  const newObj = props.reduce((output, property) => {
    // add selector if not already existing
    if (!output[property]) {
      output[property] = { }
    }

    return output[property]
  }, obj)

  newObj[majorPseudo] = value
}

/**
 * Nests pseudo selectors into their reference selector
 * @param {Object} styles - an object with styles
 */
export function nestPseudoClasses(styles) {
  Object.keys(styles).forEach(selector => {
    if (selector.indexOf(':') > -1) {
      const [ sel, ...pseudo ] = selector.split(':')
      // add selector if not already existing
      if (!styles[sel]) {
        styles[sel] = { }
      }

      setDotProp(styles[sel], ':' + pseudo.join('.:'), styles[selector])

      // add pseudo to selector object
      delete styles[selector]
    }
  })

  return styles
}

/**
 * Adds an !important flag to every value
 * @param {Object} styles - an object with styles
 */
export function importantify(styles) {
  Object.keys(styles).forEach(property => {
    const value = styles[property]
    // add !important flag to achieve higher priority than inline styles
    if (value.toString().indexOf('!important') === -1) {
      styles[property] = value + '!important'
    }
  })

  return styles
}
