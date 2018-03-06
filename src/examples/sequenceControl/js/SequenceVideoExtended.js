var $ = require('jQuery');
var SequenceVideo = require('./SequenceVideo');
function Main($dom,videoID,imgs,gui){
	var sv;
	var cvs,ctx,video
	var buffer1,buffer2,buffer3;
	var maskImg;
  var imgOffsets = [];
  this.blendMode = ['source-over','source-in','source-out','source-atop','destination-over',
          'destination-in','destination-out','destination-atop','lighter','copy',
          'xor','multiply','screen','overlay','darken','lighten','color-dodge',
          'color-burn','hard-light','soft-light','difference','exclusion',
          'hue','saturation','color','luminosity'];
  var blendMode = 'darken';
	function setup(){
		sv = new SequenceVideo($dom,videoID);
		cvs 	= sv.getCanvas();
		ctx 	= sv.getContext();
    video = sv.getVideo();

    buffer1 = createBufferCanvas();
    buffer2 = createBufferCanvas();
    buffer3 = createBufferCanvas();
    $dom.append(buffer1.cvs);
    $dom.append(buffer2.cvs);
    $dom.append(buffer3.cvs);
    $dom.append(cvs);

    var guiBlend = gui.add(this,'blendMode',this.blendMode);
    guiBlend.onChange(function(value){
      blendMode = value;
      draw();
    });

    let size = 50+'%';
    $dom[0].style.display = 'flex';
    cvs.style.display = 'block';
    buffer1.cvs.style.display = 'block';
    buffer2.cvs.style.display = 'block';
    buffer3.cvs.style.display = 'block';

    cvs.style.width = cvs.style.width = size;
    cvs.style.height = cvs.style.height = size;

		buffer1.cvs.width = cvs.width;
    buffer1.cvs.height = cvs.height;
		buffer1.cvs.style.width = size;
    buffer1.cvs.style.height = size;

    buffer2.cvs.style.width = size;
    buffer2.cvs.style.height = size;
    buffer2.cvs.width = cvs.width;
    buffer2.cvs.height = cvs.height;

    buffer3.cvs.style.width = size;
    buffer3.cvs.style.height = size;
    buffer3.cvs.width = cvs.width;
    buffer3.cvs.height = cvs.height;
		
		sv.drawVideo = draw;
		// ctx.fillStyle = '#fa00ff';
    // buffer2.ctx.fillStyle = '#000';

    maskImg = document.getElementById('video-mask');
    setImages();
	}

  function setImages(){
    for(let i=0; i<imgs.length; i++){
      var img = imgs[i];
      imgOffsets[i] = {img:img,x:0,y:0,scale:0,opacity:0,width:img.width,height:img.height};
    }
  }

	function draw(){
    ctx.clearRect(0,0,cvs.width,cvs.height);
    buffer1.ctx.clearRect(0,0,cvs.width,cvs.height);
    buffer2.ctx.clearRect(0,0,cvs.width,cvs.height);
    buffer3.ctx.clearRect(0,0,cvs.width,cvs.height);

    buffer1.ctx.globalCompositeOperation = 'source-over';
    buffer1.ctx.fillStyle = '#fff';
    buffer1.ctx.fillRect(0,0,cvs.width,cvs.height);
    buffer1.ctx.globalCompositeOperation = 'darken';
    buffer1.ctx.drawImage(video, 0, 0,cvs.width,cvs.height);
    

    buffer2.ctx.globalCompositeOperation = 'source-over';
    buffer2.ctx.drawImage(buffer1.cvs,0,0,cvs.width,cvs.height);
    buffer2.ctx.globalCompositeOperation = 'destination-in';
    buffer2.ctx.drawImage(maskImg,0,0,cvs.width,cvs.height);


    buffer3.ctx.globalCompositeOperation = 'source-over';
    // drawImage(buffer3.ctx);
    buffer3.ctx.fillStyle = 'rgba(0,0,0,255)';
    buffer3.ctx.fillRect(0,0,cvs.width,cvs.height);
    buffer3.ctx.globalCompositeOperation = blendMode;//'destination-in';
    buffer3.ctx.drawImage(buffer2.cvs,0,0,cvs.width,cvs.height);
    buffer3.ctx.globalCompositeOperation = 'destination-in';
    buffer3.ctx.drawImage(maskImg,0,0,cvs.width,cvs.height);

    // buffer3.ctx.globalCompositeOperation = 'screen';
    // drawImage(buffer3.ctx);

    ctx.globalCompositeOperation = 'source-over';
    drawImage(ctx);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(buffer3.cvs,0,0,cvs.width,cvs.height);
    // ctx.fillStyle = '#22658c';
    // ctx.fillRect(0,0,cvs.width,cvs.height);
	}

  var crtImg;
  function drawImage(ctx){
    crtImg = imgOffsets[0];
    // crtImg.opacity += (1-crtImg.opacity)*0.2;
    // crtImg.scale += (1-crtImg.opacity)*0.2;
    ctx.drawImage(crtImg.img,0,0,crtImg.width,crtImg.height);

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

  function createBufferCanvas(){
    let cvs = document.createElement('canvas'),
        ctx = cvs.getContext('2d');
    return {cvs:cvs,ctx:ctx}
  }

	setup.call(this);
}

Main.prototype.constructor = Main;
module.exports = Main;