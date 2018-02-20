(function () {
  var SelfPosition = require('../../../js/modules/parallax/SelfPosition');
  var throttle    = require('lodash/throttle');
  var debounce    = require('lodash/debounce');
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

  var wrap = $('.wrap'),
      imgs = [];
  var top = 0, scrollTop = 0;
  getRandomImage('mountain',function(datas){
    for(var i=0; i<10; i++){

      var imgWrap = $('<article class="img-wrap"></article>').appendTo(wrap);
      imgWrap.css({maxWidth:Math.floor(Math.random()*400+300)});
      var img = document.createElement("img");
      img.src = datas[i].url;
      img.onload = function(){
        $(this).attr({width:this.width,height:this.height});
      }

      imgWrap.append(img);
      // var title = $('<h3>'+datas[i].title+'</h3>').appendTo(imgWrap);
      imgs.push({wrap:imgWrap,offset:0,img:img,y:0,titleY:0,rect:null,self:new SelfPosition(img)._setup()});

    }
    setup();
  });

  function setup(){
    $(window).on('scroll',throttle(onScroll,100));
    $(window).on('resize',onResize);
    onResize();
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
    for(var i=0; i<imgs.length; i++){
      imgs[i].rect = imgs[i].img.getBoundingClientRect();
      imgs[i].offset = imgs[i].wrap.offset();
    } 
  }

  function update(){
    top += (scrollTop-top) * 0.1;
    for(var i=0; i<imgs.length; i++){
      var info = imgs[i];

      var y = (scrollTop+info.rect.height)/(info.rect.y+info.rect.height+window.innerHeight);
      if(i==2){
        // imgs[i].rect = imgs[i].img.getBoundingClientRect();
        console.log(i,"rect", y,info.rect,info.offset);
      }


      // var self = imgs[i].self;
      // self._update();
      // var y = -5+self.progress*10;
      // imgs[i].y += (y-imgs[i].y)*0.1;
      // var titleY = 100-self.progress*200;
      // imgs[i].titleY += (titleY-imgs[i].titleY)*0.1;
      // if(self.progress < 2 && self.progress > -1){
      //   imgs[i].img.style.transform = translate3d('0px',Number(imgs[i].y.toFixed(3))+'%',200);
      //   imgs[i].title.style.transform = translate3d('0px',Number(imgs[i].titleY.toFixed(3))+'px',0);
      // }
    }

    if(Math.abs(top-scrollTop)<0.01){
      ticking = false;
    }else{
      requestAnimationFrame(update);
    }
  }

  function translate3d(x,y,z){
    return 'translate3d('+x+','+y+','+z+'px)';
  }

}).call(this);