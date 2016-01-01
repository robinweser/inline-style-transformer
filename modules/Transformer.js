import camelToDashCase from './utils/camelToDashCase'
import isUnitlessProperty from './utils/isUnitlessProperty'

export default {
  /**
   * Creates a valid CSS string out of an object of styles
   * @param {Object} styles - an object with CSS styles
   * @param {boolean} importantFlag - adds an !important flag to the value
   */
  cssifyObject(styles, importantFlag) {
    // early return false if styles is not an object
    if (!styles || styles instanceof Object === false) {
      return false
    }

    let rules = ''
    Object.keys(styles).forEach(property => {
      let value = styles[property]
      if (value instanceof Object) {
        // prerender nested style objects
        rules += camelToDashCase(property) + '{' + cssifyObject(value, importantFlag) + '}'
      } else {
        if (rules !== '') {
          rules += ';'
        }

        // automatically adds units to CSS properties that are not unitless
        // but are provided as a plain number
        if (!isUnitlessProperty(property) && !isNaN(parseFloat(value)) && isFinite(value) && value !== 0) {
          value = value + 'px'
        }

        // add !important flag to achieve higher priority than inline styles
        if (importantFlag && value.toString().indexOf('!important') === -1) {
          value = value + '!important'
        }

        rules += camelToDashCase(property) + ':' + value
      }
    })

    return styles
  },

  objectifyCSS(CSS) {}
}
