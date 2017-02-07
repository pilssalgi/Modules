/* ***************************************************************************************
  set transition
  require : jQuery
*************************************************************************************** */
var _Transition = {
  set : function($dom,duration,ease){
    var css = duration +'s '+ease;
    $dom.css({"-webkit-transition" : css, "transition" : css});
  },
  duration : function($dom,duration){
    var css = duration +'s';
    $dom.css({"-webkit-transition-duration" : css, "transition-duration" : css});
  },
  delay : function($dom,duration){
    var css = duration +'s';
    $dom.css({"-webkit-transition-delay" : css, "transition-delay" : css});
  }
}

module.exports = _Transition;