/**
 * Copyright (c) 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export const en = {
  vcc: {
    attr: {
      language: 'en'
    },
    general: {
      generic: {
        altTextGenerator: {
          overallNumberOfGroups: 'Overall number of elements:',
          overallNumberOfGeom: 'Overall number of elements in this chart:',
          numberOfInteractiveElements: 'Number of interactive elements:'
        },
        keyboardInstructions: {
          enter: 'Enter the chart area/drill down a level on the chart area or element group.',
          shiftEnter: 'Drill up a level on an element group or element.',
          space: 'Select/Deselect an element on an element.',
          horizontalArrows:
            'Move among sibling element groups or elements when focusing on an element group or an element.',
          verticalArrows: 'Move among elements across element groups when focusing on an element group or an element.'
        }
      },
      geomTypes: {
        bar: 'bar',
        slice: 'slice',
        point: 'point',
        marker: 'marker',
        node: 'node',
        dumbbell: 'dumbbell',
        link: 'link',
        cell: 'cell'
      },
      groupNames: {
        'scatter-group': 'scatter group',
        stack: 'stack',
        cluster: 'cluster',
        'marker-group': 'marker group',
        pie: 'pie',
        line: 'line',
        node: 'node',
        row: 'row',
        'node-collection': 'node collection'
      },
      keys: {
        ctrl: 'Control',
        enter: 'Enter',
        shift: 'Shift',
        space: 'Space',
        esc: 'Esc',
        tab: 'Tab'
      },
      keywords: {
        structure: 'structure',
        selected: 'selected',
        action: 'action',
        result: 'result',
        note: 'note',
        keyboard: 'keyboard',
        interactive: 'interactive',
        titled: 'titled',
        title: 'title',
        subtitle: 'subtitle',
        static: 'static',
        image: 'image',
        purpose: 'purpose',
        chart: 'chart',
        start: 'start',
        end: 'end',
        value: 'value',
        axis: 'axis',
        annotation: 'annotation'
      },
      expressions: {
        keyboardInstructions: 'Keyboard Instructions',
        showKeyboardInstructions: 'Display Keyboard Instructions',
        keyboardInstructionsNote:
          'Press and hold when using the arrow keys for the best navigation experience on a Mac (Voiceover).',
        dismissTooltip: 'Dismiss the tooltip at any time.',
        keyboardInstructionsEsc: 'Exit the chart at any time.',
        butSomeMayBeHiddenUntilYouInteractWithThisNode: '(but some may be hidden until you interact with this node).',
        asAPercentage: 'as a percentage',
        numberOfAnnotations: 'Number of annotations:'
      }
    },
    dataTable: {
      table1: 'You are currently on data table 1 of 2. This table contains data for the chart nodes.',
      table2: 'You are currently on data table 2 of 2. This table contains the data for the chart links.',
      display: 'display data table'
    },
    accessibilityController: {
      navigateToTheChartAreaByPressingEnter: 'Navigate into the chart area by pressing ENTER.'
    },
    accessibilityDescriptions: {
      chartLayoutDescription: 'Chart Layout Description',
      withNoTitleProvided: 'with no title provided.',
      fullDescription:
        'This section contains additional information about this chart. Pressing TAB will focus the keyboard instructions menu. Tabbing again takes you to the chart area.',
      nonInteractive:
        'This section contains additional information about this chart. Pressing TAB will focus the data table button.',
      longDescription: 'Long Description',
      executiveSummary: 'Executive Summary',
      statisticalInformation: 'Statistical Information',
      xAxis: 'The chart has a horizontal X axis.',
      yAxis: 'The chart has a vertical Y axis.',
      primaryYAxis: 'The chart has a primary vertical Y axis.',
      secondaryYAxis: 'The chart has a secondary vertical Y axis.',
      multipleYAxisSections: 'The chart has multiple vertical Y axis sections.',
      numberOfVerticalYAxisSections: 'Number of vertical Y axis sections:',
      usingDifferentScales: 'The Y Axes are using different scales.',
      thisSeriesIsTitled: 'This series is titled:',
      notesAboutTheChartStructure: 'Notes about the chart structure',
      numberOfAnnotationsOnTheChart: 'Number of annotations on the chart:'
    },
    'bar-chart': {
      altTextGenerator: {
        overallNumberOfGroups: 'Overall number of bars:',
        overallNumberOfGeom: 'Overall number of bars in this bar chart:',
        numberOfInteractiveElements: 'Number of interactive bars:'
      },
      keyboardInstructions: {
        enter: 'Enter the chart area/drill down a level on the chart area or a bar group.',
        shiftEnter: 'Drill up a level on a bar group or bar.',
        space: 'Select/Deselect a bar on a bar.',
        horizontalArrows: 'Move among sibling bar groups or bars when focusing on a bar group or a bar.',
        verticalArrows: 'Move among bars across bar groups when focusing on a bar group or a bar.'
      }
    },
    'clustered-bar-chart': {
      altTextGenerator: {
        overallNumberOfGroups: 'Overall number of clusters:',
        overallNumberOfGeom: 'Overall number of bars in currently selected cluster:',
        numberOfInteractiveElements: 'Number of interactive bars in cluster:'
      },
      keyboardInstructions: {
        enter: 'Enter the chart area/drill down a level on the chart area or a cluster.',
        shiftEnter: 'Drill up a level on a cluster or bar.',
        space: 'Select/Deselect a bar on a bar.',
        horizontalArrows: 'Move among sibling clusters or bars on a cluster or bar.',
        verticalArrows: 'Move among bars across clusters on a cluster or bar.'
      }
    },
    'stacked-bar-chart': {
      altTextGenerator: {
        overallNumberOfGroups: 'Overall number of stacks:',
        overallNumberOfGeom: 'Overall number of bars in currently selected stack:',
        numberOfInteractiveElements: 'Number of interactive bars in currently selected stack:'
      },
      keyboardInstructions: {
        enter: 'Enter the chart area/drill down a level on the chart area or a stack.',
        shiftEnter: 'Drill up a level on a stack or bar.',
        space: 'Select/Deselect a bar on a bar.',
        horizontalArrows: 'Move among sibling stacks or bars on a stack or bar.',
        verticalArrows: 'Move among bars across stacks on a stack or bar.'
      }
    },
    'line-chart': {
      altTextGenerator: {
        overallNumberOfGroups: 'Overall number of lines:',
        overallNumberOfGeom: 'Overall number of points in currently selected line:',
        numberOfInteractiveElements: 'Number of interactive points in selected line:'
      },
      keyboardInstructions: {
        enter: 'Enter the chart area/drill down a level on the chart area or a line.',
        shiftEnter: 'Drill up a level on a line or point.',
        space: 'Select/Deselect a point on a line or point.',
        horizontalArrows: 'Move among sibling lines or points on a line or point.',
        verticalArrows: 'Move among points across lines on a line or point.'
      }
    },
    'pie-chart': {
      altTextGenerator: {
        overallNumberOfGroups: 'Overall number of slices:',
        overallNumberOfGeom: 'Overall number of slices in this pie chart:',
        numberOfInteractiveElements: 'Number of interactive slices:'
      },
      keyboardInstructions: {
        enter: 'Enter the chart area/drill down a level on the chart area or a pie.',
        shiftEnter: 'Drill up a level on a pie or slice.',
        space: 'Select/Deselect a slice on a slice.',
        horizontalArrows: 'Move among sibling pies or slices on a pie or slice.'
      }
    },
    'scatter-plot': {
      altTextGenerator: {
        overallNumberOfGroups: 'Overall number of scatter groups:',
        overallNumberOfGeom: 'Overall number of points in currently selected scatter group:',
        numberOfInteractiveElements: 'Number of interactive points in this scatter group:'
      },
      keyboardInstructions: {
        enter: 'Enter the chart area/drill down a level on the chart area or a scatter group.',
        shiftEnter: 'Drill up a level on a scatter group or point.',
        space: 'Select/Deselect a point on a scatter group or group.',
        horizontalArrows: 'Move among sibling scatter groups or points on a scatter group or point.',
        verticalArrows: 'Move among points across scatter groups on a scatter group or point.'
      }
    },
    'heat-map': {
      altTextGenerator: {
        overallNumberOfGroups: 'Overall number of rows:',
        overallNumberOfGeom: 'Overall number of cells in this row:',
        numberOfInteractiveElements: 'Number of interactive cells in this row:'
      },
      keyboardInstructions: {
        enter: 'Enter the chart area/drill down a level on the chart area or a row.',
        shiftEnter: 'Drill up a level on a row or cell.',
        space: 'Select/Deselect a cell on a cell.',
        horizontalArrows: 'Move among sibling rows or cells on a row or cell.',
        verticalArrows: 'Move among cells across rows on a row or cell.'
      }
    },
    'circle-packing': {
      altTextGenerator: {
        overallNumberOfGroups: 'Overall number of nodes:',
        numberOfChildElements: 'Number of child elements:',
        overallNumberOfGeom: 'Overall number of nodes in this node collection:',
        numberOfInteractiveElements: 'Number of interactive nodes in this circle:'
      },
      keyboardInstructions: {
        enter: 'Enter the chart area/drill down a level on the chart area or a node collection.',
        shiftEnter: 'Drill up a level on a node collection or node.',
        space: 'Select/Deselect a node on a node collection or node.',
        horizontalArrows: 'Move among sibling node collections or nodes on a node collection or node.',
        verticalArrows: 'Drill up or down a level on a node collection or node.'
      }
    },
    'parallel-plot': {
      altTextGenerator: {
        overallNumberOfGroups: 'Overall number of lines:',
        overallNumberOfGeom: 'Overall number of points in this line:',
        numberOfInteractiveElements: 'Number of interactive points in this line:'
      },
      keyboardInstructions: {
        enter: 'Enter the chart area/drill down a level on the chart area or a line.',
        shiftEnter: 'Drill up a level on a line or point.',
        space: 'Select/Deselect a point on a point.',
        horizontalArrows: 'Move among sibling lines or points on a line or point.',
        verticalArrows: 'Move among points across lines on a line or point.'
      }
    },
    'dumbbell-plot': {
      altTextGenerator: {
        overallNumberOfGroups: 'Overall number of dumbbells:',
        overallNumberOfGeom: 'Overall number of dumbbells in this dumbbell plot',
        numberOfInteractiveElements: 'Number of interactive dumbbells in this dumbbell plot:'
      },
      keyboardInstructions: {
        enter: 'Enter the chart area/drill down a level on the chart area or a group.',
        shiftEnter: 'Drill up a level on a group or dumbbell.',
        space: 'Select/Deselect a dumbbell on a dumbbell.',
        horizontalArrows: 'Move among sibling groups or dumbbells on a group or dumbbell.'
      }
    },
    'world-map': {
      altTextGenerator: {
        overallNumberOfGroups: 'Overall number of markers:',
        overallNumberOfGeom: 'Overall number of markers on this map:',
        numberOfInteractiveElements: 'Number of interactive markers on this map:'
      },
      keyboardInstructions: {
        enter: 'Enter the chart area/drill down a level on the chart area or a marker group.',
        shiftEnter: 'Drill up a level on a marker group or marker.',
        space: 'Select/Deselect a marker on a marker.',
        horizontalArrows: 'Move among sibling marker groups or markers on a marker group or marker.',
        verticalArrows: 'Move among markers across marker groups on a marker group or marker.'
      }
    },
    'alluvial-diagram': {
      altTextGenerator: {
        overallNumberOfGroups: 'Overall number of nodes or links:',
        overallNumberOfGeom: 'Overall number of nodes or links in currently selected node or link:',
        numberOfInteractiveElements: 'Number of interactive nodes or links in these nodes or links:'
      },
      keyboardInstructions: {
        enter: 'Enter the chart area/drill down a level on the chart area or a node.',
        shiftEnter: 'Drill up a level on a node or link.',
        space: 'Select/Deselect a link on a link.',
        horizontalArrows: 'Move among sibling nodes or links on a node or link.',
        verticalArrows: "Drill up to link's Source or Target node on a link."
      }
    }
  }
};
