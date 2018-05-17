const $     = require('jQuery');
const UA    = require('../info/UA')();
const Bind  = require('../util/Bind');
const debounce = require('lodash/debounce');
let FakeScroll = function(target,speed,option){
  this.name     = 'FakeScroll';
  this.height   = 0;
  this.position = {x:0,y:0,oldX:0,oldY:0};
  this.speed    = typeof speed == 'undefined'?0.1:speed;
  this.target   = target;
  let instead  = document.createElement('div');
  let _this = this;
  let config = {isTop:true,onUpdate:function(){}};
  let scroll = {y:0,power:0};
  let ticking = false;

  let intersectionObserver;
  let threshold = [];

  if(option)$.extend(config,option);
  /* ************************************************************
    Setup  
  ************************************************************ */
  function setup(){
    target.style.position = 'fixed';
    target.style.top = '0';
    update = Bind(update,this);
    $(window).on('resize', debounce(function(){
      _this.sizeUpdate();
    }, 10));
    

    // instead.id = 'forIntersectionObserverInsteadScroll';
    instead.style.position = 'absolute';
    instead.style.width = '10px';
    instead.style.height = '50px';
    instead.style.top = '100vh';
    instead.style.zIndex = 1000;
    // instead.style.visibility = 'hidden';
    instead.style.backgroundColor = 'red';
    target.insertAdjacentElement('beforebegin',instead);

    for (let i=0; i<=1.0; i+= 0.01) {
      threshold.push(i);
    }
    
    $(window).on('SmoothScrollUpdate', function(){
      _this.sizeUpdate();
    });

    _this.sizeUpdate();

    intersectionObserver = new IntersectionObserver(intersectionCallback, {root:null,rootMargin:"0px",threshold:threshold});
    intersectionObserver.observe(instead);
    console.log("intersectionObserver", intersectionObserver);
  }


  function intersectionCallback(entries) {
    entries.forEach(function(entry) {
      if(!ticking){
        requestAnimationFrame(update);
        ticking = true;
      }
    });
  }

  
  /* ************************************************************
    Rendering
  ************************************************************ */
  let dis = 0;
  function update(){
    scroll.y = window.pageYOffset || document.documentElement.scrollTop;
    this.position.y += (scroll.y-this.position.y)*this.speed;
    this.position.y = Number(this.position.y.toFixed(1));
    dis = Math.abs(scroll.y-this.position.y);
    console.log("dis", dis);
    if(dis < 1){
      ticking = false;
    }else{
      requestAnimationFrame(update);
      if(instead.style.bottom == '-4px')instead.style.bottom = '-5px';
      else instead.style.bottom = '-4px';
    }

    config.onUpdate();
    this.positionUpdate();
  }

  this.sizeUpdate = function(){
    document.body.style.height = this.target.clientHeight +'px';
    _this.positionUpdate();
  }

  this.positionUpdate = function(){
    this.target.style.transform ="perspective(1000px) translate3d(0px,"+(-this.position.y)+"px,0)";//this.translate3d(0,-this.position.y+'px',0);
  }

  setup.call(this);
  return;
}
module.exports = FakeScroll;
