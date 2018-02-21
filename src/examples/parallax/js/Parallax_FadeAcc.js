var SelfPosition = require('../../../js/modules/parallax/SelfPosition');
var Easing = require('../../../js/modules/parallax/Easing');
function Main($selector){
	var list = [];
	function setup(){
		$selector.each(function(i){
			// $(this).css({backgroundColor:'rgba('+Math.floor(Math.random()*100)+',0,0,0.4)'})
			list[i] = {
				dom:$(this)[0],
				child:$(this).children()[0],
				img:$(this).find('img')[0],
				selfPosition:new SelfPosition($(this)[0]),
				pos:{x:0,y:0,z:0},
				acc:{x:0,y:0,z:0},
				showUpAcc:300,
				offsetY:Math.random()*100+100,
				speed:Math.random()*0.3
			};
		});
	}

	var scrollOld = 0,scrollAcc = 0,scrollAcc2 = 0;
	this.update = function(scroll){
		scrollAcc += ((scroll-scrollOld)-scrollAcc)*0.05;
		scrollAcc2 += (scrollAcc-scrollAcc2)*0.05;
		// scrollAcc = Math.abs(scrollAcc);
		// if(scrollAcc<0.01)scrollAcc=0;
		scrollOld = scroll;
		for(var i=0; i<list.length; i++){
			var l = list[i];
			list[i].selfPosition.update(scroll);
			var p = list[i].selfPosition.progress.showUpHalf; // 0~1
			if(p>1)p=1;
			if(p<0)p=0;
			p  = Easing.easeOutQuart(0,p,0,1,1);
			l.acc.y += (l.showUpAcc * (1-p) - l.acc.y)*0.2;
			translate3d(l.dom,0,l.acc.y+'px',0);
		}
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