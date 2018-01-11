/*
  Require
  <script>
    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  </script>
*/

var $ = require('jQuery');
(function(){
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  
  var YoutubePlayer= function(youtubeID,domID,width,height,ready){
    var _this       = this;
    var initialized = false,
        isReady     = false;

    this.player;
    this.init = function(){
      if(initialized)return;
      initialized = true;
      this.player = new YT.Player(domID, {
        height: height,
        width: width,
        videoId: youtubeID,
        events: {
          'onReady': _this.onPlayerReady,
          'onStateChange': _this.onPlayerStateChange
        }
      });

      return this;
    }

    this.onPlayerReady = function(e){
      isReady = true;
      if(ready)ready(e);
      // _this.player.stopVideo();

    }

    this.onPlayerStateChange = function(e){
      
    }

    this.play = function(){
      this.player.playVideo();
    }

    this.remove = function(){
      this.player.destroy();
    }

    this.stop = function(){
      if(!isReady)return;
      this.player.stopVideo();
    }

    return this.init();
  };
  module.exports = YoutubePlayer;
}).call(this);