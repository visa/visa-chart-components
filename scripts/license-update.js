/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const { simpleGit, CleanOptions } = require('simple-git');
simpleGit().clean(CleanOptions.FORCE);
const git = simpleGit();

const ossFirstCommitDate = '2020-12-10'; // the week of initial release of OSS on GH
const defaultYearDate = new Date().getFullYear();
const parentLicenseFile = glob.sync(path.join(__dirname, '..') + '/LICENSE', {});
const parentLicenseHeaderFile = glob.sync(path.join(__dirname, '..') + '/LICENSE HEADER', {});
const tsFileExclusions = [
  '/**/*.d.ts', // auto-generated type files
  '/**/*.json', // license header breaks json files
  '/**/__snapshots__/**', // auto-generated testing snapshots
  '/**/node_modules/**', // ensure node modules is not included
  '/**/charts-angular/src/directives/**', // auto-generated angular directives/components
  '/**/charts-react/src/components/**' // auto-generated react components and utilities
];

const licenseFileExclusions = [
  '/**/charts-R/LICENSE', // R licensing files which has different syntax
  '/**/charts-R/LICENSE.md' // R licensing files which has different syntax
];

// GET THE MASTER FILE CONTENT SO WE CAN COPY IT THROUGHOUT THE LIB'S PACKAGES
const parentFileContent = fs
  .readFileSync(parentLicenseFile[0])
  .toString()
  .split('\n');

const parentHeaderFileContent = fs
  .readFileSync(parentLicenseHeaderFile[0])
  .toString()
  .split('\n');

const parentHeaderFileHTMLContent = fs
  .readFileSync(parentLicenseHeaderFile[0])
  .toString()
  .replace('/**', '<!--')
  .replace('**/', '-->')
  .split('\n');

const parentHeaderFileRContent = fs
  .readFileSync(parentLicenseHeaderFile[0])
  .toString()
  .replace('/**', '# /**')
  // .replace('**/', '# **/-->')
  .replace(/ \*/g, '# *')
  .split('\n');

async function getFilesGitHistory(file) {
  let statusSummary;
  try {
    statusSummary = await git.log({ '--since': ossFirstCommitDate, file });
  } catch (e) {
    // handle the error
    console.error(e);
  }
  return statusSummary;
}

// THIS CODE WILL OVERWRITE THE PACKAGES/LICENSE FILES WITH WHATEVER IS IN THE ROOT /LICENSE FILE
const licenseFiles = glob.sync(path.join(__dirname, '..', 'packages') + '/*/LICENSE', {
  ignore: licenseFileExclusions
});
licenseFiles.forEach(function(file) {
  try {
    fs.writeFileSync(file, parentFileContent.join('\n'));
    console.log(`Success:: file:${file} written with new license`);
  } catch (ex) {
    console.log(`Error:: while processing file:${file}, exception:${ex}`);
  }
});

