/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import Utils from '@visa/visa-charts-utils';

const { getLicenses } = Utils;

import * as unitTestAccessibility from './unit-test-accessibility';

import * as unitTestAxis from './unit-test-axis';

import * as unitTestEvent from './unit-test-event';

import * as unitTestGeneric from './unit-test-generic';

import * as unitTestInteraction from './unit-test-interaction';

import * as unitTestTooltip from './unit-test-tooltip';

import * as unitTestLabel from './unit-test-label';

import { flushTransitions, parseTransform, asyncForEach } from './unit-test-utils';

export {
  unitTestAccessibility,
  unitTestAxis,
  unitTestEvent,
  unitTestGeneric,
  unitTestInteraction,
  unitTestTooltip,
  unitTestLabel,
  flushTransitions,
  parseTransform,
  asyncForEach
};

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
