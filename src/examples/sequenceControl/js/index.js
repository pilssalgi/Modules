(function () {
	var throttle			= require('lodash/throttle');
	var debounce			= require('lodash/debounce');
	var UAParser			= require('ua-parser-js');
	var UA						= new UAParser();
	var isPC					= UA.getDevice().vendor == undefined?true:false;

	var SequenceVideo 					= require('./SequenceVideo');
	var SequenceVideoExtended 	= require('./SequenceVideoExtended');
	var SequenceVideoPixi 			= require('./SequenceVideoPixi');
	var SequenceWebgl						= require('./SequenceWebgl');
	$(document).ready(function(){
		setup();
	});
		
	var gui;
	var pathName = window.location.pathname.split('/');
	var pageName = pathName[pathName.length-1].split('.')[0];	
	var methods = {};

	function setup(){

		if(pageName == 'videoDrawCavas'){
			var sv = new SequenceVideo($('.wrap'),'video');
			methods.play = function(){
				sv.play();
			}
			methods.stop = function(){
				sv.stop();
			}
			methods.pause = function(){
				sv.pause();	
			}

			gui = new dat.GUI();
			gui.add(methods,'play');
			gui.add(methods,'pause');
			gui.add(methods,'stop');
		}

		// Draw on Pixi
		if(pageName == 'videoDrawPixi'){
			gui = new dat.GUI();
			var sve = new SequenceVideoPixi($('.wrap'),'video',gui);
			$('.wrap').css({background:'#22658c'});
			methods.play = function(){
				sve.play();
			}
			methods.stop = function(){
				sve.stop();
			}
			methods.pause = function(){
				sve.pause();	
			}

			gui.add(methods,'play');
			gui.add(methods,'pause');
			gui.add(methods,'stop');
		}
		
		// Draw on Webgl
		if(pageName == 'videoDrawWebgl'){
			var imgs = [];
			$('.imgs img').each(function(i){
				imgs[i] = $(this)[0];
			});

			var videoDom = document.getElementById('video');

			var offset = {
				// cameraZoomMotion:{start:0.38,end:0.43},
				// PlaneZoomMotion:{start:0,end:-0.05},
				// textureZoomMotion:{start:1.3,end:1}
			};


			var sw = new SequenceWebgl($('.wrap')[0],videoDom,imgs[0].getAttribute('src'),offset);
			
			methods.play = function(){
				var random = Math.floor(Math.random()*(imgs.length-1));
				sw.changeImage(imgs[random].getAttribute('src'));
				sw.play();
			}
			methods.stop = function(){
				sw.stop();
			}
			methods.pause = function(){
				sw.pause();	
				}

			gui = new dat.GUI();
			gui.add(methods,'play');

			setTimeout(function(){
				methods.play();
				console.log("play");
			},2000);
			// gui.add(methods,'pause');
			// gui.add(methods,'stop');
		}
		

	}


}).call(this);