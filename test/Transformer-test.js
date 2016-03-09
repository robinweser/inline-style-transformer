import { toCSS, toObject, importantify, nestPseudoClasses } from '../modules/Transformer'
import { expect } from 'chai'

describe('Converting a style object to a CSS string', () => {
  it('should use dash case CSS properties', () => {
    expect(toCSS({ flexDirection: 'row' })).to.eql('flex-direction:row')
  })
  it('should add semicolons between rules', () => {
    expect(toCSS({ flexDirection: 'row', fontSize: '12px' })).to.eql('flex-direction:row;font-size:12px')
  })
  it('should use custom separators', () => {
    expect(toCSS({ flexDirection: 'row', fontSize: '12px' }, {
      ruleSeparator: '\n'
    })).to.eql('flex-direction:row;\nfont-size:12px')
  })
  it('should resolve multiple values', () => {
    expect(toCSS({ display: [ '-webkit-flex', 'flex' ] })).to.eql('display:-webkit-flex;display:flex')
  })
  it('should add units to unitless values', () => {
    expect(toCSS({ width: 10 })).to.eql('width:10px')
  })
  it('should add a custom unit to unitless values', () => {
    expect(toCSS({ width: 10 }, { unit: 'em' })).to.eql('width:10em')
  })
  it('should not add units if the value is 0', () => {
    expect(toCSS({ width: 0 })).to.eql('width:0')
  })
  it('should return an empty string if the object is empty', () => {
    expect(toCSS({ })).to.eql('')
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
  it('should use a custom selector separator', () => {
    expect(toCSS({
      selector: {
        color: 'red',
        backgroundColor: 'blue'
      },
      selector2: {
        color: 'green'
      }
    }, { ruleSeparator: '\n', selectorSeparator: '\n' })).to.eql('selector{\ncolor:red;\nbackground-color:blue\n}\nselector2{\ncolor:green\n}\n')
  })
  it('should use a custom selector separator', () => {
    expect(toCSS({
      selector: {
        color: 'red',
        backgroundColor: 'blue'
      },
      selector2: {
        color: 'green'
      }
    }, { ruleSeparator: '\n', selectorSeparator: '\n', indent: '  ' })).to.eql('selector{\n  color:red;\n  background-color:blue\n}\nselector2{\n  color:green\n}\n')
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
  it('should resolve multiple fallback values as an array', () => {
    expect(toObject('display:-webkit-flex;display:flex')).to.eql({
      display: [ '-webkit-flex', 'flex' ]
    })
  })
  it('should parse px values', () => {
    expect(toObject('width:50px')).to.eql({ width: 50 })
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
  it('should resolve pseudo selectors', () => {
    expect(toObject('.class2 {color: red}.class2:hover {color: green}')).to.eql({
      class2: {
        color: 'red'
      },
      'class2:hover': {
        color: 'green'
      }
    })
  })
  it('should add missing selectors if needed', () => {
    expect(nestPseudoClasses({ 'class1:hover': { color: 'blue' } })).to.eql({
      class1: {
        ':hover': {
          color: 'blue'
        }
      }
    })
  })
})

describe('Nesting pseudo classes', () => {
  it('should nest pseudo selectors into their reference selector', () => {
    expect(nestPseudoClasses({
      class1: {
        color: 'red'
      },
      'class1:hover:focus:active': {
        color: 'blue'
      }
    })).to.eql({
      class1: {
        color: 'red',
        ':hover': {
          ':focus': {
            ':active': {
              color: 'blue'
            }
          }
        }
      }
    })
  })
})

describe('Adding important flags', () => {
  it('should add a flag if not set yet', () => {
    expect(importantify({ flexDirection: 'row' })).to.eql({
      flexDirection: 'row!important'
    })
  })
  it('should do nothing if flag already exists', () => {
    expect(importantify({ flexDirection: 'row!important' })).to.eql({
      flexDirection: 'row!important'
    })
  })
})
