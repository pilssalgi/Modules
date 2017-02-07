var ArrayUtil = {
  shuffle : function(array){
    var n = array.length, t, i;
    while (n) {
      i = Math.floor(Math.random() * n--);
      t = array[n];
      array[n] = array[i];
      array[i] = t;
    }
    return array;
  },

  ascendingSort : function(array,key) {
    array.sort(function(a, b) { // 오름차순
      return a[key] - b[key];
    });
  },

  descendingSort : function(array,key) {
    array.sort(function(a, b) { // 내림차순
      return b[key] - a[key];
    });
  }
}
module.exports = ArrayUtil;