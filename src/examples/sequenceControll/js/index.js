(function () {
	var throttle			= require('lodash/throttle');
	var debounce			= require('lodash/debounce');
	var UAParser			= require('ua-parser-js');
	var UA						= new UAParser();
	var isPC					= UA.getDevice().vendor == undefined?true:false;

	var SequenceVideo 			= require('./SequenceVideo');
	var SequenceVideoExtned = require('./SequenceVideoExtended');
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

		if(pageName == 'videoDrawCavasExtended'){
			var sve = new SequenceVideoExtned($('.wrap'),'video');
			$('.wrap').css({background:'#faf'});
			methods.play = function(){
				sve.play();
			}
			methods.stop = function(){
				sve.stop();
			}
			methods.pause = function(){
				sve.pause();	
			}

			gui = new dat.GUI();
			gui.add(methods,'play');
			gui.add(methods,'pause');
			gui.add(methods,'stop');
		}
		
	}


}).call(this);