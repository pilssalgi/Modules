/* ************************************************************
title  : Scroll Bar ver 0.01
date   : 2016.12
author : Heowongeun
************************************************************ */
var DragAndDrop = require('./DragAndDrop');
var Bind        = require('../util/Bind');
var windowSize  = require('../WindowSize');
var throttle    = require('throttle-debounce/throttle');
function ScrollBar($btn,$wrap,option){
  this.btn        = $btn;
  this.wrap       = $wrap;
  this.isDrag     = false;
  this.isMoving   = false;

  this.config = {
    direction : 'x',
    bounceFriction  : 0.2,
    dragSpeed : 0.2,
    update:function(){},
    end:function(){}
  };

  $.extend(this.config,option);

  this.drag      = {x:0,y:0,old:{x:0,y:0}};
  this.position     = {x:0,y:0,oldX:0,normal:{x:0,y:0}};
  this.fakePosition = {x:0,y:0,oldX:0};

  var $fakeBtn;
  var renderID = undefined;
  var maxWidth = 0, maxHeight = 0;
  var $win = $(window);
  
  function setup(){
    this.onDragStart    = Bind(this.onDragStart,this);
    this.onDragMove     = Bind(this.onDragMove,this);
    this.onDragStop     = Bind(this.onDragStop,this);
    this.barClick       = Bind(this.barClick,this);

    onRender  = Bind(onRender,this);
    onResize  = Bind(onResize,this);
    $fakeBtn  = $('<figure></figure>');
    // $btn.after($fakeBtn);
    $fakeBtn.css({
      position:'absolute',
      background:'red',
      left:$btn.css('left'),
      top:$btn.css('top'),
      marginLeft:$btn.css('marginLeft'),
      marginTop:$btn.css('marginTop'),
      cursor:'pointer',
      zIndex:10
    });

    $win.on('resize',throttle(10,onResize,false));
    // this.wrap.on('click',this.barClick);
    onResize();

    new DragAndDrop($btn,{
      onStart:this.onDragStart,
      onMove:this.onDragMove,
      onEnd:this.onDragStop
    });
  }

  this.barClick = function(e){
    this.drag.x = e.offsetX;
    this.renderStart();
  }

  function onResize(){
    maxWidth  = this.wrap.width();
    maxHeight = this.wrap.height();
    // $fakeBtn.css({width:$btn.width(),height:$btn.height()});
  }

  function onRender(){
    renderID = requestAnimationFrame(onRender);
    this.fakePosition.x = this.drag.x;

    if(this.fakePosition.x < 0)this.fakePosition.x = 0;
    if(this.fakePosition.x > maxWidth)this.fakePosition.x = maxWidth;
    // TweenLite.set($fakeBtn,{x:this.fakePosition.x,y:this.fakePosition.y});

    this.position.x += (this.fakePosition.x-this.position.x)*this.config.dragSpeed;
    this.position.y += (this.fakePosition.y-this.position.y)*this.config.dragSpeed;
    TweenLite.set(this.btn,{x:this.position.x,y:this.position.y});

    var disX = this.position.x-this.fakePosition.x,
        disY = this.position.y-this.fakePosition.y,
        dis = Math.sqrt(disX*disX+disY*disY);

    if(dis<0.01 && !this.isDrag){
      this.renderStop();
      this.config.end();
    }
    if(dis<0.1){
      this.position.x = this.fakePosition.x;
      this.position.y = this.fakePosition.y;
    }

    this.position.normal.x = this.position.x/maxWidth;
    this.position.normal.y = this.position.y/maxHeight;
    this.config.update(this.position);

  }

  this.renderStart = function(){
    if(!renderID)renderID = requestAnimationFrame(onRender);
  }

  this.renderStop = function(){
    cancelAnimationFrame(renderID);
    renderID = null;
  }

  this.setX = function(normal){
    this.fakePosition.x = this.position.x = normal*maxWidth;
    this.position.normal.x = normal;
    this.drag.x = normal*maxWidth;

    TweenLite.set(this.btn,{x:this.position.x,y:this.position.y});
    // onRender();
  }

  setup.call(this);
  return this;
};

ScrollBar.prototype.onDragStart  = function(e){
  this.btn.addClass('scrollHover');
  this.renderStart();
  this.drag.old.x = this.drag.x;
  this.isDrag = true;
}
ScrollBar.prototype.onDragMove   = function(e){
  this.isMoving = true;
  this.drag.x = -e.distance.x+this.drag.old.x;
  if(this.btn.hasClass('scrollHover'))this.btn.addClass('scrollHover');
}
ScrollBar.prototype.onDragStop   = function(e){
  this.isDrag = false;
  this.isMoving = false;
  this.btn.removeClass('scrollHover');
}
module.exports = ScrollBar;