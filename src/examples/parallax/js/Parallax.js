var SelfPosition = require('../../../js/modules/parallax/SelfPosition');
function Parallax($selector){
	var list = [];
	function setup(){
		$selector.each(function(i){
			list[i] = {
				dom:$(this),
				child:$(this).children()[0],
				selfPosition:new SelfPosition($(this)[0]),
				x:0,
				y:0,
				z:0,
				offsetY:200,
				speed:Math.random()*0.1+0.05
			};
		});
	}

	this.update = function(scrollY){
		for(var i=0; i<list.length; i++){
			var l = list[i];
			list[i].selfPosition.update(scrollY);
			var p = list[i].selfPosition.progress;
			l.y += ((l.offsetY*0.5-p*l.offsetY)-l.y) * l.speed;
			translate3d(l.child,0,l.y+'px',0); 
		}
	}

	function translate3d(dom,x,y,z){
    dom.style.transform = "perspective(1000px) translate3d("+x+","+y+","+z+"px)";
  }

	setup.call(this);
	return this;
}

Parallax.prototype.constructor = Parallax;
module.exports = Parallax;