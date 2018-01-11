(function(){
  var ShuffleText = function(option){
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789,.?/\\(^)![]{}*&^%$#'\"";
    var word,length,cnt;
    var isShuffling = false;
    var dom,timer;

    var config = {
      step:2,
      letterMargin:3,
      fullview:false,
      framerate:30,
      reverse:false,
      word:'',
      dom:null,
      callback:null
    }
    $.extend(config,option);
    this.config = config;

    if(config.dom){
      config.word = config.dom.text();
    }

    this.start = function($dom){
      if($dom){
        config.dom = $dom;
        config.word = $dom.text();
      }

      if(config.word){
        word = config.word;
      }

      shuffleStart();
    }

    this.change = function(text){
      word = text;
      shuffleStart();
    }

    function shuffleStart(){
      cleartimer();
      cnt = 0;
      length = word.length;
      if(length>0)shuffle(0);
    }
    function shuffle(start){
      if(start>length){
        cleartimer();
        return;
      }
      var temp = word.split('');
      
      if(config.reverse)temp.reverse();
      for(var i=start; i<length; i++){
        if(i>start+config.letterMargin){
          temp[i] = '';
        }else{
          temp[i] = randomText();
        }
        if(config.fullview)temp[i] = randomText();
      }
      var texts = temp.join('');
      if(config.reverse)temp.reverse();
      if(config.dom)config.dom.html(texts);
      if(config.callback)config.callback(texts);

      cnt++;
      var cntStep = Math.floor(cnt/config.step);
      timer = setTimeout(function(){
        shuffle(cntStep);
      },1000/config.framerate);
    }

    function cleartimer(){
      if(timer){
        clearTimeout(timer);
        timer = null;
      }
    }

    function randomText(){
      var len = letters.length-1;
      return letters.substr(Math.floor(Math.random()*(len-1)),1);
    }

    return this;
  }

  ShuffleText.prototype.constructor = ShuffleText;
  module.exports = ShuffleText;
}).call(this);