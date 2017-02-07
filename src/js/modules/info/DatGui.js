(function(){
  var DatGui = function(){
    this.gui = new dat.GUI();
    var param = {color:'0xffffff'},folders = {};
    this.add = function(folderName,name, value, callback, isColor, min, max){
      if(!folders[folderName]){
        folders[folderName] = this.gui.addFolder(folderName);
      }
      var node,folder = folders[folderName];
      param[ name ] = value;
      if ( isColor ) {
        node = folder.addColor( param, name ).onChange( function() {
          callback( param[ name ] );
        } );
        callback( param[ name ] );
      } else if ( typeof value == 'object' ) {
        node = folder.add( param, name, value ).onChange( function() {
          callback( param[ name ] );
        } );
        callback( param[ name ] );
      } else {
        node = folder.add( param, name, min, max ).onChange( function() {
          callback( param[ name ] );
        } );
        callback( param[ name ] );
      }
      return node;
    }
  }

  DatGui.prototype.constructor = DatGui;
  module.exports = DatGui;
}).call();