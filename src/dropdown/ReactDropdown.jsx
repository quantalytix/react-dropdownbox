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

    //console.log(this.flattenDeep(this.props.data));
    /*let wrapped = [];
    wrapped = this.wrapItemArray(this.props.data);
    console.log(wrapped);
    let indexed = [];
    */
    console.log(this.props.data);
    let indexed = this.mutateArrayAddIndexes2(this.props.data);
    console.log(indexed.array);
    console.log(indexed.count);

    console.log(this.flattenDeep(this.props.data));
    console.log(this.flattenDeep(indexed.array));

    //let flat = this.flattenDeep(indexed.array);
    //console.log(flat);
  }

  flattenDeep(arr1) {
    // flatten object array to include only items and not group objects
    let array = arr1.reduce((acc, val) => Array.isArray(val.children) ? acc.concat({ node: val.node, isGroup: true, key: val.key, value: val.value}, this.flattenDeep(val.children)) : acc.concat({ node: val.node, key: val.key, value: val }), []);
    // index each item object in the array with a unique number
    //for (let i = 0; i < array.length; i++) array[i].node = i;
    // return the flattened indexed array of selectable items
    return array;
  }


  mutateArrayAddIndexes(arr1, count = 0) {
    for (let i = 0; i < arr1.length; i++) {
      arr1[i].node = {};
      arr1[i].node = count;
      count = count + 1;
      if (Array.isArray(arr1[i].children)) {
        var result = this.mutateArrayAddIndexes(arr1[i].children, count);
        arr1[i].children = result.array;
        count = result.count;
      }
    }
    return { array: arr1, count: count };
  }

  mutateArrayAddIndexes2(arr1, count = 0) {
    let array = []
    for (let i = 0; i < arr1.length; i++) {
      let item = {node: NaN, children: NaN, value: NaN, key: NaN};
      item.node = count;
      item.value = arr1[i].value;
      count = count + 1;
      if (Array.isArray(arr1[i].children)) {
        var result = this.mutateArrayAddIndexes2(arr1[i].children, count);
        item.children = result.array;
        count = result.count;
      }
      array.push(item);
    }
    return { array: array, count: count };
  }

  searchController({ textInput, dispatch }) {
    let wrappedItemArray = this.flattenDeep(this.props.data);
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