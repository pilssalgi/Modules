(function () {
  var Load_Image        = require('./modules/loader/Load_Image');
  var LoadingAnimation  = require('./class/ui/LoadingAnimation');
  var imgLoader         = new Load_Image();
  imgLoader.load($('body'),new LoadingAnimation(init));

  function init(){
    console.log(init);
  }

}).call(this);