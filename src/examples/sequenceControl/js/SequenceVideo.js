var $ = require('jQuery');
var debounce = require('lodash/debounce');
function Main($dom,videoID){
	if(!$dom[0])return;

  var cvs,ctx;
  var video,videoTotal;
  var debounceResize;
  var isPlay = false;
  var timer;
	function setup(){
		cvs = document.createElement('canvas');
		ctx = cvs.getContext('2d');

		cvs.width  = $dom.width();
		cvs.height = $dom.height();
		cvs.style.width = "100%";
		cvs.style.height = "100%";
		
		video = document.getElementById(videoID);

		$dom.append(cvs);
		addEvent();
	}

	function addEvent(){
		video.addEventListener('loadedmetadata', function(e) {
    	videoTotal = video.duration;
    	console.log("meta", e);
		});
		video.addEventListener('oncanplay',function(){
			console.log("video.readyState", video.readyState);
		});

		video.addEventListener("pause", function(){
		}, false);

		video.addEventListener("ended",function(){
			timerStop();
		});

		debounceResize = debounce(onResize,100);
		$(window).on('resize',debounceResize);
	}

	function onResize(){
		console.log('resize');
	}

	this.getCanvas = function(){
		return cvs;
	}

	this.getContext = function(){
		return ctx;
	}

	this.getVideo = function(){
		return video;
	}

	this.drawVideo = function(){
		ctx.clearRect(0,0,cvs.width,cvs.height);
		ctx.drawImage(video, 0, 0,cvs.width,cvs.height);
	}

	this.play = function(){
		isPlay = true;
		video.play();
		timerStart();
	}

	this.pause = function(){
		isPlay = false;
		video.pause();
		timerStop();
	}

	this.stop = function(){
		isPlay = false;
		video.pause();
		video.currentTime = 0;
		timerStop();		
	}

	let render = () =>{
		this.drawVideo();
		timer = requestAnimationFrame(render);
	}

	let timerStart = () => {
		if(timer)timerStop();
		// timer = setInterval(this.drawVideo,30/1000);
		timer = requestAnimationFrame(render);
	}

	function timerStop(){
		// if(timer)clearInterval(timer);
		if(timer)cancelAnimationFrame(timer);
		timer = null;
	}


	setup.call(this);
	return this;
}

Main.prototype.constructor = Main;
module.exports = Main;