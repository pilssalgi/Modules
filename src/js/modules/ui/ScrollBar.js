/* ************************************************************
title  : Scroll Bar ver 0.01
date   : 2016.12
author : Heowongeun
************************************************************ */
var DragAndDrop = require('./DragAndDrop');
var Bind        = require('../util/Bind');
var windowSize  = require('../util/WindowSize');
var throttle    = require('throttle-debounce/throttle');
function ScrollBar($btn,$wrap,option){
  this.btn        = $btn;
  this.wrap       = $wrap;
  this.isDrag     = false;
  this.isMoving   = false;

  this.config = {
    direction       : 'x',
    bounceFriction  : 0.2,
    dragSpeed       : 0.2,
    update          : function(){},
    end             : function(){}
  };

  $.extend(this.config,option);

  this.drag         = {x:0,y:0,vf:0,old:{x:0,y:0}};
  this.position     = {x:0,y:0,oldX:0,normal:{x:0,y:0}};
  this.fakePosition = {x:0,y:0,oldX:0};

  var $fakeBtn;
  var $win = $(window);
  var maxWidth = 0, maxHeight = 0;
  var ticking = false;
  
  function setup(){
    onDragStart    = Bind(onDragStart,this);
    onDragMove     = Bind(onDragMove,this);
    onDragStop     = Bind(onDragStop,this);
    barClick       = Bind(barClick,this);

    update    = Bind(update,this);
    onResize  = Bind(onResize,this);
    // $fakeBtn  = $('<figure></figure>');
    // $btn.after($fakeBtn);
    // $fakeBtn.css({
    //   position:'absolute',
    //   background:'red',
    //   left:$btn.css('left'),
    //   top:$btn.css('top'),
    //   marginLeft:$btn.css('marginLeft'),
    //   marginTop:$btn.css('marginTop'),
    //   cursor:'pointer',
    //   zIndex:10
    // });

    $win.on('resize',throttle(10,onResize,false));
    // this.wrap.on('click',this.barClick);
    onResize();

    new DragAndDrop($btn,{
      onStart:onDragStart,
      onMove:onDragMove,
      onEnd:onDragStop
    });
  }

  function onDragStart(e){
    this.btn.addClass('scrollHover');
    this.drag.old.x = this.drag.x;
    this.isDrag = true;
    if(!ticking){
      requestAnimationFrame(update);
      ticking = true;
    }
  }
  function onDragMove(e){
    this.isMoving = true;
    this.drag.x = -e.distance.x+this.drag.old.x;
  }
  function onDragStop(e){
    this.isDrag = false;
    this.isMoving = false;
    this.btn.removeClass('scrollHover');
    console.log('stop');
  }


  function barClick(e){
    this.drag.x = e.offsetX;
  }

  function onResize(){
    maxWidth  = this.wrap.width()-$btn.width();
    maxHeight = this.wrap.height();
    // $fakeBtn.css({width:$btn.width(),height:$btn.height()});
  }

  function update(){
    this.fakePosition.x = this.drag.x;

    if(this.fakePosition.x < 0)this.fakePosition.x = 0;
    if(this.fakePosition.x > maxWidth)this.fakePosition.x = maxWidth;
    // TweenLite.set($fakeBtn,{x:this.fakePosition.x,y:this.fakePosition.y});

    this.position.x += (this.fakePosition.x-this.position.x)*this.config.dragSpeed;
    // this.position.y += (this.fakePosition.y-this.position.y)*this.config.dragSpeed;

    this.btn[0].style.transform = this.transition(this.position.x,0,0);
    var distance = Math.abs(this.position.x-this.fakePosition.x);

    this.position.normal.x = this.position.x/maxWidth;
    // this.position.normal.y = this.position.y/maxHeight;
    this.config.update(this.position);
    
    if(distance<0.01 && !this.isDrag){
      ticking = false;
      this.config.end();
    }else{
      requestAnimationFrame(update);
    }

  }

  this.transition = function(x,y,z){
    return 'translate3d('+x+'px,'+y+'px,'+z+'px)';
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

module.exports = ScrollBar;