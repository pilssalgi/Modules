var THREE 				= require('three');
function TextureCanvas(width,height){
	this.canvas;
	this.context;
	this.texture;
	this.width  = width;
	this.height = height;
	this.x = 0;
	this.y = 0;
	function setup(){
		this.canvas = document.createElement('canvas');
		this.canvas.width  = width;
		this.canvas.height = height;

		this.context = this.canvas.getContext( '2d' );
		this.context.imageSmoothingEnabled = true;
		this.context.translate(0.5,0.5);

		this.texture = new THREE.Texture(this.canvas);
		this.texture.format			=	THREE.RGBAFormat;
		this.texture.magFilter	=	THREE.NearestFilter;
		this.texture.minFilter	=	THREE.NearestFilter;

		this.clear();
		return this;
	}
	this.clear = function(){
		this.context.clearRect(0,0,this.width,this.height);
	}
	this.draw = function(texture){
		this.clear();
		this.context.drawImage(texture,0,0);
		this.texture.needsUpdate  = true;
	}
	setup.call(this);
};
TextureCanvas.prototype.constructor = TextureCanvas;
module.exports = TextureCanvas;