import isUnitlessCSSProperty from 'unitless-css-property'

export default (property, value) => !isUnitlessCSSProperty(property) && !isNaN(parseFloat(value)) && isFinite(value) && value !== 0
