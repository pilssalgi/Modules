var windowSize  = require('../util/WindowSize');
var Bind        = require('../util/Bind');
var debounce    = require('lodash/debounce');

var SelfPosition = function(element){
	this.element       = element;
	this.progress      = 0;
	this.progressOld   = 0;
	this.isStageIn     = false;
	this.offset        = null;
	this.rect          = null;
	this.stageInOffset = {min:0,max:1};

	this.setup();
	return this;
}


SelfPosition.prototype.setup = function(){
	this.resize = Bind(this.resize,this);
	$(window).on('resize', debounce(this.resize, 10));
	this.resize();
	return this;
}
SelfPosition.prototype.resize = function(){
	this.rect   = this.element.getBoundingClientRect();
	this.offset = this.getOffset(this.element);
	this.update();
}
SelfPosition.prototype.getOffset = function(element){
	var rect = element.getBoundingClientRect();
	return { 
		top  : rect.top + window.pageYOffset - document.documentElement.clientTop,
		left : rect.left + window.pageXOffset - document.documentElement.clientLeft
	}
}

var scrollTop = 0,dir = 0;
SelfPosition.prototype.update = function(scrollY){
	scrollTop       = scrollY || window.pageYOffset || document.documentElement.scrollTop;
	this.progress   = -(this.offset.top-scrollTop-window.innerHeight)/(this.rect.height+window.innerHeight);
	dir             = this.progress-this.progressOld;

	if(this.progress >= 0 && this.progress <= 1){
		if(!this.isStageIn && this.progress > this.stageInOffset.min){
			this.in(dir);
			this.isStageIn = true;
		}
	}else{
		if(this.isStageIn && this.progress < this.stageInOffset.max){
			this.out(dir);
		}
		this.isStageIn = false;
	}

	this.progressOld = this.progress;
}

SelfPosition.prototype.in = function(dir){
}

SelfPosition.prototype.out = function(dir){
}

SelfPosition.prototype.constructor = SelfPosition;
module.exports = SelfPosition;