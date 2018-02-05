(function () {
  $(document).ready(function(){
    var dndGallery = require('./DragAndDropGallery');
    var dndG1 = new dndGallery($('.dragAndDropLeft'));
    var dndG2 = new dndGallery($('.dragAndDropRight'),{reverse:true});


    $('.dragAndDropLeft .arrL').on('click',function(){
      dndG1.prev();
    });

    $('.dragAndDropLeft .arrR').on('click',function(){
      dndG1.next();
    });

    $('.dragAndDropRight .arrL').on('click',function(){
      dndG2.prev();
    });

    $('.dragAndDropRight .arrR').on('click',function(){
      dndG2.next();
    });

  });
}).call(this);