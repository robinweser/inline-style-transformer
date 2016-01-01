# Transformation tools for CSS and inline styles
[![Build Status](https://travis-ci.org/rofrischmann/style-transform.svg)](https://travis-ci.org/rofrischmann/style-transform)
[![Code Climate](https://codeclimate.com/github/rofrischmann/style-transform/badges/gpa.svg)](https://codeclimate.com/github/rofrischmann/style-transform)
[![npm version](https://badge.fury.io/js/style-transform.svg)](http://badge.fury.io/js/style-transform)
![Dependencies](https://david-dm.org/rofrischmann/style-transform.svg)


# Usage
```sh
npm install style-transform
```
### Methods
* [toCSS](#tocssstyles--unit)
* [toObject](#toObjectcss)

## toCSS(styles [, unit])
Takes a `styles` object and generates a valid CSS string. Property names get converted to dash-case and plain numbers *(if they're not unitless properties)* get a `unit` applied *(default = `px`)*.
```javascript
import { toCSS } from 'style-transform'

const styles = {
	fontSize: 15,
	color: 'red',
	transform: 'rotate(30deg)'
}

// basic object to CSS string
const CSS = toCSS(styles)
CSS === 'font-size:15px;color:red;transform:rotate(30deg)'

// custom unit transformation
CSS = toCSS(styles, 'em')
CSS === 'font-size:15em;color:red;transform:rotate(30deg)'
```
## toObject(CSS)
Converts a `CSS` string to a optimized javascript object. Property names get camel-cased and number values get converted to pure numbers if possible.

```javascript
import { toObject } from 'style-transform'

const CSS = 'font-size:15px;color:red;transform:rotate(30deg)'

// values with px also get
// converted to pure numbers
const styles = toObject(CSS)
styles === {fontSize: 15, color: 'red', transform: 'rotate(30deg)'}
```
#### Advanced
You can also use the new ECMAScript 2015 template strings. This let's you effectively write CSS within javascript. <br>
`objectifyCSS` will automatically normalize all tabs and line-breaks.

```javascript
const CSS = `
	font-size: 15px;
	color: red;
	transform: rotate(30deg)
`

const styles = toObject(CSS)
styles === {fontSize: 15, color: 'red', transform: 'rotate(30deg)'}
```

# License
**style-transform** is licensed under the [MIT License](http://opensource.org/licenses/MIT).<br>
Documentation is licensed under [Creative Common License](http://creativecommons.org/licenses/by/4.0/).<br>
Created with ♥ by [@rofrischmann](http://rofrischmann.de).

# Contributing
I would love to see people getting involved.<br>
If you have a feature request please create an issue. Also if you're even improving style-transform by any kind please don't be shy and send a pull request to let everyone benefit.

### Issues
If you're having any issue please let me know as fast as possible to find a solution a hopefully fix the issue. Try to add as much information as possible such as your environment, exact case, the line of actions to reproduce the issue.

### Pull Requests
If you are creating a pull request, try to use commit messages that are self-explanatory. Also always add some **tests** unless it's totally senseless (add a reason why it's senseless) and test your code before you commit so Travis won't throw errors.
