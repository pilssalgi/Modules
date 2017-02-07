/**
* 2013.10.
* Heo Util ver 0.02
* Author : Heonwongeun
* FaceBook : https://www.facebook.com/heo.wongeun
*/

(function(){
  var Util = {};
  var UA = require('./UA')();
  if(typeof Heo == 'undefined')Heo = {};
  Heo.Util = Util;
  Util._bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  /* ************************************************************
      Change Image To Canvas
  ************************************************************ */
  Heo.Util.changeToCanvas = function($img){
    var w   = $img.width(),
        h   = $img.height();

    var image = new Image();
    image.src = $img.attr('src');
    image.onload = function(){
      w = image.width;
      h = image.height;

      var canvas = $('<canvas width="'+w+'" height="'+h+'"></canvas>').addClass($img[0].className).css({display:'block'});
      var ctx = canvas[0].getContext("2d");

      $img.before(canvas);
      $.extend(canvas.data(),$img.data());
      if($img[0].id != 'undefined')canvas.attr('id',$img[0].id);
      
      canvas.width    = w;
      canvas.height   = h;
      ctx.drawImage(image, 0, 0, w, h);
      $img.remove();
    }
  }

  /* ************************************************************
      Scroll Event On / Off
  ************************************************************ */
  var keys = {37: 1, 38: 1, 39: 1, 40: 1};
  function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;  
  }

  function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
  }
  Heo.Util.DisableScroll = function(){
    if (window.addEventListener) // older FF
    window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
  }

  Heo.Util.EnableScroll = function(){
    if (window.removeEventListener)
      window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
  }

  /* ***************************************************************************************
      set transition
      require : jQuery
  *************************************************************************************** */
  Util.Css = {};
  Util.Css.setTransition = function(obj,duration,ease){
    var css = duration +'s '+ease;
    obj.css({"-webkit-transition" : css, "transition" : css});
  },

  Util.Css.setTransitionDuration = function(obj,duration){
    var css = duration +'s';
    obj.css({"-webkit-transition-duration" : css, "transition-duration" : css});
  }

  Util.Css.setTransitionDelay = function(obj,duration){
    var css = duration +'s';
    obj.css({"-webkit-transition-delay" : css, "transition-delay" : css});
  }

  Util.Css.addWillChange = function(obj,property){
    obj[0].style.willChange = property;
  }

  Util.Css.removeWillChange = function(obj){
    obj[0].style.willChange = 'auto';
  }
  /* ************************************************************
      favorite ease
  ************************************************************ */
  /* ************************************************************
      Math
  ************************************************************ */
  Util.Math = {};
  Util.Math.getRandom = function(max,min){
    return Math.floor(Math.random() * (max - min)) + min;
  }

  Util.Math.getToRadian = function(degree){
    return Math.PI * degree / 180;
  }

  Util.Math.getToDegree = function(radian){
    return radian * 180 / Math.PI;
  }

  /* ************************************************************
      Array
  ************************************************************ */
  Util.Array = {};
  Util.Array.shuffle = function(array){
    var n = array.length, t, i;
    while (n) {
      i = Math.floor(Math.random() * n--);
      t = array[n];
      array[n] = array[i];
      array[i] = t;
    }
    return array;
  }

  Util.Array.ascendingSort = function(array,key) {
    array.sort(function(a, b) { // 오름차순
      return a[key] - b[key];
    });
  }

  Util.Array.descendingSort = function(array,key) {
    array.sort(function(a, b) { // 내림차순
      return b[key] - a[key];
    });
  }


  /* 이름순으로 정렬 */
  // student.sort(function(a, b) { // 오름차순
  //     return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  //     // 광희, 명수, 재석, 형돈
  // });
   
  // student.sort(function(a, b) { // 내림차순
  //     return a.name > b.name ? -1 : a.name < b.name ? 1 : 0;
  //     // 형돈, 재석, 명수, 광희
  // });
   
  //  나이순으로 정렬 
  // var sortingField = "age";
   
  // student.sort(function(a, b) { // 오름차순
  //     return a[sortingField] - b[sortingField];
  //     // 13, 21, 25, 44
  // });
   
  // student.sort(function(a, b) { // 내림차순
  //     return b[sortingField] - a[sortingField];
  //     // 44, 25, 21, 13
  // });

  /* ************************************************************
      Touch
      require : jQuery
  ************************************************************ */
  Util.Touch = {};
  Util.Touch.getTouchEvent = function(target,config){
    var touchMoveOffset = 0,
        touchStartPos = {},
        touchMovePos = {};
    var isDown = false;
    var infos = {
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
      onStart : function(e){},
      onMove : function(e){},
      onEnd : function(e){},
    };

    $.extend(_config,config);

    if(UA.isPC){
      $(target).bind('mousedown',onStart);
      $(target).bind('mousemove',onMove);
      $(target).bind('mouseup',onEnd);
    }else{
      $(target).bind('touchstart',onStart);
      $(target).bind('touchmove',onMove);
      $(target).bind('touchend',onEnd);
    }

    function onStart(e){
      if(UA.isPC)e.preventDefault();
      infos.start = getPageInfo(e);
      infos.move      = {x:0,y:0};
      infos.end       = {x:0,y:0};
      infos.distance  = {x:0,y:0};
      _config.onStart(infos);
      isDown = true;

      // if(UA.isPC){
      //   $(target).bind('mousemove',onMove);
        
      // }else{
      //   $(target).bind('touchmove',onMove);
        
      // }
    }

    function onMove(e){
      e.preventDefault();
      infos.move = getPageInfo(e);
      infos.distance.x = infos.start.x - infos.move.x;
      infos.distance.y = infos.start.y - infos.move.y;
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
      // if(UA.isPC){
      //   $(target).unbind('mousemove',onMove);
      // }else{
      //   $(target).unbind('touchmove',onMove);
      // }
    }
  }

  function getPageInfo(e){
    var info = {x:0, y:0}; 
    var supportTouch = 'ontouchstart' in window;
    if(UA.isMozilla && UA.isPC)supportTouch = false;
    if(supportTouch) {
      var touch;
      if (e.touches != null) {
        touch = e.touches[0];
      } else {
        touch = e.originalEvent.touches[0];
      }
      info.x = touch.clientX;
      info.y = touch.clientY;
    } else {
      info.x = e.clientX;
      info.y = e.clientY;
    }
    return info;
  }


  /* ************************************************************
      get Window Size
  ************************************************************ */
  Heo.Util.windowSize = function(){
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
  /* ************************************************************
      change scope
  ************************************************************ */
  Heo.Util.changeScope = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  module.exports = Heo;

}).call(this);

