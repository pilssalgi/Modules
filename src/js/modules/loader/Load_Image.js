var imagesLoaded  = require('imagesLoaded');
var bind          = require('../util/Bind');
Load_Image = function(){
  var _this       = this;
  this.isLoading  = false;
  this.progress   = 0;
  this._progress  = 0;
  this.speed      = 0.05;
  this.loadAnimation = null;
  this.renderID;
  render = bind(render,this);
};
Load_Image.prototype.load = function($dom,loadAnimation){
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
  var percent = imgLoaded = 0;
  loader.on("progress",function(instance,image){
    var result = image.isLoaded ? 'loaded' : 'broken';
    imgLoaded++;
    _this._progress = (imgLoaded/n);
  });
  this.renderID = requestAnimationFrame(render);
}
Load_Image.prototype.loading  = function(progress){}
Load_Image.prototype.loaded   = function(progress){}
function render(){
  this.progress += (this._progress-this.progress)*this.speed;
  if(this.progress > 0.999){
    this.progress = 1;
    this.loading(this.progress);
    this.loaded(this.progress);
    return;
  }
  this.loading(this.progress);
  renderID = requestAnimationFrame(render);
}
Load_Image.prototype.constructor = Load_Image;
module.exports = Load_Image;
