/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { DOCS_RENDERED, STORY_RENDERED, STORY_CHANGED } from '@storybook/core-events';
import { addons } from '@storybook/addons';

let hasExpanded = false;
let initialLoad = true;
let initialStoryLoad = true;
let firstTab = true;

// this could have cross browser support issues
// we can check it against keydown functions in our a11y util
// to make sure we have covered any cross browser issues
const handleKeyDown = e => {
  // set mutation observer for new "link to canvas" a tag
  // console.log('checking e', e, e.target);
  if (firstTab) {
    watchNavTabs();
    firstTab = false;
  }
  if (e.keyCode === 13 || e.keyCode === 32) {
    e.target.click();
    // if "link to canvas" clicked, re-add tabindex to nav tabs
    if (new RegExp('#storybook-preview-wrapper|^/?path=/story/').test(e.target.getAttribute('href'))) {
      // console.log('tabindex reset!');
      setTimeout(() => {
        Array.from(document.querySelectorAll('.os-content div div div > a'))
          .slice(-3)
          .forEach(i => i.setAttribute('tabindex', -1));
      }, 500);
    }

    if (e.target.getAttribute('data-item-id')) {
      const a11yText = document.querySelector('#a11y-status-message-text');
      a11yText.textContent = `${e.target.getAttribute('data-item-id')} selected, press tab to skip over to canvas`;
    }
  }
};

const makeH1 = () => {
  if (document.querySelector('.sidebar-header div:first-of-type > a')) {
    let newH1 = document.createElement('h1');
    let oldH1 = document.querySelector('.sidebar-header div:first-of-type a');
    document.querySelector('.sidebar-header div:first-of-type').appendChild(newH1);
    document.querySelector('h1').appendChild(oldH1);

    // adjust aria live to work with selections
    // this is a hack, but we need to try and make sure we have the aria-live region
    // before we adjust it
    setTimeout(() => {
      const a11yLive = document.querySelector('#a11y-status-message');
      const a11yText = document.createElement('p');
      a11yLive.setAttribute('role', 'alert');
      a11yText.setAttribute('id', 'a11y-status-message-text');
      a11yText.textContent = '';
      a11yLive.appendChild(a11yText);
    }, 3000);
  }
  document.querySelector('#storybook-explorer-tree div div div a').classList.add('level1');
};

const setNavAria = () => {
  const nav = document.querySelector('nav.container');
  nav.setAttribute('aria-hidden', false);
  nav.setAttribute(
    'aria-label',
    'Visa Chart Components vertical navigation, use Tab key to traverse items and Enter key to select.'
  );
  nav.setAttribute('aria-role', 'navigation');
};

const removeShortcutDropdown = () => {
  document.querySelector('.sidebar-header div:last-child').remove();
};

const removeSearch = () => {
  // console.log('we are calling remove search');
  const searchParent = document.querySelector('.sidebar-header').parentNode;
  searchParent.querySelector('.search-field').remove(); // remove downshift combobox
  searchParent.querySelector('label').remove(); // remove downshift label
  document.querySelector('#storybook-explorer-menu').removeAttribute('tabindex');
  document.querySelector('#storybook-explorer-menu > div:last-child').remove(); // remove the search result div
};

const createTree = () => {
  document.querySelector('#storybook-explorer-tree div').setAttribute('role', 'table');
  // document.querySelector('#storybook-explorer-tree div').setAttribute('tabindex', '0');
  document.querySelector('#storybook-explorer-tree div div').setAttribute('role', 'rowgroup');
  // document.querySelector('#storybook-explorer-tree div div').addEventListener('keydown', handleKeyDown);
};

const setAddonTabs = () => {
  const tabParentDiv = document.querySelectorAll('.os-content')[2].querySelector('.tabbutton').parentNode;

  // on initial load we have to do this no matter what
  if (initialLoad) {
    tabParentDiv.querySelectorAll('.tabbutton').forEach(i => i.setAttribute('aria-selected', false));
    tabParentDiv.querySelectorAll('.tabbutton-active').forEach(i => i.setAttribute('aria-selected', true));
  }

  // then we can watch for changes to make sure update accordingly
  const tabObserver = new MutationObserver(() => {
    // console.log('tabObserver has been fired', e, tabParentDiv);
    // make sure the selected tab is active
    tabParentDiv.querySelectorAll('.tabbutton').forEach(i => i.setAttribute('aria-selected', false));
    tabParentDiv.querySelectorAll('.tabbutton-active').forEach(i => i.setAttribute('aria-selected', true));

    if (tabParentDiv.querySelector('.tabbutton-active').id.includes('controls')) {
      // accordion fix
      Array.from(document.querySelectorAll('td:first-of-type button')).forEach(i => {
        i.click();
      });

      // rename controls table to make more sense, only when there on re render
      if (
        document
          .querySelectorAll('.os-content')[2]
          .querySelector('.tabbutton-active')
          .getAttribute('id')
          .includes('controls') &&
        document.querySelector('.docblock-argstable')
      ) {
        const tableRows = document.querySelectorAll('tr');
        tableRows.forEach(tr => {
          const isSide = tr.getAttribute('title') && tr.getAttribute('title').substring(0, 4) === 'Side';
          if (isSide) {
            const newText = `Show ${tr.getAttribute('title').substring(4)}`;
            tr.setAttribute('title', newText);
            tr.querySelectorAll('button').forEach(b => (b.textContent = newText));
          }
        });
      }
    }
  });

  // watch for changes to addon tab classes
  tabObserver.observe(tabParentDiv, { childList: true, subtree: true, attributeFilter: ['class'] });
};

