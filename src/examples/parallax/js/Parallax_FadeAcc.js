var SelfPosition  = require('../../../js/modules/parallax/SelfPosition');
var Easing        = require('../../../js/modules/parallax/Easing');
var assignIn      = require('lodash/assignIn');
var debounce      = require('lodash/debounce');
function Main($selector,option){
	var list 	= [];
	var total = 0;
	var resizeDebounce;
	function setup(){
		total = $selector.length;
		$selector.each(function(i){
			// $(this).css({backgroundColor:'rgba('+Math.floor(Math.random()*100)+',0,0,0.4)'})
			list[i] = {
				dom:$(this)[0],
				child:$(this).children()[0],
				selfPosition:new SelfPosition($(this)[0]),
				pos:{x:0,y:0,z:0},
				acc:{x:0,y:0,z:0},
				offsetY:Math.random()*100+100,
				speed:Math.random()*0.3
			};
		});

		resizeDebounce = debounce(onResize,10);
		$(window).on('resize',resizeDebounce);
	}

	function onResize(){
		for(var i=0; i<total; i++){
			list[i].selfPosition.update();
		}
	}

	var config = {
		showUpAcc:300,
		showUpEase:Easing.easeOutQuart
	}

	var _scroll = 0;
	this.update = function(scroll){
		if(scroll == undefined){
			_scroll += ((window.pageYOffset || document.documentElement.scrollTop)-_scroll)*0.2;
		}else{
			_scroll = scroll;
		}

		var l,p;
		for(var i=0; i<total; i++){
			l = list[i];
			l.selfPosition.update(_scroll);
			p = list[i].selfPosition.progress.showUpTop; // 0~1
			if(p<=1 && p>=0){
				p  = config.showUpEase(0,p,0,1,1);
				l.acc.y = config.showUpAcc * (1-p);
				translate3d(l.child,0,l.acc.y+'px',0);
			}
		}
	}

	this.kill = function(){

	}

	// $.easing[easing](newPogress,newPogress,0,1,1);

	function translate3d(dom,x,y,z){
		dom.style.transform = "perspective(1000px) translate3d("+x+","+y+","+z+"px)";
	}

	function rotate(dom,degree,z){
		dom.style.transform = "perspective(1000px) rotate("+degree+"deg) translate3d(0,0,"+Math.abs(z*5)+"px)";
	}


	setup.call(this);
	return this;
}

Main.prototype.constructor = Main;
module.exports = Main;