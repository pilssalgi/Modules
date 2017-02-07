var SvgPathDraw = function($path){
  var _this = this;
  var path,length,dashOffset,dashArray;
  this._progress = -1;

  function setup(){
    path    = $path;
    length  = $path[0].getTotalLength();
    dashOffset  = length; 
    dashArray   = length;
    this.update(this._progress);
  };

  this.update = function(progress){
    this._progress = progress;
    TweenLite.set(path,{
      strokeDashoffset:dashOffset.toFixed(3)*this._progress+'px',
      strokeDasharray:dashArray.toFixed(3)+'px ' + dashArray.toFixed(3)+'px'
    });
  }

  this.fromTo = function(from,to,dur,delay){
    var _this = this;
    this._progress = from;

    TweenLite.to(this,dur,{delay:delay,_progress:to,ease:Quart.easeInOut,
      onUpdate:function(){
        _this.update(_this._progress);
      }
    });
  } 

  setup.call(this);
  return this;
}
SvgPathDraw.prototype.constructor = SvgPathDraw;
module.exports = SvgPathDraw;