import React, { Component } from 'react';

export default class Textbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
    };

    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    this.textInput.current.focus();
  }

  handleChange(e) {
    if (this.props.hasOwnProperty('onChange'))
      this.props.onChange(e);
  }

  handleOnBlur(e) {
    this.setState({ focused: false });
    if (this.props.hasOwnProperty('onBlur'))
      this.props.onBlur(e);
  }

  handleOnFocus(e) {
    this.setState({ focused: true });
    this.focusTextInput();
    if (this.props.hasOwnProperty('onFocus'))
      this.props.onFocus(e);
  }

  render() {
    let itemStyle = {
      position: 'absolute',
      //zIndex: (this.state.focused) ? 0 : 1,
      //opacity: (this.state.focused) ? 0 : 1,
      display: (this.state.focused) ? 'none' : 'block'
    }

    let inputStyle = {
      position: 'absolute',
      zIndex: (this.state.focused) ? 1 : 0,
      opacity: (this.state.focused) ? 1 : 0,
      //display: (this.state.focused) ? 'block' : 'none'
    }

    let containerStyle = {
      height: 22
    }

    return (
      <div id="container" style={containerStyle} className={this.props.className} tabIndex={this.props.tabIndex} onFocus={this.handleOnFocus} >
        <div style={itemStyle}>{this.props.value}</div>
        <div style={inputStyle}>
          <input ref={this.textInput} value={this.props.value} onChange={this.handleChange} onBlur={this.handleOnBlur} tabIndex="0" />
        </div>
      </div>
    );
  }
}

Textbox.defaultProps = {
  value : 'new text',
  tabIndex: 0
};

