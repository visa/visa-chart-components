/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export interface IDataTableProps {
  /**
   * @shortDescription ID used to identify chart (must be unique), helpful for validation messages. Defaults to UUID v4 standard.
   * @controlName TextField
   * @groupName Data */
  uniqueID: string;

  /**
   * @shortDescription Chart data used to create table
   * @controlName TextArea
   * @groupName Data */
  data: object[];
  /**
   * @shortDescription Chart columns used to order columns in data table
   * @controlName TextArea
   * @groupName Data */
  tableColumns: object[];
  /**
   * @shortDescription When selected, applies compact height to rows of table
   * @controlName Toggle
   * @groupName Style */
  isCompact: boolean;
  /**
   * @shortDescription When selected, applies screen reader class to table button
   * @controlName Toggle
   * @groupName Style */
  hideDataTable: boolean;
  /**
   * @shortDescription Padding between plot area and axes lines
   * @controlName TextArea
   * @groupName Padding */
  padding: IBoxModelType;

  /**
   * @shortDescription Margin between the subtitle and the chart area, or between the title and chart area if no subtitle is specified
   * @controlName TextArea
   * @groupName Margin */
  margin: IBoxModelType;
}

export interface IBoxModelType {
  top: number;
  bottom: number;
  right: number;
  left: number;
}
