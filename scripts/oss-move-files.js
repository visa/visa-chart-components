/**
 * Copyright (c) 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
const path = require('path');
const glob = require('glob');
const fs = require('fs');

// get arg passed from command line (for sibling directory)
const args = process.argv.slice(2);

// get all folders in the monorepo
const folders = [];
fs.readdirSync(path.join(__dirname, '..', 'packages')).forEach(subDir => {
  try {
    if (fs.lstatSync(path.join(__dirname, '..', 'packages', subDir)).isDirectory()) {
      // folders.push(path.join(__dirname,'..','packages', subDir));
      folders.push(subDir);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
});

// for each subfolder, copy file from the source dir to here
// we assume the source dir is a valid dir inputted when the script is called
const destPath = path.join(__dirname, '..');
const sourcePath = args[0];
console.log('checking source path', sourcePath);
if (!sourcePath) {
  console.log('your source path was not provided, exiting program');
  process.exit(1);
}

// loop and copy
folders.forEach(folder => {
  try {
    const folderFiles = glob.sync(path.join(sourcePath, 'packages', folder) + '/**', {});
    folderFiles.forEach(fFile => {
      if (!fs.lstatSync(fFile).isDirectory()) {
        try {
          const destFile = fFile.replace(sourcePath, destPath);
          console.log('copying', folder, fFile);
          fs.copyFileSync(fFile, destFile);
        } catch (error) {
          console.log('error: ', error, ' when copying', fFile, ' to ', destFile);
        }
      }
    });
  } catch (error) {
    console.log('error: ', error, ' when copying files from', folder);
  }
});
