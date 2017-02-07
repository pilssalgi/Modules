/* ***************************************************************************************
  will Change
  require : jQuery
*************************************************************************************** */
var _WillChange = {
  set:function($dom,property){
    $dom[0].style.willChange = property;
  },
  remove = function($dom){
    $dom[0].style.willChange = 'auto';
  }
};

module.exports = _WillChange