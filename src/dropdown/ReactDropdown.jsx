import React, { Component } from 'react';
import Textbox from './Textbox';
import './react-dropdown2.scss';

export default class ReactDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownVisible: false,
      textInput: 'enter text here',
      activeIndex: 0,      
      itemStack: []
    }

    this.handleOnSelected = this.handleOnSelected.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleExitClick = this.handleExitClick.bind(this);

    console.log(this.flattenDeep(this.props.data));
  }

  flattenDeep(arr1) {
    let array = arr1.reduce((acc, val) => Array.isArray(val.children) ? acc.concat(this.flattenDeep(val.children)) : acc.concat({node: NaN, value: val}), []);
    for(let i = 0; i < array.length; i++) array[i].node = i;
    return array;
 }

  searchController({ textInput, dispatch }) {
    return this.renderItems(this.props.data, dispatch, 0)
  }

  renderItems(list, dispatch, index) {
    return list.map((item, key) => {
      if (item.children != null && item.children.length > 0) {
        return this.renderGroup(item, key, dispatch, index)
      } 
      else {
        index = index + 1;        
        let selectItem = (          
          <div
            className="dropdown-item"
            key={key}            
            onClick={e => this.handleOnSelected(e.target.textContent)}
            //onKeyPress={e => dispatch({ type: "SET_VALUE" }, e.target.textContent)}
            >
            {item.value + ' ' + index} 
          </div>
        );
        return selectItem;
      }
    })
  }

  renderGroup(item, key, dispatch, index) {
    index = index + 1;
    return (
      <div key={key}>
        <div className="dropdown-heading">{item.value.toUpperCase()}</div>
        <div className="indent">
          {this.renderItems(item.children, dispatch, index)}
        </div>
      </div>
    )
  }

  handleExitClick = (e) => {
    this.setState({
      display: 'none',
      focused: false,
      textInput: ''
    });
    console.log('handleExitClick(e)');
  }

  handleOnSelected(e) {
    this.setState({
      textInput: e,
      dropdownVisible: false
    });
  }

  handleOnChange(e) {
    this.setState({
      textInput: e.target.value
    });
    console.log('handleChange(e)');
  }

  handleOnFocus(e) {
    this.setState({
      dropdownVisible: true
    });
    console.log('handleOnFocus(e)');
  }

  handleOnBlur(e) {
    this.setState({
      dropdownVisible: false
    });
    console.log('handleOnBlur(e)');
    //console.log(document.activeElement.className);
  }

  render() {
    const { dropdownVisible } = this.state

    let resultStyle = {
      display: (dropdownVisible) ? 'block' : 'none'
    }

    let dropdown = (dropdownVisible) ? (
      <div style={resultStyle} onClick={this.handleClick} className="dropdown-container">
        {this.searchController(this.state)}
      </div>
    ) : null;

    return (
      <div className="react-dropdown" onFocus={this.handleOnFocus} onBlur={this.handleOnBlur} >
        <div className="search">
          <Textbox value={this.state.textInput} onChange={this.handleOnChange} />
        </div>
        {dropdown}
      </div>
    );
  }
}