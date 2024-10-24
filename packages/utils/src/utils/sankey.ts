/**
 * Copyright (c) 2021, 2023, 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/

/* This file includes code covered by the following notice */
/**
 * Copyright 2015, Mike Bostock
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * * Neither the name of the author nor the names of contributors may be used to
 * endorse or promote products derived from this software without specific prior
 * written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **/

import { max, min, sum } from 'd3-array';
import { linkHorizontal, linkVertical } from 'd3-shape';

function targetDepth(d) {
  return d.target.depth;
}

export function sankeyLeft(node) {
  return node.depth;
}

export function sankeyRight(node, n) {
  return n - 1 - node.height;
}

export function sankeyJustify(node, n) {
  return node.sourceLinks.length ? node.depth : n - 1;
}

export function sankeyCenter(node) {
  return node.targetLinks.length ? node.depth : node.sourceLinks.length ? min(node.sourceLinks, targetDepth) - 1 : 0;
}

function constant(x) {
  return function() {
    return x;
  };
}

function ascendingSourceBreadth(a, b) {
  return ascendingBreadth(a.source, b.source) || a.index - b.index;
}

function ascendingTargetBreadth(a, b) {
  return ascendingBreadth(a.target, b.target) || a.index - b.index;
}

function ascendingBreadth(a, b) {
  return a.y0 - b.y0;
}

function value(d) {
  return d.value;
}

function defaultId(d, _i, _nodes) {
  return d.index;
}

function defaultNodes(graph) {
  return graph.nodes;
}

function defaultLinks(graph) {
  return graph.links;
}

function find(nodeById, id) {
  const node = nodeById.get(id);
  if (!node) throw new Error('missing: ' + id);
  return node;
}

function flipNodesVertical({ nodes }) {
  nodes.map(n => {
    n.oldX0 = n.x0;
    n.oldX1 = n.x1;
    n.oldY0 = n.y0;
    n.oldY1 = n.y1;
    n.y0 = n.x0;
    n.y1 = n.x1;
    n.x0 = n.oldY0;
    n.x1 = n.oldY1;
    return n;
  });
}

function computeLinkBreadths({ nodes }) {
  for (const node of nodes) {
    let y0 = node.y0;
    let y1 = y0;
    for (const link of node.sourceLinks) {
      link.y0 = y0 + link.width / 2;
      y0 += link.width;
    }
    for (const link of node.targetLinks) {
      link.y1 = y1 + link.width / 2;
      y1 += link.width;
    }
  }
}

function computeLinkBreadthsVertical({ nodes }) {
  for (const node of nodes) {
    let x0 = node.x0;
    let x1 = x0;
    for (const link of node.sourceLinks) {
      link.x0 = x0 + link.width / 2;
      x0 += link.width;
    }
    for (const link of node.targetLinks) {
      link.x1 = x1 + link.width / 2;
      x1 += link.width;
    }
  }
}

