(function () {
	var throttle			= require('lodash/throttle');
	var debounce			= require('lodash/debounce');
	var UAParser			= require('ua-parser-js');
	var UA						= new UAParser();
	var isPC					= UA.getDevice().vendor == undefined?true:false;

	var SequenceVideo 					= require('./SequenceVideo');
	var SequenceVideoExtended 	= require('./SequenceVideoExtended');
	var SequenceVideoPixi 			= require('./SequenceVideoPixi');
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

			console.log("gui", gui);
		}

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
		

		if(pageName == 'videoDrawExtended'){
			var imgs = [];
			$('.imgs img').each(function(i){
				imgs[i] = $(this)[0];
			});
			gui = new dat.GUI();
			var sve = new SequenceVideoExtended($('.wrap'),'video',imgs,gui);
			$('.wrap').css({background:'#aa658c'});
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
		

	}


}).call(this);