var SelfPosition = require('../layout/SelfPosition');
var Parallax = function($dom,scroll,option){
  this.target = $dom;
  this.over = false;
  
  var config = {
    offsetX:0,
    offsetY:0,
    offsetH:0,
    speed:0.1,
    moveTarget:null
  }

  this.y      = 0;
  this.x      = 0;
  this.width  = 0;
  this.height = 0;

  $.extend(config,option);

  function setup(){
    if(!config.moveTarget) config.moveTarget = $dom;
    this.__proto__ = new SelfPosition($dom);
    this.resize();
    return this;
  }

  this.update = function(){
    this._update(scroll.y);
    if(this.progress < 1 && this.progress > 0){
      this.over = true;
    }else{
      this.over = false;
    }

    if(this.progress<1.5 && this.progress > -0.5){
      // this.x += (-op.mouseMoveInfo.position.rx*10-this.x)*op.mouseMoveInfo.vx;
      this.y += ((-config.offsetY*this.progress)-this.y)*config.speed;
      this.height += ((100+config.offsetH*this.progress)-this.height)*config.speed;
      this.move();
    }
  }


  this.move = function(){
    config.moveTarget.css(this.translate3d(this.x+'px',this.y+'px',0));
    config.moveTarget.css({height:this.height+'%'});
  }

  this.translate3d = function(x,y,z){
    var css3 = "translate3d("+x+","+y+","+z+")";
    return {
      "-webkit-transform" : css3,
      "transform"         : css3
    };
  }

  setup.call(this);
}
Parallax.prototype.constructor = Parallax;
module.exports = Parallax;