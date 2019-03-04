import React, {useState, useReducer, useEffect, useRef} from 'react'
import { createInternalNodeArray, flattenData } from './ReactDropdownHelper';
import { filterList } from './ReactDropdownFilter';
import SearchBox from './SearchBox'
import ResultsContainer from './ResultsContainer'
import './react-dropdown.scss';

const initialState = {
  dropdownVisible: false,
  textInput: '',
  selectedIndex: null,
  selectedKey: null,
  activeIndex: 0,
  itemStack: [],
  count: [],
  internalData: [],
  showResult: true,
}
export const ReactDropdownContext = React.createContext()

const reducer = (state, action) => {
  switch(action.type) {
    case 'showDropdown':
      return {...state, dropdownVisible: true}
    case 'hideDropdown':
      return {...state, dropdownVisible: false}
    case 'showResult':
      return {...state, showResult: true}
    case 'hideResult':
      return {...state, showResult: false}
    default:
      return state
  }
}

export default function ReactDropdown ({data, selectGroupings, onSelect, filter, className, ...otherProps}) {
  const [textInput, setTextInput] = useState(initialState.textInput)
  const [selectedIndex, setSelectedIndex] = useState(initialState.selectedIndex)
  const [selectedKey, setSelectedKey] = useState(initialState.selectedKey)
  const [activeIndex, setActiveIndex] = useState(initialState.activeIndex)
  const [itemStack, setItemStack] = useState(initialState.itemStack)
  const [count, setCount] = useState(initialState.count)
  const [internalData, setInternalData] = useState(initialState.internalData)
  const [{dropdownVisible, showResult}, dispatch] = useReducer(reducer, initialState)
  const ddRef = useRef()

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick, false);
    if (data && data.length !== 0) {
      let result = createInternalNodeArray(data)
      let internalData = result.array;
      let count = result.count;
      let selectables = flattenData(internalData);
      setItemStack(selectables)
      setCount(count)
      setInternalData(internalData)
    }
    return () => document.removeEventListener('click', handleDocumentClick, false);
  }, [data])

  const handleDocumentClick = (e) => {
    if (!ddRef.current.contains(e.target)) {
      dispatch({type: 'showResult'})
      dispatch({type: 'hideDropdown'})
      resetSelection();
    }
  }

  const getActiveItemRef = (index) => {
    return ddRef.current.getElementsByClassName('dropdown-item')[index];
  }

  const setSelectedValue = (index) => {
    let itemData = itemStack[index]
    if (itemData) {
      setActiveIndex(index)
      setSelectedIndex(index)
      setSelectedKey(itemData.key)
      setTextInput(itemData.value.value)
    }
  }

  const setActiveItem = (index, item, updateText = true) => {
    setActiveIndex(index)
    setTextInput(item.text)
  }

  const setNullState = () => {
    setTextInput(initialState.textInput)
    setActiveIndex(initialState.activeIndex)
  }

  const scrollIntoViewItem = (refItem) => {
    if (refItem) {
      refItem.scrollIntoView({ block: 'end', behavior: 'smooth' })
    }
  }

  const resetSelection = () => {
    if (selectedIndex) {
      setNullState()
    }
    else {
      setSelectedValue(selectedIndex);
    }
  }

  // need to circle back and see why this actually works lol
  // the current recurssion shouldn't allow this to work correctly
  // when scrolling items into view... 
  const moveActiveIndex = (currentIndex, i, e) => {
    let index = currentIndex + i;
    let item = itemStack[index];
    if (item) {
      if (item.isGroup && selectGroupings === false) {
        if (index < count && index > 0) {
          moveActiveIndex(index, i, e);
          let currentRef = getActiveItemRef(currentIndex);
          scrollIntoViewItem(currentRef);
          setActiveIndex(index);
        }
      } else {
        let newItemRef = getActiveItemRef(index)
        if (newItemRef) {
          let item = itemStack[index];
          setActiveItem(index, item);
          scrollIntoViewItem(newItemRef);
        } else {
          let currentRef = getActiveItemRef(currentIndex)
          scrollIntoViewItem(currentRef);
          setActiveIndex(index);
        }
      }
    }
  }

  const handleOnKeyDown = (e) => {
    // check if dropdown is open; if not open and bail
    if (!dropdownVisible) {
      dispatch({type: 'showDropdown'})
      return;
    }
    //escape
    if (e.keyCode === 27) {
      resetSelection();
      dispatch({type: 'hideDropdown'})
    }
    //enter
    if (e.keyCode === 13) {
      let item = itemStack[activeIndex];
      onSelect(item)
      setSelectedValue(activeIndex);
      dispatch({type: 'showResult'})
      dispatch({type: 'hideDropdown'})
    }
    //tab
    if (e.keyCode === 9) {
      setSelectedValue(activeIndex);
      dispatch({type: 'hideDropdown'})
    }
    //up
    if (e.keyCode === 38 && activeIndex > 0) {
      dispatch({type: 'showDropdown'})
      moveActiveIndex(activeIndex, -1, e);
    }
    //down
    else if (e.keyCode === 40 && activeIndex < count - 1) {
      dispatch({type: 'showDropdown'})
      moveActiveIndex(activeIndex, 1, e);
    }
  }

  const handleOnTextChange = (e) => {
    let textValue = e.target.value;
    let searchWords = textValue.split(' ');

    let result = [];
    let count = 0;

    if (textValue === '') {
      let nodeArray = createInternalNodeArray(data);
      result = nodeArray.array;
      count = nodeArray.count;
    }
    else {
      let filtered = filter(data, searchWords);
      let nodes = createInternalNodeArray(filtered);
      result = nodes.array;
      count = nodes.count;
    }

    let selectables = flattenData(result);

    setTextInput(textValue)
    setActiveIndex(0)
    setItemStack(selectables)
    setCount(count)
    setInternalData(result)
  }

  const handleOnFocus = (e) => {
    dispatch({type: 'showDropdown'})
  }

  const handleOnSelected = (e) => {
    onSelect(e)
    setSelectedValue(e.node);
    dispatch({type: 'showResult'})
    dispatch({type: 'hideDropdown'})
  }

  const handleOnMouseOver = (item) => {
    setActiveIndex(item.node);
  }

  const state = {
    dropdownVisible,
    textInput,
    selectedIndex,
    selectedKey,
    activeIndex,
    itemStack,
    count,
    internalData,
    showResult,
    handleDocumentClick,
    handleOnFocus,
    handleOnKeyDown,
    handleOnMouseOver,
    handleOnSelected,
    handleOnTextChange,
    dispatch
  }

  return (
    <ReactDropdownContext.Provider value={state}>
      <div 
        ref={node => ddRef.current = node} 
        className={className ? `react-dropdown ${className}` : "react-dropdown"} 
        onFocus={handleOnFocus} 
        onChange={handleOnTextChange} 
        onKeyDown={handleOnKeyDown} >
        <SearchBox {...otherProps} />
        <ResultsContainer />
      </div>
    </ReactDropdownContext.Provider>
  )
}

ReactDropdown.defaultProps = {
  filter: filterList,
  theme: {
    height: '30px',
    fontSize: 'inherit',
  },
  onSelect: () => {},
  selectGroupings: false
}