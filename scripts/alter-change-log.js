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

const files = glob.sync(path.join(__dirname, '..', 'packages') + '/*/CHANGELOG.md', {});
files.forEach(function(file) {
  try {
    let releaseArray = [];
    const lines = fs
      .readFileSync(file)
      .toString()
      .split('\n');

    const linesLength = lines ? lines.length : 0;
    if (linesLength > 0) {
      const mainReleaseRegex = /^#\s\[\d{1,}\.\d{1,}\.\d{1,}\].*\(\d{4}-\d{2}-\d{2}\){1}$/gm;
      const mainReleaseRegexSecondPattern = /^#\s\d{1,}\.\d{1,}\.\d{1,}.*\(\d{4}-\d{2}-\d{2}\){1}$/gm;
      const mainReleaseRegexthirdPattern = /^##\s\[\d{1,}\.\d{1,}\.\d{1,}\].*\(\d{4}-\d{2}-\d{2}\){1}$/gm;
      const subReleaseRegex = /^##\s\[\d{1,}\.\d{1,}\.\d{1,}.*\].*\(\d{4}-\d{2}-\d{2}\){1}$/gm;
      const subReleaseRegexSecondPattern = /^##\s\d{1,}\.\d{1,}\.\d{1,}.*\(\d{4}-\d{2}-\d{2}\){1}$/gm;
      const subReleaseRegexThirdPattern = /^#\s\[\d{1,}\.\d{1,}\.\d{1,}.*\].*\(\d{4}-\d{2}-\d{2}\){1}$/gm;

      for (let i = 0; i < lines.length; i++) {
        if (
          lines[i] &&
          (mainReleaseRegex.test(lines[i]) ||
            mainReleaseRegexSecondPattern.test(lines[i]) ||
            mainReleaseRegexthirdPattern.test(lines[i]))
        ) {
          releaseArray.push({ type: 'mainRelease', lineNumber: i });
        } else if (
          lines[i] &&
          (subReleaseRegex.test(lines[i]) ||
            subReleaseRegexSecondPattern.test(lines[i]) ||
            subReleaseRegexThirdPattern.test(lines[i]))
        ) {
          releaseArray.push({ type: 'subRelease', lineNumber: i });
        }
      }

      let accumaltor = { previousType: '', start: undefined };
      let spliceIndexes = [];
      const reducer = function(acm, currentValue) {
        if (currentValue.type === 'subRelease' && acm.previousType !== 'subRelease') {
          acm.start = currentValue.lineNumber;
        } else if (currentValue.type === 'mainRelease' && acm.start) {
          spliceIndexes.push(`${accumaltor.start}-${currentValue.lineNumber}`);
          acm.start = undefined;
        }
        acm.previousType = currentValue.type;
        return acm;
      };
      if (releaseArray && releaseArray.length > 0) {
        releaseArray.reduce(reducer, accumaltor);
        if (accumaltor && accumaltor.start) {
          spliceIndexes.push(`${accumaltor.start}-${linesLength}`);
        }
      }

      if (spliceIndexes && spliceIndexes.length > 0) {
        const lineNumbers = spliceIndexes[0].split('-');
        const [beginLineNumber, endLineNumber] = lineNumbers;
        const deleteCount = endLineNumber - beginLineNumber;
        const removedLines = lines.splice(beginLineNumber, deleteCount);
        const truncateFile = fs.truncateSync(file, 0);
        fs.writeFileSync(file, lines.join('\n'));
        console.log(`Success:: file:${file} `); //${beginLineNumber}- ${deleteCount} ${linesLength}`);
      }
    }
  } catch (ex) {
    console.log(`Error:: while processing file:${file}, exception:${ex}`);
  }
});
