/* ************************************************************
  Math
************************************************************ */
var _Math = {
  random : function(max,min){
    return Math.floor(Math.random() * (max - min)) + min;
  },
  toRadian : function(degree){
    return Math.PI * degree / 180;
  },
  toDegree : function(radian){
    return radian * 180 / Math.PI;
  }
};

module.exports = _Math;