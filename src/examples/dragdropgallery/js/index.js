(function () {
  $(document).ready(function(){
    var dndGallery = require('./DragAndDropGallery');
    var arrL1 = $('.dragAndDropLeft .arrL'),
        arrR1 = $('.dragAndDropLeft .arrR'),
        arrL2 = $('.dragAndDropRight .arrL'),
        arrR2 = $('.dragAndDropRight .arrR');

    var dndG1 = new dndGallery($('.dragAndDropLeft'),{friction:0.9,arrowLeft:arrL1,arrowRight:arrR1});
    var dndG2 = new dndGallery($('.dragAndDropRight'),{friction:0.96,arrowLeft:arrL2,arrowRight:arrR2,reverse:true});

    arrL1.on('click',function(){
      dndG1.prev({duration:2,ease:Back.easeInOut});
    });

    arrR1.on('click',function(){
      dndG1.next({complete:function(){console.log('moved')}});
    });

    arrL2.on('click',function(){
      dndG2.next();
    });

    arrR2.on('click',function(){
      dndG2.prev();
    });

  });
}).call(this);