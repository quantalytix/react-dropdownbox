import React from 'react';

class ReactDropdownRenderProps {
  renderItem(item, state) {    
    let selectItem = (
      <div>
        {item.value}
      </div>
    );
    return selectItem;
  }

  renderGroup(item, state, children) {
    return (
      <div key={item.node}>
        <div className="dropdown-heading">{item.value.toUpperCase()}</div>
        <div className="indent">
          {children}
        </div>
      </div>
    )
  }
}
export { ReactDropdownRenderProps };