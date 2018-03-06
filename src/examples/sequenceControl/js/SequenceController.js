var $ = require('jQuery');
var debounce  		= require('lodash/debounce');
function SequenceController(className){
	var selecetor = $(className);
	if(selecetor[0] == undefined)return;
	var parent = selecetor.parent();
	var cvs = document.createElement('canvas');
	var ctx = cvs.getContext('2d');

	cvs.width 	= selecetor[0].width;
	cvs.height 	= selecetor[0].height;
	cvs.style.position = "absolute";
	cvs.style.left = '0';
	cvs.style.top = '0';
	cvs.style.width = "100%";
	cvs.style.height = "100%";

	var width = 0,height = 0;
	var _this = this;
	var isReady = false;

	var controller = {
		crt:0,
		seqCrt:0,
		seqOld:-1,
		tweener:null,
		sequence:[],
		to:function(to,duration,delay,ease,cb){
			var _this = this;
			if(this.tweener){
				this.tweener = this.tweener.kill();
				this.tweener = null;
			}
			this.tweener = TweenLite.to(this,duration,{crt:to,delay:delay,ease:ease,onComplete:cb,onUpdate:function(){_this.update()}});
		},
		reset:function(){
			ctx.clearRect(0,0,cvs.width,cvs.height);
			this.crt = 0;
		},
		update:function(){
			this.seqCrt = Math.floor(this.crt*this.total);
			if(this.seqCrt != this.seqOld){
				ctx.clearRect(0,0,width,height);
				ctx.drawImage(this.sequence[this.seqCrt][0], 0, 0,cvs.width,cvs.height);
			}
			this.seqOld = this.seqCrt;
		}
	}


	parent.append(cvs);
	selecetor.each(function(i){
		controller.sequence[i] = $(this);
	});
	controller.total = controller.sequence.length-1;

	isReady = true;

	return controller;
}

module.exports = SequenceController;