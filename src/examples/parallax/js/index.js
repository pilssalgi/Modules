(function () {
	var throttle			= require('lodash/throttle');
	var debounce			= require('lodash/debounce');
	var SmoothScroll	= require('../../../js/modules/ui/FakeScroll');
	var FlickrLoader	= require('../../../js/modules/api/FlickrLoader');
	var UAParser			= require('ua-parser-js');
	var UA						= new UAParser();
	var isPC					= UA.getDevice().vendor == undefined?true:false;

	var wrap 			= $('.wrapIn'),
			wrapLeft	= $('.galleryLeft'),
			wrapRight	= $('.galleryRight');
	var pathName = window.location.pathname.split('/');
	var pageName = pathName[pathName.length-1].split('.')[0];	
	var tags 		= ['vangogh','leonardo','michelangelobuonarroti','rembrandt','andywarhol','paulgauguin'];
	var crtTag 	= -1;

	var SScroll=null,palax;
	var ParallaxModules = {
		rotateZoom:require('./Parallax_Zoom'),
		fadeAcc:require('./Parallax_FadeAcc')
	}
	var ParallaParams = {
		rotateZoom 	: {degree:10,zoom:300,speed:0.02,fadeAcc:true,fadeAccOffset:300},
		fadeAcc 		: {showUpAcc:300}
	}

	$(document).ready(function(){
		$('.'+pageName).addClass("active");
		setup();
	});
	
	function setup(){
		$(window).on('scroll',throttle(onScroll,300));
		if(isPC)SScroll = new SmoothScroll(wrap[0],0.1);
		update();

		crtTag = 0;
		FlickrLoader(tags[crtTag],makeImageDom);
		tagSet();
	}

	function tagSet(){
		for(var i=0; i<tags.length; i++){
			var a = $('<a>#'+tags[i]+'</a>');
			$('.tags').append(a);

			(function(dom,id){
				dom.on('click',function(){
					if(isLoading || crtTag==id)return;
					crtTag = id;
					isLoading = true;
					FlickrLoader(tags[id],makeImageDom);
				})
			})(a,i);
		}
	}

	var loadCount = 0;
	var imgs = [];
	var isLoading = true;
	function makeImageDom(datas){
		wrapLeft.empty();
		wrapRight.empty();
		loadCount = 0;
		var count = 1;
		for(var i=0; i<datas.length; i++){
			var imgWrap   = $('<article class="img-wrap"></article>').appendTo((count%2==0?wrapLeft:wrapRight));
			var imgWrapIn = $('<article class="img-wrapIn"></article>').appendTo(imgWrap);
			var img = document.createElement("img");
			imgWrapIn.append(img);
			img.src = datas[i].url;
			img.onload = function(){
				$(this).attr({width:this.width,height:this.height});
				loadCount++;
				if(loadCount == datas.length){
					isLoading = false;
					SScroll.sizeUpdate();

					if(!palax)palax = new ParallaxModules[pageName]($('.img-wrap'),ParallaParams[pageName]);
					else palax.setList($('.img-wrap'));
				}
			}
			count++;
		}
	}

	var ticking = false;
	function onScroll(e){
		if(!ticking){
			requestAnimationFrame(update);
		}
		ticking = true;
	}

	function update(){
		requestAnimationFrame(update);
		if(palax)palax.update(SScroll?SScroll.position.y:undefined);
	}

}).call(this);