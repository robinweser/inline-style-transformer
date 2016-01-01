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
})
