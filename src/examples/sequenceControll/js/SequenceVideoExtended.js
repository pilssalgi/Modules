var $ = require('jQuery');
var SequenceVideo = require('./SequenceVideo');
function Main($dom,videoID){
	var sv;
	var cvs,ctx,video
	var cvs2,ctx2;
	var maskImg;
	function setup(){
		sv = new SequenceVideo($dom,videoID);
		cvs 	= sv.getCanvas();
		ctx 	= sv.getContext();

		cvs2 = document.createElement('canvas');
		ctx2 = cvs2.getContext('2d');

		maskImg = document.getElementById('video-mask');

		cvs2.width  = $dom.width();
		cvs2.height = $dom.height();
		cvs2.style.width = "100%";
		cvs2.style.height = "100%";

		video = sv.getVideo();
		sv.drawVideo = draw;
		ctx.fillStyle = '#22658c';
	}

	function draw(){
		ctx.clearRect(0,0,cvs.width,cvs.height);
		ctx2.clearRect(0,0,cvs.width,cvs.height);
		ctx2.globalCompositeOperation = 'source-in';
		ctx2.drawImage(maskImg, 0, 0,cvs.width,cvs.height);
		ctx2.globalCompositeOperation = 'xor';
		ctx2.drawImage(video, 0, 0,cvs.width,cvs.height);

		// ctx2.globalCompositeOperation = 'darken';
		ctx.drawImage(cvs2, 0, 0,cvs.width,cvs.height);
		
		
	}

	this.play = function(){
		sv.play();
	}

	this.pause = function(){
		sv.pause();
	}

	this.stop = function(){
		sv.stop();
	}

	setup.call(this);
}
Main.prototype.constructor = Main;
module.exports = Main;