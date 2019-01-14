import React, { Component } from 'react';
import ReactDropdown from './dropdown/ReactDropdown';

class App extends Component {
  render() {

    const sampleList = [
      {
        key: 1, value: 'Fictional Characters', children: [
          { key: 1, value: 'Joker' },
          { key: 2, value: 'Batman' },
          { key: 3, value: 'Robin' },
          { key: 4, value: 'Two-Face' },
          {
            key: 5, value: 'Not a Superhero', children: [
              { key: 1, value: 'Koolaid Man' },
              { key: 1, value: 'Koolaid Woman' },
              { key: 1, value: 'Koolaid Woman Twin' },
              { key: 2, value: 'Joe Dirt' },
            ]
          },
        ]
      },
      {
        key: 2, value: 'Real People', children: [
          { key: 2, value: 'Jenn' },
          { key: 3, value: 'Will' },
          { key: 3, value: 'Chris' },
        ]
      }
    ]

    return (
      <div className="App" style={{ height: '100vh', background: '#1A1A1A'}}>
        <ReactDropdown data={sampleList} placeholder='search or select'/>
        <div style={{color: 'white', padding: '10px'}}>
          Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
          The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
        </div>
      </div>
    );
  }
}

export default App;
