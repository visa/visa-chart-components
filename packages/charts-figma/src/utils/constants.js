/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export const fontsToLoad = [
  { family: 'Tahoma', style: 'Regular' }, // 0
  { family: 'Tahoma', style: 'Bold' }, // 1
  { family: 'Open Sans', style: 'Light' }, // 2
  { family: 'Open Sans', style: 'Regular' }, // 3
  { family: 'Open Sans', style: 'Semibold' }, // 4
  { family: 'Open Sans', style: 'Bold' }, // 5
  { family: 'Open Sans', style: 'Extrabold' } // 6
];

export const textStylesToCreate = [
  {
    name: 'VCC Plugin/TextStyles/Main Title',
    description: 'attached to all the main titles for charts created with the vcc plugin',
    fontName: fontsToLoad[6], // Extrabold
    fontSize: 21,
    lineHeight: { value: 28, unit: 'PIXELS' }
  },
  {
    name: 'VCC Plugin/TextStyles/Sub Title',
    description: 'attached to all the sub titles for charts created with the vcc plugin',
    fontName: fontsToLoad[3], // Semibold
    fontSize: 16,
    lineHeight: { value: 21, unit: 'PIXELS' }
  },
  {
    name: 'VCC Plugin/TextStyles/Axis Titles',
    description: 'attached to all the axis titles for charts created with the vcc plugin',
    fontName: fontsToLoad[4], // Semibold
    fontSize: 12,
    lineHeight: { value: 18, unit: 'PIXELS' },
    textCase: 'UPPER'
  },
  {
    name: 'VCC Plugin/TextStyles/Axis Tick Labels',
    description: 'attached to all the x axis tick labels for charts created with the vcc plugin',
    fontName: fontsToLoad[3], // Regular
    fontSize: 12,
    lineHeight: { value: 16, unit: 'PIXELS' }
  },
  {
    name: 'VCC Plugin/TextStyles/Series Labels',
    description: 'attached to all the series labels for charts created with the vcc plugin',
    fontName: fontsToLoad[4], // Regular
    fontSize: 12,
    lineHeight: { value: 15, unit: 'PIXELS' }
  },
  {
    name: 'VCC Plugin/TextStyles/Legend Labels',
    description: 'attached to all the legend labels for charts created with the vcc plugin',
    fontName: fontsToLoad[4], // Regular
    fontSize: 12,
    lineHeight: { value: 15, unit: 'PIXELS' }
  },
  {
    name: 'VCC Plugin/TextStyles/Total Labels',
    description: 'attached to all the total labels for charts created with the vcc plugin',
    fontName: fontsToLoad[4], // Regular
    fontSize: 12,
    lineHeight: { value: 15, unit: 'PIXELS' }
  },
  {
    name: 'VCC Plugin/TextStyles/Data Labels',
    description: 'attached to all the data labels for charts created with the vcc plugin',
    fontName: fontsToLoad[3], // Regular
    fontSize: 12,
    lineHeight: { value: 15, unit: 'PIXELS' }
  },
  {
    name: 'VCC Plugin/TextStyles/Highlight Labels',
    description: 'attached to all the highlight data labels for charts created with the vcc plugin',
    fontName: fontsToLoad[4], // Regular
    fontSize: 20,
    lineHeight: { value: 24, unit: 'PIXELS' }
  },
  {
    name: 'VCC Plugin/TextStyles/Center Labels',
    description: 'attached to all the center data labels for charts created with the vcc plugin',
    fontName: fontsToLoad[4], // Regular
    fontSize: 20,
    lineHeight: { value: 24, unit: 'PIXELS' }
  },
  {
    name: 'VCC Plugin/TextStyles/Annotation Titles',
    description: 'attached to all the data labels for charts created with the vcc plugin',
    fontName: fontsToLoad[4], // Semi bold
    fontSize: 14,
    lineHeight: { value: 18, unit: 'PIXELS' }
  },
  {
    name: 'VCC Plugin/TextStyles/Annotation Text',
    description: 'attached to all the data labels for charts created with the vcc plugin',
    fontName: fontsToLoad[2], // light
    fontSize: 12,
    lineHeight: { value: 15, unit: 'PIXELS' }
  }
];

