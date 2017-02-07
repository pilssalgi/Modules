var UA = require('../info/UA')();
var DragAndDrop = function(target,config){
  var touchMoveOffset = 0,
      touchStartPos = {},
      touchMovePos = {};
  var isDown = false;
  var infos = {
    event:null,
    start:{x:0,y:0},
    move:{x:0,y:0},
    end:{x:0,y:0},
    distance:{x:0,y:0},
    distanceOffset : function(){
      return {x:Math.abs(this.distance.x),y:Math.abs(this.distance.y)};
    }
  }

  var _config = {
    moveWhileDown : true,
    targetOut:false,
    onStart : function(e){},
    onMove : function(e){},
    onEnd : function(e){},
  };

  $.extend(_config,config);

  if(UA.isPC){
    $(target).bind('mousedown',onStart);
    // $(document).bind('mousemove',onMove);
    // $(document).bind('mouseup',onEnd);
  }else{
    $(target).bind('touchstart',onStart);
    // $(document).bind('touchmove',onMove);
    // $(document).bind('touchend',onEnd);
  }

  function onStart(e){
    if(UA.isPC)e.preventDefault();
    infos.start     = getPageInfo(e);
    infos.move      = {x:0,y:0};
    infos.end       = {x:0,y:0};
    infos.distance  = {x:0,y:0};
    _config.onStart(infos)
    isDown = true;
    if(UA.isPC){
      $(document).on('mousemove',onMove);
      $(document).on('mouseup',onEnd);
      // $(document).on('mouseout',onEnd);
      if(_config.targetOut)$(target).on('mouseout',onEnd);
    }else{
      $(document).on('touchmove',onMove);
      $(document).on('touchend',onEnd);
    }
  }

  function onMove(e){
    // e.preventDefault();
    infos.move = getPageInfo(e);
    infos.distance.x = infos.start.x - infos.move.x;
    infos.distance.y = infos.start.y - infos.move.y;
    if(Math.abs(infos.distance.x)>Math.abs(infos.distance.y))e.preventDefault();

    if(_config.moveWhileDown){
      if(isDown)_config.onMove(infos);
    }else{
      _config.onMove(infos);
    }
  }

  function onEnd(e){
    infos.end = infos.move;
    if(_config.moveWhileDown){
      if(isDown)_config.onEnd(infos);
    }else{
      _config.onEnd(infos);
    }
    
    isDown = false;
    if(UA.isPC){
      $(document).off('mousemove',onMove);
      $(document).off('mouseup',onEnd);
      // $(document).off('mouseout',onEnd);
      if(_config.targetOut)$(target).off('mouseout',onEnd);
    }else{
      $(document).off('touchmove',onMove);
      $(document).off('touchend',onEnd);
    }
  }
  function getPageInfo(e){
    var info = {x:0, y:0}; 
    var supportTouch = 'ontouchstart' in window;
    var targetRect = {left:e.target.offsetLeft,top:e.target.offsetTop};
    if(UA.isMozilla && UA.isPC)supportTouch = false;
    if(supportTouch) {
      var touch;
      if (e.touches != null) {
        touch = e.touches[0];
      } else {
        touch = e.originalEvent.touches[0];
      }
      info.x = touch.clientX-targetRect.left;
      info.y = touch.clientY-targetRect.top;
    } else {
      info.x = e.clientX;
      info.y = e.clientY;
    }
    return info;
  }
}

DragAndDrop.prototype.constructor = DragAndDrop;
module.exports = DragAndDrop;

