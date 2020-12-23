/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { getContrastingStroke, getAccessibleStrokes } from './colors';
import { getBrowser } from './browser-util';
import { select } from 'd3-selection';
const isSafari = getBrowser() === 'Safari';

const indices = {
  categorical: [[0], [0], [0, 1], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5]],
  sequential: [
    [0],
    [0],
    [0, 8],
    [0, 4, 8],
    [1, 3, 5, 7],
    [0, 2, 4, 6, 8],
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 7, 8]
  ],
  diverging_center: [
    ,
    // this scheme is odd-length only
    [5], // this index does not appear on this scheme
    ,
    [0, 5, 10], // this index does not appear on this scheme
    ,
    [1, 3, 5, 7, 9], // this index does not appear on this scheme
    ,
    [2, 3, 4, 5, 6, 7, 8], // this index does not appear on this scheme
    ,
    [1, 2, 3, 4, 5, 6, 7, 8, 9], // this index does not appear on this scheme
    ,
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  ],
  diverging_split: [
    ,
    ,
    // this scheme is even-length only
    // this index does not appear on this scheme
    [1, 8], // this index does not appear on this scheme
    ,
    [0, 3, 6, 9], // this index does not appear on this scheme
    ,
    [0, 2, 4, 5, 7, 9], // this index does not appear on this scheme
    ,
    [0, 1, 2, 3, 6, 7, 8, 9], // this index does not appear on this scheme
    ,
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  ]
};

