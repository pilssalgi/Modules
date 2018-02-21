var SelfPosition = require('../../../js/modules/parallax/SelfPosition');
var Easing = require('../../../js/modules/parallax/Easing');
var assignIn = require('lodash/assignIn');
function Main($selector,option){
	var list = [];
	function setup(){
		$selector.each(function(i){
			// $(this).css({backgroundColor:'rgba('+Math.floor(Math.random()*100)+',0,0,0.4)'})
			list[i] = {
				dom:$(this)[0],
				child:$(this).children()[0],
				img:$(this).find('img')[0],
				selfPosition:new SelfPosition($(this)[0])
			};
		});
	}

	var config = {
		degree:10,
		speed:0.1,
		zoom:100
	}

	assignIn(config,option);

	var accOffset = {
		acc : 0,
		accOld : 0,
		max : 50
	}
	var scrollOld = 0;
	this.update = function(scroll){
		accOffset.acc += (((scroll-scrollOld)/accOffset.max)-accOffset.acc)*config.speed;
		if(accOffset.acc<-1)accOffset.acc = -1;
		if(accOffset.acc>1)accOffset.acc = 1;
		scrollOld = scroll;
		for(var i=0; i<list.length; i++){
			var l = list[i];
			// list[i].selfPosition.update(scroll);
			rotate(l.img,accOffset.acc*config.degree,Math.abs(accOffset.acc)*config.zoom);
		}
	}

  function rotate(dom,degree,z){
    dom.style.transform = "perspective(1000px) rotate("+degree+"deg) translate3d(0,0,"+z+"px)";
  }


	setup.call(this);
	return this;
}

Main.prototype.constructor = Main;
module.exports = Main;