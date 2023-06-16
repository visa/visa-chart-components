/**
 * Copyright (c) 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
const path = require('path');
const glob = require('glob');
const fs = require('fs');

const changelogFiles = [
  ...glob.sync(path.join(__dirname, '..', 'packages') + '/**/CHANGELOG.md', {}), // (nested) package level results
  ...glob.sync(path.join(__dirname, '..', 'packages') + '/*/NEWS.md', {}), // charts-R changelog
  ...glob.sync(path.join(__dirname, '..') + '/CHANGELOG.md', {}) // root results
];
changelogFiles.forEach(function(file, i) {
  try {
    fs.unlinkSync(file);
    console.log(`SUCCESS:: file:${file} was successfully removed`);
  } catch (ex) {
    console.log(`Error:: while processing ts file:${file}, exception:${ex}`);
  }
});
console.log(`Done removing ${changelogFiles.length} CHANGELOG.md files`);
