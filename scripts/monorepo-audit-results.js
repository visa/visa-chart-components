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
const prettier = require('prettier');

const coverageDir = './coverage';
const combinedAuditResultsJSONFile = path.join(coverageDir, '/yarn-audit-report.json');
const jsonFiles = [
  ...glob.sync(path.join(__dirname, '..', 'packages') + '/*/yarn-audit.json', {}), // package level results
  ...glob.sync(path.join(__dirname, '..') + '/yarn-audit.json', {}) // root results
];
let combinedJSONResults = {};
jsonFiles.forEach(function(file, i) {
  try {
    // const fileContent = JSON.parse(fs.readFileSync(file));
    const fileContent = fs
      .readFileSync(file)
      .toString()
      .split('\n');

    // const jsonFileContent = JSON.parse(fileContent.map(rec => rec === "" ? "{}" : rec).join());
    const jsonFileContent = JSON.parse(`[${fileContent.filter(rec => rec !== '').join()}]`);
    // get package name of file for generating machine/user independent snapshot object
    const packageName = path.dirname(file).slice(path.dirname(file).lastIndexOf('/') + 1);

    // add file to combined json object
    combinedJSONResults[packageName] = jsonFileContent;

    // output cleaned version of file
    const cleanFileName = file.replace('yarn-audit.json', 'yarn-audit-clean.json');
    if (!fs.existsSync(cleanFileName)) {
      fs.closeSync(fs.openSync(cleanFileName, 'w'));
    }
    fs.writeFileSync(cleanFileName, prettier.format(JSON.stringify(jsonFileContent), { parser: 'json' }));

    console.log(
      'SUCCESS:: combined and cleaned',
      cleanFileName,
      jsonFileContent.find(d => d.type === 'auditSummary').data.vulnerabilities
    );
  } catch (ex) {
    console.log(`Error:: while processing ts file:${file}, exception:${ex}`);
  }
});
// now that we have created combined file content we can write it to the file
if (combinedJSONResults) {
  const formattedResults = prettier.format(JSON.stringify(combinedJSONResults), { parser: 'json' });
  // if dir/file doesn't exist we have to create it first
  if (!fs.existsSync(combinedAuditResultsJSONFile)) {
    if (!fs.existsSync(coverageDir)) {
      fs.mkdirSync(coverageDir);
    }
    fs.closeSync(fs.openSync(combinedAuditResultsJSONFile, 'w'));
  }
  fs.writeFileSync(combinedAuditResultsJSONFile, formattedResults);
  console.log(`Success:: file:${combinedAuditResultsJSONFile} created, open in chrome to view results`);
}
console.log(
  'audit results are now available, view file below, or run the snapshot test [yarn compare-audit-results] to check changes'
);
console.log(
  `json yarn audit results here => ${path.resolve(
    combinedAuditResultsJSONFile
  )} and file specific versions referenced above`
);
