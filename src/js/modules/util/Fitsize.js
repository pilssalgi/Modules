(function(){
  function FitSize($elem,option){
    var global = this,
        target = $elem,
        isReady = $elem[0]=='undefined'?false:true;
    var directW = 1,
        directH = 1;

    this.config = { 
      position : "", 
      align : "c",
      size : "cover",
      marginX : 0,
      marginY : 0,
      compareTarget : isReady?$elem.parent():null,
      minWidth:undefined, 
      minHeight:undefined, 
      maxWidth:undefined, 
      maxWidth:undefined, 
      callBack : undefined, 
      autoResize : true
    };

    $.extend(this.config,option);
    if(this.config.align.indexOf('r') > -1)directW = -1;
    if(this.config.align.indexOf('b') > -1)directH = -1;

    this.targetInfo = {
      obj:$elem,
      width:0,
      height:0,
      aspect:0,
      update:update,
      css : { width:0,height:0,left:0,top:0},
      fit : function(){
        this.obj.css(this.css);
      }
    }

    this.compareTargetInfo = {
      obj:global.config.compareTarget,
      width:0,height:0,aspect:0,
      update : update
    }

    function update(){
      if(isReady){
        this.width  = this.obj.outerWidth();
        this.height = this.obj.outerHeight();
        this.aspect = this.width/this.height;
      }
    }

    this.fit = function(){
      var frameW  = this.compareTargetInfo.width,
          frameH  = this.compareTargetInfo.height,
          aspect  = this.targetInfo.aspect,
          targetCss = this.targetInfo.css;
      
      if(frameW/aspect < frameH){
          targetCss.width   = frameH*aspect;
          targetCss.height  = frameH;
      }else{
          targetCss.width   = frameW;
          targetCss.height  = frameW/aspect;
      }


      switch(this.config.size){
        case 'cover'  : break;
        case 'width'  : targetCss.width   = frameW;
                        targetCss.height  = frameW/aspect; 
                        break;

        case 'height' : targetCss.width   = frameH*aspect;
                        targetCss.height  = frameH;
                        break;

        case 'contain' : if(frameH*aspect > frameW){
                          targetCss.width   = frameW;
                          targetCss.height  = frameW/aspect; 
                        }else{
                          targetCss.width   = frameH*aspect;
                          targetCss.height  = frameH;
                        }
                        break;
      }

      // targetCss.width = Math.floor(targetCss.width);
      // targetCss.height = Math.floor(targetCss.height);

      if(typeof this.config.minWidth !== 'undefined'){
        if(targetCss.width < this.config.minWidth){
          targetCss.width  = this.config.minWidth;
          targetCss.height = targetCss.width/aspect;
        }
      }

      if(typeof this.config.minHeight !== 'undefined'){
        if(targetCss.height < this.config.minHeight){
          targetCss.height = this.config.minHeight;
          targetCss.width   = targetCss.height*aspect;
        }
      }

      if(typeof this.config.maxWidth !== 'undefined'){
        if(targetCss.width > this.config.maxWidth){
          targetCss.width  = this.config.maxWidth;
          targetCss.height = targetCss.width/aspect;
        }
      }

      if(typeof this.config.maxHeight !== 'undefined'){
        if(targetCss.height > this.config.maxHeight){
          targetCss.height = this.config.maxHeight;
          targetCss.width   = targetCss.height*aspect;
        }
      }

      targetCss.left  = (frameW-targetCss.width)*0.5;
      targetCss.top   = (frameH-targetCss.height)*0.5;
      
      switch(this.config.align){
          case 'l'  : targetCss.left = 0;
                      break;
          case 'r'  : targetCss.left = (frameW-targetCss.width);
                      break;
          case 't'  : targetCss.top = 0;
                      break;
          case 'b'  : targetCss.top = (frameH-targetCss.height);
                      break;
          case 'lt' : targetCss.left = 0; targetCss.top = 0;
                      break;
          case 'lb' : targetCss.left = 0; targetCss.top = (frameH-targetCss.height);
                      break;
          case 'rt' : targetCss.left = (frameW-targetCss.width); targetCss.top = 0;
                      break;
          case 'rb' : targetCss.left = (frameW-targetCss.width); targetCss.top = (frameH-targetCss.height);
                      break;
      }
      targetCss.left += this.config.marginX;
      var marginH = targetCss.height-frameH;
          
      // if(ratioH > 1){
        targetCss.top += marginH*0.01*this.config.marginY*directH;
        // if(this.config.align == 'b')targetCss.top *= -1;
      // }
      

      this.targetInfo.fit();
    };

    function init(){
      if(isReady){
        // console.log(global.targetInfo.obj.css('position'));
        if(global.targetInfo.obj.css('position') == 'static'){
          global.targetInfo.obj.css('position','relative')
        }
        global.update();
        if(global.config.autoResize){
          $(window).on('resize',global.onResize);
        }
      }
    }

    this.update = function(){
      this.targetInfo.update();
      this.compareTargetInfo.update();
      this.fit();
    }

    this.onResize = function(){
      global.update();
    }

    init();
    return this;
  }

  FitSize.prototype.constructor = FitSize;
  this.FitSize = FitSize;
  module.exports = FitSize;
}).call(this);