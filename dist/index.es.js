import React, { useContext, useRef, useState, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

var flattenData = function flattenData(arr1) {
  // flatten object array to include items and identify group objects in 
  // a single dimension array
  var reducer = function reducer(acc, val) {
    if (Array.isArray(val.children)) {
      return acc.concat({
        node: val.node,
        isGroup: true,
        key: val.key,
        value: val.value,
        text: val.text
      }, flattenData(val.children));
    } else {
      return acc.concat({
        node: val.node,
        key: val.key,
        value: val,
        text: val.text
      });
    }
  };
  return arr1.reduce(reducer, []);
};

var createInternalNodeArray = function createInternalNodeArray(arr1) {
  var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var internalNodeArray = [];
  arr1.forEach(function (itemObj) {
    var item = createItemNode(count, itemObj);
    count += 1;
    if (Array.isArray(itemObj.children)) {
      var result = createInternalNodeArray(itemObj.children, count);
      item.children = result.array;
      count = result.count;
    }
    internalNodeArray.push(item);
  });
  return { array: internalNodeArray, count: count };
};

var createItemNode = function createItemNode(id, item) {
  return { node: id, children: null, text: item.text, value: item.value, key: item.key };
};

//both list and search are arrays for parameters
var filterList = function filterList(list, search) {
  var results = [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].children) {
      var objCopy = Object.assign({}, list[i]);
      objCopy.children = filterList(list[i].children, search);
      if (objCopy.children.length > 0) results.push(objCopy);
    } else {
      for (var n = 0; n < search.length; n++) {
        if (search[n] !== '') {
          var regExp = buildRegEx(search[n]);
          if (checkIfMatch(list[i], regExp)) {
            // need to check if results are already in the list
            if (!checkDuplicate(list[i], results)) {
              results.push(list[i]);
            }
          }
        }
      }
    }
  }
  return results;
};

var checkIfMatch = function checkIfMatch(item, regExp) {
  return item.text.match(regExp);
};

var buildRegEx = function buildRegEx(str) {
  var sanitized = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  return new RegExp('^' + sanitized + '', "gmi");
};

var checkDuplicate = function checkDuplicate(item, list) {
  for (var i = 0; i < list.length; i++) {
    if (list[i] === item) return true;
  }
  return false;
};

var ReactDropdownContext = React.createContext();

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

