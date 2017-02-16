var windowSize  = require('../util/WindowSize');
var Bind        = require('../util/Bind');
var SelfPosition = function(target){
  this.target       = target;
  this.progress     = 0;
  this.progressOld  = 0;
  this.isStageIn    = true;
  this.clientRect   = this.target.getBoundingClientRect();
  this.stageSize    = { width:0, height:0 };
  this.offset       = {left:0,top:0,width:0,height:0};
}


SelfPosition.prototype._setup = function(){
  this._resize = Bind(this._resize,this);
  $(window).on('_resize',this._resize);
  this._resize();  
  return this;
}
SelfPosition.prototype._resize = function(){
  this.stageSize      = windowSize();
  this.clientRect     = this.target.getBoundingClientRect();
  this._update();
}

SelfPosition.prototype._update = function(scrollY){
  this.clientRect = this.target.getBoundingClientRect();
  this.progress = 1-((this.clientRect.top+this.clientRect.height)/(this.stageSize.height+this.clientRect.height));
  if(this.progress >= 0 && this.progress <= 1){
    this.isStageIn = true;
  }else{
    this.isStageIn = false;
  }

  this.progressOld = this.progress;
}

SelfPosition.prototype.constructor = SelfPosition;
module.exports = SelfPosition;