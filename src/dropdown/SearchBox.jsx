import React, { useContext, useRef } from 'react';
import ReactDropdownContext from './ReactDropdownContext';

export default function SearchBox({placeholder, initialValue, theme, icon, ...otherProps}) {
  const input = useRef()
  const context = useContext(ReactDropdownContext)

  const handleChange = (e) => {
    if (otherProps.onChange)
      otherProps.onChange(e);
  }

  const handleOnFocus = async (e) => {
    await context.dispatch({type: 'hideResult'})
    focusTextInput();
    if (otherProps.onFocus)
      otherProps.onFocus(e);
  }

  const focusTextInput = (e) => {
    input.current.focus()
    input.current.select()
  }

    return (
      <div className='search-box' style={theme}>
        <div className={context.showResult ? 'result-div show' : 'result-div'} tabIndex="0" onFocus={handleOnFocus} style={{width: `calc(${theme.width} - 20px)`}}>
          <span>{context.textInput || initialValue}</span>
        </div>
        <input className={context.showResult ? 'input-box' : 'input-box show'} ref={input} placeholder={placeholder} onChange={handleChange} tabIndex="0"/>
        <div className="dropdown-icon" tabIndex="-1">
          { icon ? <div className={icon}></div> 
          : 
            <div className='arrows'>
              <i className='arrow-down2'></i>
            </div>
          }
        </div>
      </div>
    );
  }

