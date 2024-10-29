// used in post build to fix stencil bug https://github.com/ionic-team/stencil-ds-output-targets/issues/406
// this modifies the import type path in visa-charts.ts (in charts-angular and vue) to point to dist/types/components
const options = [
  {
    files: '../charts-angular/src/lib/directives/visa-charts.ts', // replace this with the path to your file
    from: /import type { Components } from '@visa\/charts\/dist\/components';/g, // replace this with the string to replace
    to: `import type { Components } from '@visa/charts/dist/types/components';` // replace this with the string to replace with
  },
  {
    files: '../charts-vue/lib/components.ts', // replace this with the path to your file
    from: /import type { JSX } from '@visa\/charts\/dist\/components';/g, // replace this with the string to replace
    to: `import type { JSX } from '@visa/charts/dist/types/components';` // replace this with the string to replace with
  },
  {
    files: '../charts-react/src/components/visa-charts.ts', // replace this with the path to your file
    from: /import type { JSX } from '@visa\/charts\/dist\/components';/g, // replace this with the string to replace
    to: `import type { Components as JSX } from '@visa/charts/dist/types/components';` // replace this with the string to replace with
  }
];

import('replace-in-file').then(module => {
  const replaceInFile = module.replaceInFile;

  options.forEach(option => {
    replaceInFile(option)
      .then(results => {
        console.log('Replacement results:', results);
      })
      .catch(error => {
        console.error('Error occurred:', error);
      });
  });
});

// we have to use this code to move react helper functions back into ./utils folder
// in version 4 of stencil these are placed in the react-component-lib folder, but we cannot upgrade based 0.5.3 output target yet.
const fs = require('fs');
const path = require('path');

// Define source and destination directories
const sourceDir = path.join(__dirname, '../../charts-react/src/components/react-component-lib');
const destDir = path.join(__dirname, '../../charts-react/src/components/react-component-lib/utils');
const utilFiles = ['attachProps.ts', 'case.ts', 'dev.ts', 'index.tsx'];

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Function to move files
function moveFiles() {
  fs.readdir(sourceDir, (err, files) => {
    if (err) {
      console.error('Error reading source directory:', err);
      return;
    }

    files.forEach(file => {
      // console.log('checking file', file, utilFiles.indexOf(file) >= 0);
      if (utilFiles.indexOf(file) >= 0) {
        const sourceFile = path.join(sourceDir, file);
        const destFile = path.join(destDir, file);

        fs.rename(sourceFile, destFile, err => {
          if (err) {
            console.error(`Error moving file ${file}:`, err);
          } else {
            console.log(`Moved file ${file} to ${destDir}`);
          }
        });
      }
    });
  });
}

// Execute the function
moveFiles();
