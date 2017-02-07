
/*! modernizr 3.3.1 (Custom Build) | MIT *
 * http://modernizr.com/download/?-devicemotion_deviceorientation-setclasses !*/
!function(e,n,o){function s(e,n){return typeof e===n}function a(){var e,n,o,a,i,l,r;for(var c in f)if(f.hasOwnProperty(c)){if(e=[],n=f[c],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(o=0;o<n.options.aliases.length;o++)e.push(n.options.aliases[o].toLowerCase());for(a=s(n.fn,"function")?n.fn():n.fn,i=0;i<e.length;i++)l=e[i],r=l.split("."),1===r.length?Modernizr[r[0]]=a:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=a),t.push((a?"":"no-")+r.join("-"))}}function i(e){var n=r.className,o=Modernizr._config.classPrefix||"";if(c&&(n=n.baseVal),Modernizr._config.enableJSClass){var s=new RegExp("(^|\\s)"+o+"no-js(\\s|$)");n=n.replace(s,"$1"+o+"js$2")}Modernizr._config.enableClasses&&(n+=" "+o+e.join(" "+o),c?r.className.baseVal=n:r.className=n)}var t=[],f=[],l={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var o=this;setTimeout(function(){n(o[e])},0)},addTest:function(e,n,o){f.push({name:e,fn:n,options:o})},addAsyncTest:function(e){f.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=l,Modernizr=new Modernizr;var r=n.documentElement,c="svg"===r.nodeName.toLowerCase();Modernizr.addTest("devicemotion","DeviceMotionEvent"in e),Modernizr.addTest("deviceorientation","DeviceOrientationEvent"in e),a(),i(t),delete l.addTest,delete l.addAsyncTest;for(var d=0;d<Modernizr._q.length;d++)Modernizr._q[d]();e.Modernizr=Modernizr}(window,document);
var UA = require('../info/UA')();
function MouseMove($target){
  var global = this;
  var config = {
    moveOffset : { x: 0.3, y:0.1 }
  }
  this.position = {x:0,y:0,cx:0,cy:0,rx:0,ry:0};
  this.vx = 0.02;
  this.vy = 0.02;

  function init(){
    if(UA.isPC){ // gyroscope support
      setMouseMoveEvent();
    } else      
    if(Modernizr.deviceorientation) {
      setOrientationEvent();
    }
  }

  function setMouseMoveEvent(){
    $target.on('mousemove',onMouseMove);
  }

  var isLandscape = false, orienRotion = 0, offset = 2;
  function setOrientationEvent(){
    window.ondeviceorientation = function(e){
      var x = e.beta,
          y = e.gamma;
      
      if(isLandscape){
        x = e.gamma;
        y = e.beta*(orientation>0?1:-1);
      }

      if(orienRotion == 180){
        x = e.beta*-1;
        y = e.gamma*-1;
      }

      if (x >  90) { x =  90; y *= -1;};
      if (x < -90) { x = -90; };


      global.position.cx = y/90;
      global.position.cy = x/90;

      global.position.rx = y/90;
      global.position.ry = x/90;
      
      if(UA.isSmartPhone){
        global.position.cy = global.position.ry = 0;
      }else{
      }
      global.update();
    };

    $(window).on("orientationchange",function(){
      orienRotion = window.orientation;
      // alert(orienRotion)
      if(window.orientation == 0){ // Portrait
        isLandscape = false;
      }else{ // Landscape
        isLandscape = true;
      }
    });

    $(window).trigger("orientationchange");
  }

  this.update = function(){

  }

  function onMouseMove(e){
    var offset = $target.offset();
    global.position.x   = e.clientX - offset.left;
    global.position.y   = e.clientY - offset.top;
    global.position.cx  = (e.clientX - offset.left - $target.outerWidth() * 0.5)*config.moveOffset.x;
    global.position.cy  = (e.clientY - offset.top - $target.outerHeight() * 0.5)*config.moveOffset.y;
    global.position.rx  = (global.position.x-$target.outerWidth() * 0.5)/$target.outerWidth();
    global.position.ry  = (global.position.y-$target.outerHeight() * 0.5)/$target.outerHeight();
    global.update();
  }
  init();
  return this;
}
MouseMove.prototype.constructor = MouseMove;
module.exports = MouseMove;
