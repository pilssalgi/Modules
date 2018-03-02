import {TweenMax, Power2, TimelineLite} from "gsap";
var $ 						= require('jQuery');
var debounce 			= require('lodash/debounce');
var THREE 				= require('three');
var TextureCanvas = require('../../../js/modules/webgl/TextureCanvas');
var UAParser  = require('ua-parser-js');
var UA 				= new UAParser();
var isPC 			= UA.getDevice().vendor == undefined?true:false;
var browser 	= UA.getBrowser();
var isIE11 		= browser.name == 'IE' && browser.version == '11.0';
var enableInlineVideo = require('iphone-inline-video');
var assignIn = require('lodash/assignIn');
// isIE11 = false;

function Main(wrap,videoDom,imageUrl,option){
	var width,height,aspect;
	var videoWidth,videoHeight,videoAspect;
	var scene,camera,renderer;
	var debounceResize;
	var video = videoDom;
	var videoTexture,videoCanvasTexture;
	var textureloader,imgTexture;
	var geometry,material,mesh;
	var mMove;
	var uniforms;
	var isRender = false;
	var offset = {
		cameraZoomMotion:{start:0.38,end:0.43},
		PlaneZoomMotion:{start:0,end:-0.05},
		textureZoomMotion:{start:1.5,end:1}		
	};
	assignIn(offset,option);

	function setup(){
		setStageSize();
		scene   	= new THREE.Scene();
		camera  	= new THREE.PerspectiveCamera(75,aspect,0.1,1000);
		renderer 	= new THREE.WebGLRenderer({alpha: true});
		renderer.setSize(width,height);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setClearColor(0x000000, 0);
		wrap.appendChild(renderer.domElement);

		camera.position.z = 0.45;
		videoWidth 	= videoDom.width;
		videoHeight = videoDom.height;
		videoAspect = videoHeight/videoWidth;

		enableInlineVideo(video);

		textureloader = new THREE.TextureLoader();

		if(!isIE11){
			videoTexture = new THREE.VideoTexture( video );
			videoTexture.minFilter 	= THREE.LinearFilter;
			videoTexture.magFilter 	= THREE.LinearFilter;
			videoTexture.format 		= THREE.RGBFormat;	
		}else{
			videoTexture = new TextureCanvas(videoWidth,videoHeight);
		}

		addEvent();
		load(imageUrl,start);

	}

	function load(src,cb){
		textureloader.load(src,function(texture){
			imgTexture = texture;
			if(cb)cb(texture);
		})
	}

	function start(){
		geometry = new THREE.PlaneBufferGeometry(1,videoAspect,10,10);
		geometry.computeBoundingBox();
		uniforms = {
			texture:{type:'t',value:imgTexture},
			tMask:{type:'t',value:videoTexture},
			scale:{type:'f',value:1.2},
			alpha:{type:'f',value:1}
		}
		material = new THREE.ShaderMaterial({
			// wireframe:true,
			transparent:true,
			uniforms:uniforms,
			vertexShader:   document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent
		});
		mesh = new THREE.Mesh(geometry,material);
		scene.add(mesh);
		render();
	}

	function render(){
		renderer.render(scene, camera);

		if(isIE11){
			videoTexture.draw(video);
			uniforms.tMask.value 	= videoTexture.texture;
		}

		if(isRender)requestAnimationFrame(render);
	}

	const addEvent =()=> {
		this.addEvent();
	}
	
	function onResize(){
		setStageSize();
		camera.aspect = aspect;
		renderer.setSize(width,height);
		camera.updateProjectionMatrix();
		renderer.render(scene, camera);
	}

	var distance,boundingHeight,fov;
	function cameraFitObject(){
		distance = mesh.position.distanceTo(camera.position);
		boundingHeight = geometry.boundingBox.max.y-geometry.boundingBox.min.y;
		fov = 2 * Math.atan( boundingHeight / ( 2 * distance ) ) * ( 180 / Math.PI );
		camera.fov = fov;
		camera.updateProjectionMatrix();
	}

	function setStageSize(){
		width  = wrap.clientWidth;
		height = wrap.clientHeight;
		aspect = width/height;
	}

	var tweens = [];
	this.play = function(){
		var delay = video.duration;
		if(!isRender){
			isRender = true;
			render();
		}

		video.play();
		this.reset();

		tweens[0] = TweenLite.to(camera.position,video.duration+1.2,{z:offset.cameraZoomMotion.end,ease:Power0.easeNone});
		tweens[1] = TweenLite.to(uniforms.scale,video.duration+1.2,{value:offset.textureZoomMotion.end,ease:Power1.easeOut});
		tweens[2] = TweenLite.to(uniforms.alpha,0.5,{delay:delay,value:0,ease:Power1.easeOut});
		tweens[3] = TweenLite.to(mesh.position,0.8,{delay:delay,z:offset.PlaneZoomMotion.end,ease:Power4.easeInOut,
			onStart:function(){
				$(wrap).addClass('wrapChangeColor');
			},
			onComplete:function(){
				isRender = false;
			}
		});
	}

	this.reset = function(){
		TweenLite.set(camera.position,{z:offset.cameraZoomMotion.start});
		TweenLite.set(mesh.position,{z:offset.PlaneZoomMotion.start});
		TweenLite.set(uniforms.scale,{value:offset.textureZoomMotion.start});
		TweenLite.set(uniforms.alpha,{value:1});

		$(wrap).removeClass('wrapChangeColor');

		if(tweens[0])tweens[0].kill();
		if(tweens[1])tweens[1].kill();
		if(tweens[2])tweens[2].kill();
		if(tweens[3])tweens[3].kill();
		renderer.render(scene, camera);
	}

	this.pause = function(){
		video.pause();
	}

	this.stop = function(){
		video.pause();
		video.currentTime = 0;
		this.reset();

	}
	this.changeImage = function(imgUrl){
		load(imgUrl,function(texture){
			uniforms.texture.value = texture;
		});
	}

	//Add,Remove Event
	this.addEvent = function(){
		debounceResize = debounce(onResize,100);
		$(window).on('resize',debounceResize);
		onResize();
	}
	this.kill = function(){
		$(window).off('resize',debounceResize);
	}

	setup.call(this);
}
Main.prototype.constructor = Main;
module.exports = Main;