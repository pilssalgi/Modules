var SelfPosition = require('../../../js/modules/parallax/SelfPosition');
var Easing = require('../../../js/modules/parallax/Easing');
var assignIn = require('lodash/assignIn');
var debounce      = require('lodash/debounce');
function Main($selector,option){
	var list = [];
	var total = 0;
	var resizeDebounce;

	var config = {
		degree:10,
		speed:0.1,
		zoom:100,
		fadeAcc:false,
		fadeAccOffset:300,
		showUpEase:Easing.easeOutQuart
	}

	assignIn(config,option);

	function setup(){
		total = $selector.length;

		this.addList($selector);

		resizeDebounce = debounce(onResize,10);
		$(window).on('resize',resizeDebounce);
	}

	function onResize(){
		for(var i=0; i<total; i++){
			list[i].selfPosition.update();
		}
	}



	this.addList = function($selector){
		$selector.each(function(i){
			list[i] = {
				dom:$(this)[0],
				child:$(this).children()[0],
				img:$(this).find('img')[0],
				selfPosition:new SelfPosition($(this)[0]),
				acc:{x:0,y:0,z:0}
			};
		});
	};

	var _scroll = 0;
	var scrollOld = 0;
	var scrollAccOffset = {
		acc : 0,
		accOld : 0,
		max : 50
	}
	this.update = function(scroll){
		if(scroll == undefined){
			_scroll += ((window.pageYOffset || document.documentElement.scrollTop)-_scroll)*0.5;
		}else{
			_scroll = scroll;
		}

		scrollAccOffset.acc += (((_scroll-scrollOld)/scrollAccOffset.max)-scrollAccOffset.acc)*config.speed;
		if(scrollAccOffset.acc<-1)scrollAccOffset.acc = -1;
		if(scrollAccOffset.acc>1)scrollAccOffset.acc = 1;

		var l,p;
		for(var i=0; i<total; i++){
			l = list[i];
			l.selfPosition.update(_scroll);
			rotate(l.img,scrollAccOffset.acc*config.degree,Math.abs(scrollAccOffset.acc)*config.zoom);

			if(config.fadeAcc){
				p = list[i].selfPosition.progress.showUpTop; // 0~1
				if(p<=1 && p>=0){
					p  = config.showUpEase(0,p,0,1,1);
					l.acc.y = config.fadeAccOffset * (1-p);
					translate3d(l.child,0,l.acc.y+'px',0);
				}
			}
		}

		scrollOld = _scroll;
	}

	this.kill = function(){
		for(var i=0; i<total; i++){
			list[i].selfPosition.kill();
			delete list[i].selfPosition;
		}

		list = [];
	}

	function translate3d(dom,x,y,z){
		dom.style.transform = "perspective(1000px) translate3d("+x+","+y+","+z+"px)";
	}

  function rotate(dom,degree,z){
    dom.style.transform = "perspective(1000px) translate3d(0,0,"+z+"px) rotate("+degree+"deg)";
  }


	setup.call(this);
	return this;
}

Main.prototype.constructor = Main;
module.exports = Main;