// HEO_Util = function(){
//     this.init = function(){}

//     /* ***************************************************************************************
//         set transition
//     *************************************************************************************** */

//     this.setTransition = function(obj,duration,easing){
//         var css = duration +'s '+easing;
//         obj.css({"-webkit-transition" : css, "transition" : css});
//     }

//     this.setTransitionDuration = function(obj,duration){
//         var css = duration +'s';
//         obj.css({"-webkit-transition-duration" : css, "transition-duration" : css});
//     }

//     /* ***************************************************************************************
//         get touch info
//     *************************************************************************************** */
//     this.touchHandler = function(target,callBack){
//         var touchMoveOffset = 0,
//             touchStartPos = {},
//             touchMovePos = {};

//         // console.log(target);
//         $(target).bind("touchstart", function(e){
//             touchMoveOffset = 0;
//             touchStartPos = getTouchInfo(e);
//             touchMovePos  = getTouchInfo(e);
//         });

//         $(target).bind("touchmove", function(e){
//             e.preventDefault();
//             touchMovePos = getTouchInfo(e);w
//             var movedY = touchStartPos.y - touchMovePos.y,
//                 movedX = touchStartPos.x - touchMovePos.x;
//             touchMoveOffset = Math.abs(movedX) < Math.abs(movedY)?0:movedX;
//         });
//         $(target).bind("touchend", function(e){
//             callBack(touchMoveOffset);
//         });
//     }

//      ***************************************************************************************
//         get window size
//     *************************************************************************************** 
//     this.windowSize = function(){
//         var size = { width:0,height:0};
//         if (document.documentElement.clientHeight) {
//             size.width = document.documentElement.clientWidth;
//             size.height = document.documentElement.clientHeight;
//         } else if (document.body.clientHeight) {
//             size.width = document.body.clientWidth;
//             size.height = document.body.clientHeight;
//         } else if (stage.height) {
//             size.width = stage.width;
//             size.height = stage.height;
//         }

//         size.halfX = size.width * 0.5;
//         size.halfY = size.height * 0.5;
//         return size;
//     }
//     this.init();

//     /* ************************************************************
      
//     ************************************************************ */
//     this.Renderer = function{
//         renderID : null,
//         list : {},

//         addList : function(name,fn){
//             this.list[name] = {update:fn,freeze:false};
//             return this.list[name];
//         },
//         start : function(){
//             var _this = this;
//             this.render = _bind(this.render,this)
//             this.renderID = requestAnimationFrame(this.render);
//         },

//         stop    : function(){},
//         render  : function(){
//             for(var o in this.list){
//                 if(!this.list[o].freeze)this.list[o].update();
//             }
//             this.renderID = requestAnimationFrame(this.render);
//         }
//     }

//     /* ************************************************************
      
//     ************************************************************ */
  
  
// }
// HEO_Util.prototype.constructor = HEO_Util;
// this.HEO_Util = HEO_Util;