const watchNavTabs = () => {
  // when "Link to Canvas" is added, add listener so when clicked can reset tabindex
  const tabObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      Array.from(mutation.addedNodes).forEach(n => {
        n.addEventListener('keydown', handleKeyDown);
      });
    });
  });

  Array.from(document.querySelectorAll('#storybook-explorer-tree div div div')).forEach(i => {
    tabObserver.observe(i, { subtree: true, childList: true });
  });
};

const watchTableAccordion = () => {
  // changing this to panel-tab-content as it is always present
  const tableParentElement = document.querySelector('#panel-tab-content');

  const tableObserver = new MutationObserver(mutations => {
    // console.log('table accordion update fired', mutations);
    // we are only going to change what is needed, this helps us avoid an infinite loop
    mutations.forEach(mutation => {
      // console.log('watching table changes', mutation, mutation.target);
      if (
        mutation &&
        mutation.target &&
        mutation.target.nodeName === 'TR' &&
        mutation.target.getAttribute('title').substring(0, 4) === 'Side'
      ) {
        const first4 = mutation.target.getAttribute('title').substring(0, 4) === 'Side' ? 'Show' : 'Hide';
        mutation.target.setAttribute('title', `${first4}${mutation.target.getAttribute('title').substring(4)}`);
        mutation.target.querySelectorAll('button').forEach(b => {
          const oldText = b.textContent;
          b.textContent = `${first4}${oldText.substring(4)}`;
        });
      }
    });
  });

  // on the initial creation of this we need to observe the elements
  tableObserver.observe(tableParentElement, { subtree: true, attributeFilter: ['title'] });
};

const setRowsAndCells = () => {
  const observer = new MutationObserver(() => {
    Array.from(document.querySelectorAll('#storybook-explorer-tree div div div')).forEach(i => {
      i.setAttribute('role', 'row');
      // Introduction OR Initial Story "Link to Canvas" a tag
      if (i.querySelector('a:nth-child(2)')) {
        i.querySelector('a:nth-child(2)').addEventListener('keydown', handleKeyDown);
      }
    });
    Array.from(document.querySelectorAll('#storybook-explorer-tree div div div > a:first-child')).forEach(i => {
      i.setAttribute('role', 'cell');
      i.setAttribute('tabindex', '0');
      i.addEventListener('keydown', handleKeyDown);

      if (i.innerHTML.split('/svg>')[1] === 'Introduction') {
        i.setAttribute(
          'aria-label',
          `${i.innerHTML.split('/svg>')[1]} page for Visa Chart Components.
          Press Enter or Space key to view on canvas`
        );
      } else if (i.getAttribute(`data-parent-id`)) {
        i.setAttribute(
          'aria-label',
          `${i.getAttribute(`data-item-id`).split('--')[1]} example${' '}
          ${i
            .getAttribute(`data-parent-id`)
            .split('-')
            .join(' ')} component${' '}
          Press Enter or Space key to view on canvas`
        );
      }
      i.querySelector('svg').setAttribute('aria-hidden', true); // set all svg icons to be presentation
    });
    Array.from(document.querySelectorAll('#storybook-explorer-tree div div > button')).forEach(i =>
      i.classList.add('level1')
    );

    // remove storybook arrow navigation from tree elements
    // console.log('checking this', document.querySelector('#storybook-explorer-menu').querySelectorAll('a[data-highlightable=true]'));
    document
      .querySelector('#storybook-explorer-menu')
      .querySelectorAll('a[data-highlightable=true]')
      .forEach(i => i.setAttribute('data-highlightable', false));
    document
      .querySelector('#storybook-explorer-menu')
      .querySelectorAll('button[data-highlightable=true]')
      .forEach(i => i.setAttribute('data-highlightable', false));
    if (document.querySelector('#bar-chart--hidden')) {
      document.querySelector('#bar-chart--hidden').setAttribute('data-highlightable', true);
    }
  });
  // watch for stories added to DOM
  observer.observe(document.querySelector('#storybook-explorer-tree div div'), { childList: true });
};

