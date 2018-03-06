var $ = require('jQuery');
var debounce = require('lodash/debounce');
function Main($dom,videoID,gui){
	const app = new PIXI.Application({ transparent: true });
	var width,height;
	var debounceResize;
	var handwriteSprite,videoSprite;

	function setup(){
		app.stage.interactive = true;
		$dom.append(app.view);
		addEvent();
	}

	function addEvent(){
		debounceResize = debounce(onResize,100);
		$(window).on('resize',debounceResize);
		onResize();
	}

	function onResize(){
		width = $dom.width();
		height = $dom.height();
		app.renderer.resize(width, height );
	}

	this.play = function(){
		var texture = PIXI.Texture.fromVideo('./video/handwrite.mp4');
    handwriteSprite = PIXI.Sprite.fromImage('./video/handwrite-last.png');
    videoSprite = new PIXI.Sprite(texture);

    handwriteSprite.mask = videoSprite;

    app.stage.addChild(handwriteSprite, videoSprite);
    videoSprite.width = app.renderer.width;
    videoSprite.height = app.renderer.height;
    handwriteSprite.width = app.renderer.width;
    handwriteSprite.height = app.renderer.height;
	}

	this.pause = function(){
		// sv.pause();
	}

	this.stop = function(){
		// sv.stop();
	}

	setup.call(this);
}
Main.prototype.constructor = Main;
module.exports = Main;