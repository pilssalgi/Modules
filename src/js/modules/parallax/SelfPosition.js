/**
* 2018.01
* ver 0.1.1
* Author : Heonwongeun
* FaceBook : https://www.facebook.com/heo.wongeun
*/

var windowSize  = require('../util/WindowSize');
var Bind        = require('../util/Bind');
var debounce    = require('lodash/debounce');

var SelfPosition = function(element){
	this.element       	= element;
	this.progress      	= {crt:0,old:0,showUp:0,showUpTop:0,showUpHalf:0};
	this.isStageIn     	= false;
	this.offset        	= null;
	this.rect          	= null;
	this.stageInOffset 	= {min:0,max:1};

	this.setup();
	return this;
}


SelfPosition.prototype.setup = function(){
	this.resize = Bind(this.resize,this);
	// $(window).on('resize', debounce(this.resize, 10));
	$(window).on('resize', this.resize);//debounce(this.resize, 10));
	this.resize();
	return this;
}
SelfPosition.prototype.kill = function(){
	$(window).off('resize', this.resize);
}

SelfPosition.prototype.resize = function(){
	this.rect   = this.element.getBoundingClientRect();
	this.offset = this.getOffset(this.element);
	console.log("this.rect", this.rect);
	this.update();
}
SelfPosition.prototype.getOffset = function(element){
	var rect = element.getBoundingClientRect();
	return { 
		top  : rect.top + window.pageYOffset - document.documentElement.clientTop,
		left : rect.left + window.pageXOffset - document.documentElement.clientLeft
	}
}

var scrollTop = 0,contentTop=0,dir = 0;
SelfPosition.prototype.update = function(scrollY){
	scrollTop       				 = scrollY || window.pageYOffset || document.documentElement.scrollTop;
	contentTop 							 = -(this.offset.top-scrollTop-window.innerHeight);
	this.progress.crt 			 = contentTop/(this.rect.height+window.innerHeight);
	this.progress.showUpSelf = contentTop/(this.rect.height);
	this.progress.showUpTop  = contentTop/(window.innerHeight);
	this.progress.showUpHalf = contentTop/(window.innerHeight*0.5);
	dir             				 = this.progress.crt-this.progress.old;

	if(this.progress.crt >= 0 && this.progress.crt <= 1){
		if(!this.isStageIn && this.progress.crt > this.stageInOffset.min){
			this.in(dir);
			this.isStageIn = true;
		}
	}else{
		if(this.isStageIn && this.progress.crt < this.stageInOffset.max){
			this.out(dir);
		}
		this.isStageIn = false;
	}

	this.progress.old = this.progress.crt;
}

SelfPosition.prototype.in = function(dir){
}

SelfPosition.prototype.out = function(dir){
}

SelfPosition.prototype.constructor = SelfPosition;
module.exports = SelfPosition;