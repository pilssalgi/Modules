var $ = require('jQuery');
var SequenceVideo = require('./SequenceVideo');
function Main($dom,videoID){
	var sv;
	var cvs,ctx,video
	var bufferCvs,buffer;
	var maskImg;
	function setup(){
		sv = new SequenceVideo($dom,videoID);
		cvs 	= sv.getCanvas();
		ctx 	= sv.getContext();

		bufferCvs = document.createElement('canvas');
		buffer 		= bufferCvs.getContext('2d');

		maskImg = document.getElementById('video-mask');

		bufferCvs.width  = $dom.width();
		bufferCvs.height = $dom.height();
		bufferCvs.style.width = "100%";
		bufferCvs.style.height = "100%";

		video = sv.getVideo();
		sv.drawVideo = draw;
		ctx.fillStyle = '#22658c';
	}

	function draw(){
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