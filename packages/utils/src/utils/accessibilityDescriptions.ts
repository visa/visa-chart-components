/**
 * Copyright (c) 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { select } from 'd3-selection';
const emptyDescriptions = {
  'vcl-access-title': 'This chart has no title provided.',
  'vcl-access-subtitle': 'This chart has no subtitle provided.',
  'vcl-access-long-description': '', // 'This chart has no long description provided.',
  'vcl-access-context': '',
  'vcl-access-executive-summary': '', // 'This chart has no executive summary provided.',
  'vcl-access-purpose': '', // 'This chart has no information regarding its purpose provided.',
  'vcl-access-statistics': '', // 'This chart has no statistical explanation provided.',
  'vcl-access-layout': '', // 'This chart has no layout description provided.',
  'vcl-access-xAxis': '', // 'This chart has no x axis.',
  'vcl-access-yAxis': '', // 'this chart has no y axis.',
  'vcl-access-notes': '', // 'No notes provided regarding the structure of the chart.',
  'vcl-access-annotation': '', // 'This chart has no annotations.',
  'vcl-access-annotation-title': '', // 'This chart displays an annotation with no title.',
  'vcl-access-annotation-description': '', // 'This annotation has no description provided.'
  headings: ''
};

export const initializeDescriptionRoot = ({
  rootEle,
  title,
  chartTag,
  uniqueID,
  highestHeadingLevel,
  redraw,
  disableKeyNav
}: {
  rootEle: any;
  title: string;
  chartTag: string;
  uniqueID: string;
  highestHeadingLevel?: any;
  redraw?: boolean;
  disableKeyNav?: boolean;
}) => {
  let level1 = findTagLevel(highestHeadingLevel, 0);
  level1 = level1 === 'h1' ? 'h2' : level1;
  const level2 = findTagLevel(level1, 1);
  const level3 = findTagLevel(level1, 2);
  const level4 = findTagLevel(level1, 3);
  let instructionsWrapper = select(rootEle).select('.vcl-accessibility-instructions');
  if (!instructionsWrapper.size() || redraw) {
    select(rootEle)
      .select('.vcl-main-title')
      .attr('aria-hidden', 'true');
    select(rootEle)
      .select('.vcl-sub-title')
      .attr('aria-hidden', 'true');

    if (!instructionsWrapper.size()) {
      instructionsWrapper = select(rootEle)
        .select('.o-layout')
        .insert('div', ':first-child')
        .attr('class', 'vcl-accessibility-instructions')
        .style('position', 'absolute')
        .style('width', '200px');
    } else {
      instructionsWrapper.selectAll('*').remove();
    }

    instructionsWrapper.append(level4).attr('class', 'screen-reader-info vcl-region-label');
    // .on('focus', focusInstructions)
    // .on('blur', blurInstructions)
    // .attr('tabindex', 0);

    instructionsWrapper
      .append(level1)
      .attr('class', 'screen-reader-info vcl-access-title')
      .text(emptyDescriptions['vcl-access-title']);
    instructionsWrapper
      .append(level2)
      .attr('class', 'screen-reader-info vcl-access-subtitle')
      .text(emptyDescriptions['vcl-access-subtitle']);
    instructionsWrapper
      .append(level2)
      .attr('class', 'screen-reader-info vcl-access-executive-summary-heading')
      .text(emptyDescriptions['headings']);
    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-access-executive-summary')
      .attr('data-level', level2)
      .text(emptyDescriptions['vcl-access-executive-summary']);
    instructionsWrapper
      .append(level2)
      .attr('class', 'screen-reader-info vcl-access-purpose-heading')
      .text(emptyDescriptions['headings']);
    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-access-purpose')
      .attr('data-level', level2)
      .text(emptyDescriptions['vcl-access-purpose']);
    instructionsWrapper
      .append(level2)
      .attr('class', 'screen-reader-info vcl-access-long-description-heading')
      .text(emptyDescriptions['headings']);
    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-access-long-description')
      .attr('data-level', level2)
      .text(emptyDescriptions['vcl-access-long-description']);
    instructionsWrapper
      .append(level4)
      .attr('data-level', level2)
      .attr('class', 'screen-reader-info vcl-access-context')
      .text(emptyDescriptions['vcl-access-context']);
    instructionsWrapper
      .append(level2)
      .attr('class', 'screen-reader-info vcl-access-structure-heading')
      .text('Structure');
    instructionsWrapper
      .append(level3)
      .attr('class', 'screen-reader-info vcl-access-statistics-heading')
      .text(emptyDescriptions['headings']);
    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-access-statistics')
      .attr('data-level', level3)
      .text(emptyDescriptions['vcl-access-statistics']);
    instructionsWrapper
      .append(level3)
      .attr('class', 'screen-reader-info vcl-access-chart-layout-heading')
      .text('Chart Layout Description');
    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-access-layout')
      .text(emptyDescriptions['vcl-access-layout']);
    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-access-xAxis')
      .text(emptyDescriptions['vcl-access-xAxis']);
    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-access-yAxis')
      .text(emptyDescriptions['vcl-access-yAxis']);
    instructionsWrapper
      .append(level3)
      .attr('class', 'screen-reader-info vcl-access-notes-heading')
      .text(emptyDescriptions['headings']);
    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-access-notes')
      .attr('data-level', level3)
      .attr('data-annotationlevel', level2)
      .text(emptyDescriptions['vcl-access-notes']);
    instructionsWrapper
      .append(level2)
      .attr('class', 'screen-reader-info vcl-access-annotations-heading')
      .text(emptyDescriptions['headings']);
  }
  instructionsWrapper.attr('id', 'chart-instructions-' + uniqueID);

  const chartTitle = title ? ', Titled: ' + title : ', with no title provided.';
  const fullDescription = `Keyboard interactive ${chartTag}${chartTitle}. This section contains additional information about this chart. Pressing TAB will focus the keyboard instructions menu. Tabbing again takes you to the chart area.`; //  Chart Unique ID: ${uniqueID}.
  const nonInteractive = `Static ${chartTag} image${chartTitle}. This section contains additional information about this chart. Pressing TAB will focus the data table button.`;
  instructionsWrapper.select('.vcl-region-label').text(!disableKeyNav ? fullDescription : nonInteractive);
};

export const setAccessTitle = (rootEle: any, title: string) => {
  select(rootEle)
    .select('.vcl-access-title')
    .text(title ? 'Chart title: ' + title : emptyDescriptions['vcl-access-title']);
};

export const setAccessSubtitle = (rootEle: any, subtitle: string) => {
  select(rootEle)
    .select('.vcl-access-subtitle')
    .text(subtitle ? 'Chart subtitle: ' + subtitle : emptyDescriptions['vcl-access-subtitle']);
};

export const setAccessLongDescription = (rootEle: any, description: string) => {
  setDescriptionNode(
    select(rootEle).select('.vcl-accessibility-instructions'),
    description,
    'Long Description',
    'vcl-access-long-description',
    description ||
      select(rootEle)
        .select('.vcl-access-context')
        .text()
  );
};

export const setAccessContext = (rootEle: any, context: string) => {
  setDescriptionNode(
    select(rootEle).select('.vcl-accessibility-instructions'),
    context,
    'Long Description',
    'vcl-access-context',
    context ||
      select(rootEle)
        .select('.vcl-access-long-description')
        .text(),
    'vcl-access-long-description'
  );
};

export const setAccessExecutiveSummary = (rootEle: any, summary: string) => {
  setDescriptionNode(
    select(rootEle).select('.vcl-accessibility-instructions'),
    summary,
    'Executive Summary',
    'vcl-access-executive-summary',
    !!summary
  );
};

export const setAccessPurpose = (rootEle: any, purpose: string) => {
  setDescriptionNode(
    select(rootEle).select('.vcl-accessibility-instructions'),
    purpose,
    'Purpose',
    'vcl-access-purpose',
    !!purpose
  );
};

export const setAccessStatistics = (rootEle: any, statistics: string) => {
  setDescriptionNode(
    select(rootEle).select('.vcl-accessibility-instructions'),
    statistics,
    'Statistical Information',
    'vcl-access-statistics',
    !!statistics
  );
};

export const setAccessChartCounts = ({
  rootEle,
  parentGNode,
  chartTag,
  geomType,
  groupName,
  recursive
}: {
  rootEle: any;
  parentGNode: any;
  chartTag: string;
  geomType: string;
  groupName?: string;
  recursive?: boolean;
}) => {
  const primaryG = select(parentGNode);
  const plural =
    primaryG
      .selectAll('g')
      .selectAll('*:not(title)')
      .size() > 1 ||
    (primaryG
      .selectAll('g')
      .selectAll('*:not(title)')
      .size() === 0 && primaryG.selectAll('*:not(title)').size()) > 1
      ? 's'
      : '';
  const groupNameString = groupName || geomType + ' group';
  const groupPlural = primaryG.selectAll('g').size() > 1 ? 's' : '';
  const count = !recursive
    ? primaryG.selectAll('g').size()
      ? primaryG.selectAll('g').size() +
        ' ' +
        groupNameString +
        groupPlural +
        ' containing a total ' +
        (primaryG
          .selectAll('g')
          .selectAll('*:not(title)')
          .size() -
          primaryG
            .selectAll('g')
            .selectAll('.vcl-accessibility-focus-highlight')
            .size()) +
        ' ' +
        geomType +
        plural
      : primaryG.selectAll('*:not(title)').size() -
        primaryG.selectAll('.vcl-accessibility-focus-highlight').size() +
        ' ' +
        geomType +
        plural
    : primaryG.selectAll('g').size() +
      ' ' +
      geomType +
      plural +
      ' (more ' +
      geomType +
      's may be revealed upon interaction)';

  select(rootEle)
    .select('.vcl-access-layout')
    .text(`This is a ${chartTag} with ${count}.`);
};

export const setAccessXAxis = ({
  rootEle,
  hasXAxis,
  xAxis,
  xAxisLabel
}: {
  rootEle: any;
  hasXAxis: boolean;
  xAxis?: any;
  xAxisLabel?: string;
}) => {
  let label = emptyDescriptions['vcl-access-xAxis'];
  if (hasXAxis) {
    const xDomain = xAxis && xAxis.formattedTicks && xAxis.formattedTicks[0] ? xAxis.formattedTicks : [];
    const xAxisTitle = xAxisLabel ? `, titled ${xAxisLabel}` : '';
    const xAxisRange = xDomain.length
      ? ` with a range that starts with ${xDomain[0]} and ends with ${xDomain[xDomain.length - 1]}`
      : '';
    label = `The chart has a horizontal X Axis${xAxisTitle}${xAxisRange}.`;
  }
  select(rootEle)
    .select('.vcl-access-xAxis')
    .text(label);
};

export const setAccessYAxis = ({
  rootEle,
  hasYAxis,
  yAxis,
  secondaryYAxis,
  yAxisLabel,
  secondaryYAxisLabel,
  xAxisLabel
}: {
  rootEle: any;
  hasYAxis: boolean;
  yAxis?: any;
  secondaryYAxis?: any;
  yAxisLabel?: string;
  secondaryYAxisLabel?: string;
  xAxisLabel?: string;
}) => {
  let label = emptyDescriptions['vcl-access-yAxis'];
  // y axis range from min to max

  // secondary y axis range from min to max e.g for pareto-chart.
  let yAxisTicks;
  if (yAxis && yAxis.formattedTicks) {
    yAxisTicks = yAxis.formattedTicks;
  }

  let secondaryYAxisTicks;
  if (secondaryYAxis && secondaryYAxis.formattedTicks) {
    secondaryYAxisTicks = secondaryYAxis.formattedTicks;
  }

  if (hasYAxis) {
    if (secondaryYAxisTicks) {
      // secondary y axis present
      const yAxis1Title = yAxisLabel ? `, titled ${yAxisLabel}` : '';
      const yAxis1Ticks = yAxisTicks
        ? ` with a range that starts with ${yAxisTicks[0]} and ends with ${yAxisTicks[yAxisTicks.length - 1]}`
        : '';
      const yAxis2Title = secondaryYAxisLabel ? `, titled ${secondaryYAxisLabel}` : '';
      const yAxis2Ticks = secondaryYAxisTicks
        ? ` with a range that starts with ${secondaryYAxisTicks[0]} and ends with ${
            secondaryYAxisTicks[secondaryYAxisTicks.length - 1]
          }`
        : '';
      label = `The chart has a primary vertical Y Axis${yAxis1Title}${yAxis1Ticks}. `;
      label += `The chart has a secondary vertical Y Axis${yAxis2Title}${yAxis2Ticks}.`;
    } else if (!(typeof yAxis === 'function')) {
      // y axis is an object that may contain multiple axes
      // parallel plot uses this
      const yLabels = Object.keys(yAxis);
      const firstYDomain =
        yAxis[yLabels[0]].y && yAxis[yLabels[0]].y.formattedTicks && yAxis[yLabels[0]].y.formattedTicks[0]
          ? yAxis[yLabels[0]].y.formattedTicks
          : [];
      const y1Range = firstYDomain.length
        ? `, with a range that starts with ${firstYDomain[0]} and ends with ${firstYDomain[firstYDomain.length - 1]}`
        : '';
      label =
        yLabels.length > 1
          ? `The chart has ${yLabels.length} vertical Y Axis sections, all using different scales${
              xAxisLabel ? '. This series is titled ' + xAxisLabel : ''
            }.`
          : `The chart has a vertical Y Axis, titled ${yLabels[0]}${y1Range}.`;
      if (yLabels.length > 1) {
        // the yAxis objected *does* contain multiple objects!
        let i = 0;
        for (i = 0; i < yLabels.length; i++) {
          const labelScale = yAxis[yLabels[i]].y;
          const iYDomain =
            labelScale && labelScale.formattedTicks && labelScale.formattedTicks[0] ? labelScale.formattedTicks : [];
          const iYRange = iYDomain.length
            ? `, with a range that starts with ${iYDomain[0]} and ends with ${iYDomain[iYDomain.length - 1]}`
            : '';
          label += ` Y Axis ${i + 1} of ${yLabels.length}, titled ${yLabels[i]}${iYRange}.`;
        }
      }
    } else {
      // only one axis present
      const yDomain = yAxis && yAxis.formattedTicks && yAxis.formattedTicks[0] ? yAxis.formattedTicks : [];
      const yAxisTitle = yAxisLabel ? `, titled ${yAxisLabel}` : '';
      const yAxisRange = yDomain.length
        ? ` with a range that starts with ${yDomain[0]} and ends with ${yDomain[yDomain.length - 1]}`
        : '';

      label = `The chart has a vertical Y axis${yAxisTitle}${yAxisRange}.`;
    }
  }
  select(rootEle)
    .select('.vcl-access-yAxis')
    .text(label);
};

export const setAccessStructure = (rootEle: any, structure: string) => {
  setDescriptionNode(
    select(rootEle).select('.vcl-accessibility-instructions'),
    structure,
    'Notes about the chart structure',
    'vcl-access-notes',
    !!structure
  );
};

export const setAccessAnnotation = (rootEle: any, annotations: any) => {
  const parent = select(rootEle).select('.vcl-accessibility-instructions');
  const notesNode = parent.select('.vcl-access-notes').node();
  let header = parent.select('.vcl-access-annotations-heading');

  const instructionsHeading = '.vcl-interaction-instructions';
  const headerLevel = notesNode.dataset.annotationlevel;
  const level1 = findTagLevel(headerLevel, 1);
  const level2 = findTagLevel(headerLevel, 2);

  parent.selectAll('.vcl-access-annotation').remove();

  let i = 1;
  if (annotations && annotations.length) {
    if (!header.size()) {
      header = parent
        .insert(headerLevel, instructionsHeading)
        .attr('class', 'screen-reader-info vcl-access-annotations-heading');
    }
    annotations.forEach(annotation => {
      let count = false;
      if (annotation.note) {
        if (annotation.note.title) {
          count = true;
          parent
            .insert(level1, instructionsHeading)
            .attr('class', 'screen-reader-info vcl-access-annotation')
            .text(annotation.note.title || 'Annotation ' + i);
        }
        if (annotation.note.label) {
          count = true;
          parent
            .insert(level2, instructionsHeading)
            .attr('class', 'screen-reader-info vcl-access-annotation')
            .text(annotation.note.label);
        }
      }
      if (annotation.accessibilityDescription) {
        count = true;
        parent
          .insert(level2, instructionsHeading)
          .attr('class', 'screen-reader-info vcl-access-annotation')
          .text(annotation.accessibilityDescription);
      }
      if (count) {
        i++;
      }
    });
  }
  if (i - 1) {
    const plural = i - 2 > 0 ? 's' : '';
    const headingText = i - 1 + ' annotation' + plural + ' on the chart';
    header.text(headingText);
  } else {
    header.remove();
  }
};

export const setAccessibilityDescriptionWidth = (uniqueID, width) => {
  select('#chart-instructions-' + uniqueID).style('width', () => {
    return Math.max(width, 200) + 'px';
  });
};

export const findTagLevel = (startLevel: any, depthFromStart?: number) => {
  if (startLevel === 'p' || startLevel === 'P' || !startLevel) {
    return 'p';
  } else if (startLevel === 'span' || startLevel === 'SPAN') {
    return 'span';
  } else if (startLevel === 'div' || startLevel === 'DIV') {
    return 'div';
  }
  const depth = depthFromStart || 0;
  const start = typeof startLevel !== 'string' || startLevel.length <= 1 ? startLevel : startLevel[1];
  if (+start + depth < 7 && depth < 3) {
    return 'h' + (+start + depth);
  }
  return 'p';
};

const focusInstructions = (_, i, n) => {
  select(n[i])
    .style('width', 'auto')
    .style('height', 'auto')
    .style('left', 'auto')
    .style('top', '15px')
    .style('background', 'white')
    .style('z-index', 9999);
};

const blurInstructions = (_, i, n) => {
  select(n[i])
    .style('width', null)
    .style('height', null)
    .style('left', null)
    .style('top', null)
    .style('background', null)
    .style('z-index', null);
};

const setDescriptionNode = (
  root: any,
  description: string,
  headingText: string,
  tag: string,
  contentExists: boolean,
  headingTag?: string
) => {
  const contentNode = root.select('.' + tag).text(description || emptyDescriptions[tag]);

  let headingNode = root.select('.' + (headingTag || tag) + '-heading');
  if (contentExists) {
    if (!headingNode.size()) {
      headingNode = root
        .insert(contentNode.node().dataset.level, '.' + (headingTag || tag))
        .attr('class', 'screen-reader-info ' + (headingTag || tag) + '-heading');
    }
    headingNode.text(headingText);
  } else {
    headingNode.remove();
  }
};
