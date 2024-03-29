/**
 * Copyright (c) 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const libCoverage = require('istanbul-lib-coverage');
const libReport = require('istanbul-lib-report');
const reports = require('istanbul-reports');
const prettier = require('prettier');

// get existing code coverage results and combine them together
const coverageMap = libCoverage.createCoverageMap();
const files = glob.sync(path.join(__dirname, '..', 'packages') + '/*/coverage/coverage-final.json', {});

const configWatermarks = {
  statements: [50, 75],
  functions: [50, 75],
  branches: [50, 75],
  lines: [50, 75]
};

files.forEach(function(file) {
  try {
    const fileJson = JSON.parse(fs.readFileSync(file));
    Object.keys(fileJson).forEach(fileName => coverageMap.addFileCoverage(fileJson[fileName]));
    // console.log(`Success:: coverage file:${file} added to global map`);
  } catch (ex) {
    console.log(`Error:: while processing test coverage file:${file}, exception:${ex}`);
  }
});

// create the report and print the results to the console as well.
try {
  const context = libReport.createContext({
    dir: './coverage',
    defaultSummarizer: 'pkg',
    watermarks: configWatermarks,
    coverageMap
  });

  // const reportLCOV = reports.create('lcov');
  const reportHTML = reports.create('html');
  const reportJSON = reports.create('json');
  const reportTextSummary = reports.create('text-summary');
  const reportText = reports.create('text');

  // reportLCOV.execute(context);
  reportTextSummary.execute(context);
  reportText.execute(context);
  reportHTML.execute(context);
  reportJSON.execute(context);

  // console.log(`Success:: combined coverage report created`);
} catch (ex) {
  console.log(`Error:: while processing combined coverage report, exception:${ex}`);
}

// now we will combine jest-html-reporter outputs
const coverageDir = './coverage';
const combinedTestResultsFile = path.join(coverageDir, '/jest-test-report.html');
let combinedFileContent = undefined;
// let combinedFileConsoleSummary = undefined; // we can use this later to output to command line as well.
const htmlFiles = glob.sync(path.join(__dirname, '..', 'packages/*/coverage') + '/**/test-report.html', {});
htmlFiles.forEach(function(file, i) {
  try {
    const newTitle = '<title>@visa/charts jest result</title>';
    const fileContent = fs
      .readFileSync(file)
      .toString()
      .split('\n');

    // now we have to parse out various aspects of the file
    let titleRecord = fileContent.splice(0, 1)[0];
    let newTitleRecord = titleRecord;
    let bodyLastRecord = fileContent.splice(-1, 1)[0];
    let topFileBody =
      bodyLastRecord.substr(0, bodyLastRecord.indexOf('<body>') + 6) +
      '<div id="jesthtml-content"><h1>@visa/charts jest results</h1><br/><hr/><br/></div>';
    let bottomFileBody = bodyLastRecord.substr(bodyLastRecord.indexOf('</body>'));
    let parsedFileBody = bodyLastRecord
      .substr(bodyLastRecord.indexOf('<body>') + 6)
      .replace('</body></html>', '<br/><hr/><br/>')
      .replace(/h1/g, 'h2')
      .replace(/\<\/div\>/g, '</div>\n')
      .split('\n');

    if (i === 0) {
      // replace the title if we find it in the first record
      if (titleRecord.indexOf('<title>') > 0) {
        newTitleRecord = titleRecord.replace(
          titleRecord.substr(
            titleRecord.indexOf('<title>'),
            titleRecord.indexOf('</title>') - (titleRecord.indexOf('<title>') - 8)
          ),
          newTitle
        );
      }

      // first time through we just write the whole file
      combinedFileContent = [newTitleRecord, ...fileContent, topFileBody, ...parsedFileBody, bottomFileBody];
    } else {
      // second are beyond we parse out the relevant body of the reports and append body content below
      combinedFileContent.splice(-1, 0, ...parsedFileBody);
    }
  } catch (ex) {
    console.log(`Error:: while processing ts file:${file}, exception:${ex}`);
  }
});
// now that we have created combined file content we can write it to the file
if (combinedFileContent) {
  // if dir/file doesn't exist we have to create it first
  if (!fs.existsSync(combinedTestResultsFile)) {
    if (!fs.existsSync(coverageDir)) {
      fs.mkdirSync(coverageDir);
    }
    console.log('path check', path.resolve('./'), path.resolve(combinedTestResultsFile));
    fs.closeSync(fs.openSync(combinedTestResultsFile, 'w'));
  }
  fs.writeFileSync(combinedTestResultsFile, combinedFileContent.join('\n'));
  console.log(`Success:: file:${combinedTestResultsFile} created, open in chrome to view results`); //${beginLineNumber}- ${deleteCount} ${linesLength}`);
}

const combinedTestResultsJSONFile = path.join(coverageDir, '/jest-test-report.json');
const jsonFiles = glob.sync(path.join(__dirname, '..', 'packages/*/coverage') + '/**/test-report.json', {});
let combinedJSONResults = {};
jsonFiles.forEach(function(file, i) {
  try {
    const fileContent = JSON.parse(fs.readFileSync(file)).testResults[0].assertionResults;
    // get package name of file for generating machine/user independent snapshot object
    const packageName = path.dirname(file).slice(
      path
        .dirname(file)
        .slice(0, path.dirname(file).lastIndexOf('/'))
        .lastIndexOf('/') + 1,
      path.dirname(file).lastIndexOf('/')
    );

    // user specific bugfix - loop through and make full paths relative
    const userSpecificPath = new RegExp(path.dirname(file).slice(0, path.dirname(file).indexOf('/packages')), 'g');
    fileContent.forEach(result => {
      // console.log(result);
      if (result && result.failureMessages && result.failureMessages.length > 0) {
        const failures = [...result.failureMessages];
        failures.forEach((fail, i) => {
          result.failureMessages[i] = fail.replace(userSpecificPath, '.');
        });
      }
    });

    // we now have to filter out the fake test failure, which is only in place to hack cicd
    combinedJSONResults[packageName] = fileContent.filter(o => o['ancestorTitles'][0] !== 'fake-test-fail-exit');
    // console.log(file, i, combinedJSONResults);
  } catch (ex) {
    console.log(`Error:: while processing ts file:${file}, exception:${ex}`);
  }
});
// now that we have created combined file content we can write it to the file
if (combinedJSONResults) {
  const formattedResults = prettier.format(JSON.stringify(combinedJSONResults), { parser: 'json' });

  // if dir/file doesn't exist we have to create it first
  if (!fs.existsSync(combinedTestResultsJSONFile)) {
    if (!fs.existsSync(coverageDir)) {
      fs.mkdirSync(coverageDir);
    }
    console.log('path check', path.resolve('./'), path.resolve(combinedTestResultsJSONFile));
    fs.closeSync(fs.openSync(combinedTestResultsJSONFile, 'w'));
  }
  fs.writeFileSync(combinedTestResultsJSONFile, formattedResults);
  console.log(`Success:: file:${combinedTestResultsJSONFile} created, open in chrome to view results`); //${beginLineNumber}- ${deleteCount} ${linesLength}`);
}

console.log('reports are now available, open these in your browser');
console.log(`view testing coverage results here => ${path.resolve('./coverage/index.html')}`);
console.log(`view testing success/failure results here => ${path.resolve(combinedTestResultsFile)}`);
console.log(`json testing success/failure results here => ${path.resolve(combinedTestResultsJSONFile)}`);
