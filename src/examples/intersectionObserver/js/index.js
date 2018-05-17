(function () {
  var SelfPosition = require('../../../js/modules/parallax/SelfPosition');
  var FakeScroll  = require('../../../js/modules/ui/FakeScroll');
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
      observers = [];
  var top = 0, scrollTop = 0;
  var loadedCount = 0;

  let observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: []
  };

  let threshold = [];

  getRandomImage('tokyo',function(datas){
    for (let i=0; i<=1.0; i+= 0.01) {
      threshold.push(i);
    }
    for(var i=0; i<datas.length; i++){

      var imgWrap = $('<article class="img-wrap" id="'+i+'"></article>').appendTo(wrapIn);
      // imgWrap.css({maxWidth:Math.floor(Math.random()*400+300)});
      var img = document.createElement("img");
      img.src = datas[i].url;
      imgWrap.append(img);
      img.onload = function(){
        $(this).attr({width:this.width,height:this.height});
        loadedCount++;
        if(loadedCount == datas.length){
          setup();
          setTimeout(function(){$(window).trigger('resize');},500);
        }
      }
      var title = $('<h3>'+datas[i].title+'</h3>').appendTo(imgWrap);
      observers[i] = {
        intersection:new IntersectionObserver(intersectionCallback,{root:null,rootMargin: "0px",threshold: threshold}),
        img:img,
        offset:{x:0,y:0},
        position:{x:0,y:0}
      };
      observers[i].intersection.observe(imgWrap[0]);
    }
  });

  function intersectionCallback(entries) {
    entries.forEach(function(entry) {
      let box = entry.target;
      let id = box.id;
      let rect = entry.boundingClientRect;
      observers[id].offset.y = (rect.top+rect.height) / (window.innerHeight+rect.height);
      if(id==3)console.log(rect,entry.intersectionRect);
      // translate3d(observers[id].img,0,(100-observers[id].offset.y*100)+'px',0);

    });
  }

  function setup(){
    // $(window).on('scroll',onScroll);
    new FakeScroll(wrapIn[0],0.1);
    update();
  }

  var ticking = false;
  function onScroll(){}
  function update(){
    let img,offset,pos;
    for(let i=0; i<observers.length; i++){
      img = observers[i].img;
      offset = observers[i].offset;
      pos = observers[i].position;
      pos.y += (offset.y*200-pos.y)*0.1;
      // if(i==3)console.log(offset.y);
      translate3d(img,0,pos.y+'px',0);
    }
    requestAnimationFrame(update);
  }

  function translate3d(dom,x,y,z){
    dom.style.transform = "translate3d("+x+","+y+","+z+")";
  }
}).call(this);