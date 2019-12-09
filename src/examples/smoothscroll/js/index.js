import SmoothScroll from '../../../js/modules/ui/SmoothScroll';

(function () {
  var SelfPosition = require('../../../js/modules/parallax/SelfPosition');
  var throttle    = require('lodash/throttle');
  function getRandomImage(tags,callBack){
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
    { tags: tags,tagmode: "any",format: "json" },
    function(data) {
        var imgs = [];
        for(var i=0; i<data.items.length; i++){
          var url = data.items[i].media.m.replace('_m','_b');
          imgs.push({url:url,title:data.items[i].title});
        }

        callBack(imgs);
    });
  }

  var wrap = $('.wrap'),
      wrapIn = $('.wrap-inner'),
      imgs = [];
  var top = 0, scrollTop = 0;
  var loadedCount = 0;
  getRandomImage('tokyo',function(datas){
    for(var i=0; i<datas.length; i++){

      var imgWrap = $('<article class="img-wrap"></article>').appendTo(wrapIn);
      // imgWrap.css({maxWidth:Math.floor(Math.random()*400+300)});
      var img = document.createElement("img");
      img.src = datas[i].url;
      imgWrap.append(img);
      img.onload = function(){
        loadedCount++;
        if(loadedCount == datas.length){
          setup();
        }
      }
      var title = $('<h3>'+datas[i].title+'</h3>').appendTo(imgWrap);
      imgs.push({wrap:imgWrap,img:img,y:0,titleY:0,title:title[0],self:new SelfPosition(img).setup()});
    }
  });

  function setup(){
    new SmoothScroll(wrapIn[0],{speed:0.05});
  }


}).call(this);