export function getTexture({
  scheme,
  id,
  index,
  fillColor,
  textureColor
}: {
  scheme: string;
  id: string;
  index: number;
  fillColor: string;
  textureColor: string;
}) {
  const textureData = {
    categorical: [
      {
        attributes: {
          width: 12,
          height: 12,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '12',
              height: '12',
              fill: `${fillColor}`
            }
          },
          {
            name: 'path',
            attributes: {
              d: 'M 0,0 l 12,12 M -3,9 l 6,6 M 9,-3 l 6,6',
              'stroke-width': '1',
              'shape-rendering': 'auto',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 12,
          height: 12,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '12',
              height: '12',
              fill: `${fillColor}`
            }
          },
          {
            name: 'circle',
            attributes: {
              cx: '6',
              cy: '6',
              r: '1',
              fill: `${textureColor}`,
              stroke: '#343434',
              'stroke-width': '0'
            }
          },
          {
            name: 'circle',
            attributes: {
              cx: '0',
              cy: '0',
              r: '1',
              fill: `${textureColor}`,
              stroke: '#343434',
              'stroke-width': '0'
            }
          },
          {
            name: 'circle',
            attributes: {
              cx: '0',
              cy: '12',
              r: '1',
              fill: `${textureColor}`,
              stroke: '#343434',
              'stroke-width': '0'
            }
          },
          {
            name: 'circle',
            attributes: {
              cx: '12',
              cy: '0',
              r: '1',
              fill: `${textureColor}`,
              stroke: '#343434',
              'stroke-width': '0'
            }
          },
          {
            name: 'circle',
            attributes: {
              cx: '12',
              cy: '12',
              r: '1',
              fill: `${textureColor}`,
              stroke: '#343434',
              'stroke-width': '0'
            }
          }
        ]
      },
      {
        attributes: {
          width: 24,
          height: 24,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '24',
              height: '24',
              fill: `${fillColor}`
            }
          },
          {
            name: 'path',
            attributes: {
              d: 'M 0,0 l 24,24 M -6,18 l 12,12 M 18,-6 l 12,12',
              'stroke-width': '1',
              'shape-rendering': 'auto',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          },
          {
            name: 'path',
            attributes: {
              d: 'M 0,24 l 24,-24 M -6,6 l 12,-12 M 18,30 l 12,-12',
              'stroke-width': '1',
              'shape-rendering': 'auto',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 12,
          height: 12,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '12',
              height: '12',
              fill: `${fillColor}`
            }
          },
          {
            name: 'path',
            attributes: {
              d: 'M 4.5,4.5l3,3M4.5,7.5l3,-3',
              fill: 'transparent',
              stroke: `${textureColor}`,
              'stroke-width': '1',
              'stroke-linecap': 'square',
              'shape-rendering': 'auto'
            }
          }
        ]
      },
      {
        attributes: {
          width: 10,
          height: 10,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '10',
              height: '10',
              fill: `${fillColor}`
            }
          },
          {
            name: 'path',
            attributes: {
              d: 'M 5, 0 l 0, 10',
              'stroke-width': '1',
              'shape-rendering': 'auto',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 12,
          height: 12,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '12',
              height: '12',
              fill: `${fillColor}`
            }
          },
          {
            name: 'circle',
            attributes: {
              cx: '6',
              cy: '6',
              r: '1.5',
              fill: 'none',
              stroke: `${textureColor}`,
              'stroke-width': '1'
            }
          },
          {
            name: 'circle',
            attributes: {
              cx: '2',
              cy: '10',
              r: '1.5',
              fill: 'none',
              stroke: `${textureColor}`,
              'stroke-width': '1'
            }
          },
          {
            name: 'circle',
            attributes: {
              cx: '10',
              cy: '2',
              r: '1.5',
              fill: 'none',
              stroke: `${textureColor}`,
              'stroke-width': '1'
            }
          }
        ]
      }
    ],
    sequential: [
      {
        attributes: {
          width: 10,
          height: 10,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '10',
              height: '10',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d: 'M 0 0 L 10 0M 0 10 L 10 10',
              'stroke-width': '1',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 52.40843064167849,
          height: 10.187166949552141,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '52.40843064167849',
              height: '10.187166949552141',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -52.40843064167849 10.187166949552141 L 52.40843064167849 -10.187166949552141M -52.40843064167849 20.374333899104283 L 104.81686128335699 -10.187166949552141M 0 20.374333899104283 L 104.81686128335699 0',
              'stroke-width': '2',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 26.694671625540145,
          height: 10.785347426775834,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '26.694671625540145',
              height: '10.785347426775834',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -26.694671625540145 10.785347426775834 L 26.694671625540145 -10.785347426775834M -26.694671625540145 21.570694853551668 L 53.38934325108029 -10.785347426775834M 0 21.570694853551668 L 53.38934325108029 0',
              'stroke-width': '3',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 17.882916499714003,
          height: 12.062179485039053,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '17.882916499714003',
              height: '12.062179485039053',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -17.882916499714003 12.062179485039053 L 17.882916499714003 -12.062179485039053M -17.882916499714003 24.124358970078106 L 35.76583299942801 -12.062179485039053M 0 24.124358970078106 L 35.76583299942801 0',
              'stroke-width': '4',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 14.142135623730951,
          height: 14.14213562373095,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '14.142135623730951',
              height: '14.14213562373095',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -14.142135623730951 14.14213562373095 L 14.142135623730951 -14.14213562373095M -14.142135623730951 28.2842712474619 L 28.284271247461902 -14.14213562373095M 0 28.2842712474619 L 28.284271247461902 0',
              'stroke-width': '5',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 12.062179485039053,
          height: 17.882916499714003,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '12.062179485039053',
              height: '17.882916499714003',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -12.062179485039053 17.882916499714003 L 12.062179485039053 -17.882916499714003M -12.062179485039053 35.76583299942801 L 24.124358970078106 -17.882916499714003M 0 35.76583299942801 L 24.124358970078106 0',
              'stroke-width': '6',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 10.863603774052963,
          height: 25.593046652474495,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '10.863603774052963',
              height: '25.593046652474495',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -10.863603774052963 25.593046652474495 L 10.863603774052963 -25.593046652474495M -10.863603774052963 51.18609330494899 L 21.727207548105927 -25.593046652474495M 0 51.18609330494899 L 21.727207548105927 0',
              'stroke-width': '7',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 10.187166949552141,
          height: 52.40843064167844,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '10.187166949552141',
              height: '52.40843064167844',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -10.187166949552141 52.40843064167844 L 10.187166949552141 -52.40843064167844M -10.187166949552141 104.81686128335689 L 20.374333899104283 -52.40843064167844M 0 104.81686128335689 L 20.374333899104283 0',
              'stroke-width': '8',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 10,
          height: 10,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '10',
              height: '10',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d: 'M 0 0 L 0 10M 10 0 L 10 10',
              'stroke-width': '9',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      }
    ],
    diverging_split: [
      {
        attributes: {
          width: 10.35276180410083,
          height: 38.63703305156273,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '10.35276180410083',
              height: '38.63703305156273',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M 0 -38.63703305156273 L 20.70552360820166 38.63703305156273M -10.35276180410083 -38.63703305156273 L 10.35276180410083 38.63703305156273M -10.35276180410083 0 L 10.35276180410083 77.27406610312546',
              'stroke-width': '9',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 11.547005383792516,
          height: 20.000000000000004,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '11.547005383792516',
              height: '20.000000000000004',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M 0 -20.000000000000004 L 23.094010767585033 20.000000000000004M -11.547005383792516 -20.000000000000004 L 11.547005383792516 20.000000000000004M -11.547005383792516 0 L 11.547005383792516 40.00000000000001',
              'stroke-width': '7',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 14.142135623730951,
          height: 14.142135623730951,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '14.142135623730951',
              height: '14.142135623730951',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M 0 -14.142135623730951 L 28.284271247461902 14.142135623730951M -14.142135623730951 -14.142135623730951 L 14.142135623730951 14.142135623730951M -14.142135623730951 0 L 14.142135623730951 28.284271247461902',
              'stroke-width': '5',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 20.000000000000004,
          height: 11.547005383792516,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '20.000000000000004',
              height: '11.547005383792516',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M 0 -11.547005383792516 L 40.00000000000001 11.547005383792516M -20.000000000000004 -11.547005383792516 L 20.000000000000004 11.547005383792516M -20.000000000000004 0 L 20.000000000000004 23.094010767585033',
              'stroke-width': '3',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 38.63703305156273,
          height: 10.35276180410083,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '38.63703305156273',
              height: '10.35276180410083',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M 0 -10.35276180410083 L 77.27406610312546 10.35276180410083M -38.63703305156273 -10.35276180410083 L 38.63703305156273 10.35276180410083M -38.63703305156273 0 L 38.63703305156273 20.70552360820166',
              'stroke-width': '1',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 38.63703305156273,
          height: 10.35276180410083,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '38.63703305156273',
              height: '10.35276180410083',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -38.63703305156273 10.35276180410083 L 38.63703305156273 -10.35276180410083M -38.63703305156273 20.70552360820166 L 77.27406610312546 -10.35276180410083M 0 20.70552360820166 L 77.27406610312546 0',
              'stroke-width': '1',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 20.000000000000004,
          height: 11.547005383792515,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '20.000000000000004',
              height: '11.547005383792515',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -20.000000000000004 11.547005383792515 L 20.000000000000004 -11.547005383792515M -20.000000000000004 23.09401076758503 L 40.00000000000001 -11.547005383792515M 0 23.09401076758503 L 40.00000000000001 0',
              'stroke-width': '3',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 14.142135623730951,
          height: 14.14213562373095,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '14.142135623730951',
              height: '14.14213562373095',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -14.142135623730951 14.14213562373095 L 14.142135623730951 -14.14213562373095M -14.142135623730951 28.2842712474619 L 28.284271247461902 -14.14213562373095M 0 28.2842712474619 L 28.284271247461902 0',
              'stroke-width': '5',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 11.547005383792516,
          height: 20.000000000000004,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '11.547005383792516',
              height: '20.000000000000004',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -11.547005383792516 20.000000000000004 L 11.547005383792516 -20.000000000000004M -11.547005383792516 40.00000000000001 L 23.094010767585033 -20.000000000000004M 0 40.00000000000001 L 23.094010767585033 0',
              'stroke-width': '7',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 10.35276180410083,
          height: 38.637033051562696,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '10.35276180410083',
              height: '38.637033051562696',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -10.35276180410083 38.637033051562696 L 10.35276180410083 -38.637033051562696M -10.35276180410083 77.27406610312539 L 20.70552360820166 -38.637033051562696M 0 77.27406610312539 L 20.70552360820166 0',
              'stroke-width': '9',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      }
    ],
    diverging_center: [
      {
        attributes: {
          width: 12.423314164920995,
          height: 46.36443966187528,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '12.423314164920995',
              height: '46.36443966187528',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M 0 -46.36443966187528 L 24.84662832984199 46.36443966187528M -12.423314164920995 -46.36443966187528 L 12.423314164920995 46.36443966187528M -12.423314164920995 0 L 12.423314164920995 92.72887932375056',
              'stroke-width': '11',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 13.85640646055102,
          height: 24.000000000000004,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '13.85640646055102',
              height: '24.000000000000004',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M 0 -24.000000000000004 L 27.71281292110204 24.000000000000004M -13.85640646055102 -24.000000000000004 L 13.85640646055102 24.000000000000004M -13.85640646055102 0 L 13.85640646055102 48.00000000000001',
              'stroke-width': '9',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 16.970562748477143,
          height: 16.970562748477143,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '16.970562748477143',
              height: '16.970562748477143',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M 0 -16.970562748477143 L 33.941125496954285 16.970562748477143M -16.970562748477143 -16.970562748477143 L 16.970562748477143 16.970562748477143M -16.970562748477143 0 L 16.970562748477143 33.941125496954285',
              'stroke-width': '7',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 24.000000000000004,
          height: 13.85640646055102,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '24.000000000000004',
              height: '13.85640646055102',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M 0 -13.85640646055102 L 48.00000000000001 13.85640646055102M -24.000000000000004 -13.85640646055102 L 24.000000000000004 13.85640646055102M -24.000000000000004 0 L 24.000000000000004 27.71281292110204',
              'stroke-width': '5',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 46.36443966187528,
          height: 12.423314164920995,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '46.36443966187528',
              height: '12.423314164920995',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M 0 -12.423314164920995 L 92.72887932375056 12.423314164920995M -46.36443966187528 -12.423314164920995 L 46.36443966187528 12.423314164920995M -46.36443966187528 0 L 46.36443966187528 24.84662832984199',
              'stroke-width': '3',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 12,
          height: 12,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '12',
              height: '12',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d: 'M 0 0 L 12 0M 0 12 L 12 12',
              'stroke-width': '1',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 46.36443966187528,
          height: 12.423314164920995,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '46.36443966187528',
              height: '12.423314164920995',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -46.36443966187528 12.423314164920995 L 46.36443966187528 -12.423314164920995M -46.36443966187528 24.84662832984199 L 92.72887932375056 -12.423314164920995M 0 24.84662832984199 L 92.72887932375056 0',
              'stroke-width': '3',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 24.000000000000004,
          height: 13.856406460551018,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '24.000000000000004',
              height: '13.856406460551018',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -24.000000000000004 13.856406460551018 L 24.000000000000004 -13.856406460551018M -24.000000000000004 27.712812921102035 L 48.00000000000001 -13.856406460551018M 0 27.712812921102035 L 48.00000000000001 0',
              'stroke-width': '5',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 16.970562748477143,
          height: 16.97056274847714,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '16.970562748477143',
              height: '16.97056274847714',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -16.970562748477143 16.97056274847714 L 16.970562748477143 -16.97056274847714M -16.970562748477143 33.94112549695428 L 33.941125496954285 -16.97056274847714M 0 33.94112549695428 L 33.941125496954285 0',
              'stroke-width': '7',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 13.85640646055102,
          height: 24.000000000000004,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '13.85640646055102',
              height: '24.000000000000004',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -13.85640646055102 24.000000000000004 L 13.85640646055102 -24.000000000000004M -13.85640646055102 48.00000000000001 L 27.71281292110204 -24.000000000000004M 0 48.00000000000001 L 27.71281292110204 0',
              'stroke-width': '9',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      },
      {
        attributes: {
          width: 12.423314164920995,
          height: 46.36443966187523,
          patternUnits: 'userSpaceOnUse',
          id: `${id}`,
          class: 'VCL-texture-pattern'
        },
        children: [
          {
            name: 'rect',
            attributes: {
              width: '12.423314164920995',
              height: '46.36443966187523',
              fill: `${fillColor}`,
              stroke: 'rgba(255, 0, 0, 0.1)',
              'stroke-width': '0'
            }
          },
          {
            name: 'path',
            attributes: {
              d:
                'M -12.423314164920995 46.36443966187523 L 12.423314164920995 -46.36443966187523M -12.423314164920995 92.72887932375046 L 24.84662832984199 -46.36443966187523M 0 92.72887932375046 L 24.84662832984199 0',
              'stroke-width': '11',
              stroke: `${textureColor}`,
              'stroke-linecap': 'square'
            }
          }
        ]
      }
    ]
  };
  // need to check categorical index to fill constancy!! Should import the scheme here
  return textureData[scheme][index];
}

export const checkAttributeTransitions = (source, attributeArray) => {
  let change = false;
  let i = 0;
  while (!change && i < attributeArray.length) {
    const d = attributeArray[i];
    const currentAttributeValue = d.numeric ? parseFloat(source.attr(d.attr)) : source.attr(d.attr);
    change = !(currentAttributeValue === d.newValue);
    i++;
  }
  return change;
};

function runTextureLifecycle(source, data, transitionDisabled?) {
  const parent = select(source);
  let defs = parent.select('defs');
  if (!defs.size()) {
    defs = parent.append('defs');
  }
  const patterns = defs.selectAll('.VCL-texture-pattern').data(data, d => d.scheme + d.index);
  // remove old patterns
  patterns
    .exit()
    .transition()
    .duration(!transitionDisabled ? 750 : 0)
    .remove();
  // append new patterns
  const enter = patterns.enter().append('pattern');
  // update all existing patterns
  const update = patterns.merge(enter);
  update
    .each((d, i, n) => {
      const patternAttributes = Object.keys(d.attributes);
      const me = select(n[i]);
      patternAttributes.forEach(attr => {
        me.attr(attr, d.attributes[attr]);
      });
    })
    .attr('patternContentUnits', 'userSpaceOnUse')
    .attr('x', 0)
    .attr('y', 0);

  const children = update.selectAll('.VCL-t-p-e').data(d => d.children, (d, i) => d.name + i);
  // remove children that are a different type, by slot order
  children.exit().remove();
  // append new children, also according to slot order and type
  const enterChildren = children
    .enter()
    .append(d => {
      return document.createElementNS('http://www.w3.org/2000/svg', d.name);
    })
    .attr('class', 'VCL-t-p-e');
  // update all existing children
  const updateChildren = children.merge(enterChildren);
  updateChildren.each((d, i, n) => {
    const me = select(n[i]);
    const childAttributes = Object.keys(d.attributes);
    childAttributes.forEach(attr => {
      me.attr(attr, d.attributes[attr]);
    });
  });
}

export function convertColorsToTextures({
  colors,
  rootSVG,
  id,
  scheme,
  disableTransitions
}: {
  colors: any;
  rootSVG: any;
  id: string;
  scheme?: string;
  disableTransitions?: boolean;
}) {
  const output = [];
  const textures = [];
  let i = 0;
  const colorArray = colors.range ? colors.range() : colors;
  // if (colorArray.length === 1) {
  //   output.push;
  // }
  // removePatterns(rootSVG);
  colorArray.forEach(color => {
    // we create a unique ID for each texture
    let textureId = id + '_texture_' + i;

    // get one color for the texture/stroke and one for the fill, depending on the scheme
    const contrastedColors = prepareStrokeColorsFromScheme(color, i, colorArray, scheme);

    // we retrieve the appropriate pattern data for the texture
    const texture = getTexture({
      scheme: contrastedColors.textureScheme,
      id: textureId,
      index: indices[contrastedColors.textureScheme][colors.length][i],
      fillColor: contrastedColors.fillColor,
      textureColor: contrastedColors.textureColor
    });
    // we append the pattern to the dom
    // appendPattern(rootSVG, texture);
    texture.scheme = contrastedColors.textureScheme;
    texture.index = indices[contrastedColors.textureScheme][colors.length][i];
    textures.push(texture);
    // we add the url to this pattern to our output array
    output.push(createUrl(textureId));
    i++;
  });
  runTextureLifecycle(rootSVG, textures, disableTransitions);
  // return array of "url(#[id])" strings for use in place of hex codes for element fills
  return output;
}

export const prepareStrokeColorsFromScheme = (color, i, colorArray, scheme?) => {
  // the sequential scheme colors are easiest, so they are default
  let fillColor = colorArray[0];
  let textureColor = colorArray[colorArray.length - 1];
  const textureScheme =
    scheme === 'categorical' || !scheme
      ? 'categorical'
      : scheme === 'sequential'
      ? 'sequential'
      : colorArray.length % 2
      ? 'diverging_center' // odd numbered scheme
      : 'diverging_split'; // even numbered scheme

  if (textureScheme === 'categorical') {
    // we calculate the appropriate stroke color for the texture
    textureColor = getContrastingStroke(color);
    fillColor = color;
  } else if (textureScheme !== 'sequential') {
    if (textureScheme.includes('center')) {
      // center diverging scheme
      const firstHalfIndex = (colorArray.length - 1) / 2 - 1;
      const middleIndex = firstHalfIndex + 1;
      const secondHalfIndex = middleIndex + 1;
      if (i <= firstHalfIndex) {
        textureColor = colorArray[0];
        fillColor = colorArray[firstHalfIndex];
      } else if (i >= secondHalfIndex) {
        textureColor = colorArray[colorArray.length - 1];
        fillColor = colorArray[secondHalfIndex];
      } else {
        // we calculate the appropriate stroke color for the texture
        textureColor = getContrastingStroke(color);
        fillColor = color;
      }
    } else {
      // split diverging scheme
      const topHalfIndex = colorArray.length / 2;
      if (i < topHalfIndex) {
        textureColor = colorArray[0];
        fillColor = colorArray[topHalfIndex - 1];
      } else {
        textureColor = colorArray[colorArray.length - 1];
        fillColor = colorArray[topHalfIndex];
      }
    }
  }
  return {
    fillColor,
    textureColor,
    textureScheme
  };
};

export const removeFilters = root => {
  select(root)
    .selectAll('.VCL-accessibility-stroke-filter')
    .remove();
};

export const createTextStrokeFilter = ({
  root,
  id,
  color,
  strokeSizeOverride
}: {
  root: any;
  id: string;
  color: string;
  strokeSizeOverride?: number;
}) => {
  const sanitizedColor = color[0] === '#' ? color.substr(1) : color;
  const s = ((strokeSizeOverride || '') + '').replace('.', 'p');
  const strokeClass = 'VCL-t-s-f-' + sanitizedColor + s;
  const strokeId = strokeClass + id + s;
  let filter = select(root).select('.' + strokeClass);
  if (!filter.size()) {
    // select(root).selectAll('VCL-text-stroke-filter').remove()
    let defs = select(root).select('defs');
    if (!defs.size()) {
      defs = select(root).append('defs');
    }
    filter = defs
      .append('filter')
      .attr('id', strokeId)
      .attr('class', strokeClass);
    filter
      .append('feMorphology')
      .attr('in', 'SourceAlpha')
      .attr('result', 'dilatedText')
      .attr('operator', 'dilate')
      .attr('radius', strokeSizeOverride || 1.5);
    filter
      .append('feFlood')
      .attr('flood-color', color || '#ffffff')
      .attr('flood-opacity', 1)
      .attr('result', 'whiteTextFlood');
    filter
      .append('feComposite')
      .attr('in', 'whiteTextFlood')
      .attr('in2', 'dilatedText')
      .attr('operator', 'in')
      .attr('result', 'textOutline');
    const merge = filter.append('feMerge');
    merge.append('feMergeNode').attr('in', 'textOutline');
    if (!strokeSizeOverride) {
      // this ensures that text (which use the default) will always have effective outlines
      merge.append('feMergeNode').attr('in', 'textOutline');
      merge.append('feMergeNode').attr('in', 'textOutline');
    }
    merge.append('feMergeNode').attr('in', 'SourceGraphic');
  } else {
    filter.attr('id', strokeId);
  }
  return createUrl(strokeId);
};

export const createMultiStrokeFilter = ({
  root,
  id,
  state,
  fillColor,
  strokeWidth,
  forceStrokeColor,
  includeOuterStroke,
  strokeOnHover,
  alwaysShowStroke,
  stacked
}: {
  root: any;
  id: string;
  state: string;
  fillColor: string;
  strokeWidth: number;
  forceStrokeColor?: string;
  includeOuterStroke?: boolean;
  strokeOnHover?: boolean;
  alwaysShowStroke?: boolean;
  stacked?: boolean;
}) => {
  const rootDefs = select(root).select('defs');
  const strokes = getAccessibleStrokes(fillColor);
  // dark fills that are at rest don't need a stroke
  const primaryStroke =
    (state !== 'hover' || strokeOnHover) && (strokes.length === 1 || state === 'click') ? strokes[0] : fillColor;
  // cleanup is always the same as base fill
  const cleanupStroke = fillColor;
  // if there is an edge, use it - this is only for dark fills
  const edgeStroke = strokes[1] || '';
  // if we include outer stroke, it is always white
  const outerStroke = includeOuterStroke ? '#ffffff' : '';
  const filterId =
    'VCL-filter-' + (primaryStroke[0] === '#' ? primaryStroke.substring(1) : primaryStroke) + '-' + state + '-' + id;
  if (rootDefs.select('#' + filterId).size()) {
    rootDefs.select('#' + filterId).remove();
  }
  const filter = rootDefs
    .append('filter')
    .attr('id', filterId)
    .attr('class', 'VCL-accessibility-stroke-filter');
  const data = createFilterData(
    state !== 'hover' && forceStrokeColor ? forceStrokeColor : primaryStroke,
    cleanupStroke,
    primaryStroke !== fillColor || state === 'hover' || alwaysShowStroke ? strokeWidth : 0,
    outerStroke,
    edgeStroke,
    !stacked ? 0 : 0.5
  );
  data.forEach(filterComposite => {
    filter
      .append('feMorphology')
      .attr('in', 'SourceAlpha')
      .attr('operator', filterComposite.operator)
      .attr('radius', filterComposite.radius)
      .attr(
        'result',
        filterComposite.result
          ? filterComposite.result + '-morph'
          : 'morph-' + filterComposite.operator + '-' + filterComposite.radius
      );
    if (filterComposite.color) {
      filter
        .append('feFlood')
        .attr('flood-color', filterComposite.color)
        .attr('result', filterComposite.result + '-color');
    }
    filter
      .append('feComposite')
      .attr('in', filterComposite.result ? filterComposite.result + '-color' : 'SourceGraphic')
      .attr(
        'in2',
        filterComposite.result
          ? filterComposite.result + '-morph'
          : 'morph-' + filterComposite.operator + '-' + filterComposite.radius
      )
      .attr('operator', 'in')
      .attr('result', filterComposite.result ? filterComposite.result + '-stroke' : 'fill');
  });
  const feMerge = filter.append('feMerge');
  data.forEach(filterComposite => {
    feMerge.append('feMergeNode').attr('in', filterComposite.result ? filterComposite.result + '-stroke' : 'fill');
  });
  return createUrl(filterId);
};

const createFilterData = (primary, clean, strokeWidth, outside?, edge?, adjustForStack?) => {
  const output = [];
  const browser = getBrowser();
  const mod = browser !== 'IE' && browser !== 'Edge' ? 0 : 1;
  let strokeStart = browser !== 'Safari' ? mod : 0.1;
  if (outside) {
    output.push({
      color: outside,
      result: 'outside',
      operator: !adjustForStack ? 'dilate' : 'erode',
      radius: !adjustForStack ? 1 : 0
    });
  }
  if (edge) {
    strokeStart++;
    output.push({
      color: edge,
      result: 'edge',
      operator: 'erode',
      radius: mod + adjustForStack
    });
  }
  output.push({
    color: primary,
    result: 'primary',
    operator: 'erode',
    radius: strokeStart + adjustForStack
  });
  output.push({
    color: clean,
    result: 'clean',
    operator: 'erode',
    radius: strokeStart + strokeWidth + adjustForStack
  });
  output.push({
    operator: 'erode',
    radius: strokeStart + strokeWidth + 1 + adjustForStack
  });
  return output;
};

export const removeHoverStrokes = (root: any) => {
  const className = 'vcl-accessibility-focus';
  select(root)
    .selectAll('.' + className + '-hoverSource')
    .classed(className + '-hoverSource', false);

  select(root)
    .selectAll('.' + className + '-hover')
    .remove();
};

const removeDuplicateStrokes = (parent: any, id: string) => {
  const root = select(parent.ownerSVGElement);
  root.selectAll('.vcl-accessibility-focus-hoverSource').classed('vcl-accessibility-focus-hoverSource', false);
  root.select('#VCL-clip-' + id).remove();
  root.select('#VCL-hover-stroke-' + id).remove();
  root.select('#VCL-buffer-stroke' + id).remove();
  root.select('#VCL-parent-' + id).remove();
};

export const drawHoverStrokes = ({
  inputElement,
  id,
  key,
  strokeWidth,
  fill,
  recursive,
  strokeOverride
}: {
  inputElement: any;
  id: string;
  key: any;
  strokeWidth: number;
  fill: string;
  recursive?: boolean;
  strokeOverride?: string;
}) => {
  const strokes = getAccessibleStrokes(fill);
  const stroke = strokeOverride || strokes[0];
  const shouldBuffer = !!strokes[1];
  const uniqueElementId = createId(id, key);

  const source =
    inputElement.tagName !== 'DIV'
      ? inputElement
      : select(inputElement.parentNode)
          .select('svg')
          .node();

  const className = 'vcl-accessibility-focus';
  const shouldHideOutline = select(source)
    .style('outline')
    .includes('auto');
  if (shouldHideOutline) {
    select(source)
      .style('outline-width', '0px')
      .style('outline-offset', '0px')
      .style('outline-color', 'none');
  }

  const parent = source.parentNode;
  removeDuplicateStrokes(parent, uniqueElementId);

  select(source).classed(className + '-hoverSource', true);

  const dashedStrokeLayer = source.cloneNode(false);
  const darkElementBuffer = shouldBuffer ? source.cloneNode(false) : null;
  const clipPathElement = source.cloneNode(false);
  const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
  clipPath.appendChild(clipPathElement);

  if (!recursive) {
    const parentOfParent = parent.parentNode;
    const parentCopy = parent.cloneNode(false);
    const newParent = select(parentCopy).attr('id', 'VCL-parent-' + uniqueElementId);

    parentCopy.appendChild(clipPath);
    parentCopy.appendChild(dashedStrokeLayer);
    if (shouldBuffer) {
      parentCopy.appendChild(darkElementBuffer);
    }

    if (parent.nextSibling) {
      parentOfParent.insertBefore(parentCopy, parent.nextSibling);
    } else {
      parentOfParent.appendChild(parentCopy);
    }
    applyDefaults(newParent, className);
  } else {
    if (source.nextSibling) {
      if (shouldBuffer) {
        parent.insertBefore(darkElementBuffer, source.nextSibling);
      }
      parent.insertBefore(dashedStrokeLayer, source.nextSibling);
      parent.insertBefore(clipPath, source.nextSibling);
    } else {
      parent.appendChild(clipPath);
      parent.appendChild(dashedStrokeLayer);
      if (shouldBuffer) {
        parent.appendChild(darkElementBuffer);
      }
    }
  }
  const clipId = 'VCL-clip-' + uniqueElementId;
  const url = createUrl(clipId);
  select(clipPath)
    .attr('id', clipId)
    .attr('clipPathUnits', 'userSpaceOnUse')
    .attr('class', className + '-highlight ' + className + '-hover');

  const clip = select(clipPathElement)
    .attr('id', 'VCL-clip-element-' + uniqueElementId)
    .style('opacity', 1)
    .attr('opacity', 1);
  applyDefaults(clip, className);

  const strokeElement = select(dashedStrokeLayer)
    .attr('id', 'VCL-buffer-stroke-' + uniqueElementId)
    .style('opacity', 1)
    .attr('opacity', 1)
    .style('stroke', stroke);
  applyDefaults(strokeElement, className);
  applyOutlineOverride(strokeElement, strokeWidth, url, shouldBuffer, true);

  if (shouldBuffer) {
    const buffer = select(darkElementBuffer)
      .attr('id', 'VCL-buffer-stroke-' + uniqueElementId)
      .style('opacity', 1)
      .attr('opacity', 1)
      .style('stroke', fill);
    applyDefaults(buffer, className);
    applyOutlineOverride(buffer, 1, url, false, false);
  }
};

// this is currently unused, but will allow for future strokes to transition with a chart
// (rather than hiding during transition). See commented section in bar chart for use.
export const mirrorStrokeTransition = ({
  id,
  key,
  attribute,
  newValue,
  easing,
  duration
}: {
  id: string;
  key: any;
  attribute: string;
  newValue: any;
  easing: any;
  duration: number;
}) => {
  const baseId = createId(id, key);
  const layers = ['VCL-clip-element-', 'VCL-buffer-stroke-', 'VCL-buffer-stroke-'];
  layers.forEach(layer => {
    const targetId = '#' + layer + baseId;
    let target = select(targetId);
    if (target.size()) {
      if (duration) {
        target = target.transition(attribute).duration(duration);
        if (easing) {
          target = target.ease(easing);
        }
      }
      target.attr(attribute, newValue);
    }
  });
};

const applyDefaults = (selection, className) => {
  selection
    .attr('class', className + '-highlight ' + className + '-hover')
    .attr('focusable', false)
    .attr('aria-label', null)
    .attr('aria-hidden', true)
    .attr('role', null)
    .style('pointer-events', 'none')
    .attr('tabindex', null)
    .attr('mix-blend-mode', null)
    .style('mix-blend-mode', null);
};

const applyOutlineOverride = (selection, extraStrokeWidth, url, buffer, dash) => {
  selection
    .style('stroke-linecap', 'butt')
    .style('outline-offset', '0px')
    .style('outline-color', 'none')
    .style('outline-width', '0px')
    .attr('fill', 'none')
    .style('fill', 'none')
    .style('stroke-opacity', 1)
    .attr('marker-start', null)
    .attr('marker-end', null)
    .attr('filter', null)
    .attr('stroke-dasharray', dash ? '8 6' : null)
    .attr('clip-path', url)
    .style('stroke-width', (_, i, n) => {
      const scaleIndex = select(n[i]).attr('transform')
        ? select(n[i])
            .attr('transform')
            .indexOf('scale')
        : -1;
      let scale = 1;
      if (scaleIndex > -1) {
        const scaleSubstring = select(n[i])
          .attr('transform')
          .substring(scaleIndex + 6);
        const endSubstring =
          scaleSubstring.indexOf(',') < scaleSubstring.indexOf(')') && scaleSubstring.indexOf(',') !== -1
            ? scaleSubstring.indexOf(',')
            : scaleSubstring.indexOf(')');
        scale = +scaleSubstring.substring(0, endSubstring);
      }
      return ((buffer ? 2 : 0) + extraStrokeWidth * 2) / scale + 'px';
    });
};

const createUrl = id => {
  let path = window.location.pathname;
  if (path[path.length - 1] === '/') {
    path = path.substring(0, path.length - 1);
  }
  return (
    (!isSafari ? 'url(#' : 'url(' + window.location.protocol + '//' + window.location.host + path + '#') + id + ')'
  );
};

const createId = (id, key) => {
  const parsedKey = key instanceof Date ? key.getTime() : key;
  return id + '-' + (parsedKey + '').replace(/\W/g, '-');
};
