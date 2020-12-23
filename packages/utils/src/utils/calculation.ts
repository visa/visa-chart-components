/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export function leastSquares(xSeries, ySeries) {
  var reduceSumFunc = function(prev, cur) {
    return prev + cur;
  };

  var xBar = (xSeries.reduce(reduceSumFunc) * 1.0) / xSeries.length;
  var yBar = (ySeries.reduce(reduceSumFunc) * 1.0) / ySeries.length;

  var ssXX = xSeries
    .map(function(d) {
      return Math.pow(d - xBar, 2);
    })
    .reduce(reduceSumFunc);

  var ssYY = ySeries
    .map(function(d) {
      return Math.pow(d - yBar, 2);
    })
    .reduce(reduceSumFunc);

  var ssXY = xSeries
    .map(function(d, i) {
      return (d - xBar) * (ySeries[i] - yBar);
    })
    .reduce(reduceSumFunc);

  var slope = ssXY / ssXX;
  var intercept = yBar - xBar * slope;
  var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

  return [slope, intercept, rSquare];
}

export function capitalized(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
