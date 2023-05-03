'use strict';

const compareBookDetails = (arr_1, arr_2) => {
    const result = [];
  
    for (let i = 0; i < arr_1.length; i++) {
      const curItem = arr_1[i];
      const matchedItem = arr_2.find((item) => item.bookName === curItem.bookName);
  
      if (matchedItem) {
        result.push(matchedItem);
      } else {
        result.push(curItem);
      }
    }
  
    for (let i = 0; i < arr_2.length; i++) {
      const item = arr_2[i];
      const matchedItem = result.find((resultItem) => resultItem.bookName === item.bookName);
  
      if (!matchedItem) {
        result.push(item);
      }
    }
  
    return result;
}

module.exports = {
    compareBookDetails,
};