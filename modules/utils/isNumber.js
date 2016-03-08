import isUnitlessProperty from './isUnitlessProperty'

export default (property, value) => !isUnitlessProperty(property) && !isNaN(parseFloat(value)) && isFinite(value) && value !== 0
