/**
 * Copyright (c) 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
HTMLWidgets.widget({
  name: 'visaChart',
  type: 'output',

  factory: function(el, width, height) {
    // get container size (width and height) // not sure we need this
    var containerWidth = width * 0.9;
    var containerHeight = height * 0.8;
    var tagName = '';

    // console.log('checking el', el, containerWidth, containerHeight, width, height);

    return {
      renderValue: function(x) {
        tagName = x.tagName;
        x.height = containerHeight;
        x.width = containerWidth;
        x.data = HTMLWidgets.dataframeToD3(x.data);

        // first check whether the element exists
        var chartElement;

        // create chart it will create and bind to its own element
        if (el.querySelector(x.tagName)) {
          chartElement = el.querySelector(x.tagName);

          // assign props
          Object.keys(x).forEach(prop => {
            if (prop === 'propList') {
              Object.keys(x[prop]).forEach(propListProp => {
                chartElement[propListProp] = x.propList[propListProp];
              });
            } else if (prop !== 'tagName') {
              chartElement[prop] = x[prop];
            }
          });
        } else {
          chartElement = document.createElement(x.tagName);

          // assign props
          Object.keys(x).forEach(prop => {
            if (prop === 'propList') {
              Object.keys(x[prop]).forEach(propListProp => {
                chartElement[propListProp] = x.propList[propListProp];
              });
            } else if (prop !== 'tagName') {
              chartElement[prop] = x[prop];
            }
          });

          // append chartElement to el
          el.appendChild(chartElement);
        }

        // TODO: code to render the widget, e.g.
        // console.log('test', x, chartElement);
      },

      resize: function(width, height) {
        var containerWidth = width * 0.9;
        var containerHeight = height * 0.8;
        var chartElement = el.querySelector(tagName);

        // TODO: not sure what to do here, maybe just pass updated height and width to bar chart
        chartElement.height = containerHeight;
        chartElement.width = containerWidth;

        // console.log('we are in resize', height, width, chartElement, chartElement.height, chartElement.width);
      }
    };
  }
});
