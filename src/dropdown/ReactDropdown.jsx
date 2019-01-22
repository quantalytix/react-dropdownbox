import React, { Component } from 'react';
import Textbox from './Textbox';
import { ReactDropdownHelper } from './ReactDropdownHelper';
import { renderItem, renderGroup, renderSelected } from './ReactDropdownRender';
import { filterList } from './ReactDropdownFilter';
import './react-dropdown.scss';

export default class ReactDropdown extends Component {
  constructor(props) {
    super(props);

    this.handleOnSelected = this.handleOnSelected.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOnTextChange = this.handleOnTextChange.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);

    this.helper = new ReactDropdownHelper();

    this.state = {
      dropdownVisible: false,
      textInput: '',
      selectedIndex: null,
      selectedKey: null,
      activeIndex: 0,
      itemStack: [],
      count: [],
      internalData: [],
    }
  }

   componentDidMount() {
    document.addEventListener('click', this.handleClick, false);
    if (this.props.data && this.props.data.length !== 0) {
      let result = this.helper.createInternalNodeArray(this.props.data)
      let internalData = result.array;
      let count = result.count;
      let selectables = this.helper.flattenData(internalData);
      this.setState({
        itemStack: selectables,
        count: count,
        internalData: internalData
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      let result = this.helper.createInternalNodeArray(this.props.data)
      let internalData = result.array;
      let count = result.count;
      let selectables = this.helper.flattenData(internalData);
      this.setState({
        itemStack: selectables,
        count: count,
        internalData: internalData
      })
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
        {this.props.renderItem(item, this.state)}
      </div>
    );
    return selectItem;
  }

  renderDropdown(list) {
    return list.map((item, key) => {
      if (item.children != null && item.children.length > 0) {
        return this.props.renderGroup(item, this.state, this.renderDropdown(item.children));
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
      textInput: item.text
    }));
  }

  setNullState() {
    this.setState({
      textInput: '',
      activeIndex: 0
    });
  }

  scrollIntoViewItem(refItem) {
    if (refItem != null)
      refItem.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }

  resetSelection() {
    if (this.state.selectedIndex == null) {
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

  // need to circle back and see why this actually works lol
  // the current recurssion shouldn't allow this to work correctly
  // when scrolling items into view... 
  moveActiveIndex(currentIndex, i) {
    let index = currentIndex + i;
    let item = this.state.itemStack[index];

    if (item != null) {
      if (item.isGroup & this.props.selectGroupings === false) {
        if (index < this.state.count & index > 0) {
          this.moveActiveIndex(index, i);
          let currentRef = this.getActiveItemRef(currentIndex);
          this.scrollIntoViewItem(currentRef);
          this.setActiveIndex(index);
        }
      }
      else {
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
    let count = 0;
    let helper = new ReactDropdownHelper();

    if (textValue === '') {
      let nodeArray = helper.createInternalNodeArray(this.props.data);
      result = nodeArray.array;
      count = nodeArray.count;
    }
    else {
      let filtered = this.props.filter(this.props.data, searchWords);
      let nodes = helper.createInternalNodeArray(filtered);
      result = nodes.array;
      count = nodes.count;
    }

    let selectables = helper.flattenData(result);

    this.setState({
      textInput: textValue,
      activeIndex: 0,
      itemStack: selectables,
      count: count,
      internalData: result
    });
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
    let found = e.path.find(el => el.className === "react-dropdown")
    if (found && this.node.contains(e.target)) {
      return
    }
    this.closeDropdown();
    this.resetSelection();
  }

  //https://codepen.io/takatama/pen/mVvbqx

}

ReactDropdown.defaultProps = {
  renderItem: renderItem,
  renderGroup: renderGroup,
  renderSelected: renderSelected,
  filter: filterList,

  selectGroupings: false
}