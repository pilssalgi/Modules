(function(){
  var UA = require('./UA')();
  var Util = require('./Util').Util;
  var _bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  var ScrollAndTouch = function(option){
    var TouchUtil = Util.Touch;
    var wasSetup = false;
    this.config     = {
      target      : document,
      freeze      : false,
      type        : "wheel",
      screenFix   : false,
      dragAndDrop : true,
      touchStart  : function(){},
      touchMove   : function(){},
      touchEnd    : function(){}
    }

    $.extend(this.config,option);


    this.setup = function(){
      if(!wasSetup){
        this.onScroll = _bind(this.onScroll,this);
        this.onDown = _bind(this.onDown,this);
        this.onMove = _bind(this.onMove,this);
        this.onUp = _bind(this.onUp,this);

        $(this.config.target).bind('mousewheel',this.onScroll);
        TouchUtil.getTouchEvent(this.config.target);
      }
    }

    this.onScroll   = function(event, delta, deltaX, deltaY){
      console.log(delta, deltaX, deltaY);
    }
   

    this.setup();
    return this;
  }

  ScrollAndTouch.prototype.constructor = ScrollAndTouch;

  module.exports = ScrollAndTouch;
}).call(this);