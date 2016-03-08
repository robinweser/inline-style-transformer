// Taken directly from React core
// https://github.com/facebook/react/blob/master/src/renderers/dom/shared/CSSProperty.js
const unitlessProperties = {
  animationIterationCount: true,
  borderImageOutset: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridColumn: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  stopOpacity: true,
  strokeDashoffset: true,
  strokeOpacity: true,
  strokeWidth: true
}

const prefixes = [ 'Webkit', 'ms', 'Moz', 'O' ]
const getPrefixedKey = (prefix, key) => prefix + key.charAt(0).toUpperCase() + key.slice(1)

// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.
Object.keys(unitlessProperties).forEach(property => prefixes.forEach(prefix => unitlessProperties[getPrefixedKey(prefix, property)] = true))

export default property => unitlessProperties[property] ? true : false
