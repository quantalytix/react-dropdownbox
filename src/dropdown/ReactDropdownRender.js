import React from 'react';

  const renderItem = (item, state) => {    
    let selectItem = (
      <div>
        {item.text}
      </div>
    );
    return selectItem;
  }

  const renderGroup = (item, state, children) => {
    return (
      <div key={item.node}>
        <div className="dropdown-heading">{item.text.toUpperCase()}</div>
        <div className="indent">
          {children}
        </div>
      </div>
    )
  }

  const renderSelected = (item,state) => {
    return (<b>item.text</b>);
  }

export {renderItem, renderGroup, renderSelected}