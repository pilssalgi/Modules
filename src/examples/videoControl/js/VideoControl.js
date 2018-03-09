var $         = require('jQuery');
var enableInlineVideo = require('iphone-inline-video');
require('jquery-mousewheel')($);
function VideoControl(video){
	var frame = 0, oldFrame = -1;
	var tweener;

	function setup(){
		$(video).on('mousewheel',function(e){
			frame += -e.deltaY*0.001;
			e.preventDefault();
		});

		var length = $('.btn').length;
		$('.btn').each(function(i){
			$(this).on('click',function(){
				if(tweener)tweener.kill();
				tweener = TweenLite.to(video,1,{currentTime:video.duration/length*i,ease:Power3.easeInOut,onUpdate:function(){
					frame = video.currentTime;
				}});
			});
		});
		video.addEventListener('loadedmetadata',function(){
			video.play();
			video.pause();
		});
		render();
	}

	function render(){
		requestAnimationFrame(render);
		if(frame<0)frame = 0;
		if(frame>video.duration)frame = video.duration;
		console.log("frame", frame);
		if(frame != oldFrame)video.currentTime = frame;
		oldFrame = frame;
		videoBar.style.transform = "translateX("+(video.currentTime/video.duration)*100+"%)";
	}


	setup.call(this);
	return this;
}

VideoControl.prototype.contructor = VideoControl;
module.exports = VideoControl;