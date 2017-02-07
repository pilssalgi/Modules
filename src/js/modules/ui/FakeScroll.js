var Bind = require('../util/Bind');
var FakeScroll = function(target,scroll,speed,option){
  var windowSize  = require('../util/WindowSize');
  this.name     = 'FakeScroll';
  this.height   = 0;
  this.position = {x:0,y:0,oldX:0,oldY:0};
  this.speed    = typeof speed == 'undefined'?0.1:speed;
  this.target   = target;
  var $fakeDom  = $('<figure></figure>');
  var screenSize = windowSize();
  var _this = this;
  var config = {isTop:true};
  var scroll = {y:0};
  var ticking = false;
  if(option)$.extend(config,option);
  /* ************************************************************
    Setup  
  ************************************************************ */
  function setup(){
    $(window).on('scroll',onScroll);
    $('body').css({height:$scrollTarget.outerHeight()});

    $(window).on('resize',function(){
      screenSize = windowSize();
      _this.sizeUpdate();
    });
  }

  function onScroll(){
    if(!ticking){
      update();
    }
    ticking = true;
  }
  /* ************************************************************
    Rendering
  ************************************************************ */
  function update(){
    requestAnimationFrame(function(){
      scroll.y = window.pageYOffset || document.documentElement.scrollTop;
      _this.position.y += (scroll.y-_this.position.y)*_this.speed;
      _this.position.y = Number(_this.position.y.toFixed(2));
      var distance = Math.abs(_this.position.y-scroll.y);
      if(distance < .1){
        // _this.position.y = Math.floor(scroll.y);
        _this.positionUpdate();
        ticking = false;
      }else{
        update();
      }
      
      if(_this.position.y != _this.position.oldY){
        _this.positionUpdate();
      }

      _this.position.oldY = _this.position.y;
    });
  }

  this.sizeUpdate = function(){
    this.height = $scrollTarget.outerHeight();
    $('body').css({height:this.height});
  }

  this.positionUpdate = function(){
    this.target.style.transform ="translate3d(0px,"+(-this.position.y)+"px,0)";//this.translate3d(0,-this.position.y+'px',0);
  }


  /* ************************************************************
      
  ************************************************************ */
  
  this.translate3d = function(x,y,z){
    var css3 = "translate3d("+x+","+y+","+z+")";
    return css3;
    // return {
    //   "-webkit-transform" : css3,
    //   "transform"         : css3
    // };
  }

  setup.call(this);
  return;
}
module.exports = FakeScroll;
