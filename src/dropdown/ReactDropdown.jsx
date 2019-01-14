import React, { Component } from 'react';
import Textbox from './Textbox';
import './react-dropdown2.scss';

/*
  states:
    1. Not focused
    2. Focused but dropdown not shown
    3. focused and dropdown shown
*/

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

    let selectables = this.flattenDeep(internalData);

    this.state = {
      dropdownVisible: false,
      textInput: 'enter text here',
      activeIndex: 0,
      selectedIndex: null,
      selectedKey: null,
      itemStack: selectables,
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
            item={item}
            className={itemStyle}
            key={item.node}
            onClick={e => this.handleOnSelected(item)} >
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
    this.setSelectedValue(e.node);
  }

  getActiveItemRef(index) {
    return this.refs[index];
  }

  openDropdown() {
    this.setState({ dropdownVisible: true });
  }

  closeDropdown() {
    this.setState({ dropdownVisible: false });
  }

  setSelectedValue(index) {    
    let itemData = this.state.itemStack[index];    
    if (itemData) {
      this.setState({
        selectedIndex: index,
        selectedKey: itemData.key,
        textInput: itemData.value.value
      });
    }
  }

  setActiveItem(index, item) {    
    this.setState(prevState => ({      
      activeIndex: index,
      textInput: item.value.value
    }));
  }

  scrollIntoViewItem(refItem) {
    refItem.scrollIntoView({ block: 'end', behavior: 'smooth' });      
  }

  resetSelection(){
    this.setSelectedValue(this.state.selectedIndex);
  }

  deincrementActiveIndex() {
    this.setState(prevState => ({        
      activeIndex: prevState.activeIndex - 1
    }));
  }

  moveActiveIndex(currentIndex, i) {
    let index = currentIndex + i;   
    let newItemRef = this.getActiveItemRef(index);
    if (newItemRef != null) {      
      let item = this.state.itemStack[index];
      console.log(item);
      this.setActiveItem(index, item);
      this.scrollIntoViewItem(newItemRef);
    }
    else {
      let currentRef = this.getActiveItemRef(currentIndex);
      this.scrollIntoViewItem(currentRef);
      this.deincrementActiveIndex()
    }
  }

  moveActiveIndexDown() {

  }

  handleOnKeyDown(e) {
    //console.log(e.target);
    const { activeIndex, count } = this.state

    if (!this.state.dropdownVisible) {
      this.setState({ dropdownVisible: true });
      return;
    }
    //escape
    if (e.keyCode === 27) {
      console.log('escape key has been pressed');      
      this.resetSelection();
      this.closeDropdown();
    }
    //enter
    if (e.keyCode === 13) {
      console.log('enter key has been pressed');
      this.setSelectedValue(this.state.activeIndex);
      this.closeDropdown();
    }
    //tab
    if (e.keyCode === 9) {
      this.setSelectedValue(this.state.activeIndex);
      this.closeDropdown();
    }
    //up
    if (e.keyCode === 38 && activeIndex > 0) {
      this.openDropdown();
      this.moveActiveIndex(activeIndex, -1);
    }
    //down
    else if (e.keyCode === 40 && activeIndex < count - 1) {
      this.openDropdown();
      this.moveActiveIndex(activeIndex, 1);
    }
  }


  handleOnChange(e) {
    this.setState({
      textInput: e.target.value
    });
    console.log('handleChange(e)');
  }


  handleOnFocus(e) {
    this.openDropdown();
  }

  handleOnBlur(e) {
    this.closeDropdown();
    console.log('handleOnBlur(e)');    
  }

  //https://codepen.io/takatama/pen/mVvbqx
  render() {
    const { dropdownVisible } = this.state

    let resultStyle = {
      display: (dropdownVisible) ? 'block' : 'none'
    }

    let dropdown = (dropdownVisible) ? (
      <div style={resultStyle} className="dropdown-container" tabIndex="0">
        {this.searchController(this.state)}
      </div>
    ) : null;

    return (
      <div className="react-dropdown" onFocus={this.handleOnFocus} onChange={this.handleOnChange} onKeyDown={this.handleOnKeyDown} >
        <div className="search">
          <Textbox className="search-box" value={this.state.textInput} /><button tabIndex="-1" className="search-dd">open</button>
        </div>
        {dropdown}
      </div>
    );
  }
}