/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export const polyfillMouseEvents = (window: any) => {
  // Polyfills DOM4 MouseEvent
  const MouseEventPolyfill = function(eventType, params) {
    params = params || { bubbles: false, cancelable: false };
    const mouseEvent = document.createEvent('MouseEvent');
    mouseEvent.initMouseEvent(
      eventType,
      params.bubbles,
      params.cancelable,
      window,
      0,
      params.screenX || 0,
      params.screenY || 0,
      params.clientX || 0,
      params.clientY || 0,
      params.ctrlKey || false,
      params.altKey || false,
      params.shiftKey || false,
      params.metaKey || false,
      params.button || 0,
      params.relatedTarget || null
    );

    return mouseEvent;
  };

  MouseEventPolyfill.prototype = Event.prototype;

  window.MouseEvent = MouseEventPolyfill;
};

export const polyfillGetAttributeNames = () => {
  if (Element.prototype.getAttributeNames == undefined) {
    Element.prototype.getAttributeNames = function() {
      var attributes = this.attributes;
      var length = attributes.length;
      var result = new Array(length);
      for (var i = 0; i < length; i++) {
        result[i] = attributes[i].name;
      }
      return result;
    };
  }
};
