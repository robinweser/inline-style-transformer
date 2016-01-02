import { toCSS, toObject, importantify } from '../lib/Transformer'
import { expect } from 'chai'

describe('Converting a style object to a CSS string', () => {
  it('should use dash case CSS properties', () => {
    expect(toCSS({flexDirection: 'row'})).to.eql('flex-direction:row')
  })
  it('should add semicolons between rules', () => {
    expect(toCSS({flexDirection: 'row', fontSize: '12px'})).to.eql('flex-direction:row;font-size:12px')
  })
  it('should resolve multiple values', () => {
    expect(toCSS({display: ['-webkit-flex', 'flex']})).to.eql('display:-webkit-flex;display:flex')
  })
  it('should add units to unitless values', () => {
    expect(toCSS({width: 10})).to.eql('width:10px')
  })
  it('should add a custom unit to unitless values', () => {
    expect(toCSS({width: 10}, 'em')).to.eql('width:10em')
  })
  it('should not add units if the value is 0', () => {
    expect(toCSS({width: 0})).to.eql('width:0')
  })
  it('should return an empty string if the object is empty', () => {
    expect(toCSS({})).to.eql('')
  })
  it('should return an empty string if styles is not an object', () => {
    expect(toCSS(12)).to.eql(false)
  })
  it('should transform multiple nested objects', () => {
    expect(toCSS({
      selector: {
        color: 'red'
      },
      selector2: {
        color: 'green'
      }
    })).to.eql('selector{color:red}selector2{color:green}')
  })
})

describe('Converting CSS strings to objects', () => {
  it('should use camel case', () => {
    expect(toObject('flex-direction:row')).to.eql({
      flexDirection: 'row'
    })
  })
  it('should parse numbers and floats', () => {
    expect(toObject('font-weight:500')).to.eql({
      fontWeight: 500
    })
  })
  it('should parse px values', () => {
    expect(toObject('width:50px')).to.eql({width: 50})
  })
  it('should resolve selectors', () => {
    expect(toObject('.class2 {color: red}.class3{color: green}')).to.eql({
      class2: {
        color: 'red'
      },
      class3: {
        color: 'green'
      }
    })
  })
})


describe('Adding important flags', () => {
  it('should add a flag if not set yet', () => {
    expect(importantify({flexDirection: 'row'})).to.eql({
      flexDirection: 'row!important'
    })
  })
  it('should do nothing if flag already exists', () => {
    expect(importantify({flexDirection: 'row!important'})).to.eql({
      flexDirection: 'row!important'
    })
  })
})