function SearchBox(_ref) {
  var _this = this;

  var placeholder = _ref.placeholder,
      initialValue = _ref.initialValue,
      theme = _ref.theme,
      icon = _ref.icon,
      otherProps = objectWithoutProperties(_ref, ['placeholder', 'initialValue', 'theme', 'icon']);

  var input = useRef();
  var context = useContext(ReactDropdownContext);

  var handleChange = function handleChange(e) {
    if (otherProps.onChange) otherProps.onChange(e);
  };

  var handleOnFocus = function () {
    var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return context.dispatch({ type: 'hideResult' });

            case 2:
              focusTextInput();
              if (otherProps.onFocus) otherProps.onFocus(e);

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function handleOnFocus(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  var focusTextInput = function focusTextInput(e) {
    input.current.focus();
    input.current.select();
  };

  return React.createElement(
    'div',
    { className: 'search-box', style: theme },
    React.createElement(
      'div',
      { className: context.showResult ? 'result-div show' : 'result-div', tabIndex: '0', onFocus: handleOnFocus, style: { width: 'calc(' + theme.width + ' - 20px)' } },
      React.createElement(
        'span',
        null,
        context.textInput || initialValue
      )
    ),
    React.createElement('input', { className: context.showResult ? 'input-box' : 'input-box show', ref: input, placeholder: placeholder, onChange: handleChange, tabIndex: '0' }),
    React.createElement(
      'div',
      { className: 'dropdown-icon', tabIndex: '-1' },
      icon ? React.createElement('div', { className: icon }) : React.createElement(
        'div',
        { className: 'arrows' },
        React.createElement('i', { className: 'arrow-down2' })
      )
    )
  );
}

function DropdownItem(_ref) {
  var item = _ref.item;

  var _useContext = useContext(ReactDropdownContext),
      activeIndex = _useContext.activeIndex,
      handleOnMouseOver = _useContext.handleOnMouseOver,
      handleOnSelected = _useContext.handleOnSelected;

  return React.createElement(
    'div',
    {
      id: item.node,
      item: item,
      onClick: function onClick() {
        return handleOnSelected(item);
      },
      onMouseOver: function onMouseOver() {
        return handleOnMouseOver(item);
      },
      className: activeIndex === item.node ? 'dropdown-item selected' : 'dropdown-item'
    },
    React.createElement(
      'div',
      null,
      item.text
    )
  );
}

function ResultsContainer() {
  var _useContext = useContext(ReactDropdownContext),
      dropdownVisible = _useContext.dropdownVisible,
      internalData = _useContext.internalData;

  var renderGroup = function renderGroup(item, children) {
    return React.createElement(
      'div',
      { key: item.node },
      React.createElement(
        'div',
        { className: 'dropdown-heading' },
        item.text.toUpperCase()
      ),
      React.createElement(
        'div',
        { className: 'indent' },
        children
      )
    );
  };

  var renderDropdown = function renderDropdown() {
    var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : internalData;

    return list.map(function (item, key) {
      if (item.children && item.children.length) {
        return renderGroup(item, renderDropdown(item.children));
      } else {
        return React.createElement(DropdownItem, { key: item.node, item: item });
      }
    });
  };

  return React.createElement(
    'div',
    { className: dropdownVisible ? "results-container show" : 'results-container', tabIndex: '0' },
    renderDropdown()
  );
}

var initialState = {
  dropdownVisible: false,
  textInput: '',
  selectedIndex: null,
  selectedKey: null,
  activeIndex: 0,
  itemStack: [],
  count: [],
  internalData: [],
  showResult: true
};

var reducer = function reducer(state, action) {
  switch (action.type) {
    case 'showDropdown':
      return _extends({}, state, { dropdownVisible: true });
    case 'hideDropdown':
      return _extends({}, state, { dropdownVisible: false });
    case 'showResult':
      return _extends({}, state, { showResult: true });
    case 'hideResult':
      return _extends({}, state, { showResult: false });
    default:
      return state;
  }
};

function ReactDropdown(_ref) {
  var data = _ref.data,
      selectGroupings = _ref.selectGroupings,
      onSelect = _ref.onSelect,
      filter = _ref.filter,
      className = _ref.className,
      otherProps = objectWithoutProperties(_ref, ['data', 'selectGroupings', 'onSelect', 'filter', 'className']);

  var _useState = useState(initialState.textInput),
      _useState2 = slicedToArray(_useState, 2),
      textInput = _useState2[0],
      setTextInput = _useState2[1];

  var _useState3 = useState(initialState.selectedIndex),
      _useState4 = slicedToArray(_useState3, 2),
      selectedIndex = _useState4[0],
      setSelectedIndex = _useState4[1];

  var _useState5 = useState(initialState.selectedKey),
      _useState6 = slicedToArray(_useState5, 2),
      selectedKey = _useState6[0],
      setSelectedKey = _useState6[1];

  var _useState7 = useState(initialState.activeIndex),
      _useState8 = slicedToArray(_useState7, 2),
      activeIndex = _useState8[0],
      setActiveIndex = _useState8[1];

  var _useState9 = useState(initialState.itemStack),
      _useState10 = slicedToArray(_useState9, 2),
      itemStack = _useState10[0],
      setItemStack = _useState10[1];

  var _useState11 = useState(initialState.count),
      _useState12 = slicedToArray(_useState11, 2),
      count = _useState12[0],
      setCount = _useState12[1];

  var _useState13 = useState(initialState.internalData),
      _useState14 = slicedToArray(_useState13, 2),
      internalData = _useState14[0],
      setInternalData = _useState14[1];

  var _useReducer = useReducer(reducer, initialState),
      _useReducer2 = slicedToArray(_useReducer, 2),
      _useReducer2$ = _useReducer2[0],
      dropdownVisible = _useReducer2$.dropdownVisible,
      showResult = _useReducer2$.showResult,
      dispatch = _useReducer2[1];

  var ddRef = useRef();

  useEffect(function () {
    document.addEventListener('click', handleDocumentClick, false);
    if (data && data.length !== 0) {
      var result = createInternalNodeArray(data);
      var _internalData = result.array;
      var _count = result.count;
      var selectables = flattenData(_internalData);
      setItemStack(selectables);
      setCount(_count);
      setInternalData(_internalData);
    }
    return function () {
      return document.removeEventListener('click', handleDocumentClick, false);
    };
  }, [data]);

  var handleDocumentClick = function handleDocumentClick(e) {
    if (!ddRef.current.contains(e.target)) {
      dispatch({ type: 'showResult' });
      dispatch({ type: 'hideDropdown' });
      resetSelection();
    }
  };

  var getActiveItemRef = function getActiveItemRef(index) {
    return ddRef.current.getElementsByClassName('dropdown-item')[index];
  };

  var setSelectedValue = function setSelectedValue(index) {
    var itemData = itemStack[index];
    if (itemData) {
      setActiveIndex(index);
      setSelectedIndex(index);
      setSelectedKey(itemData.key);
      setTextInput(itemData.value.value);
    }
  };

  var setActiveItem = function setActiveItem(index, item) {

    setActiveIndex(index);
    setTextInput(item.text);
  };

  var setNullState = function setNullState() {
    setTextInput(initialState.textInput);
    setActiveIndex(initialState.activeIndex);
  };

  var scrollIntoViewItem = function scrollIntoViewItem(refItem) {
    if (refItem) {
      refItem.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  };

  var resetSelection = function resetSelection() {
    if (selectedIndex) {
      setNullState();
    } else {
      setSelectedValue(selectedIndex);
    }
  };

  // need to circle back and see why this actually works lol
  // the current recurssion shouldn't allow this to work correctly
  // when scrolling items into view... 
  var moveActiveIndex = function moveActiveIndex(currentIndex, i, e) {
    var index = currentIndex + i;
    var item = itemStack[index];
    if (item) {
      if (item.isGroup && selectGroupings === false) {
        if (index < count && index > 0) {
          moveActiveIndex(index, i, e);
          var currentRef = getActiveItemRef(currentIndex);
          scrollIntoViewItem(currentRef);
          setActiveIndex(index);
        }
      } else {
        var newItemRef = getActiveItemRef(index);
        if (newItemRef) {
          var _item = itemStack[index];
          setActiveItem(index, _item);
          scrollIntoViewItem(newItemRef);
        } else {
          var _currentRef = getActiveItemRef(currentIndex);
          scrollIntoViewItem(_currentRef);
          setActiveIndex(index);
        }
      }
    }
  };

  var handleOnKeyDown = function handleOnKeyDown(e) {
    // check if dropdown is open; if not open and bail
    if (!dropdownVisible) {
      dispatch({ type: 'showDropdown' });
      return;
    }
    //escape
    if (e.keyCode === 27) {
      resetSelection();
      dispatch({ type: 'hideDropdown' });
    }
    //enter
    if (e.keyCode === 13) {
      var item = itemStack[activeIndex];
      onSelect(item);
      setSelectedValue(activeIndex);
      dispatch({ type: 'showResult' });
      dispatch({ type: 'hideDropdown' });
    }
    //tab
    if (e.keyCode === 9) {
      setSelectedValue(activeIndex);
      dispatch({ type: 'hideDropdown' });
    }
    //up
    if (e.keyCode === 38 && activeIndex > 0) {
      dispatch({ type: 'showDropdown' });
      moveActiveIndex(activeIndex, -1, e);
    }
    //down
    else if (e.keyCode === 40 && activeIndex < count - 1) {
        dispatch({ type: 'showDropdown' });
        moveActiveIndex(activeIndex, 1, e);
      }
  };

  var handleOnTextChange = function handleOnTextChange(e) {
    var textValue = e.target.value;
    var searchWords = textValue.split(' ');

    var result = [];
    var count = 0;

    if (textValue === '') {
      var nodeArray = createInternalNodeArray(data);
      result = nodeArray.array;
      count = nodeArray.count;
    } else {
      var filtered = filter(data, searchWords);
      var nodes = createInternalNodeArray(filtered);
      result = nodes.array;
      count = nodes.count;
    }

    var selectables = flattenData(result);

    setTextInput(textValue);
    setActiveIndex(0);
    setItemStack(selectables);
    setCount(count);
    setInternalData(result);
  };

  var handleOnFocus = function handleOnFocus(e) {
    dispatch({ type: 'showDropdown' });
  };

  var handleOnSelected = function handleOnSelected(e) {
    onSelect(e);
    setSelectedValue(e.node);
    dispatch({ type: 'showResult' });
    dispatch({ type: 'hideDropdown' });
  };

  var handleOnMouseOver = function handleOnMouseOver(item) {
    setActiveIndex(item.node);
  };

  var state = {
    dropdownVisible: dropdownVisible,
    textInput: textInput,
    selectedIndex: selectedIndex,
    selectedKey: selectedKey,
    activeIndex: activeIndex,
    itemStack: itemStack,
    count: count,
    internalData: internalData,
    showResult: showResult,
    handleDocumentClick: handleDocumentClick,
    handleOnFocus: handleOnFocus,
    handleOnKeyDown: handleOnKeyDown,
    handleOnMouseOver: handleOnMouseOver,
    handleOnSelected: handleOnSelected,
    handleOnTextChange: handleOnTextChange,
    dispatch: dispatch
  };

  return React.createElement(
    ReactDropdownContext.Provider,
    { value: state },
    React.createElement(
      'div',
      {
        ref: function ref(node) {
          return ddRef.current = node;
        },
        className: className ? 'react-dropdown ' + className : "react-dropdown",
        onFocus: handleOnFocus,
        onChange: handleOnTextChange,
        onKeyDown: handleOnKeyDown },
      React.createElement(SearchBox, otherProps),
      React.createElement(ResultsContainer, null)
    )
  );
}

ReactDropdown.defaultProps = {
  filter: filterList,
  theme: {
    height: '30px',
    fontSize: 'inherit'
  },
  selectGroupings: false
};

ReactDropdown.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    children: PropTypes.arrayOf(PropTypes.object)
  })).isRequired,
  onSelect: PropTypes.func.isRequired,
  initialValue: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  theme: PropTypes.object,
  filter: PropTypes.func,
  selectGroupings: PropTypes.bool
};

export default ReactDropdown;
//# sourceMappingURL=index.es.js.map
