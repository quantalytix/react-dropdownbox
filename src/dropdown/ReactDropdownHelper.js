
  export const flattenData = (arr1) => {
    // flatten object array to include items and identify group objects in 
    // a single dimension array
    let reducer = (acc, val) => {
      if (Array.isArray(val.children)) {
        return acc.concat(
          { 
            node: val.node, 
            isGroup: true, 
            key: val.key, 
            value: val.value,
            text: val.text
          }, 
          flattenData(val.children)
        )
      } else {
        return acc.concat(
          { 
            node: val.node, 
            key: val.key, 
            value: val ,
            text: val.text
          }
        )
      }
    }
    return arr1.reduce(reducer, [])
  }


  export const createInternalNodeArray = (arr1, count = 0) => {
    let internalNodeArray = []
    arr1.forEach(itemObj => {
      let item = createItemNode(count, itemObj)
      count += 1
      if (Array.isArray(itemObj.children)) {
        let result = createInternalNodeArray(itemObj.children, count)
        item.children = result.array
        count = result.count
      }
      internalNodeArray.push(item)
    })
    return { array: internalNodeArray, count: count };
  }

  const createItemNode = (id, item) => {
    return { node: id, children: null, text: item.text, value: item.value, key: item.key };
  };