var Bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
module.exports = Bind;