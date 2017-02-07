var Load_Animation = function(){
  this.progress = 0;
  function setup(){}
  setup.call(this);
  return this;
};
Load_Animation.prototype.start    = function(callBack){}
Load_Animation.prototype.loading  = function(p){}
Load_Animation.prototype.loaded   = function(callBack){}
Load_Animation.prototype.constructor = Load_Animation;
module.exports = Load_Animation;
