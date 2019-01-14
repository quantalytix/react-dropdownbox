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
        <ReactDropdown data={sampleList} />
      </div>
    );
  }
}

export default App;
