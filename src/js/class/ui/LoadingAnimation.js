var Interface = require('../../modules/loader/Load_Animation');
var LoadingAnimation = function(complete){
  function setup(){
    console.log('setup');
  }
  this.start = function(){
    console.log('start');
  }

  this.loading = function(){
    console.log('loading');
  }

  this.loaded = function(){
    console.log('loaded');
    if(complete)complete();
  }

  setup();
}
LoadingAnimation.prototype.constructor = LoadingAnimation;
LoadingAnimation.prototype = new Interface();
module.exports = LoadingAnimation;