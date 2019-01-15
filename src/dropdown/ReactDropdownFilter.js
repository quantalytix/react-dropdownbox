
class ReactDropdownFilter {

  constructor(){
    this.filterList = this.filterList.bind(this);
  }

  //both list and search are arrays for parameters
  filterList(list, search) {
    let results = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].children) {
        let objCopy = Object.assign({}, list[i]);        
        objCopy.children = this.filterList(list[i].children, search);
        if (objCopy.children.length > 0) results.push(objCopy);
      }
      else {
        for (let n = 0; n < search.length; n++) {
          if (search[n] !== '') {
            let regExp = this.buildRegEx(search[n]);
            if (this.checkIfMatch(list[i], regExp)) {
              // need to check if results are already in the list
              if (!this.checkDuplicate(list[i], results)) {
                results.push(list[i]);
              }
            }
          }
        }
      }
    }
    return results;
  }

  checkIfMatch(item, regExp) {
    return item.text.match(regExp);
  }

  buildRegEx(str) {
    let sanitized = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    return new RegExp('^' + sanitized + '', "gmi");
  }

  checkDuplicate(item, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i] === item) return true;
    }
    return false;
  }
}
export { ReactDropdownFilter };