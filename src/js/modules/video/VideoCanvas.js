var Bind = require('../util/Bind');

function VideoCanvas(videoDom,$videoContainer,readyCallBack){
	this.drawCvs;
	this.drawCtx;
	this.name 					= name;
	this.video 					= videoDom;
	this.containerSize 	= {width:0,height:0};
	this.canvasSize 		= {width:0,height:0,x:0,y:0};
	this.videoSize 			= {width:0,height:0,aspect:0};
	this.divisionCanvas = [];
	this.isPlay 				= false;
	this.isReady 				= false;

	var _this = this;
	var cts = this.containerSize,
			cs 	= this.canvasSize;
	var divisionWidth = 0;
	var poster = new Image();
	poster.src = this.video.getAttribute('poster');
	// poster.onload = function(){};

	setup = Bind(setup,this);
	this.video.preload = 'auto';
	this.video.addEventListener( "loadedmetadata", setup, false );

	function setup(){
		this.videoSize.width  = this.video.videoWidth;
		this.videoSize.height = this.video.videoHeight;
		this.videoSize.aspect = this.videoSize.width/this.videoSize.height;

		this.drawCvs = document.createElement('canvas');
		this.drawCtx = this.drawCvs.getContext('2d');

		$videoContainer.append(this.drawCvs);

		//for test
		this.drawCvs.style.position = 'absolute';
		this.drawCvs.style.width = '100%';
		this.drawCvs.style.height = '100%';
		this.drawCvs.style.left = 0;
		this.drawCvs.style.top = 0;

		// for(var i=0; i<divisionNum; i++){
		// 	var cvs = document.createElement('canvas'),
		// 			ctx = cvs.getContext('2d');
		// 	this.divisionCanvas[i] = {cvs:cvs,ctx:ctx,domElement:cvs};
		// }

		videoRender = Bind(videoRender,this);
		drawVideo 	= Bind(drawVideo,this);
		resize 			= Bind(resize,this);
		$(window).on('resize',resize);
		resize();

		this.isReady = true;
		if(readyCallBack)readyCallBack(this.divisionCanvas);
		this.reset();
	}

	function resize(){
		this.containerSize.width 	= $videoContainer.width();		
		this.containerSize.height = $videoContainer.height();

		var condition = cts.width/this.videoSize.aspect;
    if(condition < cts.height){
        cs.width   = cts.height*this.videoSize.aspect;
        cs.height  = cts.height;
    }else{
        cs.width   = cts.width;
        cs.height  = condition;
    }

    cs.x = Math.floor((cts.width-cs.width)*0.5);
    cs.y = Math.floor((cts.height-cs.height)*0.5);

    this.drawCvs.width 	= cts.width;
    this.drawCvs.height = cts.height;
    console.log(this);
    // divisionWidth = Math.floor(cts.width/divisionNum);
  //   for(var i=0; i<divisionNum; i++){
  //   	var cvs = this.divisionCanvas[i].cvs;
  //   	cvs.width 	= divisionWidth;
  //   	cvs.height 	= cts.height;
		// }
	}

	this.getCanvas = function(){
		return this.divisionCanvasl;
	}

	var interval = 1000/30;
	var then,startTime;// = Date.now();
	var elapsed;
	this.play = function(){
		console.log("this.video", this.video);
		if(!this.isReady)return;
		this.video.play();
		this.isPlay = true;
		requestAnimationFrame(videoRender);
		then = Date.now();
		startTime = then;		
	}

	this.stop = function(){
		this.video.pause();
		this.isPlay = false;
	}

	this.reset = function(){
		this.video.currentTime = 0;
		this.video.pause();
		// drawVideo(poster);
	}

	function videoRender(){
		if(this.isPlay){
			now = Date.now();
  		elapsed = now - then;
  		if (elapsed > interval) {
		    then = now - (elapsed % interval);
		    drawVideo(this.video);
		  }
			requestAnimationFrame(videoRender);
		}
	}

	function drawVideo(drawTarget){
		this.drawCtx.drawImage(drawTarget,cs.x,cs.y,cs.width,cs.height);
	}

	// setup.call(this);
	return this;
};

VideoCanvas.prototype.constructor = VideoCanvas;

module.exports = VideoCanvas;