const commonGrid = [
  {
    id: 'grid-group',
    selector: 'class',
    selectorVal: 'grid-group',
    addID: true,
    order: 91,
    children: [
      {
        id: 'grid-left',
        selector: 'data-testid',
        selectorVal: 'grid-left',
        addID: true,
        children: [
          {
            id: 'grid-left-lines',
            selector: '',
            selectorVal: 'g line',
            translateCSS: true,
            cssStylesToCopy: ['stroke-dasharray', 'stroke', 'stroke-opacity', 'stroke-width']
          },
          {
            id: 'grid-left-axis-line',
            selector: '',
            selectorVal: 'path',
            translateCSS: true,
            cssStylesToCopy: ['stroke-width']
          }
        ]
      },
      {
        id: 'grid-bottom',
        selector: 'data-testid',
        selectorVal: 'grid-bottom',
        addID: true,
        children: [
          {
            id: 'grid-bottom-lines',
            selector: '',
            selectorVal: 'g line',
            translateCSS: true,
            cssStylesToCopy: ['stroke-dasharray', 'stroke', 'stroke-opacity', 'stroke-width']
          },
          {
            id: 'grid-bottom-axis-line',
            selector: '',
            selectorVal: 'path',
            translateCSS: true,
            cssStylesToCopy: ['stroke-width']
          }
        ]
      }
    ]
  }
];
const commonAnnotation = [
  {
    id: 'annotation-group',
    selector: 'data-testid',
    selectorVal: 'annotation-group',
    addID: true,
    order: 1
  },
  {
    id: 'editable-annotation-group',
    selector: 'data-testid',
    selectorVal: 'editable-annotation-group',
    addID: true,
    remove: true
  },
  {
    id: 'reference-group',
    selector: 'data-testid',
    selectorVal: 'reference-line-group',
    addID: true,
    order: 2
  }
];
const commonXAxis = {
  'no-baseline': [
    {
      id: 'x-axis',
      selector: 'data-testid',
      selectorVal: 'x-axis',
      addID: true,
      order: 12,
      children: [
        {
          id: 'axis tick lines',
          selector: 'data-testid',
          selectorVal: 'axis-tick-line',
          remove: false
        },
        {
          id: 'axis tick text',
          selector: 'data-testid',
          selectorVal: 'axis-tick-text'
        }
      ]
    },
    {
      id: 'x-axis-label',
      selector: 'data-testid',
      selectorVal: 'x-axis-label',
      figmaName: 'x-axis-label',
      addID: true,
      order: 11
    }
  ],
  baseline: [
    {
      id: 'x-axis',
      selector: 'data-testid',
      selectorVal: 'x-axis',
      addID: true,
      order: 13
    },
    {
      id: 'x-axis-label',
      selector: 'data-testid',
      selectorVal: 'x-axis-label',
      figmaName: 'x-axis-label',
      addID: true,
      order: 12
    },
    {
      id: 'x-axis-mark',
      selector: 'data-testid',
      selectorVal: 'x-axis-mark',
      figmaName: 'x-axis-baseline',
      addID: true,
      order: 11,
      children: [
        {
          id: 'axis ticks',
          selectorVal: '.axis-mark-x .tick',
          remove: true
        }
      ]
    }
  ]
};

