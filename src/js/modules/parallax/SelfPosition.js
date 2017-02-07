var windowSize  = require('../util/WindowSize');
var Bind        = require('../util/Bind');
var SelfPosition = function(target){
  this.target       = target;
  this.isFar        = false;
  this.progress     = 0;
  this.progressOld  = 0;
  this.isStageIn    = true;
  this.clientRect   = this.target.getBoundingClientRect();
  this.stageSize    = { width:0, height:0 };
  this.offset       = {left:0,top:0,width:0,height:0};
  this.option = {
    margin        : 0,
    marginTop     : 0,
    marginBottom  : 0,
    scale         : 1,
    mouseMoveInfo : null
  }
}


SelfPosition.prototype._setup = function(target){
  this.target = target;
  this.resize = Bind(this.resize,this);
  $(window).on('resize',this.resize);
  this.resize();  
  return this;
}
SelfPosition.prototype.resize = function(){
  this.stageSize      = windowSize();
  this.offset.height  = this.target.height();
  this.offset.left    = this.target.offset().left;
  this.offset.top     = this.target.offset().top;
  this._update(document.body.scrollTop || document.documentElement.scrollTop);
}

SelfPosition.prototype._update = function(scrollY){
  if(Math.abs(this.clientRect.top) < this.stageSize.height*1.5){
    this.isFar = false;
  }else{
    this.isFar = true;
  }
  this.progress = 1-(this.clientRect.top+this.offset.height)/(this.stageSize.height+this.offset.height);
  if(this.progress >= 0 && this.progress <= 1){
    this.isStageIn = true;
  }else{
    this.isStageIn = false;
  }

  this.progressOld = this.progress;
}

SelfPosition.prototype.constructor = SelfPosition;
module.exports = SelfPosition;