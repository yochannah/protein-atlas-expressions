var jQuery  = require('jquery'),
sorter      = require('./sorter');

var proExData = function(){

  init = function(data){
    console.log('todo ', data);
    var ret = {}, gene, expr, organ; //organ is tissue.tissueGroup.
    for (var i = 0; i < data.length; i++) {
      gene = data[i];
      for (var j = 0; j < gene.proteinAtlasExpression.length; j++) {
        expr = gene.proteinAtlasExpression[j];
        organ = expr.tissue.tissueGroup.name;
        if(!ret[organ]) {
          ret[organ] = [];
        }
        ret[organ].push(expr);
      }
    }
    return ret;
  }
  return {init:init}
}

module.exports = proExData;
