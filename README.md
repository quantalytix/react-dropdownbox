# react-dropdownbox

> 

[![NPM](https://img.shields.io/npm/v/@quantalytix/react-dropdownbox.svg)](https://www.npmjs.com/package/@quantalytix/react-dropdownbox) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm i @quantalytix/react-dropdownbox
```
## Demo Screenshot

![ScreenShot](/docs/img/dropdown-sample.png)

## Usage

```jsx
import React, { Component } from 'react'

// library reference
import ReactDropdown from '@quantalytix/react-dropdownbox'
// library stylesheet
import '@quantalytix/react-dropdownbox/dist/index.es.css'
//or import '@quantalytix/react-dropdownbox/sass/react-dropdown.scss'

class Example extends Component {
  render () {
    const sampleList = [
      {
        key: 1, text: 'Fictional Characters', value: 'Fictional Characters', children: [
          { key: 1, text:'Joker', value: 'Joker' },
          { key: 2, text:'Batman', value: 'Batman' },
          { key: 3, text:'Robin', value: 'Robin' },
          { key: 4, text:'Two-Face', value: 'Two-Face' },
          {
            key: 5, text:'Not a Superhero', value: 'Not a Superhero', children: [
              { key: 1, text:'Koolaid Man', value: 'Koolaid Man' },
              { key: 1, text:'Koolaid Woman', value: 'Koolaid Woman' },
              { key: 1, text:'Koolaid Woman Twin', value: 'Koolaid Woman Twin' },
              { key: 2, text:'Joe Dirt', value: 'Joe Dirt' },
            ]
          },
        ]
      },
      {
        key: 2, text:'Real People', value: 'Real People', children: [
          { key: 2, text:'Jenn', value: 'Jenn' },
          { key: 3, text:'Will', value: 'Will' },
          { key: 3, text:'Chris', value: 'Chris' },
          { key: 3, text:'Bradley', value: 'Bradley' },
          { key: 3, text:'Ben', value: 'Ben' },
          { key: 3, text:'Min', value: 'Min' },
          { key: 3, text:'Luke', value: 'Luke' }          
        ]
      }
    ]

    return (
      <ReactDropdown data={sampleList} placeholder='search or select' initialValue='Fictional Characters' onSelect={()=>{}}/>
    )
  }
}
```

## Sass Styles

The Sass style sheet can be found in the following path `'@quantalytix/react-dropdownbox/sass/react-dropdown.scss'` under the node_modules folder. To modify the style copy this file into your local application and change the style reference in your import statement.

## License

MIT © [quantalytix](https://github.com/quantalytix)
