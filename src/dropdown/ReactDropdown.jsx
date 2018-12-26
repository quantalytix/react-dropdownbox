import React, { Component } from 'react';
import Textbox from './Textbox';
import './react-dropdown.scss';

export default class ReactDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownVisible: false,
      textInput: 'enter text here'
    }

    this.handleOnSelected = this.handleOnSelected.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleExitClick = this.handleExitClick.bind(this);
  }

  searchController({ textInput, dispatch }) {
    return this.renderItems(this.props.data, dispatch)
  }

  renderItems(list, dispatch) {
    return list.map((item, key) => {
      if (item.children != null && item.children.length > 0) {
        return this.renderGroup(item, key, dispatch)
      } else {
        return (
          <div
            className="item"
            key={key}
            onClick={e => this.handleOnSelected(e.target.textContent)}
            onKeyPress={e => dispatch({ type: "SET_VALUE" }, e.target.textContent)}>
            {item.value}
          </div>
        )
      }
    })
  }

  renderGroup(item, key, dispatch) {
    return (
      <div key={key}>
        <div className="dropdown-heading">{item.value.toUpperCase()}</div>
        <div className="indent">
          {this.renderItems(item.children, dispatch)}
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
      <div style={resultStyle} onClick={this.handleClick} className="dropdown-content">
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