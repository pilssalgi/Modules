import {TweenMax, Power2, TimelineLite} from "gsap";
(function () {
	var $         = require('jQuery');
  var throttle  = require('lodash/throttle');
	var VideoControl = require('./VideoControl');
	var enableInlineVideo = require('iphone-inline-video');

	var pathName = window.location.pathname.split('/');
	var pageName = pathName[pathName.length-1].split('.')[0];	


  $(document).ready(function(){
    $('.'+pageName).addClass("active");
    setup();
  });

  function setup(){
  	var video = document.getElementById('video');
  	var videoBar = document.getElementById('videoBar')

  	if(pageName == 'videoControl'){
	    var vc = new VideoControl(video);
	    enableInlineVideo(video);
	  }

	  // render();
  }
}).call(this);