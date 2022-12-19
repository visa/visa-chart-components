/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { drawTooltip, initTooltipStyle, overrideTitleTooltip } from './tooltip';

import { circularFind } from './circular-find';

import { findCollision, resolveLabelCollision } from './collisionDetection';

import { prepareBitmap, addToBitmap } from './vega-label/BitMap';

import { checkInteraction, checkClicked, checkHovered, interactionStyle, buildStrokes } from './interaction';

import { drawAxis, wrap } from './axis';

import { getBrowser, getOS } from './browser-util';

import { drawGrid } from './grid';

import { drawLegend, setLegendInteractionState } from './legend';

import { getLicenses } from './license';

import { formatDataLabel, placeDataLabels, getDataSymbol } from './dataLabel';

import {
  formatStats,
  roundTo,
  setNumeralLocale,
  registerNumeralFormat,
  registerNumeralLocale,
  getNumeralInstance
} from './formatStats';

import { formatDate } from './formatDate';

import { prepareRenderChange } from './renderChangeEngine';

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
  setAccessibilityController,
  setElementFocusHandler,
  setElementInteractionAccessState,
  setElementAccessID,
  checkAccessFocus,
  retainAccessFocus
} from './accessibilityController';

import {
  initializeDescriptionRoot,
  setAccessTitle,
  setAccessSubtitle,
  setAccessLongDescription,
  setAccessContext,
  setAccessExecutiveSummary,
  setAccessPurpose,
  setAccessStatistics,
  setAccessChartCounts,
  setAccessXAxis,
  setAccessYAxis,
  setAccessStructure,
  setAccessAnnotation,
  setAccessibilityDescriptionWidth,
  findTagLevel
} from './accessibilityDescriptions';

import {
  initializeElementAccess,
  hideNonessentialGroups,
  setTooltipAccess,
  setLegendAccess,
  hideNode,
  createUrl,
  setHighContrastListener
} from './accessibilityUtils';

import { createLabel, createGroupLabel } from './altTextGenerator';

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

import { Sankey, sankeyLeft, sankeyRight, sankeyJustify, sankeyCenter, sankeyLinkHorizontal } from './sankey';

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
  initializeElementAccess,
  initializeDescriptionRoot,
  setElementFocusHandler,
  setElementAccessID,
  setTooltipAccess,
  setLegendAccess,
  setHighContrastListener,
  createLabel,
  createGroupLabel,
  setAccessibilityController,
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
  resolveLabelCollision,
  prepareBitmap,
  addToBitmap,
  findCollision,
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
  setNumeralLocale,
  registerNumeralFormat,
  registerNumeralLocale,
  getNumeralInstance,
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
  Sankey as sankey,
  sankeyCenter,
  sankeyJustify,
  sankeyLeft,
  sankeyLinkHorizontal,
  sankeyRight,
  transitionEndAll,
  transformData,
  scopeDataKeys,
  visaColors,
  validateAccessibilityProps,
  fixNestedSparseness,
  prepareRenderChange
};

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
