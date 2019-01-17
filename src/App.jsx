import React, { Component } from 'react';
import ReactDropdown from './dropdown/ReactDropdown';

class App extends Component {
  render() {

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
      <div className="App" style={{ height: '100vh', background: '#1A1A1A', paddingRight: '20px'}}>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '10px'}}>
        <ReactDropdown data={sampleList} placeholder='search or select'/>
        <ReactDropdown data={sampleList} placeholder='search or select'/>
      </div>
        <div style={{color: 'white', padding: '10px'}}>
          Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
          The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
        </div>
      </div>
    );
  }
}

export default App;
