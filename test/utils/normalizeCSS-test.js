import normalizeCSS from '../../lib/utils/normalizeCSS'
import { expect } from 'chai'

describe('Normalizing CSS strings', () => {
  it('should remove new lines', () => {
    expect(normalizeCSS(`
			width:5;
			height:6;
			`)).to.eql('width:5;height:6;')
  })
  it('should remove tabs', () => {
    expect(normalizeCSS(`
			width:	5;
			height: 6;
			`)).to.eql('width:5;height: 6;')
  })
  it('should convert class selectors to object keys', () => {
    expect(normalizeCSS(`
      .class1 {
        width:5;
        height:6;
      }
      .class2 {
        color:red;
        font-size:12px;
      }`)).to.eql('class1{width:5;height:6;}class2{color:red;font-size:12px;}')
  })
})
