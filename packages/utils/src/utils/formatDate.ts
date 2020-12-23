/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { timeFormat } from 'd3-time-format';

export const formatDate = ({
  date,
  format,
  offsetTimezone
}: {
  date: any;
  format: string;
  offsetTimezone: boolean;
}) => {
  const userTimezoneOffset = offsetTimezone ? date.getTimezoneOffset() * 60000 : 0;
  const offsetDate = new Date(date.getTime() + userTimezoneOffset);
  format = format.includes('%') ? format : '%Y %b';
  const formatedDate = timeFormat(format)(offsetDate);

  return formatedDate;
};