addons.register('improve-a11y', api => {
  const emitter = addons.getChannel();
  emitter.on(DOCS_RENDERED, () => {
    // console.log('docs rendered')
    if (!hasExpanded) {
      setTimeout(api.expandAll, 1);
      hasExpanded = true;
    }
    // improveARIA();
    if (initialLoad) {
      makeH1();
      setNavAria();
      setAddonTabs();
      removeShortcutDropdown();
      removeSearch();
      createTree();
      setRowsAndCells();
      initialLoad = false;
    }
  });

  // story rendered fires on load and every story change
  // so no need for story changed vs rendered for what we need
  emitter.on(STORY_RENDERED, () => {
    // console.log('story rendered')
    if (!hasExpanded) {
      setTimeout(api.expandAll, 1);
      hasExpanded = true;
    }

    // code that runs on first update
    if (initialLoad) {
      // console.log('story loaded', initialLoad);
      makeH1();
      setNavAria();
      setAddonTabs();
      removeShortcutDropdown();
      removeSearch();
      createTree();
      setRowsAndCells();
      initialLoad = false;
    }

    if (initialStoryLoad) {
      watchTableAccordion();
      // function getKeyByValue(object, value) {
      //   return Object.keys(object).find(key => object[key].includes(value));
      // }
      // let sorted = Array.from(document.querySelectorAll('#panel-tab-content tbody tr')).sort((a, b) => {
      //   let A = a.querySelector('td span').textContent
      //   let B = b.querySelector('td span').textContent
      //   let A_Category = getKeyByValue(categories, A)
      //   let B_Category = getKeyByValue(categories, B)
      //   if (A.charAt(0) === A.charAt(0).toUpperCase() && B.charAt(0) === B.charAt(0).toUpperCase()) {
      //     if (A > B) return 1;
      //     if (A < B) return -1;
      //     return 0;
      //   } else if (A.charAt(0) === A.charAt(0).toUpperCase() && B.charAt(0) !== B.charAt(0).toUpperCase()) {
      //     if (A > B_Category) return 1;
      //     if (A < B_Category) return -1;
      //     return 0;
      //   } else if (A.charAt(0) !== A.charAt(0).toUpperCase() && B.charAt(0) === B.charAt(0).toUpperCase()) {
      //     if (A_Category > B) return 1;
      //     if (A_Category < B) return -1;
      //     return 0;
      //   } else {
      //     if (A_Category > B_Category) return 1;
      //     if (A_Category < B_Category) return -1;
      //     return 0;
      //   }
      // });

      // for (let i = 0; i < sorted.length; ++i) {
      //   document.querySelector('#panel-tab-content tbody').appendChild(sorted[i]);
      // }

      Array.from(document.querySelectorAll('td:first-of-type button')).forEach(i => {
        i.click();
      });
      initialStoryLoad = false;
    }

    // code that runs every update
    // collapse all of the accordions
    // console.log('story rendered');

    // remove tabindex from <a> on top tab list
    document
      .querySelectorAll('.os-content')[1]
      .querySelectorAll('a')
      .forEach(i => i.setAttribute('tabindex', -1));

    // rename controls table to make more sense, only when there on re render
    if (
      document
        .querySelectorAll('.os-content')[2]
        .querySelector('.tabbutton-active')
        .getAttribute('id')
        .includes('controls') &&
      document.querySelector('.docblock-argstable')
    ) {
      const tableRows = document.querySelectorAll('tr');
      tableRows.forEach(tr => {
        const isSide = tr.getAttribute('title') && tr.getAttribute('title').substring(0, 4) === 'Side';
        if (isSide) {
          const newText = `Show ${tr.getAttribute('title').substring(4)}`;
          tr.setAttribute('title', newText);
          tr.querySelectorAll('button').forEach(b => (b.textContent = newText));
        }
      });
    }

    // check for this on story render
    // if (document.querySelectorAll('.os-content')[1].querySelectorAll('a')[0].textContent === "Docs") {
    //   document.querySelectorAll('.os-content')[1].querySelectorAll('a')[0].remove();
    // }
  });

  emitter.on(STORY_CHANGED, () => {
    // console.log('story changed')
    if (!initialStoryLoad) {
      Array.from(document.querySelectorAll('td:first-of-type button')).forEach(i => {
        i.click();
      });
    }
  });
});
