/**
 * Copyright (c) 2020, 2021, 2022, 2023, 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// temporary comment to bump charts with feature commit
import { DIRECTIVES } from './directives';
@NgModule({
  // declarations: [DIRECTIVES],
  exports: [DIRECTIVES],
  imports: [CommonModule, DIRECTIVES],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VisaChartsModule {}
