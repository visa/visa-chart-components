/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
const path = require('path');
const glob = require('glob');
const fs = require('fs');

const rPath = path.join((__dirname, '..', 'packages') + '/charts-R/inst/htmlwidgets/lib/visa-chart-components');
const chartsPath = path.join(path.join(__dirname, '..', 'packages') + '/charts/dist/charts');
const files = glob.sync(rPath + '/*.js', {});
const newFiles = glob.sync(chartsPath + '/*.js', {});

if (newFiles.length > 0) {
  // delete the content of the folder first
  files.forEach(function(file) {
    try {
      fs.unlinkSync(file, err => {
        if (err) throw err;
      });
    } catch (ex) {
      console.log(`Error:: while deleting file:${file}, exception:${ex}`);
    }
  });

  // then copy over the new files from @visa/charts package
  newFiles.forEach(function(newFile) {
    try {
      fs.copyFileSync(newFile, newFile.replace(chartsPath, rPath));
    } catch (ex) {
      console.log(`Error:: while deleting file:${file}, exception:${ex}`);
    }
  });
  console.log(
    'completed charts-R @visa/charts update, ',
    files.length,
    ' files were removed and ',
    newFiles.length,
    ' files were copied. Be sure to run yarn license-update now'
  );
} else {
  console.log('WARNING: no new files found in ./packages/charts/dist/charts, please run a build first');
}
