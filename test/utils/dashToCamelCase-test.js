import dashToCamelCase from '../../lib/utils/dashToCamelCase'
import { expect } from 'chai'

describe('Converting camel case to dash case', () => {
  it('should work as expected', () => {
    expect(dashToCamelCase('font-size')).to.eql('fontSize')
    expect(dashToCamelCase('color')).to.eql('color')
  })
  it('should not uppercase -ms- vendor-prefixes', () => {
    expect(dashToCamelCase('-ms-transform')).to.eql('msTransform')
  })
})
