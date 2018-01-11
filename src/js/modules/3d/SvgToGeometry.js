var extract   = require('extract-svg-path').parse;
var load      = require('load-svg');
var Complex   = require('three-simplicial-complex')(THREE);
var svgMesh3d = require('svg-mesh-3d');
var SvgToGeometry = function(){
  this.get = function(svgPath,cb){
    load(svgPath, function(err, svg) {
      var pathInfo = [];
      var geometry = null;
      $(svg).find('path').each(function(i) {
        var path = $(this).attr('d');
        var mesh = svgMesh3d(path);

        pathInfo.push({
          count:i,
          faces:mesh.cells.length,
          index:i==0?0:pathInfo[i-1].index+pathInfo[i-1].faces,
          position:{x:0,y:0,z:0,opacity:0}
        });
        // meshs.push(svgMesh3d(extract(svg)));
      });
      geometry = svgMesh3d(extract(svg));
      var bufferGeometry = new THREE.BufferGeometry().fromGeometry( Complex(geometry) );
      cb({pathInfo:pathInfo,geometry:bufferGeometry});
    });
  }

  this.getNotLoad = function(svg,cb){
    var pathInfo = [];
    var geometry = null;
    $(svg).find('path').each(function(i) {
      var path = $(this).attr('d');
      var mesh = svgMesh3d(path);

      pathInfo.push({
        count:i,
        faces:mesh.cells.length,
        index:i==0?0:pathInfo[i-1].index+pathInfo[i-1].faces,
        position:{x:0,y:0,z:0,opacity:0}
      });
      // meshs.push(svgMesh3d(extract(svg)));
    });
    geometry = svgMesh3d(extract(svg));
    var bufferGeometry = new THREE.BufferGeometry().fromGeometry( Complex(geometry) );
    cb({pathInfo:pathInfo,geometry:bufferGeometry});
  }
};

module.exports = new SvgToGeometry();