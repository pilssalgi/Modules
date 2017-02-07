/* ************************************************************
  get Window Size
************************************************************ */
var WindowSize = function(){
  var size = { width:0,height:0};
  if (document.documentElement.clientHeight) {
      size.width = document.documentElement.clientWidth;
      size.height = document.documentElement.clientHeight;
  } else if (document.body.clientHeight) {
      size.width = document.body.clientWidth;
      size.height = document.body.clientHeight;
  } else if (stage.height) {
      size.width = stage.width;
      size.height = stage.height;
  }

  size.halfX = size.width * 0.5;
  size.halfY = size.height * 0.5;
  return size;
}

module.exports = WindowSize;