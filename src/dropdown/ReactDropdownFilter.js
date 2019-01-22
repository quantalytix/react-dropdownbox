
  //both list and search are arrays for parameters
  const filterList = (list, search) => {
    let results = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].children) {
        let objCopy = Object.assign({}, list[i]);        
        objCopy.children = filterList(list[i].children, search);
        if (objCopy.children.length > 0) results.push(objCopy);
      }
      else {
        for (let n = 0; n < search.length; n++) {
          if (search[n] !== '') {
            let regExp = buildRegEx(search[n]);
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
  }

  const checkIfMatch = (item, regExp) => {
    return item.text.match(regExp);
  }

  const buildRegEx = (str) => {
    let sanitized = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    return new RegExp('^' + sanitized + '', "gmi");
  }

  const checkDuplicate = (item, list) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i] === item) return true;
    }
    return false;
  }
  
export { filterList };