/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
// import { selection } from 'd3-selection';

// in production build t.moveToFront() was erroring as not a function, refactored
export function moveToFront(selection) {
  // selection.prototype.moveToFront = function() {
  return selection.each(function() {
    this.parentNode.appendChild(this);
  });
  // };
  // return node.moveToFront();
}
