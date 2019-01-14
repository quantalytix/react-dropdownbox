
class ReactDropdownHelper {
  flattenData(arr1) {
    // flatten object array to include items and identify group objects in 
    // a single dimension array
    let array = arr1.reduce((acc, val) => Array.isArray(val.children) ? acc.concat({ node: val.node, isGroup: true, key: val.key, value: val.value }, this.flattenData(val.children)) : acc.concat({ node: val.node, key: val.key, value: val }), []);
    return array;
  }

  createInternalNodeArray(arr1, count = 0) {
    let internalNodeArray = []
    arr1.forEach(itemObj => {
      let item = this.createItemNode(count, itemObj)
      count += 1
      // would the children ever not be an array?
      // if (Array.isArray(itemObj.children)) {
      if (itemObj.children) {
        let result = this.createInternalNodeArray(itemObj.children, count)
        item.children = result.array
        count = result.count
      }
      internalNodeArray.push(item)
    })
    return { array: internalNodeArray, count: count };
  }

  createItemNode(id, item) {
    return { node: id, children: null, value: item.value, key: item.key };
  };
}
export { ReactDropdownHelper };