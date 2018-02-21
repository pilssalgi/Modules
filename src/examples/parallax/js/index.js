(function () {
  var throttle      = require('lodash/throttle');
  var debounce      = require('lodash/debounce');
  var SmoothScroll  = require('../../../js/modules/ui/FakeScroll');
  function getRandomImage(tags,callBack){
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
    { tags: tags,tagmode: "any",format: "json" },
    function(data) {
        var rnd = Math.floor(Math.random() * data.items.length);
        var imgs = [];
        for(var i=0; i<data.items.length; i++){
          var url = data.items[i].media.m.replace('_m','_b');
          imgs.push({url:url,title:data.items[i].title});
        }

        callBack(imgs);
    });
  }

  var wrap = $('.wrapIn'),
      wrapLeft = $('.galleryLeft'),
      wrapRight = $('.galleryRight'),
      imgs = [];
  var top = 0, scrollTop = 0;
  var loadCount = 0;
  getRandomImage('vangogh',function(datas){
    for(var i=0; i<datas.length; i++){
      var imgWrap   = $('<article class="img-wrap"></article>').appendTo((i<datas.length*0.5?wrapLeft:wrapRight));
      var imgWrapIn = $('<article class="img-wrapIn"></article>').appendTo(imgWrap);
      var img = document.createElement("img");
      imgWrapIn.append(img);
      img.src = datas[i].url;
      img.onload = function(){
        $(this).attr({width:this.width,height:this.height});
        loadCount++;
        if(loadCount == datas.length)setup();
      }
    }
    
  });

  var ParallaxModules = {
    rotateZoom:require('./Parallax_Zoom'),
    fadeAcc:require('./Parallax_FadeAcc')
  }

  var params = {
    rotateZoom : {degree:10,zoom:200,speed:0.02},
    fadeAcc : {}
  }

  var ss,palax;
  function setup(){
    $(window).on('scroll',throttle(onScroll,1000));
    ss = new SmoothScroll(wrap[0],0.1);

    var pageName = window.location.pathname.split('/');
    pageName = pageName[pageName.length-1].split('.')[0];
    var paraxModule = ParallaxModules[pageName];
    palax = new paraxModule($('.img-wrap'),params[pageName]);
    update();
  }

  var ticking = false;
  function onScroll(e){
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if(!ticking){
      requestAnimationFrame(update);
    }
    ticking = true;
  }

  function update(){
    requestAnimationFrame(update);
    palax.update(ss.position.y);
  }

}).call(this);