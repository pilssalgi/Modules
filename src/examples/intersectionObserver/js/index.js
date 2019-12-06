import SmoothScroll from '../../../js/modules/ui/SmoothScroll';
import IntersectionObserver from './IntersectionObserver';
const FlickrLoader  = require('../../../js/modules/api/FlickrLoader');

(function () {
  const $wrap = document.querySelector('.wrap');
  const $wrapIn = document.querySelector('.wrap-inner');
  
  const observer = new IntersectionObserver();
  const ss = new SmoothScroll($wrapIn,0.1);

  let loadedCount = 0;

  FlickrLoader('',(datas)=>{
    for(let i=0; i<datas.length; i++){
      let data = datas[i];
      const $imgWrap = document.createElement('article');
      const $title = document.createElement('h3');
      const img = document.createElement("img");

      $title.innerText = data.title;
      $imgWrap.classList.add('img-wrap');
      $imgWrap.appendChild(img);
      $imgWrap.appendChild($title);
      $wrapIn.appendChild($imgWrap);

      img.src = datas[i].url;
      
      img.onload = function(){
        $(this).attr({width:this.width,height:this.height});
        loadedCount++;
        if(loadedCount == datas.length){

          //update fake scroll
          ss.onResize();
        }
      }
      
      
      /*
        add image to observer
      */

      observer.add($imgWrap);
      // observer.remove(imgWrap[0]);
    }

    observer.onUpdate = (entries,observer)=>{
      entries.forEach(function(entry) {
        let target = entry.target;
        let id = target.id;
        if(entry.isIntersecting){
          target.classList.remove('hideUp');
          target.classList.remove('hideDown');
        }else{
          
          if(entry.boundingClientRect.bottom < 0){ // hide up
            target.classList.add('hideUp');
          }else{
            target.classList.add('hideDown');
          }
        }
      });
    };
  });


}).call(this);