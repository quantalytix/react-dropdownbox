import React from 'react';

class ReactDropdownRenderProps {
  renderItem(item, state) {    
    let selectItem = (
      <div>
        {item.text}
      </div>
    );
    return selectItem;
  }

  renderGroup(item, state, children) {
    return (
      <div key={item.node}>
        <div className="dropdown-heading">{item.text.toUpperCase()}</div>
        <div className="indent">
          {children}
        </div>
      </div>
    )
  }

  renderSelected(item,state) {
    return (<b>item.text</b>);
  }
}
export { ReactDropdownRenderProps };