const tsFiles = [
  ...glob.sync(path.join(__dirname, '..', 'packages/*/src') + '/**/*.ts*', { ignore: tsFileExclusions }), // all ts and tsx files in package/src directories
  ...glob.sync(path.join(__dirname, '..', 'packages/*/src') + '/**/*.js*', { ignore: tsFileExclusions }), // all js and jsx files in package/src directories
  ...glob.sync(path.join(__dirname, '..', 'packages/*/docs') + '/**/*.js*', { ignore: tsFileExclusions }), // all js and jsx files in package/src directories
  ...glob.sync(path.join(__dirname, '..', 'packages/*') + '/stencil.config.ts', {}), // all stencil config files in packages
  ...glob.sync(path.join(__dirname, '..', 'packages/*/src') + '/**/*.*ss', {}), // all scss files in package/src directories
  ...glob.sync(path.join(__dirname, '..', 'packages/charts-R/inst/htmlwidgets') + '/**/*.js', {}), // @visa/charts compiled code in charts-R
  ...glob.sync(path.join(__dirname, '..', 'packages/charts-python/js') + '/**/*.js', { ignore: tsFileExclusions }),
  ...glob.sync(path.join(__dirname, '..', 'scripts') + '/*.js', {}), // all node scripts in the root
  ...glob.sync(path.join(__dirname, '..') + '/*.js', {}), // all js config files in the root
  ...glob.sync(path.join(__dirname, '..', '.storybook') + '/**/*.js', { ignore: tsFileExclusions }) // all storybook js files
];
tsFiles.forEach(function(file) {
  try {
    let lastHeaderLine = 0;
    let headerExists = false;
    const nodeEntryArray = [];

    const fileContent = fs
      .readFileSync(file)
      .toString()
      .split('\n');

    if (fileContent[0] === '#!/usr/bin/env node') {
      lastHeaderLine++;
      nodeEntryArray.push('#!/usr/bin/env node');
    }

    // check if we have written license before (starts with /**)
    headerExists =
      fileContent[lastHeaderLine].trim().substr(0, 3) === '/**' &&
      fileContent[lastHeaderLine + 1].trim().substr(0, 11) === '* Copyright';
    if (headerExists) {
      // remove existing header
      for (i = lastHeaderLine; i <= fileContent.length; i++) {
        if (fileContent[i].trim() === '**/') {
          lastHeaderLine = i + 1;
          break;
        }
      }
    }

    getFilesGitHistory(file)
      .then(status => {
        const yearArray = [];
        if (status && status.all && status.all.length > 0) {
          status.all.forEach(logRecord => {
            const logRecordYear = new Date(logRecord.date).getFullYear();
            if (yearArray.findIndex(yr => yr === logRecordYear) === -1) {
              yearArray.push(logRecordYear);
            }
          });
        } else {
          yearArray.push(defaultYearDate);
        }
        // sort years in order from first to last and make it a csv string
        const yearString = yearArray.sort((a, b) => a - b).join(', ');

        // replace the parentHeaderContent
        const yearHeader = parentHeaderFileContent.map(line => {
          return line.replace('[YEARTOREPLACE]', yearString);
        });
        fs.writeFileSync(file, [...nodeEntryArray, ...yearHeader, ...fileContent.slice(lastHeaderLine)].join('\n'));
        console.log(`Success:: file:${file} written with new license, for years: `, yearString);
      })
      .catch(err => {
        // console an error and return the current year if there are issues
        console.error(err);
        const yearString = String(defaultYearDate);
        // replace the parentHeaderContent
        const yearHeader = parentHeaderFileContent.map(line => {
          return line.replace('[YEARTOREPLACE]', yearString);
        });
        fs.writeFileSync(
          file,
          [
            ...nodeEntryArray,
            ...yearHeader.replace('[YEARTOREPLACE]', yearString),
            ...fileContent.slice(lastHeaderLine)
          ].join('\n')
        );
        console.log(
          `Success:: file:${file} written with new license, but error was triggered, double check results before committing`
        );
      });
  } catch (ex) {
    console.log(`Error:: while processing ts file:${file}, exception:${ex}`);
  }
});

