import {TweenMax, Power2, TimelineLite} from "gsap";
var $ 	= require('jQuery');
var UAParser  = require('ua-parser-js');
var UA 				= new UAParser();
var isPC 			= UA.getDevice().vendor == undefined?true:false;

function DragAndDropGallery($wrap,option){
	var debounce        = require('lodash/debounce');
	var DragAndDrop     = require('../../../js/modules/ui/DragAndDrop');
	var Bind            = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	var _this       = this;
	var wrapInner   = $wrap.find('.dragAndDrop_in')[0];
	var $item       = $wrap.find('.dragAndDrop_item');
	var isDrag      = false;
	var isClick     = true;
	var isRender    = false;
	var drag        = {vf:0,power:0,old:{x:0,y:0}};
	var position    = {x:0,z:0,oldX:0,ratio:0};
	var size        = {left:0,width:0,halfWidth:0,start:0,end:0,all:0};
	var config      = {
			power : isPC?0.2:0.3,
			friction : 0.9,
			reverse:false,
			arrowLeft:null,
			arrowRight:null,
			yoyo:false,
			yoyoFriction:0.1
		}
	var items = [];
	var Tweener,TweenOption = {duration:0.7,ease:Power2.easeInOut,complete:function(){}};
	var current = 0;
	var dnd;
	var resizeDebounce;
	var deviation,vf=0;

	$.extend(config,option);
	
	function setup(){
		$item.each(function(i){
			items[i] = {dom:$(this),isStage:false,offset:0};
		});
		addEvent.call(this);
	}

	function addEvent(){
		onDragStart  = Bind(onDragStart,this);
		onDragMove   = Bind(onDragMove,this);
		onDragStop   = Bind(onDragStop,this);
		onRender     = Bind(onRender,this);
		onResize     = Bind(onResize,this);
		
		resizeDebounce = debounce(onResize,10);
		$(window).on('resize',resizeDebounce);
		onResize();
		dnd = new DragAndDrop(wrapInner,{onStart:onDragStart,onMove:onDragMove,onEnd:onDragStop});

		if(config.reverse){
			position.x = size.end;
			position.ratio = position.x / size.end;
			moveSlide(position.x);
			current = $item.total;
		}

		if($item[0].tagName.toLowerCase() == 'a' && isPC){
			$item.on('click',function(e){
				if(!isClick)e.preventDefault();
			});
		}
	}

	function onResize(){
		size.width  = $item.eq(0).innerWidth();
		size.halfWidth = size.width * 0.5;
		size.margin = 0;
		size.all = 0;//(($item.innerWidth()+size.margin)*$item.length);
		for(var i=0; i<items.length; i++){
			size.all+= items[i].dom.innerWidth();
		}
		
		deviation = size.all - $wrap.width();
		if(!config.reverse){
			size.start = 0;
			size.end = deviation<0?0:(deviation-size.margin);
		}else{
			size.start = deviation<0?deviation:size.margin;
			size.end = deviation;
		}
		position.x = position.ratio * deviation
		moveSlide(position.x);
	}

	function onDragStart(e){
		if(Tweener)Tweener.kill();
		isDrag = true;
		drag.old = e.start;
		if(!isRender)requestAnimationFrame(onRender)
	};

	function onDragMove(e){
		isClick = false;
		$wrap.addClass('preventClick');
		vf = (drag.old.x-e.move.x) * config.power;
		drag.vf += Math.round(vf);
		drag.old = e.move;
	};
	function onDragStop(e){
		isDrag = false;
		setTimeout(function(){
			isClick = true;
			$wrap.removeClass('preventClick');
		},100);
	};

	var direction = 1;
	var item,item_offset,item_dom;
	function onRender(){
		isRender = true;
		drag.vf *= config.friction;
		var dis = Math.abs(drag.vf);

		if(dis < .01 && !isDrag){
			drag.vf = 0;
			isRender = false;
		}else{
			requestAnimationFrame(onRender);  
		}

		direction = drag.vf<0?-1:1;
		
		drag.power += (drag.vf-drag.power)*0.2;

		position.x += drag.vf;
		position.ratio = position.x / size.end;
		if(position.x <= size.start)position.x += (size.start - position.x)*config.power;
		if(position.x >= size.end)position.x += (size.end-position.x)*config.power;
		moveSlide(position.x);
	}

	var standardLeft=0,standardRight=0,reserveID=0;
	function moveSlide(x){
		translate3d(wrapInner,-x+'px',0,0);
		standardLeft  = Math.floor(position.ratio*items.length);
		standardRight = Math.floor((1-position.ratio)*items.length);

		if(config.yoyo){
			for(var i =0; i<items.length; i++){
				reserveID 	= items.length-i-1;
				item 				= items[i];
				item_offset = item.offset;
				if(direction>0){
					if(!config.reverse)items[i].offset += (drag.vf*(i-standardLeft)-items[i].offset)*config.yoyoFriction;
					else items[reserveID].offset += (drag.vf*(i-standardLeft)-items[reserveID].offset)*config.yoyoFriction;
				}else{
					if(!config.reverse)items[i].offset += (drag.vf*(reserveID-standardRight)-items[i].offset)*config.yoyoFriction;
					else items[reserveID].offset += (drag.vf*(reserveID-standardRight)-items[reserveID].offset)*config.yoyoFriction;
				}
				translate3d(items[i].dom[0],item_offset+'px',0,0);
			}
		}
		checkCursor(x);
	}

	function translate3d(dom,x,y,z){
		dom.style.transform = 'perspective(1000px) translate3d('+x+','+y+'px,'+z+'px)';
	}

	function jump(x,option){
		if(Tweener)Tweener.kill();
		$.extend(TweenOption,option); 
		Tweener = TweenLite.to(position,TweenOption.duration,{x:x,ease:TweenOption.ease,
			onUpdate:function(){
				moveSlide(position.x);
			},
			onComplete:function(){
				if(TweenOption.complete != 'undefined')TweenOption.complete();
			}
		});
	}

	function checkCursor(x) {
		if(config.arrowLeft != null){
			if(config.reverse){
				if(x <= size.start){
					if(!config.arrowLeft.hasClass('arrowInActive'))config.arrowLeft.addClass('arrowInActive');
				}else{
					if(config.arrowLeft.hasClass('arrowInActive'))config.arrowLeft.removeClass('arrowInActive');
				}
			}else{
				if(x <= size.start){
					if(!config.arrowLeft.hasClass('arrowInActive'))config.arrowLeft.addClass('arrowInActive');
				}else{
					if(config.arrowLeft.hasClass('arrowInActive'))config.arrowLeft.removeClass('arrowInActive');
				}
			}
		}

		if(config.arrowRight != null){
			if(config.reverse){
				if(x >= size.end){
					if(!config.arrowRight.hasClass('arrowInActive'))config.arrowRight.addClass('arrowInActive');
				}else{
					if(config.arrowRight.hasClass('arrowInActive'))config.arrowRight.removeClass('arrowInActive');
				}
			}else{
				if(x >= size.end){
					if(!config.arrowRight.hasClass('arrowInActive'))config.arrowRight.addClass('arrowInActive');
				}else{
					if(config.arrowRight.hasClass('arrowInActive'))config.arrowRight.removeClass('arrowInActive');
				}
			}
		}
	}

	var quotient = 0,quotientEnd=0,checkID=0,tgX = 0;
	this.prev = function(option){
		if(config.reverse){
			checkID = Math.floor(position.x/size.width);
			quotient = Math.floor(position.x%size.width);
			quotientEnd = (size.end-position.x)%size.width;
			checkID++;
			if(quotientEnd>size.width*0.5)checkID--;
			if(checkID<0)checkID=0;
			tgX = (checkID*size.width)+quotient+quotientEnd;
			if(tgX>size.end)tgX = size.end;
		}else{
			checkID = Math.floor(position.x/size.width);
			quotient = Math.floor(position.x%size.width);
			checkID--;
			if(quotient>size.width*0.5)checkID++;
			if(checkID<0)checkID=0;
			tgX = checkID*size.width;
		}
		jump(tgX,option);
	}

	this.next = function(option){
		if(config.reverse){
			checkID  = Math.floor(position.x/size.width);
			quotient = Math.floor(position.x%size.width);
			quotientEnd = (size.end-position.x)%size.width;
			checkID--;
			if(quotientEnd>size.width*0.5)checkID--;
			tgX = (checkID*size.width)+quotient+quotientEnd;
			if(tgX<size.start)tgX = size.start;
		}else{
			checkID = Math.floor(position.x/size.width);
			checkID++;
			if(checkID>$item.length-1)checkID=$item.length-1;
			tgX = checkID*size.width;
			if(tgX>size.end)tgX = size.end;
		}
		jump(tgX,option);
	}

	this.kill = function(){
		$(window).off('resize',resizeDebounce);
		dnd.remove();
	}

	this.reset = function(){
		drag.vf = 0;
		isDrag = false;
		position.ratio = 0;

		if(config.yoyo){
			for(var i =0; i<items.length; i++){
				items[i].offset = 0;
			}
		}


		if(config.reverse){
			position.x = size.end;
			position.ratio = position.x / size.end;
		}else{
			position.x = size.start;
			position.ratio = 0;	
		}
		moveSlide(position.x);
	}


	setup.call(this);
};
DragAndDropGallery.prototype.constructor = DragAndDropGallery;
module.exports = DragAndDropGallery;