const commonYAxis = {
  'no-baseline': [
    {
      id: 'y-axis',
      selector: 'data-testid',
      selectorVal: 'y-axis',
      addID: true,
      order: 22
    },
    {
      id: 'y-axis-label',
      selector: 'data-testid',
      selectorVal: 'y-axis-label',
      addID: true,
      order: 21
    }
  ],
  baseline: [
    {
      id: 'y-axis',
      selector: 'data-testid',
      selectorVal: 'y-axis',
      addID: true,
      order: 23
    },
    {
      id: 'y-axis-label',
      selector: 'data-testid',
      selectorVal: 'y-axis-label',
      addID: true,
      order: 22
    },
    {
      id: 'y-axis-mark',
      selector: 'data-testid',
      selectorVal: 'y-axis-mark',
      figmaName: 'y-axis-baseline',
      addID: true,
      order: 21,
      children: [
        {
          id: 'axis ticks',
          selectorVal: '.axis-mark-y .tick',
          remove: true
        }
      ]
    }
  ]
};

const commonLegend = [
  {
    id: 'legend-labels',
    selectorVal: '[data-testid=legend-container] .legend-padding-wrapper',
    figmaName: 'legend-labels',
    addID: true,
    order: 11
  }
];

export const chartGroups = {
  'bar-chart': {
    horizontal: [
      ...commonLegend,
      ...commonGrid,
      ...commonAnnotation,
      ...commonXAxis['no-baseline'],
      ...commonYAxis['baseline'],
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'bar-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'dataLabel-group',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      }
    ],
    vertical: [
      ...commonLegend,
      ...commonGrid,
      ...commonAnnotation,
      ...commonXAxis['baseline'],
      ...commonYAxis['no-baseline'],
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'bar-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'dataLabel-group',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      }
    ],
    default: [
      ...commonLegend,
      ...commonGrid,
      ...commonAnnotation,
      ...commonXAxis['baseline'],
      ...commonYAxis['no-baseline'],
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'bar-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'dataLabel-group',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      }
    ]
  },
  'clustered-bar-chart': {
    horizontal: [
      ...commonLegend,
      ...commonGrid,
      ...commonAnnotation,
      ...commonXAxis['no-baseline'],
      ...commonYAxis['baseline'],
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'clustered-bar-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'clustered-bar-dataLabel-group',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      }
    ],
    vertical: [
      ...commonLegend,
      ...commonGrid,
      ...commonAnnotation,
      ...commonXAxis['baseline'],
      ...commonYAxis['baseline'],
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'clustered-bar-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'clustered-bar-dataLabel-group',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      }
    ],
    default: [
      ...commonLegend,
      ...commonGrid,
      ...commonAnnotation,
      ...commonXAxis['baseline'],
      ...commonYAxis['baseline'],
      // adding legend here did not do anything
      // {
      //   id: 'legend-group',
      //   selector: 'data-testid',
      //   selectorVal: 'legend-container',
      //   figmaName: 'legend-container',
      //   addID: true,
      //   order: 10,
      //   children: [

      //   ]
      // },
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'clustered-bar-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'clustered-bar-dataLabel-group',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      }
    ]
  },
  'stacked-bar-chart': {
    horizontal: [
      ...commonLegend,
      ...commonGrid,
      ...commonAnnotation,
      ...commonXAxis['no-baseline'],
      ...commonYAxis['baseline'],
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'stacked-bar-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'stacked-bar-dataLabel-group',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      },
      {
        id: 'total-label-group',
        selector: 'data-testid',
        selectorVal: 'stacked-bar-totalLabel-group',
        figmaName: 'total-labels',
        addID: true,
        order: 42
      }
    ],
    vertical: [
      ...commonLegend,
      ...commonGrid,
      ...commonAnnotation,
      ...commonXAxis['baseline'],
      ...commonYAxis['baseline'],
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'stacked-bar-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'stacked-bar-dataLabel-group',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      },
      {
        id: 'total-label-group',
        selector: 'data-testid',
        selectorVal: 'stacked-bar-totalLabel-group',
        figmaName: 'total-labels',
        addID: true,
        order: 42
      }
    ],
    default: [
      ...commonLegend,
      ...commonGrid,
      ...commonAnnotation,
      ...commonXAxis['baseline'],
      ...commonYAxis['baseline'],
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'stacked-bar-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'stacked-bar-dataLabel-group',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      },
      {
        id: 'total-label-group',
        selector: 'data-testid',
        selectorVal: 'stacked-bar-totalLabel-group',
        figmaName: 'total-labels',
        addID: true,
        order: 42
      }
    ]
  },
  'alluvial-diagram': {
    default: [
      ...commonAnnotation,
      {
        id: 'link-group',
        selectorVal: '.alluvial-link-group',
        figmaName: 'data-markers',
        addID: true,
        order: 52
      },
      {
        id: 'node-group',
        selectorVal: '.alluvial-node-group',
        figmaName: 'data-nodes',
        addID: true,
        order: 51
      },
      {
        id: 'label-group',
        selectorVal: '.alluvial-dataLabel-group',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      }
    ]
  },
  'circle-packing': {
    default: [
      ...commonAnnotation,
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'circle-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'dataLabel-group',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      }
    ]
  },
  'dumbbell-plot': {
    horizontal: [
      ...commonLegend,
      ...commonGrid,
      ...commonAnnotation,
      ...commonXAxis['no-baseline'],
      ...commonYAxis['baseline'],
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'dumbbell-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'dataLabel-wrapper',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      }
    ],
    vertical: [
      ...commonLegend,
      ...commonGrid,
      ...commonAnnotation,
      ...commonXAxis['baseline'],
      ...commonYAxis['no-baseline'],
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'dumbbell-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'dataLabel-wrapper',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      }
    ],
    default: [
      ...commonLegend,
      ...commonGrid,
      ...commonAnnotation,
      ...commonXAxis['baseline'],
      ...commonYAxis['no-baseline'],
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'dumbbell-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'dataLabel-wrapper',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      }
    ]
  },
  'heat-map': {
    default: [
      ...commonLegend,
      ...commonGrid,
      ...commonAnnotation,
      {
        id: 'x-axis',
        selectorVal: '.x.axis',
        figmaName: 'x-axis',
        addID: true,
        order: 23,
        children: [
          {
            id: 'axis-path',
            selectorVal: '.x.axis path',
            translateCSS: true,
            cssStylesToCopy: ['display']
          }
        ]
      },
      {
        id: 'x-axis-label',
        selectorVal: '.x.axis-label',
        figmaName: 'x-axis-label',
        addID: true,
        order: 22
      },
      {
        id: 'y-axis',
        selectorVal: '.y.axis',
        figmaName: 'y-axis',
        addID: true,
        order: 23,
        children: [
          {
            id: 'axis-path',
            selectorVal: '.y.axis path',
            translateCSS: true,
            cssStylesToCopy: ['display']
          }
        ]
      },
      {
        id: 'y-axis-label',
        selectorVal: '.y.axis-label',
        figmaName: 'y-axis-label',
        addID: true,
        order: 22
      },
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'map-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'dataLabel-group',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      }
    ]
  },
  'line-chart': {
    default: [
      ...commonLegend,
      ...commonGrid,
      ...commonAnnotation,
      ...commonXAxis['baseline'],
      ...commonYAxis['no-baseline'],
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'marker-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'line-group',
        selector: 'data-testid',
        selectorVal: 'line-group',
        figmaName: 'data-lines',
        addID: true,
        order: 52
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'dataLabel-group-container',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      },
      {
        id: 'series-label-group',
        selector: 'data-testid',
        selectorVal: 'line-series-label-container',
        figmaName: 'series-labels',
        addID: true,
        order: 42
      }
    ]
  },
  'parallel-plot': {
    default: [
      ...commonLegend,
      ...commonGrid,
      ...commonAnnotation,
      ...commonXAxis['baseline'],
      {
        id: 'y-axis-group',
        selector: 'data-testid',
        selectorVal: 'y-scales-group',
        figmaName: 'y-axes-group',
        addID: true,
        order: 22,
        children: [
          {
            id: 'y-axis',
            selector: 'data-testid',
            selectorVal: 'y-axis',
            addID: true,
            order: 22
          },
          {
            id: 'y-axis-label',
            selector: 'data-testid',
            selectorVal: 'y-axis-label',
            addID: true,
            order: 21
          }
        ]
      },
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'marker-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'line-group',
        selector: 'data-testid',
        selectorVal: 'parallel-line-group',
        figmaName: 'data-lines',
        addID: true,
        order: 52
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'dataLabel-group-container',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      },
      {
        id: 'series-label-group',
        selector: 'data-testid',
        selectorVal: 'parallel-series-label-container',
        figmaName: 'series-labels',
        addID: true,
        order: 42
      }
    ]
  },
  'pie-chart': {
    default: [
      ...commonAnnotation,
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'pie-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'edge-line-group',
        selector: 'data-testid',
        selectorVal: 'edgeLine-group',
        figmaName: 'edge-line-markers',
        addID: true,
        order: 52
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'dataLabel-group',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      },
      {
        id: 'center-label-group',
        selectorVal: '.pie-center-title-group',
        figmaName: 'center-labels',
        addID: true,
        order: 42
      }
    ]
  },
  'scatter-plot': {
    default: [
      ...commonLegend,
      ...commonGrid,
      ...commonAnnotation,
      ...commonXAxis['baseline'],
      ...commonYAxis['baseline'],
      {
        id: 'scatter-grid-group',
        selectorVal: '.scatter-grid-group',
        figmaName: 'grid-group',
        addID: true,
        order: 91
      },
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'marker-group-container',
        figmaName: 'data-markers',
        addID: true,
        order: 52
      },
      {
        id: 'fit-line-group',
        selector: 'data-testid',
        selectorVal: 'scatter-fit-line-group',
        figmaName: 'fit-lines',
        addID: true,
        order: 51
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'dataLabel-group-container',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      }
    ]
  },
  'world-map': {
    default: [
      ...commonLegend,
      ...commonAnnotation,
      {
        id: 'grid-group',
        selector: 'data-testid',
        selectorVal: 'grid-group',
        addID: true,
        order: 91,
        children: [
          {
            id: 'grid-graticule-outline',
            selectorVal: '.grid.graticule-outline',
            figmaName: 'grid-graticule-outline',
            addID: true,
            order: 92,
            children: [
              {
                id: 'grid-graticule-outline-path',
                selectorVal: '.grid.graticule-outline path',
                figmaName: 'grid-graticule-outline-path',
                addID: true,
                order: 93,
                translateCSS: true,
                cssStylesToCopy: [
                  'fill',
                  'fill-opacity',
                  'stroke',
                  'stroke-width',
                  'stroke-opacity',
                  'stroke-dasharray'
                ]
              }
            ]
          },
          {
            id: 'grid-graticule-grid',
            selectorVal: '.grid.graticule-grid',
            figmaName: 'grid-graticule-grid',
            addID: true,
            order: 93,
            children: [
              {
                id: 'grid-graticule-grid-path',
                selectorVal: '.grid.graticule-grid path',
                figmaName: 'grid-graticule-grid-path',
                addID: true,
                order: 94,
                translateCSS: true,
                cssStylesToCopy: [
                  'fill',
                  'fill-opacity',
                  'stroke',
                  'stroke-width',
                  'stroke-opacity',
                  'stroke-dasharray'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'mark-group',
        selector: 'data-testid',
        selectorVal: 'marker-group',
        figmaName: 'data-markers',
        addID: true,
        order: 51
      },
      {
        id: 'shapefile-group',
        selector: 'data-testid',
        selectorVal: 'country-group',
        figmaName: 'shapefile-markers',
        addID: true,
        order: 52
      },
      {
        id: 'label-group',
        selector: 'data-testid',
        selectorVal: 'dataLabel-group',
        figmaName: 'data-labels',
        addID: true,
        order: 41
      }
    ]
  }
};
