var $ = require('jQuery');
var SequenceVideo = require('./SequenceVideo');
function Main($dom,videoID){
	var sv;
	var cvs,ctx,video
	function setup(){
		sv = new SequenceVideo($dom,videoID);
		cvs 	= sv.getCanvas();
		ctx 	= sv.getContext();
		video = sv.getVideo();
		sv.drawVideo = draw;
		ctx.fillStyle = '#22658c';
	}

	function draw(){
		ctx.clearRect(0,0,cvs.width,cvs.height);
	
		ctx.fillRect(0, 0, cvs.width, cvs.height);		
		ctx.globalCompositeOperation = 'destination-in';
		ctx.drawImage(video, 0, 0,cvs.width,cvs.height);
		// ctx.globalCompositeOperation = 'source-over';
		
		
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