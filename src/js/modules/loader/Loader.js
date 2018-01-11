var imagesLoaded  = require('imagesLoaded');
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
var Loader = function(){
  var _this       = this;
  this.isLoading  = false;
  this.progress   = 0;
  this._progress  = 0;
  this.speed      = 0.2;
  this.loadAnimation = null;
  this.isRender      = false;
  this.render = bind(this.render,this);
};
Loader.prototype.load = function($dom,loadAnimation){
  var _this       = this;
  if(this.isLoaded)return;
  this.loadAnimation = loadAnimation;
  if(loadAnimation){
    this.loading = loadAnimation.loading;
    this.loaded = loadAnimation.loaded;
    loadAnimation.start();
  }
  this.isLoaded = true;
  this.progress = this._progress = 0;
  var loader = imagesLoaded($dom),n = loader.images.length;
  var percent = 0; 
  var imgLoaded = 0;
  loader.on("progress",function(instance,image){
    var result = image.isLoaded ? 'loaded' : 'broken';
    imgLoaded++;
    _this._progress = (imgLoaded/n);
  });
  requestAnimationFrame(this.render);
  this.isRender = true;
}
Loader.prototype.loading  = function(progress){}
Loader.prototype.loaded   = function(progress){}
Loader.prototype.render = function(){
  this.progress += (this._progress-this.progress)*this.speed;
  if(this.progress > 0.999){
    this.progress = 1;
    this.loading(this.progress);
    this.loaded(this.progress);
    return;
  }else{
    requestAnimationFrame(this.render);
    this.loading(this.progress);
  }
}
Loader.prototype.constructor = Loader;
module.exports = Loader;
