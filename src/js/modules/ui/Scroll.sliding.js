(function(){
/* ************************************************************
  title  : Scroll ver 0.1.4
  date   : 2014.05
  author : Heowongeun
  modifications :
      - changed speed
      - changed friction
  features : 
      - added scroll bar, 
      - target moves by scroll bar
      - scroll x,y
  require : 
      TweenLite
************************************************************ */

//scroll = new Scroll({speed:.1, friction:0.1, step:scrolling});
var _bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
var UA = require('../info/UA')();
var getPagePos = function(e){
  var pos, touch;
  pos = {x:0, y:0};
  if("ontouchstart" in window) {
    if (e.touches != null) {
        touch = e.touches[0];
    } else {
        touch = e.originalEvent.touches[0];
    }
    pos.x = touch.clientX;
    pos.y = touch.clientY;
  } else {
    pos.x = e.clientX;
    pos.y = e.clientY;
  }
  return pos;
}

var nv  = window.navigator,
  ua  = nv.userAgent.toLowerCase(),
  uas = {
    mac : /mac/i.test(nv['platform']),
    win : /win/i.test(nv['platform']),
    isLtIE9 : /msie\s(\d+)/.test(ua)?RegExp.$1 * 1 < 9:false
  }
/* *********************************************************
*  Constructor 
********************************************************** */

function Scroll(option){
  this.scrollBar;
  this.config     = {
    target      : document,
    speed       : .1,
    friction    : 0.1,
    freeze      : false,
    type        : "wheel",
    scrollType  : "y",
    screenFix   : false,
    scrollLimit : 30,
    scrollBar   : null,
    step        : function(){},
    start       : function(){},
    stop        : function(){},
    touchStart  : function(){},
    touchMove   : function(){},
    touchEnd    : function(){}
  }

  this.touchStart = {}; 
  this.touchOld = {};

  $.extend(this.config,option);
  this.config.friction = 1-Math.max(0,Math.min(1,this.config.friction));
  if(this.config.friction >= 1 )this.config.friction = 0.99;

  if(this.config.scrollBar){
    var sbInfo = this.config.scrollBar;
    this.scrollBar = new ScrollBar(
      sbInfo.moveTarget,
      sbInfo.scrollBarWrap,
      $.extend({scrollClass:this,scrollType:this.config.scrollBar.scrollType},sbInfo.option == 'undefined'?{}:sbInfo.option)
    );
  }

  this.offset         = 0;
  this.offsetMax      = 0;
  this.offsetMin      = 0;      
  this.isRender       = false;
  this.renderingID;
  this.onRender       = _bind(this.onRender,this);

  
  //wheelEvent
  this.onWheel = _bind(this.onWheel,this);
  // $(this.config.target).bind("mousewheel", this.onWheel);
  $(this.config.target).bind("mousewheel", $.throttle( 10, this.onWheel ) );
  //touchEvent
  this.onTouchStart   = _bind(this.onTouchStart,this);
  this.onTouchMove    = _bind(this.onTouchMove,this);
  this.onTouchEnd     = _bind(this.onTouchEnd,this);
  this.touchOld = {x:0,y:0};

  $(this).bind('ScrollBarEvents',this.eventListener);

  if(!UA.isPC){
    $(this.config.target).bind("touchstart", this.onTouchStart);
    $(this.config.target).bind("touchmove", this.onTouchMove);
    $(this.config.target).bind("touchend", this.onTouchEnd);
  }
  return this;
};

Scroll.prototype.constructor = Scroll;
Scroll.prototype.init = function(){

}

Scroll.prototype.optionChange = function(option){
  $.extend(this.config,option);
}

/* *********************************************************
*  SCROLL EVENT 
********************************************************** */
Scroll.prototype.EVENT_FREEZE_ON           = "freezeOn";
Scroll.prototype.EVENT_FREEZE_OFF          = "freezeOff";

// Scroll.prototype.EVENT_TOUCHSTART       = "touch_start";
// Scroll.prototype.EVENT_TOUCHEND         = "touch_end";

// Scroll.prototype.EVENT_SCROLLSTART      = "scroll_start";
// Scroll.prototype.EVENT_SCROLLAFTER      = "scroll_after";

// Scroll.prototype.event_dispatch = function(event){
  // $(this).trigger(event);
// }

Scroll.prototype.eventDispatcher = function(events){
  $(this).trigger('ScrollBarEvents',events);
}
Scroll.prototype.eventListener = function(event,data){
  switch(data) {
    case this.EVENT_FREEZE_ON  : this.config.freeze = true; break;
    case this.EVENT_FREEZE_OFF : this.config.freeze = false; break;
  }
}

/* *********************************************************
*  Event Handler
********************************************************** */

Scroll.prototype.onTouchStart = function(e){
  if(this.config.freeze)return;
  this.isTouch = true;
  this.startRender();
  this.config.touchStart();

  this.touchStart = this.getTouchInfo(e);
  this.touchOld.x = this.touchStart.x;
  this.touchOld.y = this.touchStart.y;
}

Scroll.prototype.onTouchMove = function(e){
  if(this.config.freeze)return;
  if(this.config.screenFix)e.preventDefault();
  this.startRender();
  var move  = this.getTouchInfo(e);
  var vf = (this.touchOld.y-move.y)*this.config.speed;
  this.touchMoveOffset += Math.round(vf);

  this.touchOld.x = move.x;
  this.touchOld.y = move.y;

  this.offset += Math.round(vf);
}

Scroll.prototype.onTouchEnd = function(e){
  if(typeof this.t_moveP == 'undefined')return;
  this.isTouch = false;
}


Scroll.prototype.getTouchInfo = function(e){
  if(!this.time)this.time = new Date();
  var info = { x : 0 , y : 0 , time: new Date().getTime()};
  $.extend(info,getPagePos(e));
  return info;
}

Scroll.prototype.onWheel = function(event, delta, deltaX, deltaY){
  var del = 0;
  if(uas.isLtIE9){
      del = delta;
  }else{
    switch(this.config.scrollType){
      case "x" : del = deltaX; break;
      case "y" : del = deltaY; break;
    }
  }

  if(uas.win){
    del*=50;
  }else if(UA.isMozilla && !UA.isWebkit){
    del*=5;
  }
  // else del*=0.05;
  // del *= 0.1;

  this.offset += -del*this.config.speed;
  this.startRender();
}

/* *********************************************************
*  Rendering
********************************************************** */
Scroll.prototype.startRender = function(){
  if(typeof this.renderingID == 'undefined'){
    // this.event_dispatch(this.EVENT_SCROLLSTART);
    this.config.start();
    this.renderingID = requestAnimationFrame(this.onRender);
  }
}

Scroll.prototype.stopRender = function(){
  this.config.stop();
  cancelAnimationFrame(this.renderingID);
  this.renderingID = undefined;
  this.offset = 0;
}

Scroll.prototype.onRender = function(){
  if(Math.abs(this.offset) < 0.001 && !this.isTouch){
    this.stopRender();
    this.config.step(this.offset);
    // this.event_dispatch(this.EVENT_SCROLLAFTER);
    return;
  }

  if(this.config.friction != 0)this.offset *= this.config.friction;
  
  this.config.step(this.offset);
  this.renderingID = requestAnimationFrame(this.onRender);
  if(this.config.stats && !uas.isLtIE9)this.stats();

  if(this.scrollBar)this.scrollBar.onScrolling(this.offset);
  
  if(this.config.friction == 0){
      this.stopRender();
      this.config.step(this.offset);
  }
}


/* ************************************************************
  stats
************************************************************ */
Scroll.prototype.stats = function(){
  if(typeof this.scrollStatus == 'undefined'){
    this.scrollStatus = $("<div id='scrollStatus'></div>").prependTo(this.config.target);
    this.scrollStatus.css({
      'position' : 'absolute',
      'z-index': 1000000,
      'padding': 10,
      'font-size' : 10,
      'font-weight' : 300,
      'text-transform' : 'uppercase',
      'background-color' : 'rgba(255,0,0,.9)',
      'color' : '#fff',
      'width' : 200,
      'letter-spacing' : '0.02em',
      'line-height' : '1.7em',
      'font-family' : 'Helvetica'
    })
  }

  this.scrollStatus.html(
    "scroll type = " + this.config.scrollType + "<br>" +
    "scroll speed = " + this.config.speed + "<br>" +
    "scroll offset = " + this.offset.toFixed(2)
  )
}
// this.Scroll = Scroll;



/* ************************************************************
title  : Scroll Bar ver 0.01
date   : 2015.02
author : Heowongeun
************************************************************ */
function ScrollBar(moveTarget,scrollBarWrap,option){
  this.moveTarget = $(moveTarget);
  this.moveTargetParent = this.moveTarget.parent();
  this.scWrap     = $(scrollBarWrap);
  this.scBarHit   = $('<div class="scbar-hitarea"></div>').appendTo(this.scWrap);
  this.scBarIn    = $('<div class="scbar-inner"></div>').appendTo(this.scWrap);
  this.scBar      = $('<div class="scbar"></div>').appendTo(this.scBarIn);
  this.isDrag     = false;
  this.isMiniSize = false;

  this.config = {
    scrollType  : 'y',
    freeze      : false,
    minSize     : true,
    bounceFriction  : 0.2,
    dragSpeed   : 0.2
  };

  this.positions = {
    dragging    : {x:0,y:0},
    onDownPos  : {x:0,y:0},
    onDownScrollTop : 0,
    onDownScrollLeft : 0,
  }

  this.scroll = {
    top         : 0,
    left        : 0,
    width       : 0,
    height      : 0,
    current     : 0,
    total       : 0,
    range       : 0,
    ratio       : 0,
    ratioOld    : 0
  }

  this.renderingID = undefined;
  if(typeof option != undefined)$.extend(this.config,option);
  
  this.init = function(){
    this.addEvent();
    return this;
  }
  // this.sizeOrigin();
  this.addEvent = function(){
    this.onMouseOver    = _bind(this.onMouseOver,this);
    this.onMouseOut     = _bind(this.onMouseOut,this);
    this.onMouseDown    = _bind(this.onMouseDown,this);
    this.onMouseUp      = _bind(this.onMouseUp,this);
    this.onMouseMove    = _bind(this.onMouseMove,this);
    this.onResize       = _bind(this.onResize,this);
    this.onRender       = _bind(this.onRender,this);

    this.eventListener  = _bind(this.eventListener,this);

    this.scBar.bind('mousedown',this.onMouseDown);
    this.scWrap.bind('mouseover',this.onMouseOver);
    this.scWrap.bind('mouseout',this.onMouseOut);

    $(this).bind('ScrollBarEvents',this.eventListener);
    $(window).bind('resize',this.onResize);
    this.onResize();
  }

  this.init();
  return this;
};

/* *********************************************************
*  SCROLL EVENT 
********************************************************** */
ScrollBar.prototype.EVENT_FREEZE_ON           = "freezeOn";
ScrollBar.prototype.EVENT_FREEZE_OFF          = "freezeOff";

// Scroll.prototype.EVENT_TOUCHEND         = "touch_end";
// Scroll.prototype.EVENT_SCROLLSTART      = "scroll_start";
// Scroll.prototype.EVENT_SCROLLAFTER      = "scroll_after";

// Scroll.prototype.event_dispatch = function(event){
  // $(this).trigger(event);
// }


ScrollBar.prototype.eventDispatcher = function(events){
  $(this).trigger('ScrollBarEvents',events);
}
ScrollBar.prototype.eventListener = function(event,data){
  switch(data) {
    case this.EVENT_FREEZE_ON  : this.config.freeze = true; break;
    case this.EVENT_FREEZE_OFF : this.config.freeze = false; break;
  }
}

ScrollBar.prototype.scrollTop = function(){
  return this.scroll.top;
}

ScrollBar.prototype.scrollMove = function(y,duration,onComplete){

  this.eventDispatcher(this.EVENT_FREEZE_ON);
  this.config.scrollClass.eventDispatcher(this.EVENT_FREEZE_ON);

  var _this = this;
  TweenLite.to(this.scroll,duration,{current:y,ease:Power4.easeInOut
    ,onUpdate:function(){
      _this.calculate();
      _this.update();
    }
    ,onComplete:function(){
      if(onComplete)onComplete();
      _this.eventDispatcher(_this.EVENT_FREEZE_OFF);
      _this.config.scrollClass.eventDispatcher(_this.config.scrollClass.EVENT_FREEZE_OFF);
    }
  });
}

ScrollBar.prototype.sizeMini = function(){
  if(!this.isMiniSize){
    this.isMiniSize = true;
  }
  
}

ScrollBar.prototype.sizeOrigin = function(){
  if(this.isMiniSize){
    this.isMiniSize = false;
  }
}

ScrollBar.prototype.onMouseOver = function(e){
  this.sizeOrigin();
  this.isDrag = true;
}

ScrollBar.prototype.onMouseOut = function(e){
  this.isDrag = false;
  // this.sizeMini();
}

ScrollBar.prototype.onMouseDown = function(e){
  if(this.config.freeze)return;
  e.preventDefault(); e.stopImmediatePropagation();

  switch(this.config.scrollType){
    case 'x' : 
      this.positions.onDownScrollLeft = this.scroll.left;
      this.positions.onDownPos.x = e.clientX;
      break;
      this.positions.onDownScrollTop = this.scroll.top;
      this.positions.onDownPos.y = e.clientY;
    case 'y' :
      break;
  }


  
  $('body').addClass('select-none');
  $(document).bind('mousemove',this.onMouseMove);
  $(document).bind('mouseup',this.onMouseUp);

  this.isDrag = true;
  if(this.config.scrollClass)this.config.scrollClass.stopRender();
}

ScrollBar.prototype.onMouseUp = function(e){
  $('body').removeClass('select-none');
  $(document).unbind('mousemove',this.onMouseMove);
  $(document).unbind('mouseup',this.onMouseUp);

  this.isDrag = false;
}

ScrollBar.prototype.onMouseMove = function(e){
  if(this.config.freeze)return;
  switch(this.config.scrollType){
    case 'x' : 
      this.positions.dragging.x = this.positions.onDownScrollLeft+e.clientX-this.positions.onDownPos.x;
      if(this.positions.dragging.x < 0)this.positions.dragging.x = 0;
      if(this.positions.dragging.x > this.scroll.range)this.positions.dragging.x = this.scroll.range;
      break;
    case 'y' :
      this.positions.dragging.y = this.positions.onDownScrollTop+e.clientY-this.positions.onDownPos.y;
      if(this.positions.dragging.y < 0)this.positions.dragging.y = 0;
      if(this.positions.dragging.y > this.scroll.range)this.positions.dragging.y = this.scroll.range;
      break;
  };

  this.startRender();
}

ScrollBar.prototype.startRender = function(){
  if(typeof this.renderingID == 'undefined'){
    this.renderingID = requestAnimationFrame(this.onRender);
  }
}

ScrollBar.prototype.stopRender = function(){
  if(typeof this.renderingID != 'undefined'){
    cancelAnimationFrame(this.renderingID);
    this.renderingID = undefined;
    this.positions.dragging.x = 0;
    this.positions.dragging.y = 0;
  }
}

ScrollBar.prototype.onRender = function(){
  switch(this.config.scrollType){
    case 'x' : 
      if(Math.abs(this.scroll.left-this.positions.dragging.x) < 0.001){
          this.stopRender();
          return;
      }

      this.scroll.left += (this.positions.dragging.x-this.scroll.left)*this.config.dragSpeed;
      this.scroll.ratio  = (this.scroll.left/this.scroll.range).toFixed(5);
      this.scroll.current = this.scroll.ratio * this.scroll.total;

      break;

    case 'y' : 
      if(Math.abs(this.scroll.top-this.positions.dragging.y) < 0.001){
          this.stopRender();
          return;
      }

      this.scroll.top += (this.positions.dragging.y-this.scroll.top)*this.config.dragSpeed;
      this.scroll.ratio  = (this.scroll.top/this.scroll.range).toFixed(5);
      this.scroll.current = this.scroll.ratio * this.scroll.total;

      break;
  }


  

  this.update();
  this.renderingID = requestAnimationFrame(this.onRender);
}


ScrollBar.prototype.onScrolling = function(delta){
  this.stopRender();
  switch(this.config.scrollType){
    case 'x' : this.scroll.current += delta; break;
    case 'y' : this.scroll.current += delta; break;
  }

  if(this.scroll.current < 0)this.scroll.current += -this.scroll.current*this.config.bounceFriction;
  if(this.scroll.current > this.scroll.total)this.scroll.current += (this.scroll.total-this.scroll.current)*this.config.bounceFriction;
  this.calculate();
  this.update();
}

ScrollBar.prototype.calculate = function(delta){
  this.scroll.ratio   = (this.scroll.current/this.scroll.total).toFixed(5);
  if(this.scroll.total <= 0)this.scroll.ratio = 0;
  switch(this.config.scrollType){
    case 'x' : this.scroll.left = this.scroll.ratio * this.scroll.range; break;
    case 'y' : this.scroll.top = this.scroll.ratio * this.scroll.range; break;
  }
}

ScrollBar.prototype.update = function(){
  switch(this.config.scrollType){
    case 'x' : 
      if(this.scroll.ratio == this.scroll.ratioOld)return;
      this.scBar.css(translate(this.scroll.left,0));
      this.moveTarget.css(translate(-this.scroll.ratio*this.scroll.total,0));
    break;

    case 'y' : 
      if(this.scroll.ratio == this.scroll.ratioOld)return;
      this.scBar.css(translate(0,this.scroll.top));
      this.moveTarget.css(translate(0,-this.scroll.ratio*this.scroll.total));
      // TweenLite.set(this.scBar,{y:this.scroll.top});
      // TweenLite.set(this.moveTarget,{y:-this.scroll.ratio*this.scroll.total.y});
    break;
  }

  this.scroll.ratioOld = this.scroll.ratio;

  if(this.config.scrollClass){
    this.config.scrollClass.config.step();
  }
}


function translate(x,y){
  var css3 = "matrix(1,0,0,1,"+x+","+y+")";
  return{
      "-webkit-transform" : css3,
      "transform"         : css3
  };
}


ScrollBar.prototype.onResize = function(e){
  switch(this.config.scrollType){
    case 'x' : 
      this.scroll.total   = this.moveTarget.innerWidth()-this.moveTargetParent.innerWidth();
      if(this.scroll.total<0)this.scroll.total = 0;
      this.scroll.width  = (this.moveTargetParent.innerWidth()/this.moveTarget.innerWidth())*this.scBarIn.innerWidth();
      this.scBar.css({width:this.scroll.width});
      this.scroll.range   = this.scBarIn.innerWidth()-this.scBar.innerWidth();
      break;
    case 'y' : 
      this.scroll.total   = this.moveTarget.innerHeight()-this.moveTargetParent.innerHeight();
      if(this.scroll.total<0)this.scroll.total = 0;
      this.scroll.height  = (this.moveTargetParent.innerHeight()/this.moveTarget.innerHeight())*this.scBarIn.innerHeight();
      this.scBar.css({height:this.scroll.height});
      this.scroll.range   = this.scBarIn.innerHeight()-this.scBar.innerHeight();
      break;
  }
  
  this.onScrolling(0);
  this.update();
}

ScrollBar.prototype.construcore = ScrollBar;
this.ScrollBar = ScrollBar;
module.exports = Scroll;
}).call(this);






