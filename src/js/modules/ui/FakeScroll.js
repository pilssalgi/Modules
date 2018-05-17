const $     = require('jQuery');
const Bind  = require('../util/Bind');
const debounce = require('lodash/debounce');
const throttle = require('lodash/throttle');
let FakeScroll = function(target,speed,option){
  this.name     = 'FakeScroll';
  this.height   = 0;
  this.position = {x:0,y:0,oldX:0,oldY:0};
  this.speed    = typeof speed == 'undefined'?0.1:speed;
  this.target   = target;
  let config    = {isTop:true,onUpdate:function(){}};
  let scroll    = {y:0,power:0};
  let ticking   = false;
  if(option)$.extend(config,option);
  /* ************************************************************
    Setup  
  ************************************************************ */
  function setup(){
    target.style.position = 'fixed';
    update = Bind(update,this);

    $(window).on('scroll',throttle(()=>{onScroll()},10));
    $(window).on('resize', debounce(()=>{this.sizeUpdate();},10));
    $(window).on('SmoothScrollUpdate',()=>{this.sizeUpdate();});

    this.sizeUpdate();
  }

  function onScroll(){
    scroll.y = window.pageYOffset || document.documentElement.scrollTop;
    if(!ticking){
      requestAnimationFrame(update);
    }
    ticking = true;
  }

  
  /* ************************************************************
    Rendering
  ************************************************************ */
  function update(){
    this.position.y += (scroll.y-this.position.y)*this.speed;
    this.position.y = Number(this.position.y.toFixed(1));
    var dis = (scroll.y-this.position.y);
    if(Math.abs(dis) < 1){
      ticking = false;
    }else{
      requestAnimationFrame(update);
    }
    config.onUpdate();
    this.positionUpdate();
  }

  this.sizeUpdate = function(){
    document.body.style.height = this.target.clientHeight +'px';
    this.positionUpdate();
  }

  this.positionUpdate = function(){
    this.target.style.transform ="translate3d(0px,"+(-this.position.y)+"px,0)";//this.translate3d(0,-this.position.y+'px',0);
  }

  setup.call(this);
  return;
}
module.exports = FakeScroll;
