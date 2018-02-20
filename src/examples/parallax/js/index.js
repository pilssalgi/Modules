(function () {
  var throttle      = require('lodash/throttle');
  var debounce      = require('lodash/debounce');
  var SmoothScroll  = require('../../../js/modules/ui/FakeScroll');
  var Parallax      = require('./Parallax');
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
      wrapLeft = $('.wrapLeft'),
      wrapRight = $('.wrapRight'),
      imgs = [];
  var top = 0, scrollTop = 0;
  var loadCount = 0;
  var ss,palax;
  getRandomImage('vangogh',function(datas){
    for(var i=0; i<datas.length; i++){
      var imgWrap = $('<article class="img-wrap"></article>').appendTo((i<datas.length*0.5?wrapLeft:wrapRight));
      var img = document.createElement("img");
      imgWrap.append(img);
      img.src = datas[i].url;
      img.onload = function(){
        $(this).attr({width:this.width,height:this.height});
        loadCount++;
        if(loadCount == datas.length)setup();
      }
    }
    
  });

  function setup(){
    $(window).on('scroll',throttle(onScroll,100));
    $(window).on('resize',onResize);
    onResize();
    ss = new SmoothScroll(wrap[0]);
    ss.speed = 0.08;
    palax = new Parallax($('.img-wrap'));

    update();
  }

  var ticking = false;
  function onScroll(){
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if(!ticking){
      requestAnimationFrame(update);
    }
    ticking = true;
  }

  function onResize(){
  }

  function update(){
    requestAnimationFrame(update);
    palax.update(ss.position.y);
  }

  function translate3d(x,y,z){
    return 'translate3d('+x+','+y+','+z+'px)';
  }

}).call(this);