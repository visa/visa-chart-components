/**
 * Copyright (c) 2020, 2021, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export interface IKeyboardInstructionsProps {
  /**
   * @shortDescription ID used to identify menu (must be unique).
   * @controlName TextField
   * @groupName Data */
  uniqueID: string;

  /**
   * @shortDescription Internationalization properties of the chart
   * @controlName TextArea
   * @groupName Localization
   * @sortOrder 1 */
  localization: ILocalizationType;

  /**
   * @shortDescription Type of geometry described in the menu. Defaults to "Geometry."
   * @controlName TextField
   * @groupName Data */
  geomType: string;

  /**
   * @shortDescription Type of group (if any) described in the menu. Defaults to "Group."
   * @controlName TextField
   * @groupName Data */
  groupName: string;

  /**
   * @shortDescription Tag name of the chart that the menu belongs to.
   * @controlName TextField
   * @groupName Data */
  chartTag: string;

  /**
   * @shortDescription Width of the menu area in pixels.
   * @controlName Slider
   * @groupName Base */
  width: number;

  /**
   * @shortDescription Whether the selecting the chart elements has any meaningful effect.
   * @controlName Toggle
   * @groupName Events */
  isInteractive: boolean;

  /**
   * @shortDescription Whether the chart has the ability to navigate to cousins or not.
   * @controlName Toggle
   * @groupName Events */
  hasCousinNavigation: boolean;

  /**
   * @shortDescription Replace the explanation for when to press the up and down arrow keys.
   * @controlName TextField
   * @groupName Events */
  cousinActionOverride: string;

  /**
   * @shortDescription Replace the explanation for what the up and down arrow keys do.
   * @controlName TextField
   * @groupName Events */
  cousinResultOverride: string;

  /**
   * @shortDescription Disables the instructions completely, including the icon. Requires a chart's suppressEvents = true, accessibility.elementsAreInterface = false, and accessibility.keyboardNavConfig.disabled = true
   * @controlName Toggle
   * @groupName Base */
  disabled: boolean;
}

export interface ILocalizationType {
  language?: string | object;
  numeralLocale?: string | object;
  skipValidation?: boolean;
  overwrite?: boolean;
}
