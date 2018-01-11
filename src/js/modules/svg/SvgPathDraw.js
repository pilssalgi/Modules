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

  this.fromTo = function(from,to,dur,delay,ease,complete){
    var _this = this,
        _ease = ease == 'undefined'?Quart.easeInOut:ease;

    return TweenLite.to(this,dur,{delay:delay,_progress:to,ease:_ease,
      onStart:function(){
        _this._progress = from;
      },
      onUpdate:function(){
        _this.update(_this._progress);
      },
      onComplete:function(){
        if(complete)complete();
      }
    });
  } 

  this.to = function(to,dur,delay,ease,complete){
    var _ease = ease == 'undefined'?Quart.easeInOut:ease;
    return TweenLite.to(this,dur,{delay:delay,_progress:to,ease:_ease,
      onStart:function(){},
      onUpdate:function(){
        _this.update(_this._progress);
      },
      onComplete:function(){
        if(complete)complete();
      }
    });
  }

  setup.call(this);
  return this;
}
SvgPathDraw.prototype.constructor = SvgPathDraw;
module.exports = SvgPathDraw;