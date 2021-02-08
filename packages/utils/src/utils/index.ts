/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { drawTooltip, initTooltipStyle, overrideTitleTooltip } from './tooltip';

import { circularFind } from './circular-find';

import { checkInteraction, checkClicked, checkHovered, interactionStyle, buildStrokes } from './interaction';

import { drawAxis, wrap } from './axis';

import { getBrowser, getOS } from './browser-util';

import { drawGrid } from './grid';

import { drawLegend, setLegendInteractionState } from './legend';

import { getLicenses } from './license';

import { formatDataLabel, placeDataLabels, getDataSymbol } from './dataLabel';

import { formatStats, roundTo } from './formatStats';

import { formatDate } from './formatDate';

import {
  getTexture,
  convertColorsToTextures,
  prepareStrokeColorsFromScheme,
  createMultiStrokeFilter,
  removeFilters,
  drawHoverStrokes,
  removeHoverStrokes,
  mirrorStrokeTransition,
  checkAttributeTransitions,
  createTextStrokeFilter
} from './textures';

import {
  initializeGeometryAccess,
  initializeDescriptionRoot,
  initializeGroupAccess,
  setGeometryAccessLabel,
  setGroupAccessLabel,
  setRootSVGAccess,
  hideNonessentialGroups,
  hideNode,
  setAccessTitle,
  setAccessSubtitle,
  setAccessLongDescription,
  setAccessExecutiveSummary,
  setAccessPurpose,
  setAccessContext,
  setAccessStatistics,
  setAccessChartCounts,
  setAccessXAxis,
  setAccessYAxis,
  setAccessStructure,
  setAccessAnnotation,
  retainAccessFocus,
  checkAccessFocus,
  setElementInteractionAccessState,
  setAccessibilityDescriptionWidth,
  findTagLevel,
  createUrl
} from './applyAccessibility';

import {
  getColors,
  visaColors,
  autoTextColor,
  convertVisaColor,
  darkerColor,
  outlineColor,
  calculateLuminance,
  calculateRelativeLuminance,
  getAccessibleStrokes,
  getRecursiveStroke,
  getContrastingStroke,
  ensureTextContrast
} from './colors';

import { getTextWidth, verifyTextHasSpace, manuallyWrapText } from './textHelpers';

import { getPadding } from './padding';

import { leastSquares, capitalized } from './calculation';

import { moveToFront } from './moveEle';

import { mapButtons } from './map-buttons';

import {
  transformData,
  scopeDataKeys,
  chartAccessors,
  getScopedData,
  orderScopedData,
  fixNestedSparseness
} from './dataTransform';

import { transitionEndAll } from './transitionEndAll';

import { resolveLines, generalizePath, equalizePath } from './pathManipulation';

import { symbols } from './symbols';

import { annotate } from './annotation';

import { validateAccessibilityProps } from './validate-accessibility-props';

import * as propDefaultValues from './propDefaultValues';

export {
  autoTextColor,
  buildStrokes,
  checkAttributeTransitions,
  createTextStrokeFilter,
  getBrowser,
  getOS,
  findTagLevel,
  createUrl,
  createMultiStrokeFilter,
  removeFilters,
  drawHoverStrokes,
  removeHoverStrokes,
  mirrorStrokeTransition,
  initializeGeometryAccess,
  initializeDescriptionRoot,
  initializeGroupAccess,
  setGeometryAccessLabel,
  setGroupAccessLabel,
  setRootSVGAccess,
  hideNonessentialGroups,
  hideNode,
  setAccessTitle,
  setAccessSubtitle,
  setAccessLongDescription,
  setAccessExecutiveSummary,
  setAccessPurpose,
  setAccessContext,
  setAccessStatistics,
  setAccessChartCounts,
  setAccessXAxis,
  setAccessYAxis,
  setAccessStructure,
  setAccessAnnotation,
  retainAccessFocus,
  checkAccessFocus,
  setElementInteractionAccessState,
  setAccessibilityDescriptionWidth,
  annotate,
  getTexture,
  convertColorsToTextures,
  prepareStrokeColorsFromScheme,
  calculateLuminance,
  calculateRelativeLuminance,
  getAccessibleStrokes,
  getRecursiveStroke,
  getContrastingStroke,
  ensureTextContrast,
  convertVisaColor,
  circularFind,
  capitalized,
  chartAccessors,
  checkInteraction,
  checkClicked,
  checkHovered,
  drawAxis,
  wrap,
  drawGrid,
  drawLegend,
  setLegendInteractionState,
  drawTooltip,
  darkerColor,
  equalizePath,
  formatDataLabel,
  formatStats,
  formatDate,
  getColors,
  getLicenses,
  generalizePath,
  getDataSymbol,
  getScopedData,
  getTextWidth,
  verifyTextHasSpace,
  manuallyWrapText,
  getPadding,
  interactionStyle,
  initTooltipStyle,
  leastSquares,
  moveToFront,
  mapButtons,
  orderScopedData,
  outlineColor,
  overrideTitleTooltip,
  placeDataLabels,
  propDefaultValues,
  resolveLines,
  roundTo,
  symbols,
  transitionEndAll,
  transformData,
  scopeDataKeys,
  visaColors,
  validateAccessibilityProps,
  fixNestedSparseness
};

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
