import { cssifyObject, importantifyObject } from '../lib/Transformer'
import { expect } from 'chai'

describe('Converting a style object to a CSS string', () => {
  it('should use dash case CSS properties', () => {
    expect(cssifyObject({flexDirection: 'row'})).to.eql('flex-direction:row')
  })
  it('should add semicolons between rules', () => {
    expect(cssifyObject({flexDirection: 'row', fontSize: '12px'})).to.eql('flex-direction:row;font-size:12px')
  })
  it('should resolve multiple values', () => {
    expect(cssifyObject({display: ['-webkit-flex', 'flex']})).to.eql('display:-webkit-flex;display:flex')
  })
  it('should add units to unitless values', () => {
    expect(cssifyObject({width: 10})).to.eql('width:10px')
  })
  it('should add a custom unit to unitless values', () => {
    expect(cssifyObject({width: 10}, 'em')).to.eql('width:10em')
  })
  it('should not add units if the value is 0', () => {
    expect(cssifyObject({width: 0})).to.eql('width:0')
  })
  it('should return an empty string if the object is empty', () => {
    expect(cssifyObject({})).to.eql('')
  })
  it('should return an empty string if styles is not an object', () => {
    expect(cssifyObject(12)).to.eql(false)
  })
})

describe('Adding important flags', () => {
  it('should add a flag if not set yet', () => {
    expect(importantifyObject({flexDirection: 'row'})).to.eql({
      flexDirection: 'row!important'
    })
  })
  it('should do nothing if flag already exists', () => {
    expect(importantifyObject({flexDirection: 'row!important'})).to.eql({
      flexDirection: 'row!important'
    })
  })
})