// The 'compareNodes' argument here was to the original d3-sankey script in order to allow us to bottom align nodes in VCC's alluvial-diagram
export function Sankey(compareNodes, showLinks, layout) {
  let x0 = 0,
    y0 = 0,
    x1 = 1,
    y1 = 1; // extent
  let dx = 24; // nodeWidth
  let dy = 8,
    py; // nodePadding
  let id = defaultId;
  let align = sankeyJustify;
  let sort;
  let linkSort;
  let nodes = defaultNodes;
  let links = defaultLinks;
  let iterations = 6;

  function sankey() {
    const graph = { nodes: nodes.apply(null, arguments), links: links.apply(null, arguments) };
    computeNodeLinks(graph);
    computeNodeValues(graph);
    computeNodeDepths(graph);
    computeNodeHeights(graph);
    computeNodeBreadths(graph);
    if (layout === 'vertical') {
      flipNodesVertical(graph);
      computeLinkBreadthsVertical(graph);
    } else {
      computeLinkBreadths(graph);
    }
    return graph;
  }

  sankey.update = function(graph) {
    computeLinkBreadths(graph);
    return graph;
  };

  sankey.nodeId = function(_) {
    return arguments.length ? ((id = typeof _ === 'function' ? _ : constant(_)), sankey) : id;
  };

  sankey.nodeAlign = function(_) {
    return arguments.length ? ((align = typeof _ === 'function' ? _ : constant(_)), sankey) : align;
  };

  sankey.nodeSort = function(_) {
    return arguments.length ? ((sort = _), sankey) : sort;
  };

  sankey.nodeWidth = function(_) {
    return arguments.length ? ((dx = +_), sankey) : dx;
  };

  sankey.nodePadding = function(_) {
    return arguments.length ? ((dy = py = +_), sankey) : dy;
  };

  sankey.nodes = function(_) {
    return arguments.length ? ((nodes = typeof _ === 'function' ? _ : constant(_)), sankey) : nodes;
  };

  sankey.links = function(_) {
    return arguments.length ? ((links = typeof _ === 'function' ? _ : constant(_)), sankey) : links;
  };

  sankey.linkSort = function(_) {
    return arguments.length ? ((linkSort = _), sankey) : linkSort;
  };

  sankey.size = function(_) {
    return arguments.length ? ((x0 = y0 = 0), (x1 = +_[0]), (y1 = +_[1]), sankey) : [x1 - x0, y1 - y0];
  };

  sankey.extent = function(_) {
    return arguments.length
      ? ((x0 = +_[0][0]), (x1 = +_[1][0]), (y0 = +_[0][1]), (y1 = +_[1][1]), sankey)
      : [[x0, y0], [x1, y1]];
  };

  sankey.iterations = function(_) {
    return arguments.length ? ((iterations = +_), sankey) : iterations;
  };

  // VCC had to transform for .. of with object.entries to forEach for es5 support
  function computeNodeLinks({ nodes, links }) {
    nodes.forEach((node, i) => {
      node.index = i;
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    const nodeById = new Map(nodes.map((d, i) => [id(d, i, nodes), d]));
    links.forEach((link, i) => {
      link.index = i;
      let { source, target } = link;

      if (typeof source !== 'object') source = link.source = find(nodeById, source);
      if (typeof target !== 'object') target = link.target = find(nodeById, target);
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
    if (linkSort != null) {
      for (const { sourceLinks, targetLinks } of nodes) {
        sourceLinks.sort(linkSort);
        targetLinks.sort(linkSort);
      }
    }
  }

  function computeNodeValues({ nodes }) {
    for (const node of nodes) {
      node.value =
        node.fixedValue === undefined
          ? Math.max(sum(node.sourceLinks, value), sum(node.targetLinks, value))
          : node.fixedValue;
    }
  }

  // VCC had to transform for .. of with Set() to forEach for es5 support
  function computeNodeDepths({ nodes }) {
    const n = nodes.length;
    let current: any = new Set(nodes);
    let next = new Set();
    let x = 0;
    while (current.size) {
      current.forEach(node => {
        node.depth = x;
        for (const { target } of node.sourceLinks) {
          next.add(target);
        }
      });
      if (++x > n) throw new Error('circular link');
      current = next;
      next = new Set();
    }
  }

  // VCC had to transform for .. of with Set() to forEach for es5 support
  function computeNodeHeights({ nodes }) {
    const n = nodes.length;
    let current: any = new Set(nodes);
    let next = new Set();
    let x = 0;
    while (current.size) {
      current.forEach(node => {
        node.height = x;
        for (const { source } of node.targetLinks) {
          next.add(source);
        }
      });
      if (++x > n) throw new Error('circular link');
      current = next;
      next = new Set();
    }
  }

  // added in order to compute x position when links are hidden
  function computeNodeLayersWhenLinksHidden({ nodes }) {
    const x = max(nodes, d => d.depth);
    const allNodeWidths = x * (2 * dx);
    const leftPadding = (x1 - allNodeWidths) / 2;
    const columns = new Array(x + 1);
    for (const node of nodes) {
      const i = Math.max(0, Math.min(x, Math.floor(align.call(null, node, x + 1))));
      node.layer = i;
      node.x0 = leftPadding + node.depth * (2 * dx);
      node.x1 = node.x0 + dx;
      if (columns[i]) columns[i].push(node);
      else columns[i] = [node];
    }
    if (sort)
      for (const column of columns) {
        column.sort(sort);
      }
    return columns;
  }

  function computeNodeLayers({ nodes }) {
    const x = max(nodes, d => d.depth) + 1;
    const kx = (x1 - x0 - dx) / (x - 1);
    const columns = new Array(x);
    for (const node of nodes) {
      const i = Math.max(0, Math.min(x - 1, Math.floor(align.call(null, node, x))));
      node.layer = i;
      node.x0 = x0 + i * kx;
      node.x1 = node.x0 + dx;
      if (columns[i]) columns[i].push(node);
      else columns[i] = [node];
    }
    if (sort)
      for (const column of columns) {
        column.sort(sort);
      }
    return columns;
  }

  // This function was added to the original d3-sankey script in order to allow us to bottom align nodes in VCC's alluvial-diagram
  function setBottomAlignedNodes(columns) {
    const nodeCount = max(columns, c => c.length);

    const maxValues = [];
    for (let i = 0; i < nodeCount; ++i) {
      let max = 0;
      for (let j = 0; j < columns.length; ++j) {
        if (columns[j][i] && columns[j][i].value && columns[j][i].value > max) {
          max = columns[j][i].value;
        }
      }
      maxValues[i] = max;
    }
    const ky = (y1 - y0 - (nodeCount - 1) * py) / sum(maxValues);
    for (const nodes of columns) {
      let y = y0;
      for (let i = 0; i < nodes.length; ++i) {
        nodes[i].y1 = y + maxValues[i] * ky;
        nodes[i].y0 = nodes[i].y1 - nodes[i].value * ky;
        y = nodes[i].y1 + py;
        for (const link of nodes[i].sourceLinks) {
          link.width = link.value * ky;
        }
      }
    }
  }

  function initializeNodeBreadths(columns) {
    const ky = min(columns, c => (y1 - y0 - (c.length - 1) * py) / sum(c, value));
    for (const nodes of columns) {
      let y = y0;
      for (const node of nodes) {
        node.y0 = y;
        node.y1 = y + node.value * ky;
        y = node.y1 + py;
        for (const link of node.sourceLinks) {
          link.width = link.value * ky;
        }
      }
      y = (y1 - y + py) / (nodes.length + 1);
      for (let i = 0; i < nodes.length; ++i) {
        const node = nodes[i];
        node.y0 += y * (i + 1);
        node.y1 += y * (i + 1);
      }
      reorderLinks(nodes);
    }
  }

  function computeNodeBreadths(graph) {
    const columns = !showLinks ? computeNodeLayersWhenLinksHidden(graph) : computeNodeLayers(graph);
    py = Math.min(dy, (y1 - y0) / (max(columns, c => c.length) - 1));
    // This operation was added to the original d3-sankey script to allow us to call a function that bottom aligns nodes in VCC's alluvial-diagram
    compareNodes ? setBottomAlignedNodes(columns) : initializeNodeBreadths(columns);
    for (let i = 0; i < iterations; ++i) {
      const alpha = Math.pow(0.99, i);
      const beta = Math.max(1 - alpha, (i + 1) / iterations);
      // This prop and operation was to the original d3-sankey script to allow us to bottom align nodes in VCC's alluvial-diagram
      if (!compareNodes) {
        relaxRightToLeft(columns, alpha, beta);
        relaxLeftToRight(columns, alpha, beta);
      }
    }
  }

  // Reposition each node based on its incoming (target) links.
  function relaxLeftToRight(columns, alpha, beta) {
    for (let i = 1, n = columns.length; i < n; ++i) {
      const column = columns[i];
      for (const target of column) {
        let y = 0;
        let w = 0;
        for (const { source, value } of target.targetLinks) {
          let v = value * (target.layer - source.layer);
          y += targetTop(source, target) * v;
          w += v;
        }
        if (!(w > 0)) continue;
        let dy = (y / w - target.y0) * alpha;
        target.y0 += dy;
        target.y1 += dy;
        reorderNodeLinks(target);
      }
      if (sort === undefined) column.sort(ascendingBreadth);
      resolveCollisions(column, beta);
    }
  }

  // Reposition each node based on its outgoing (source) links.
  function relaxRightToLeft(columns, alpha, beta) {
    for (let n = columns.length, i = n - 2; i >= 0; --i) {
      const column = columns[i];
      for (const source of column) {
        let y = 0;
        let w = 0;
        for (const { target, value } of source.sourceLinks) {
          let v = value * (target.layer - source.layer);
          y += sourceTop(source, target) * v;
          w += v;
        }
        if (!(w > 0)) continue;
        let dy = (y / w - source.y0) * alpha;
        source.y0 += dy;
        source.y1 += dy;
        reorderNodeLinks(source);
      }
      if (sort === undefined) column.sort(ascendingBreadth);
      resolveCollisions(column, beta);
    }
  }

  function resolveCollisions(nodes, alpha) {
    const i = nodes.length >> 1;
    const subject = nodes[i];
    resolveCollisionsBottomToTop(nodes, subject.y0 - py, i - 1, alpha);
    resolveCollisionsTopToBottom(nodes, subject.y1 + py, i + 1, alpha);
    resolveCollisionsBottomToTop(nodes, y1, nodes.length - 1, alpha);
    resolveCollisionsTopToBottom(nodes, y0, 0, alpha);
  }

  // Push any overlapping nodes down.
  function resolveCollisionsTopToBottom(nodes, y, i, alpha) {
    for (; i < nodes.length; ++i) {
      const node = nodes[i];
      const dy = (y - node.y0) * alpha;
      if (dy > 1e-6) (node.y0 += dy), (node.y1 += dy);
      y = node.y1 + py;
    }
  }

  // Push any overlapping nodes up.
  function resolveCollisionsBottomToTop(nodes, y, i, alpha) {
    for (; i >= 0; --i) {
      const node = nodes[i];
      const dy = (node.y1 - y) * alpha;
      if (dy > 1e-6) (node.y0 -= dy), (node.y1 -= dy);
      y = node.y0 - py;
    }
  }

  function reorderNodeLinks({ sourceLinks, targetLinks }) {
    if (linkSort === undefined) {
      for (const {
        source: { sourceLinks }
      } of targetLinks) {
        sourceLinks.sort(ascendingTargetBreadth);
      }
      for (const {
        target: { targetLinks }
      } of sourceLinks) {
        targetLinks.sort(ascendingSourceBreadth);
      }
    }
  }

  function reorderLinks(nodes) {
    if (linkSort === undefined) {
      for (const { sourceLinks, targetLinks } of nodes) {
        sourceLinks.sort(ascendingTargetBreadth);
        targetLinks.sort(ascendingSourceBreadth);
      }
    }
  }

  // Returns the target.y0 that would produce an ideal link from source to target.
  function targetTop(source, target) {
    let y = source.y0 - ((source.sourceLinks.length - 1) * py) / 2;
    for (const { target: node, width } of source.sourceLinks) {
      if (node === target) break;
      y += width + py;
    }
    for (const { source: node, width } of target.targetLinks) {
      if (node === source) break;
      y -= width;
    }
    return y;
  }

  // Returns the source.y0 that would produce an ideal link from source to target.
  function sourceTop(source, target) {
    let y = target.y0 - ((target.targetLinks.length - 1) * py) / 2;
    for (const { source: node, width } of target.targetLinks) {
      if (node === source) break;
      y += width + py;
    }
    for (const { target: node, width } of source.sourceLinks) {
      if (node === target) break;
      y -= width;
    }
    return y;
  }

  return sankey;
}

function horizontalSource(d) {
  return [d.source.x1, d.y0];
}

function horizontalTarget(d) {
  return [d.target.x0, d.y1];
}

export function sankeyLinkHorizontal() {
  return linkHorizontal()
    .source(horizontalSource)
    .target(horizontalTarget);
}

// VCC added link vertical to test out vertical
function verticalSource(d) {
  return [d.x1, d.target.y0];
}

function verticalTarget(d) {
  return [d.x0, d.source.y1];
}
export function sankeyLinkVertical() {
  return linkVertical()
    .source(verticalSource)
    .target(verticalTarget);
}
