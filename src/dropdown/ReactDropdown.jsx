import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import Textbox from './Textbox';
import { ReactDropdownHelper } from './ReactDropdownHelper';
import { ReactDropdownRenderProps } from './ReactDropdownRender';
import { ReactDropdownFilter } from './ReactDropdownFilter';
import './react-dropdown2.scss';

export default class ReactDropdown extends Component {
  constructor(props) {
    super(props);

    this.handleOnSelected = this.handleOnSelected.bind(this);    
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOnTextChange = this.handleOnTextChange.bind(this);    
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);

    let helper = new ReactDropdownHelper();
    let render = new ReactDropdownRenderProps();
    let filter = new ReactDropdownFilter();

    let result = helper.createInternalNodeArray(this.props.data);
    let internalData = result.array;
    let count = result.count;
    console.log(internalData)
    let selectables = helper.flattenData(internalData);
    console.log(selectables)

    this.state = {
      dropdownVisible: false,
      textInput: '',
      activeIndex: 0,
      selectedIndex: null,
      selectedKey: null,
      itemStack: selectables,
      count: count,
      internalData: internalData,

      filter: filter.filterList, // filter function  
      // why save these to state?
      // to Jenn: we can make these default properties instead of state items    
      renderGroup: render.renderGroup, // render prop
      renderItem: render.renderItem, // render prop
      renderSelected: null // render prop
    }
  }
    
  renderNodeItem(item) {
    let itemStyle = (this.state.activeIndex === item.node) ? 'dropdown-item-selected' : 'dropdown-item';
    let selectItem = (
      <div
        ref={item.node}
        id={item.node}
        item={item}
        className={itemStyle}
        key={item.node}
        onClick={e => this.handleOnSelected(item)} 
        onMouseOver={e => this.handleOnMouseOver(item)}
        >
        {this.state.renderItem(item, this.state)}
      </div>
    );
    return selectItem;
  }

  renderDropdown(list) {
    return list.map((item, key) => {
      if (item.children != null && item.children.length > 0) {
        return this.state.renderGroup(item, this.state, this.renderDropdown(item.children));
      }
      else {
        return this.renderNodeItem(item);
      }
    })
  }

  render() {
    const { dropdownVisible } = this.state

    let resultStyle = {
      display: (dropdownVisible) ? 'block' : 'none'
    }

    let dropdown = (dropdownVisible) ? (
      <div style={resultStyle} className="dropdown-container" tabIndex="0">
        {this.renderDropdown(this.state.internalData)}
      </div>
    ) : null;

    return (
      <div ref={node => this.node = node}>
        <div ref="dropdownbox" className="react-dropdown" onFocus={this.handleOnFocus} onChange={this.handleOnTextChange} onKeyDown={this.handleOnKeyDown} >
          <div className="search">
            <Textbox className="search-box" placeholder={this.props.placeholder} value={this.state.textInput} />
            <div tabIndex="-1" className="search-dd">
              <span className='arrow-up'></span>
              <span className='arrow-down'></span>
            </div>
          </div>
          {dropdown}
        </div>
      
      </div>
    );
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
        activeIndex: index,
        selectedIndex: index,
        selectedKey: itemData.key,
        textInput: itemData.value.value,        
      });
    }
  }

  setActiveItem(index, item, updateText = true) {
    this.setState(prevState => ({
      activeIndex: index,
      textInput:  item.value.value
    }));
  }

  setNullState(){
    this.setState({
      textInput: '',
      activeIndex: 0
     });
  }

  scrollIntoViewItem(refItem) {
    if(refItem != null)
      refItem.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }

  resetSelection() {
    if(this.state.selectedIndex == null){
      this.setNullState();
    }
    else {
      this.setSelectedValue(this.state.selectedIndex);      
    }    
  }

  setActiveIndex(index) {
    this.setState(prevState => ({
      activeIndex: index
    }));
  }

  moveActiveIndex(currentIndex, i) {
    let index = currentIndex + i;
    let newItemRef = this.getActiveItemRef(index);
    if (newItemRef != null) {
      let item = this.state.itemStack[index];
      this.setActiveItem(index, item);
      this.scrollIntoViewItem(newItemRef);
    }
    else {
      let currentRef = this.getActiveItemRef(currentIndex);
      this.scrollIntoViewItem(currentRef);
      this.setActiveIndex(index);
    }
  }


  handleOnKeyDown(e) {
    //console.log(e.target);
    const { activeIndex, count } = this.state

    // check if dropdown is open; if not open and bail
    if (!this.state.dropdownVisible) {
      this.openDropdown();
      return;
    }
    //escape
    if (e.keyCode === 27) {
      this.resetSelection();
      this.closeDropdown();
    }
    //enter
    if (e.keyCode === 13) {
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


  handleOnTextChange(e) {
    let textValue = e.target.value;
    let searchWords = textValue.split(' ');

    let result = [];
    if (textValue === '') {
      let helper = new ReactDropdownHelper();
      let nodeArray = helper.createInternalNodeArray(this.props.data);
      result = nodeArray.array;
    }
    else {
      result = this.state.filter(this.state.internalData, searchWords)
    }
    
    this.setState({
      internalData: result,
      textInput: textValue
    });
    console.log('handleChange(e)');
  }

  handleOnFocus(e) {
    this.openDropdown();
  }

  handleOnSelected(e) {
    this.setSelectedValue(e.node);
    this.closeDropdown();
  }

  handleOnMouseOver(item) {
    //let i = this.state.itemStack[item.node];
    this.setActiveIndex(item.node);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  
  handleClick = (e) => {
    /*
    // we can use a forwardRef to potentially solve this...
    console.log(ReactDOM.findDOMNode(this.refs.dropdownbox)); // <div class="react-dropdown">...</div>
    console.log(document.activeElement); // <input class="input-box" placeholder="" ...>
    if (document.activeElement !== ReactDOM.findDOMNode(this.refs.dropdownbox)) {
      this.closeDropdown();
      this.resetSelection();
    }
    */
    
    // if there are multiple dropdowns rendered on a single page
    // will this logic create a problem?
    // let found = e.path.find(el => el.className === "react-dropdown")
    // if (!!!found) {
    //   this.closeDropdown();
    //   this.resetSelection();
    // }
    if (this.node.contains(e.target)) {
      return
    }
    this.closeDropdown();
    this.resetSelection();
  }

  //https://codepen.io/takatama/pen/mVvbqx
  
}