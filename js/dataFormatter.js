var proExData = function(){

/**
 * This file should return data that replicates the process gone through here:
 * https://github.com/intermine/intermine/blob/beta/bio/webapp/src/org/intermine/bio/web/model/ProteinAtlasExpressions.java
 * @param  {array} data from the server in the form of the query. See query.json for the structure.
 *                      NOTE THAT AT THE MOMENT I AM NOT CONFIDENT THE QUERY
 *                      MATCHES THE RESULTS RETURNED BY HUMANMINE.
 *                      For the actual query, see: https://github.com/intermine/intermine/blob/beta/bio/webapp/src/org/intermine/bio/web/displayer/ProteinAtlasDisplayer.java
 * @return {[type]}      [description]
 */
  init = function(data){
    var sortedByOrgan = {}, gene, expr, organ, //organ is tissue.tissueGroup.
    tableData = {};
    for (var i = 0; i < data.length; i++) {
      gene = data[i];
      for (var j = 0; j < gene.proteinAtlasExpression.length; j++) {
        expr = gene.proteinAtlasExpression[j];
        organ = expr.tissue.tissueGroup.name;
        if(!sortedByOrgan[organ]) {
          sortedByOrgan[organ] = [];
          tableData[organ] = {
            cells : []
          }
        }
        sortedByOrgan[organ].push(expr);
        pushIfNotPresent(tableData[organ].cells, getCellType(expr));
      }
    }
    for (var organName in tableData) {
      if (tableData.hasOwnProperty(organName)) {
        organ = tableData[organName].cells;
        tableData[organName].cells = organ.sort(sortByLevel);
      }
    }
    return tableDataToArray(tableData);
  },
  tableDataToArray = function(tableObj){
    var arr = [];
    //make Array
    for (var organName in tableObj) {
      if (tableObj.hasOwnProperty(organName)) {
        organ = tableObj[organName];
        organ.name = organName;
        arr.push(organ);
      }
    }
    //Sort the Array by Cell Type
    return arr.sort(sortByCellType);
  },
  sortByCellType = function(a, b){
    if(a.cells.length > b.cells.length) {
      return -1;
    } else if (b.cells.length > a.cells.length) {
      return 1;
    } else {
      return 0;
    }
  },
  sortByLevel = function(a,b){
    var order = ["High", "Medium", "Low", "Not detected"];
    if(order.indexOf(a.level) < order.indexOf(b.level)) {
      return -1;
    } else if (order.indexOf(a.level) > order.indexOf(b.level)) {
      return 1;
    } else {
      return 0;
    }
  },
  pushIfNotPresent = function (arr,val){
    var present = false;
    for(var i = 0; i < arr.length; i++) {
      //check each value to see if it matches.
      if(arr[i].name === val.name){
        present = true;
      }
    }
    if(!present) {
      arr.push(val);
    }
  },
  getCellType = function(expr) {
    return {
      name : expr.tissue.name + " (" + expr.cellType + ")",
      level : expr.level
    };

  }
  return {init:init}
}

module.exports = proExData;
