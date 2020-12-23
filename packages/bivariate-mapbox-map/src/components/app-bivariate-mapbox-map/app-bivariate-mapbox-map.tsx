/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Element, h } from '@stencil/core';
import Utils from '@visa/visa-charts-utils';
// import 'core-js/features/symbol';
import '@visa/scatter-plot';

const { autoTextColor } = Utils;

@Component({
  tag: 'app-bivariate-mapbox-map',
  styleUrl: 'app-bivariate-mapbox-map.scss'
})
export class AppBivariateMapboxMap {
  @State() data: any = [];
  @State() mapboxToken: string = '';
  @State() pinnedIDs: any = ['94404'];
  @State() clickElements: any = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  @State() value: any = 0; // this is for handling value changes for button to control which dataset to send
  @State() hoveringElement: string = '';
  @State() pinStyle: any = { size: 20, overrideColor: '#F2B602' };
  @State() zoomThreshold: number = 10;
  @State() title: string = 'Mapbox Map';
  @State() subtitle: string = 'This is a custom mapbox component';
  @State() palette: string = 'bluePurple';
  @State() defaultColor: string = '#F7F7F7'; // '#FAF7FA'; // '#CCCCCC'
  @State() height: number = 500;
  @State() width: number = 1100;
  @State() stateTrigger: boolean = false;
  @State() lassos: any = {};
  @State() selection: any = [];
  @State() zipSelection: any = [];
  @State() bounds: any = [];
  @State() moveToToggle: boolean = false;
  @State() showMissingData: boolean = true;
  @State() showEmptyData: boolean = false;
  // @Event() updateComponent: EventEmitter;
  @State() msaMapData: any = [];
  @State() zipMapData: any = [];
  @State() zipDataPrepped: any = [];
  @State() decimatedZipData: any = [];
  @State() currentLassos: any = {};
  @State() randomPin: string = '39820';
  @State() savedLassos: any = {};
  @State() selected: number = 0;
  @State() showMe: boolean = false;
  @State() extents: any = {
    zip: {
      'Metric 2': {
        min: Infinity,
        max: 0
      },
      'Metric 1': {
        min: Infinity,
        max: 0
      }
    },
    msa: {
      'Metric 2': {
        min: Infinity,
        max: 0
      },
      'Metric 1': {
        min: Infinity,
        max: 0
      }
    }
  };
  @State() boundsHash: any = {
    msa: {},
    zip: {}
  };
  @State() currentCounts: any = {
    msa: 0,
    zip: 0
  };
  @State() bivariateTitles: any = {
    msa: [
      {
        colorKey: 6,
        color: '#be64ac',
        count: 0,
        metric1: 'High Metric 1',
        metric2: 'Low Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      },
      {
        colorKey: 7,
        color: '#8c62aa',
        count: 0,
        metric1: 'High Metric 1',
        metric2: 'Med Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      },
      {
        colorKey: 8,
        color: '#3b4994',
        count: 0,
        metric1: 'High Metric 1',
        metric2: 'High Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      },
      {
        colorKey: 3,
        color: '#dfb0d6',
        count: 0,
        metric1: 'Med Metric 1',
        metric2: 'Low Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      },
      {
        colorKey: 4,
        color: '#a5add3',
        count: 0,
        metric1: 'Med Metric 1',
        metric2: 'Med Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      },
      {
        colorKey: 5,
        color: '#5698b9',
        count: 0,
        metric1: 'Med Metric 1',
        metric2: 'High Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      },
      {
        colorKey: 0,
        color: '#e8e8e8',
        count: 0,
        metric1: 'Low Metric 1',
        metric2: 'Low Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      },
      {
        colorKey: 1,
        color: '#ace4e4',
        count: 0,
        metric1: 'Low Metric 1',
        metric2: 'Med Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      },
      {
        colorKey: 2,
        color: '#5ac8c8',
        count: 0,
        metric1: 'Low Metric 1',
        metric2: 'High Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      }
    ],
    zip: [
      {
        colorKey: 6,
        color: '#be64ac',
        count: 0,
        metric1: 'High Metric 1',
        metric2: 'Low Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      },
      {
        colorKey: 7,
        color: '#8c62aa',
        count: 0,
        metric1: 'High Metric 1',
        metric2: 'Med Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      },
      {
        colorKey: 8,
        color: '#3b4994',
        count: 0,
        metric1: 'High Metric 1',
        metric2: 'High Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      },
      {
        colorKey: 3,
        color: '#dfb0d6',
        count: 0,
        metric1: 'Med Metric 1',
        metric2: 'Low Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      },
      {
        colorKey: 4,
        color: '#a5add3',
        count: 0,
        metric1: 'Med Metric 1',
        metric2: 'Med Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      },
      {
        colorKey: 5,
        color: '#5698b9',
        count: 0,
        metric1: 'Med Metric 1',
        metric2: 'High Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      },
      {
        colorKey: 0,
        color: '#e8e8e8',
        count: 0,
        metric1: 'Low Metric 1',
        metric2: 'Low Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      },
      {
        colorKey: 1,
        color: '#ace4e4',
        count: 0,
        metric1: 'Low Metric 1',
        metric2: 'Med Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      },
      {
        colorKey: 2,
        color: '#5ac8c8',
        count: 0,
        metric1: 'Low Metric 1',
        metric2: 'High Metric 2',
        'Metric 1': {
          min: 0,
          max: 0
        },
        'Metric 2': {
          min: 0,
          max: 0
        }
      }
    ]
  };
  msaCustomers: string = 'http://localhost:3333/data/msaData.json';
  zipCustomers: string = 'http://localhost:3333/data/zipData.json';
  msaBoundaries: string = 'http://localhost:3333/data/msaBoundaries.json';
  zipBoundaries: string = 'http://localhost:3333/data/zipBoundaries.json';
  msaToZipBaseHref: string = 'http://localhost:3333/data/';

  msaDataPrepped: any = [];
  valueAccessors: any = ['Metric 1', 'Metric 2'];

  @Element()
  appEl: HTMLElement;

  componentWillLoad() {
    const msaPromise = this.get(this.msaCustomers).then(
      (response: string) => {
        return response;
      },
      error => {
        console.log('MSA Request Error', error);
      }
    );
    const zipPromise = this.get(this.zipCustomers).then(
      (response: string) => {
        return response;
      },
      error => {
        console.log('ZIP Request Error', error);
      }
    );
    const msaHashPromise = this.get(this.msaBoundaries).then(
      (response: string) => {
        return response;
      },
      error => {
        console.log('MSA Bounds Request Error', error);
      }
    );
    const zipHashPromise = this.get(this.zipBoundaries).then(
      (response: string) => {
        return response;
      },
      error => {
        console.log('ZIP Bounds Request Error', error);
      }
    );
    return Promise.all([msaPromise, zipPromise, msaHashPromise, zipHashPromise]).then(responses => {
      const msaResponse = responses[0] || '[]';
      const zipResponse = responses[1] || '[]';
      const msaHash = responses[2] || '[]';
      const zipHash = responses[3] || '[]';

      this.msaDataPrepped = JSON.parse(msaResponse);
      this.zipDataPrepped = JSON.parse(zipResponse);
      this.boundsHash.msa = JSON.parse(msaHash)[0];
      this.boundsHash.zip = JSON.parse(zipHash)[0];
      let msaI = 0;
      this.msaDataPrepped.forEach(msa => {
        msa.MapID = msa['MSA Id'];
        msa.Name = msa['MSA Name'];
        if (msaI % 13 === 0) {
          msa.cannotShow = true;
          msa['Metric 1'] = null;
          msa['Metric 2'] = null;
        }
        msaI++;
      });
      this.msaMapData = this.msaDataPrepped;
      let i = 0;
      const zipDecimation = [];
      this.zipDataPrepped.forEach(zip => {
        zip.MapID = zip.Zip;
        zip.Name = 'Belongs to MSA: ' + zip['MSA Name'];
        if (i % 13 === 0) {
          zip.cannotShow = true;
          zip['Metric 1'] = null;
          zip['Metric 2'] = null;
          zipDecimation.push(zip);
        }
        i++;
      });
      zipDecimation.push({ 'Metric 1': 0, 'Metric 2': 0 });
      this.zipMapData = this.zipDataPrepped;
      this.decimatedZipData = zipDecimation;
    });
  }

  // Demo Interactivity
  changeBivariate = e => {
    let tempState = [...this.clickElements];
    const value = parseInt(e.target.getAttribute('data-colorKey'), 10);
    const index = tempState.indexOf(value);
    if (tempState.length === 9) {
      tempState = [value];
    } else if (index > -1) {
      if (tempState.length === 1) {
        tempState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      } else {
        tempState.splice(index, 1);
      }
    } else {
      tempState.push(value);
    }
    this.clickElements = tempState;
    this.showMissingData = tempState.length === 9 ? true : false;
  };

  onHoverFunction = e => {
    const d = e.detail;
    // console.log('we made it to hover function!', e, d);
    this.hoveringElement = d[0] && d[0]['Name'] ? d[0]['Name'] : d[0] && d[0].MapID ? d[0].MapID : '';
  };

  onBivariateChangeFunction = e => {
    const d = e.detail;
    let i = 0;
    d.zip.forEach(cellData => {
      this.bivariateTitles.zip[i].count = cellData.count;
      this.bivariateTitles.zip[i]['Metric 1'] = cellData['Metric 1'];
      this.bivariateTitles.zip[i]['Metric 2'] = cellData['Metric 2'];
      i++;
    });
    i = 0;
    d.msa.forEach(cellData => {
      this.bivariateTitles.msa[i].count = cellData.count;
      this.bivariateTitles.msa[i]['Metric 1'] = cellData['Metric 1'];
      this.bivariateTitles.msa[i]['Metric 2'] = cellData['Metric 2'];
      i++;
    });
    this.extents.zip['Metric 2'].min = d.zip[6]['Metric 2'].min;
    this.extents.zip['Metric 1'].min = d.zip[6]['Metric 1'].min;
    this.extents.msa['Metric 2'].min = d.msa[6]['Metric 2'].min;
    this.extents.msa['Metric 1'].min = d.msa[6]['Metric 1'].min;
    this.extents.zip['Metric 2'].max = d.zip[2]['Metric 2'].max;
    this.extents.zip['Metric 1'].max = d.zip[2]['Metric 1'].max;
    this.extents.msa['Metric 2'].max = d.msa[2]['Metric 2'].max;
    this.extents.msa['Metric 1'].max = d.msa[2]['Metric 1'].max;
  };

  onClickFunction = e => {
    const d = e.detail;
    if (this.selection.length && d.msa.length && d.msa[0].MapID === this.selection[0].MapID) {
      if (this.bounds.length && this.moveToToggle) {
        this.bounds = [];
      }
      this.selection = [];
      this.selected = 0;
    } else if (d.msa[0]) {
      if (this.moveToToggle) {
        this.bounds = [this.boundsHash.msa[d.msa[0].MapID]];
      }
      this.selection = [d.msa[0]];
      this.selected = 1;
    }
    if (this.zipSelection.length && d.zip.length && d.zip[0].MapID === this.zipSelection[0].MapID) {
      if (this.bounds.length && this.moveToToggle) {
        this.bounds = [];
      }
      this.zipSelection = [];
      this.selected = 0;
    } else if (d.zip[0]) {
      if (this.moveToToggle) {
        this.bounds = [this.boundsHash.zip[d.zip[0].MapID]];
      }
      this.zipSelection = [d.zip[0]];
      this.selected = 1;
    }
  };

  get = url => {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('GET', url);
      request.onload = () => {
        if (request.status === 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      };
      request.onerror = () => {
        reject(Error('Request Failed'));
      };
      request.send();
    });
  };

  onMoveEndFunction = _ => {
    // log('we are in on move end function', d);
  };

  setToken = e => {
    const inputDOMObject = document.querySelector('#' + e.target.name);
    if (inputDOMObject && inputDOMObject['value']) {
      this.mapboxToken = inputDOMObject['value'];
    }
  };
  onSelectionFunction = e => {
    const d = e.detail;
    this.currentCounts[d.layer] = d.data.length;
    this.currentLassos = { ...d.lassoFilter };
    console.log('checking what is in selection', d);
  };

  changePins = _e => {
    const tempState = [...this.pinnedIDs];
    tempState.push(this.randomPin);
    this.randomPin = this.msaMapData[Math.floor(Math.random() * this.msaMapData.length)].MapID;
    this.pinnedIDs = tempState;
  };

  changeLayer = () => {
    this.stateTrigger = !this.stateTrigger;
    this.zoomThreshold = this.zoomThreshold ? 0 : 10;
  };

  loadLasso = () => {
    this.lassos = { ...this.savedLassos };
  };

  emptyLasso = () => {
    this.lassos = {};
  };

  saveLasso = () => {
    if (Object.keys(this.currentLassos).length) {
      this.savedLassos = { ...this.currentLassos };
    } else {
      alert('There must be a lasso visible in order to save one!');
    }
  };

  prepareTitle = cell => {
    const layer = this.zoomThreshold ? 'msa' : 'zip';
    let title = 'Count of ' + layer + 's: ';
    title += cell.count;
    title +=
      '\n' +
      cell.metric1 +
      (cell['Metric 1'].min !== cell['Metric 1'].max
        ? ' (' +
          Math.round(1000 * cell['Metric 1'].min) / 10 +
          '% - ' +
          Math.round(1000 * cell['Metric 1'].max) / 10 +
          '%)'
        : '');
    title +=
      '\n' +
      cell.metric2 +
      (cell['Metric 2'].min !== cell['Metric 2'].max
        ? ' (' +
          Math.round(1000 * cell['Metric 2'].min) / 10 +
          '% - ' +
          Math.round(1000 * cell['Metric 2'].max) / 10 +
          '%)'
        : '');
    return title;
  };

  resolveSearch = (bounds, apiData) => {
    this.zoomThreshold = 0;
    this.moveToToggle = true;
    this.bounds = [bounds];
    this.zipSelection = apiData;
    this.selected = this.zipSelection.length;
  };

  search = clickedResult => {
    if (clickedResult.layer === 'msa') {
      // we must do an api request for the zips
      this.get(this.msaToZipBaseHref + 'searchZips.json').then(
        (response: string) => {
          const zipResponse = JSON.parse(response || '[]');
          const zipsArray = [];
          zipResponse[0].results.forEach(zip => {
            zipsArray.push({ MapID: zip });
          });
          this.resolveSearch(this.boundsHash[clickedResult.layer][clickedResult.MapID], zipsArray);
          // return response;
        },
        error => {
          console.log('MSA Zips Array Request Error', error);
        }
      );
    } else {
      this.resolveSearch(this.boundsHash[clickedResult.layer][clickedResult.MapID], [clickedResult]);
    }
  };

  clearSelections = () => {
    this.selected = 0;
    this.zipSelection = [];
    this.selection = [];
  };

  generateCanvas = () => {
    (async () => {
      await customElements.whenDefined('bivariate-mapbox-map');
      const mapElement = document.querySelector('bivariate-mapbox-map');
      mapElement.generateCanvas().then(this.drawCanvas);
    })();
    // .then(object => {

    // });
  };

  generatePNG = () => {
    (async () => {
      await customElements.whenDefined('bivariate-mapbox-map');
      const mapElement = document.querySelector('bivariate-mapbox-map');
      mapElement.generateCanvas().then(this.drawPNG);
    })();
  };

  drawCanvas = canvas => {
    console.log('canvas data is ', canvas);
    document.body.appendChild(canvas);
    console.log('your application may safely print now');
  };

  drawPNG = canvas => {
    console.log('canvas data is ', canvas);
    const png = new Image();
    png.src = canvas.toDataURL();
    png.width = this.width;
    png.height = this.height;
    png.onload = () => {
      console.log('your application may safely print now');
    };
    document.body.appendChild(png);
  };

  render() {
    const layer = this.zoomThreshold ? 'msa' : 'zip';
    return (
      <div class="app-bivariate-mapbox-map">
        <div class="button-group">
          <br />
          <div class="row">
            <div class="col col-1">
              <span class="button-summary">Enter Mapbox Token:&nbsp;</span>
              <input id="mtoken" type="text" name="mtoken" />
              <button
                onClick={this.setToken}
                name="mtoken"
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#ECF6F7',
                  color: 'steelBlue'
                }}
              >
                Submit
              </button>
            </div>
          </div>
          <br />
          <div class="col col-1">
            <div>
              <span class="button-summary">Currently Viewing:&nbsp;</span>
              <button
                onClick={this.changeLayer}
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#ECF6F7',
                  color: 'steelBlue'
                }}
              >
                {this.zoomThreshold ? 'MSAs' : 'Zips'}
              </button>
            </div>
            <div>
              <span class="button-summary">Click-to-Move Feature is: </span>
              <button
                onClick={() => {
                  this.moveToToggle = !this.moveToToggle;
                }}
                style={{
                  cursor: 'pointer',
                  backgroundColor: `${this.moveToToggle ? 'steelBlue' : '#ECF6F7'}`,
                  color: `${this.moveToToggle ? 'white' : 'black'}`
                }}
              >
                {this.moveToToggle ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <div>
              <span class="button-summary">Show Missing Data?: </span>
              <button
                onClick={() => {
                  this.showMissingData = !this.showMissingData;
                }}
                style={{
                  cursor: 'pointer',
                  backgroundColor: `${this.showMissingData ? 'steelBlue' : '#ECF6F7'}`,
                  color: `${this.showMissingData ? 'white' : 'black'}`
                }}
              >
                {this.showMissingData ? 'Yes' : 'No'}
              </button>
            </div>
            <div>
              <span class="button-summary">Show Empty Polygons?: </span>
              <button
                onClick={() => {
                  this.showEmptyData = !this.showEmptyData;
                }}
                style={{
                  cursor: 'pointer',
                  backgroundColor: `${this.showEmptyData ? 'steelBlue' : '#ECF6F7'}`,
                  color: `${this.showEmptyData ? 'white' : 'black'}`
                }}
              >
                {this.showEmptyData ? 'Yes' : 'No'}
              </button>
            </div>
            <div>
              <span class="button-summary">
                {Object.keys(this.currentLassos).length + ' Lassos Shown on the Map.'}&nbsp;
              </span>
              <button
                onClick={this.saveLasso}
                disabled={!Object.keys(this.currentLassos).length}
                style={{
                  backgroundColor: Object.keys(this.currentLassos).length ? '#ECF6F7' : '#757575',
                  color: Object.keys(this.currentLassos).length ? 'steelBlue' : 'black'
                }}
              >
                {!Object.keys(this.currentLassos).length
                  ? '(Create lassos to save them)'
                  : Object.keys(this.currentLassos).length === 1
                  ? 'Save shown lasso'
                  : 'Save all ' + Object.keys(this.currentLassos).length + ' lassos'}
              </button>
            </div>
            <div style={{ display: Object.keys(this.savedLassos).length ? 'block' : 'none' }}>
              <span class="button-summary">
                {Object.keys(this.savedLassos).length +
                  ' Lasso' +
                  (Object.keys(this.savedLassos).length === 1 ? '' : 's') +
                  ' Saved.'}
                &nbsp;
              </span>
              <button
                onClick={this.loadLasso}
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#ECF6F7',
                  color: Object.keys(this.savedLassos).length ? 'steelBlue' : 'black'
                }}
              >
                {!Object.keys(this.savedLassos).length
                  ? 'Load nothing (delete unsaved lassos)'
                  : Object.keys(this.savedLassos).length === 1
                  ? 'Load saved lasso'
                  : 'Load ' + Object.keys(this.savedLassos).length + ' saved lassos'}
              </button>
            </div>

            <div style={{ display: Object.keys(this.currentLassos).length ? 'block' : 'none' }}>
              <span class="button-summary">&nbsp;</span>
              <button
                onClick={this.emptyLasso}
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#ECF6F7',
                  color: 'steelBlue'
                }}
              >
                Delete lassos on map
              </button>
            </div>
            <div style={{ display: this.zoomThreshold ? 'block' : 'none' }}>
              <span class="button-summary">Pin this random MSA:</span>
              <button
                onClick={this.changePins}
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#ECF6F7',
                  color: 'steelBlue'
                }}
              >
                {this.randomPin}
              </button>
            </div>
          </div>
          <div class="col col-2">
            <div>
              <button
                onClick={() => {
                  this.showMe = !this.showMe;
                }}
                style={{
                  width: '160px',
                  cursor: 'pointer',
                  backgroundColor: '#ECF6F7',
                  color: 'steelBlue'
                }}
              >
                {this.showMe ? 'Hide the Data' : 'Show me the Data'}
              </button>
            </div>
            <div class="bivariate-key">
              {this.bivariateTitles[layer].map(cell => {
                return (
                  <button
                    onClick={this.changeBivariate}
                    data-colorKey={cell.colorKey}
                    title={this.prepareTitle(cell)}
                    style={{
                      margin: '0px',
                      cursor: 'pointer',
                      backgroundColor: `${this.clickElements.includes(cell.colorKey) ? cell.color : '#757575'}`,
                      color: `${this.clickElements.includes(cell.colorKey) ? autoTextColor(cell.color) : 'black'}`
                    }}
                  >
                    {' '}
                    {''}{' '}
                  </button>
                );
              })}
            </div>
            {this.showMe ? (
              <scatter-plot
                data={this.zoomThreshold ? this.msaMapData : this.zipMapData}
                mainTitle={''}
                subTitle={''}
                height={105}
                width={105}
                xMinValueOverride={this.extents[layer]['Metric 2'].min}
                xMaxValueOverride={this.extents[layer]['Metric 2'].max}
                yMinValueOverride={this.extents[layer]['Metric 1'].min}
                yMaxValueOverride={this.extents[layer]['Metric 1'].max}
                xAxis={{ visible: false, gridVisible: false, label: '', format: '0' }}
                yAxis={{ visible: false, gridVisible: false, label: '', format: '$0[a]' }}
                showTooltip={false}
                dotRadius={0.5}
                dotOpacity={0.7}
                colors={['black']}
                padding={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0
                }}
                margin={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0
                }}
                hoverOpacity={0.2}
                xAccessor={'Metric 2'}
                yAccessor={'Metric 1'}
                groupAccessor={'group'}
                legend={{ visible: false }}
                dataLabel={{ visible: false, placement: 'top', labelAccessor: 'value', format: '0.0[a]' }}
                accessibility={{
                  disableValidation: true,
                  hideDataTableButton: true
                }}
              />
            ) : null}
          </div>
          <div class="col col-3">
            <button
              onClick={this.generateCanvas}
              style={{
                cursor: 'pointer',
                backgroundColor: '#ECF6F7',
                color: 'steelBlue'
              }}
            >
              Generate Canvas
            </button>
            <button
              onClick={this.generatePNG}
              style={{
                cursor: 'pointer',
                backgroundColor: '#ECF6F7',
                color: 'steelBlue'
              }}
            >
              Generate PNG
            </button>
            <div style={{ fontSize: '14px', padding: '10px', paddingBottom: '0px' }}>
              <u>San Franci|_____________________</u>
            </div>
            <div
              style={{
                boxShadow: '0 4px 6px 0 rgba(32,33,36,0.28)',
                borderRadius: '0 0 12px 12px',
                padding: '10px',
                paddingTop: '0px'
              }}
            >
              <i>Results:</i>
              <div class="search-results">
                MSA: <b>San Franci</b>sco-Oakland-Hayward
                <span>
                  <button
                    onClick={() => {
                      this.search({
                        layer: 'msa',
                        Name: 'San Francisco-Oakland-Hayward',
                        MapID: '41860'
                      });
                    }}
                    style={{
                      marginLeft: '15px',
                      cursor: 'pointer',
                      backgroundColor: '#ECF6F7',
                      color: 'steelBlue',
                      padding: '5px'
                    }}
                  >
                    Go Here
                  </button>
                </span>
              </div>
              <div class="search-results">
                Zip: 94114 (in <b>San Franci</b>sco-Oaklan...)
                <span>
                  <button
                    onClick={() => {
                      this.search({
                        layer: 'zip',
                        Name: '94114',
                        MapID: '94114'
                      });
                    }}
                    style={{
                      marginLeft: '16px',
                      cursor: 'pointer',
                      backgroundColor: '#ECF6F7',
                      color: 'steelBlue',
                      padding: '5px'
                    }}
                  >
                    Go Here
                  </button>
                </span>
              </div>
            </div>
            <div style={{ display: this.selected ? 'block' : 'none', paddingTop: '10px' }}>
              <span class="button-summary">
                {this.selected +
                  (this.zoomThreshold ? ' Msa' : ' Zip') +
                  (this.selected === 1 ? '' : 's') +
                  ' Selected'}
              </span>
              <button
                onClick={this.clearSelections}
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#ECF6F7',
                  color: 'steelBlue'
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        {this.mapboxToken && this.mapboxToken.length > 10 && this.mapboxToken.substr(0, 3) === 'pk.' ? (
          <bivariate-mapbox-map
            mainTitle={this.title}
            subTitle={
              'Currently showing ' +
              this.currentCounts[layer] +
              ' out of ' +
              (this.zoomThreshold ? this.msaMapData.length : this.zipMapData.length) +
              (' ' + layer + ' (') +
              Math.round(
                1000 *
                  (this.currentCounts[layer] / (this.zoomThreshold ? this.msaMapData.length : this.zipMapData.length))
              ) /
                10 +
              '%)'
            }
            selectMSAs={this.selection}
            selectZips={this.zipSelection}
            token={this.mapboxToken}
            width={this.width}
            height={this.height}
            colorPalette={this.palette}
            onHoverFunc={this.onHoverFunction}
            onClickFunc={this.onClickFunction}
            onMoveEndFunc={this.onMoveEndFunction}
            onSelectionFunc={this.onSelectionFunction}
            onBinUpdateFunc={this.onBivariateChangeFunction}
            ordinalAccessor={'MapID'}
            ordinalNameAccessor={'Name'}
            valueAccessors={this.valueAccessors}
            bivariateFilter={this.clickElements}
            pinIDs={this.pinnedIDs}
            msaData={this.msaMapData}
            pinStyle={this.pinStyle}
            zipData={this.zipMapData}
            zoomThreshold={this.zoomThreshold}
            fitBounds={this.bounds}
            lassoData={this.lassos}
            preserveDrawingBuffer={true}
            noDataAccessor={'cannotShow'}
            noDataMessage={
              'Your filter combination is too restrictive. Please make some adjustments to selected filters.'
            }
            hideNoData={!this.showMissingData}
            showEmpty={this.showEmptyData}
            // showTooltip={false}
            defaultColor={this.defaultColor}
            tooltipLabel={{
              format: ['', '', '0.0', '0.0'],
              labelTitle: ['', 'Code', 'Metric 1', 'Metric 2'],
              labelAccessor: ['Name', 'MapID', 'Metric 1', 'Metric 2']
            }}
          />
        ) : null}
        <div>{this.hoveringElement ? 'Currently hovering on ' + this.hoveringElement : ''}</div>
      </div>
    );
  }
}
