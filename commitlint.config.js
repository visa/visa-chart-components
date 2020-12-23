/**
* Copyright (c) 2020 Visa, Inc.
*
* This source code is licensed under the MIT license
* https://github.com/visa/visa-chart-components/blob/master/LICENSE
*
**/
const config = require('@commitlint/config-conventional');

module.exports = {extends: ['@commitlint/config-conventional'],
rules: {
    'type-enum': [
      2,
      'always',
      [
        ...config.rules['type-enum'][2],
        'wip'
      ]
    ]
  }
};
