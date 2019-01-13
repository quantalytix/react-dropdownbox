import React, { Component } from 'react';
import Textbox from './Textbox';
import './react-dropdown2.scss';
import computeScrollIntoView from 'compute-scroll-into-view';

export default class ReactDropdown extends Component {
  constructor(props) {
    super(props);

    this.handleOnSelected = this.handleOnSelected.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleExitClick = this.handleExitClick.bind(this);

    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);

    let result = this.createInternalItemArray(this.props.data);
    let internalData = result.array;
    let count = result.count;

    //let selectables = this.flattenDeep(internalData);

    this.state = {
      dropdownVisible: false,
      textInput: 'enter text here',
      activeIndex: 0,
      //itemStack: selectables,
      count: count,
      internalData: internalData
    }        
  }

  flattenDeep(arr1) {
    // flatten object array to include items and identify group objects in 
    // a single dimension array
    let array = arr1.reduce((acc, val) => Array.isArray(val.children) ? acc.concat({ node: val.node, isGroup: true, key: val.key, value: val.value }, this.flattenDeep(val.children)) : acc.concat({ node: val.node, key: val.key, value: val }), []);
    return array;
  }

  createInternalItemArray(arr1, count = 0) {
    let array = []
    for (let i = 0; i < arr1.length; i++) {
      let item = this.createItemNode(count, arr1[i]);
      count = count + 1;
      if (Array.isArray(arr1[i].children)) {
        var result = this.createInternalItemArray(arr1[i].children, count);
        item.children = result.array;
        count = result.count;
      }
      array.push(item);
    }
    return { array: array, count: count };
  }

  createItemNode(id, item) {
    return { node: id, children: null, value: item.value, key: item.key };
  }

  searchController({ textInput, dispatch }) {
    return this.renderItems(this.state.internalData, dispatch)
  }

  renderItems(list, dispatch) {
    return list.map((item, key) => {
      if (item.children != null && item.children.length > 0) {
        return this.renderGroup(item)
      }
      else {
        let itemStyle = (this.state.activeIndex === item.node) ? 'dropdown-item-selected' : 'dropdown-item';
        let selectItem = (
          <div
            ref={item.node}
            id={item.node}
            className={itemStyle}
            key={item.node}
            onClick={e => this.handleOnSelected(item.node)} >
            {item.value}
          </div>
        );
        return selectItem;


      }
    })
  }

  renderGroup(item) {
    return (
      <div key={item.node}>
        <div className="dropdown-heading">{item.value.toUpperCase()}</div>
        <div className="indent">
          {this.renderItems(item.children)}
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
    //console.log(e);
    this.setState({
      activeIndex: e
      //textInput: e,
      //dropdownVisible: false
    });
  }

  handleOnKeyDown(e) {
    console.log(e.target.value);
    const { activeIndex } = this.state
    if (e.keyCode === 38 && activeIndex > 0) {
      this.setState(prevState => ({
        activeIndex: prevState.activeIndex - 1
      }));
      if (this.refs[this.state.activeIndex - 1] != null)
        this.refs[this.state.activeIndex - 1].scrollIntoView({block: 'end', behavior: 'smooth'});
    } 
    else if (e.keyCode === 40) {
      this.setState(prevState => ({
        activeIndex: prevState.activeIndex + 1
      }));
      if (this.refs[this.state.activeIndex + 1] != null)
        this.refs[this.state.activeIndex + 1].scrollIntoView({block: 'end', behavior: 'smooth'});
    }
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

  //https://codepen.io/takatama/pen/mVvbqx
  render() {
    const { dropdownVisible } = this.state

    let resultStyle = {
      display: (dropdownVisible) ? 'block' : 'none'
    }

    let dropdown = (dropdownVisible) ? (
      // <div style={resultStyle} onClick={this.handleClick} className="dropdown-container">      
      <div style={resultStyle} className="dropdown-container" onKeyDown={this.handleOnKeyDown}>
        {this.searchController(this.state)}
      </div>
    ) : null;

    return (
      <div className="react-dropdown" onFocus={this.handleOnFocus} onKeyDown={this.handleOnKeyDown} >
        <div className="search">
          <Textbox value={this.state.textInput} />
        </div>
        {dropdown}
      </div>
    );
  }
}