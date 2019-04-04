import React, {useContext} from 'react'
import ReactDropdownContext from './ReactDropdownContext';

export default function DropdownItem({item}) {
  const {activeIndex, handleOnMouseOver, handleOnSelected} = useContext(ReactDropdownContext)
    return (
      <div
        id={item.node}
        item={item}
        onClick={() => handleOnSelected(item)}
        onMouseOver={() => handleOnMouseOver(item)}
        className={activeIndex === item.node ? 'dropdown-item selected' : 'dropdown-item'}
        >
        <div>
          {item.text}
        </div>
      </div>
    )
}