// now we update html files as they have different comment syntax
const htmlFiles = [
  ...glob.sync(path.join(__dirname, '..', 'packages/*/') + '/**/*.html', { ignore: tsFileExclusions }),
  ...glob.sync(path.join(__dirname, '..', '.storybook') + '/**/*.html', {}),
  ...glob.sync(path.join(__dirname, '..', 'packages/*/docs') + '/**/*.mdx', { ignore: tsFileExclusions }), // all storybook related mdx files
  ...glob.sync(path.join(__dirname, '..', 'stories') + '/**/*.mdx', { ignore: tsFileExclusions }) // all storybook related mdx files
];
htmlFiles.forEach(function(file) {
  try {
    let lastHeaderLine = 0;
    let headerExists = false;

    const fileContent = fs
      .readFileSync(file)
      .toString()
      .split('\n');

    // check if we have written license before (starts with /**)
    headerExists =
      fileContent[0].trim().substr(0, 7) === '<!--' && fileContent[1].trim().substr(0, 11) === '* Copyright';

    if (headerExists) {
      // remove existing header
      for (i = 0; i <= fileContent.length; i++) {
        if (fileContent[i].trim() === '-->') {
          lastHeaderLine = i + 1;
          break;
        }
      }
    }
    getFilesGitHistory(file)
      .then(status => {
        const yearArray = [];
        if (status && status.all && status.all.length > 0) {
          status.all.forEach(logRecord => {
            const logRecordYear = new Date(logRecord.date).getFullYear();
            if (yearArray.findIndex(yr => yr === logRecordYear) === -1) {
              yearArray.push(logRecordYear);
            }
          });
        } else {
          yearArray.push(defaultYearDate);
        }

        // sort years in order from first to last and make it a csv string
        const yearString = yearArray.sort((a, b) => a - b).join(', ');

        // replace the parentHeaderContent
        const yearHeader = parentHeaderFileHTMLContent.map(line => {
          return line.replace('[YEARTOREPLACE]', yearString);
        });
        fs.writeFileSync(file, [...yearHeader, ...fileContent.slice(lastHeaderLine)].join('\n'));
        console.log(`Success:: file:${file} written with new license, for years: `, yearString);
      })
      .catch(err => {
        // console an error and return the current year if there are issues
        console.error(err);
        const yearString = String(defaultYearDate);
        const yearHeader = parentHeaderFileHTMLContent.map(line => {
          return line.replace('[YEARTOREPLACE]', yearString);
        });
        fs.writeFileSync(file, [...yearHeader, ...fileContent.slice(lastHeaderLine)].join('\n'));
        console.log(
          `Success:: file:${file} written with new license, but error was triggered, double check results before committing`
        );
      });
  } catch (ex) {
    console.log(`Error:: while processing ts file:${file}, exception:${ex}`);
  }
});

// now we update R, py files as they have different comment syntax
const rFiles = [
  ...glob.sync(path.join(__dirname, '..', 'packages/charts-R') + '/**/*.R', {}),
  ...glob.sync(path.join(__dirname, '..', 'packages/charts-R') + '/**/*.yaml', {}),
  ...glob.sync(path.join(__dirname, '..', 'packages/charts-python') + '/**/*.py', {})
];

rFiles.forEach(function(file) {
  try {
    let lastHeaderLine = 0;
    let headerExists = false;

    const fileContent = fs
      .readFileSync(file)
      .toString()
      .split('\n');

    // check if we have written license before (starts with /**)
    headerExists =
      fileContent[0].trim().substr(0, 5) === '# /**' && fileContent[1].trim().substr(0, 13) === '# * Copyright';

    if (headerExists) {
      // remove existing header
      for (i = 0; i <= fileContent.length; i++) {
        if (fileContent[i].trim() === '# **/') {
          lastHeaderLine = i + 1;
          break;
        }
      }
    }
    getFilesGitHistory(file)
      .then(status => {
        const yearArray = [];
        if (status && status.all && status.all.length > 0) {
          status.all.forEach(logRecord => {
            const logRecordYear = new Date(logRecord.date).getFullYear();
            if (yearArray.findIndex(yr => yr === logRecordYear) === -1) {
              yearArray.push(logRecordYear);
            }
          });
        } else {
          yearArray.push(defaultYearDate);
        }

        // sort years in order from first to last and make it a csv string
        const yearString = yearArray.sort((a, b) => a - b).join(', ');

        // replace the parentHeaderContent
        const yearHeader = parentHeaderFileRContent.map(line => {
          return line.replace('[YEARTOREPLACE]', yearString);
        });
        fs.writeFileSync(file, [...yearHeader, ...fileContent.slice(lastHeaderLine)].join('\n'));
        console.log(`Success:: file:${file} written with new license, for years: `, yearString);
      })
      .catch(err => {
        // console an error and return the current year if there are issues
        console.error(err);
        const yearString = String(defaultYearDate);
        const yearHeader = parentHeaderFileRContent.map(line => {
          return line.replace('[YEARTOREPLACE]', yearString);
        });
        fs.writeFileSync(file, [...yearHeader, ...fileContent.slice(lastHeaderLine)].join('\n'));
        console.log(
          `Success:: file:${file} written with new license, but error was triggered, double check results before committing`
        );
      });
  } catch (ex) {
    console.log(`Error:: while processing R, py file:${file}, exception:${ex}`);
  }
});
