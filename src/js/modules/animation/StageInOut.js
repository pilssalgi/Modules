var SelfPosition = require('../layout/SelfPosition');
var StageInOut = function($dom,scroll,option){
  this.target = $dom;
  this.isIn = false;

  var config = {
    offsetIn:0,
    offsetOut:0
  }

  $.extend(config,option);

  function setup(){
    this.__proto__ = new SelfPosition($dom);
    this.resize();
    return this;
  }

  this.update = function(){
    this._update(scroll.y);

    if(this.progress > config.offsetIn && this.progress < 1-config.offsetIn){
      if(!this.isIn){
        this.in(this.direct<0?-1:1);
        this.isIn = true;
      }
    }

    if(this.progress < -config.offsetOut || this.progress > 1+config.offsetOut){
      if(this.isIn){
        this.out(this.direct<0?-1:1);
        this.isIn = false;
      }
    }

  }

  this.in = function(){

  }
  this.out = function(){

  }

  setup.call(this);
}
StageInOut.prototype.constructor = StageInOut;
module.exports = StageInOut;