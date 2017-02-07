/* ************************************************************
    Change Image To Canvas
************************************************************ */
var ImageToCanvas = function($img,callback){
  var width   = $img.width(),
      height  = $img.height(),
      image   = new Image(),
      canvas,ctx;

  image.src = $img.attr('src');
  image.onload = function(){
    width = image.width;
    height = image.height;

    canvas = $('<canvas width="'+w+'" height="'+h+'"></canvas>').addClass($img[0].className).css({display:'block'});
    ctx = canvas[0].getContext("2d");

    $img.before(canvas);
    $.extend(canvas.data(),$img.data());
    if($img[0].id != 'undefined')canvas.attr('id',$img[0].id);
    
    canvas.width    = w;
    canvas.height   = h;
    ctx.drawImage(image, 0, 0, w, h);
    $img.remove();
    if(callback)callback();
  }
  return canvas;
}

module.exports = ImageToCanvas;