/* ************************************************************
    title  : Scroll ver 0.1.1
    date   : 2019.12
    author : Heowongeun
    require : 
      TweenLite
      lodash
  ************************************************************ */

'use strict';

const debounce = require('lodash/debounce');
const throttle = require('lodash/throttle');
const assignIn = require('lodash/assignIn');

export default class SmoothScroll {
  constructor(dom,option){
    this.dom = dom;
    this.dom.style.position = 'fixed';
    this.position = { y:0, oldY:0 };
    this.scroll = {x:0,y:0};

    this.config = {
      speed : 0.05,
      onUpdate:()=>{}
    }

    this.ticking = false;

    assignIn(this.config,option);

    this._onScroll = throttle(this.onScroll.bind(this),10);
    this._onResize = debounce(this.onResize.bind(this),10);

    window.addEventListener('resize',this._onResize);
    window.addEventListener('scroll',this._onScroll);

    this.onResize();
    this.onResize();
  }

  onScroll(){
    this.scroll.y = window.pageYOffset || document.documentElement.scrollTop;

    if(!this.ticking){
      requestAnimationFrame(this.update.bind(this));
    }
    this.ticking = true;
  }

  onResize(){
    document.body.style.height = this.dom.clientHeight +'px';
  }

  update(){
    this.position.y += (this.scroll.y-this.position.y)*this.config.speed;
    this.position.y = Math.round(this.position.y * 10) / 10;
    const dis = (this.scroll.y-this.position.y);
    if(Math.abs(dis) < 0.2){
      this.ticking = false;
      this.position.y = this.scroll.y;
    }else{
      requestAnimationFrame(this.update.bind(this));
    }
    this.config.onUpdate();
    this.dom.style.transform ="translate3d(0,"+(-this.position.y)+"px,0)";
  }

  kill(){
    window.removeEventListener('resize',this._onResize);
    window.removeEventListener('scroll',this._onScroll);
  }
}
