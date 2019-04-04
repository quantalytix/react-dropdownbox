import React, {useContext} from 'react'
import ReactDropdownContext from './ReactDropdownContext';
import DropdownItem from './DropdownItem'

export default function ResultsContainer() {
  const {dropdownVisible, internalData} = useContext(ReactDropdownContext)


  const renderGroup = (item, children) => {
    return (
      <div key={item.node}>
        <div className="dropdown-heading">{item.text.toUpperCase()}</div>
        <div className="indent">
          {children}
        </div>
      </div>
    )
  }

  const renderDropdown = (list = internalData) => {
    return list.map((item, key) => {
      if (item.children && item.children.length) {
        return renderGroup(item, renderDropdown(item.children));
      }
      else {
        return <DropdownItem key={item.node} item={item}/>;
      }
    })
  }

  return (
    <div className={dropdownVisible ? "results-container show" : 'results-container' } tabIndex="0">
      {renderDropdown()}
    </div>
  )
}