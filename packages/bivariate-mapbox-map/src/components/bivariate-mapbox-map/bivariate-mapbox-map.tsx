/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Prop, Element, State, Watch, h, Method, Event, EventEmitter } from '@stencil/core';
import { IBivariateMapboxMapProps } from './bivariate-mapbox-map-props';
import { ITooltipLabelType } from '@visa/charts-types';
// import { BivariateMapboxMapDefaultValues } from './bivariate-mapbox-map-default-values';
import mapboxgl from 'mapbox-gl';

// tslint:disable-next-line:no-submodule-imports
import mapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import turf from '@turf/turf';
import { select } from 'd3-selection';
import { scaleQuantile } from 'd3-scale';
import { extent, range } from 'd3-array';
import { hsl } from 'd3-color';

import Utils from '@visa/visa-charts-utils';
const { pointsWithinPolygon, bbox, points, simplify } = turf;
const { formatDate, formatStats, /*mapButtons,*/ getLicenses } = Utils;

@Component({
  tag: 'bivariate-mapbox-map',
  styleUrls: ['bivariate-mapbox-map.scss', '../../../node_modules/mapbox-gl/dist/mapbox-gl.css', 'mapbox-gl-draw.css']
})
export class BivariateMapboxMap implements IBivariateMapboxMapProps {
  @Prop({ mutable: true }) height: any = 600;
  @Prop({ mutable: true }) width: any = 960;
  @Prop({ mutable: true }) token: string = '';
  @Prop({ mutable: true }) mainTitle: string;
  @Prop({ mutable: true }) subTitle: string;
  @Prop() ordinalAccessor: string;
  @Prop() ordinalNameAccessor: string;
  @Prop() valueAccessors: string[];
  @Prop() noDataAccessor: string;
  @Prop({ mutable: true }) noDataMessage: string = 'The data for this area cannot be displayed';
  @Prop({ mutable: true }) hideNoData: boolean = false;
  @Prop() msaData: object[] = [];
  @Prop() zipData: object[] = [];
  @Prop() lassoData: any = {};
  @Prop() selectZips: any = [];
  @Prop() selectMSAs: any = [];
  @Prop() fitBounds: any = [];
  @Prop({ mutable: true }) zoomThreshold: number = 6.5;
  @Prop() preserveDrawingBuffer: boolean = false;

  // Tooltip
  @Prop({ mutable: true }) showTooltip: boolean = true;
  @Prop({ mutable: true }) tooltipLabel: ITooltipLabelType;

  // Style
  @Prop({ mutable: true }) showEmpty: boolean = false;
  @Prop({ mutable: true }) patternImage: string = 'newPatternDense';
  @Prop({ mutable: true }) defaultColor: string = '#cccccc';
  @Prop({ mutable: true }) colorPalette: string = 'redBlue';
  @Prop({ mutable: true }) pinStyle: any = {
    size: 10,
    overrideColor: null
  };

  // Interactivity (7/7)
  @Event() selectionFunc: EventEmitter;
  @Event() clickFunc: EventEmitter;
  @Event() hoverFunc: EventEmitter;
  @Event() moveEndFunc: EventEmitter;
  @Event() binUpdateFunc: EventEmitter;
  @Prop({ mutable: true }) bivariateFilter: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  @Prop({ mutable: true }) pinIDs: any = [];

  // internal state for loading of large data status
  @State() isZipLoading: boolean = true;

  // Element
  @Element() mapboxEl: HTMLElement;
  svg: any;
  root: any;
  msaLayerID: string = 'cb_2018_us_cbsa_500k_prep';
  msaLoaded: boolean = false;
  msaCentroidID: string = 'cb_2018_us_cbsa_500k_centroid';
  msaCentroidLoaded: boolean = false;
  zipLayerID: string = 'cb_2018_us_zcta510_500k_prep';
  zipLoaded: boolean = false;
  zipCentroidID: string = 'cb_2018_us_zcta510_500k_centroid';
  zipCentroidLoaded: boolean = false;
  map: any;
  canvas: any;
  popup: any;
  features: any;
  start: any;
  current: any;
  box: any;
  bounds: any = [[-172.61742210829308, 15.894344794023453], [-32.073865958103, 71.48666602494595]];
  hawaiiBounds: any = [[-161.16958691011064, 18.417992778464622], [-153.83882259731274, 22.70653990552043]];
  alaskaBounds: any = [[-172.61742210829158, 50.98687301318617], [-101.44509971568216, 71.48666602495013]];
  puertoBounds: any = [[-71.67779719716903, 15.89434479401865], [-60.329678687514345, 22.586030955946995]];
  continentalBounds: any = [[-129.11813460082317, 19.87965176952433], [-65.13132904131496, 51.50235989647072]];
  draw: any;
  mapContainer: any;
  xScale: any;
  yScale: any;
  zipXScale: any;
  zipYScale: any;
  lassoCollection: any = {};
  oldZoom: number;
  zipColorShouldUpdate: boolean;
  msaColorShouldUpdate: boolean;
  msaScalesShouldUpdate: boolean;
  zipScalesShouldUpdate: boolean;
  pinsShouldUpdate: boolean;
  pinStyleShouldUpdate: boolean;
  sizeShouldUpdate: boolean;
  paletteShouldUpdate: boolean;
  patternImageShouldUpdate: boolean;
  defaultColorShouldUpdate: boolean;
  zoomShouldUpdate: boolean;
  lassosShouldUpdate: boolean;
  bivariateBins: any = { zip: [], msa: [] };
  msaBinCounted: boolean;
  zipBinCounted: boolean;
  binHash: any = {};
  selectZipHash: any = {};
  selectMSAHash: any = {};
  boundsHash: any = { zip: {}, msa: {} };
  boundsShouldUpdate: boolean;
  defaultBounds: any;
  patternImageDefault: string = this.patternImage;

  // http://www.joshuastevens.net/cartography/make-a-bivariate-choropleth-map/
  scaleSteps: number = 3;
  schemes: any = [
    {
      name: 'redBlue',
      colors: ['#e8e8e8', '#e4acac', '#c85a5a', '#b0d5df', '#ad9ea5', '#985356', '#64acbe', '#627f8c', '#574249']
    },
    {
      name: 'bluePurple',
      colors: ['#e8e8e8', '#ace4e4', '#5ac8c8', '#dfb0d6', '#a5add3', '#5698b9', '#be64ac', '#8c62aa', '#3b4994']
    },
    {
      name: 'greenBlue',
      colors: ['#e8e8e8', '#b5c0da', '#6c83b5', '#b8d6be', '#90b2b3', '#567994', '#73ae80', '#5a9178', '#2a5a5b']
    },
    {
      name: 'purpleOrange',
      colors: ['#e8e8e8', '#e4d9ac', '#c8b35a', '#cbb8d7', '#c8ada0', '#af8e53', '#9972af', '#976b82', '#804d36']
    }
  ];
  schemesIndex: number = 0;
  epsilon: number = 1e-6;

  @Method()
  async generateCanvas() {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      if (this.preserveDrawingBuffer) {
        const copy = new Image();
        // create fake canvas
        const ctx = canvas.getContext('2d');
        const scale = window.devicePixelRatio;
        canvas.style.width = this.width + 'px';
        canvas.style.height = this.height + 'px';
        canvas.width = this.width * scale;
        canvas.height = this.height * scale;
        this.map.once('render', () => {
          copy.src = this.map.getCanvas().toDataURL();
          copy.width = this.width;
          copy.height = this.height;
          copy.onload = () => {
            ctx.drawImage(copy, 0, 0, this.width * scale, this.height * scale);
            this.textbox(ctx, scale, canvas);
            this.logo(scale).then((logo: any) => {
              ctx.drawImage(logo.element, 5, canvas.height - logo.height - 5, logo.width, logo.height);
              resolve(canvas);
            });
          };
        });
        /* trigger render */
        this.map.setBearing(this.map.getBearing());
      } else {
        console.error(
          'PNG data cannot be generated unless component is instantiated with prop preserveDrawingBuffer set to true.'
        );
        resolve(canvas);
      }
    });
  }

  @Watch('preserveDrawingBuffer')
  bufferWatcher(_newVal, _oldVal) {
    console.error(
      'Change detected in prop preserveDrawingBuffer from value ' +
        _oldVal +
        ' to value ' +
        _newVal +
        '. This prop cannot be changed after component has loaded.'
    );
  }

  @Watch('token')
  tokenWatch(_newVal, _oldVal) {
    console.error(
      'Change detected in prop token from value ' +
        _oldVal +
        ' to value ' +
        _newVal +
        '. This prop cannot be changed after component has loaded.'
    );
  }

  @Watch('fitBounds')
  fitBoundsWatcher(_newVal, _oldVal) {
    this.boundsShouldUpdate = true;
  }

  @Watch('selectMSAs')
  selectMSAsWatcher(_newVal, _oldVal) {
    this.prepareSelectionHash('MSA');
    this.msaColorShouldUpdate = true;
  }

  @Watch('selectZips')
  selectZipsWatcher(_newVal, _oldVal) {
    this.prepareSelectionHash('Zip');
    this.zipColorShouldUpdate = true;
  }

  @Watch('bivariateFilter')
  bivariateWatcher(_newVal, _oldVal) {
    this.zipColorShouldUpdate = true;
    this.msaColorShouldUpdate = true;
  }

  @Watch('showEmpty')
  showEmptyWatcher(_newVal, _oldVal) {
    this.zipColorShouldUpdate = true;
    this.msaColorShouldUpdate = true;
  }

  @Watch('hideNoData')
  hideNoDataWatcher(_newVal, _oldVal) {
    this.zipColorShouldUpdate = true;
    this.msaColorShouldUpdate = true;
  }

  @Watch('colorPalette')
  paletteWatcher(_newVal, _oldVal) {
    this.paletteShouldUpdate = true;
    this.zipColorShouldUpdate = true;
    this.msaColorShouldUpdate = true;
  }

  @Watch('valueAccessors')
  valueWatcher(_newVal, _oldVal) {
    this.zipColorShouldUpdate = true;
    this.msaColorShouldUpdate = true;
    this.zipScalesShouldUpdate = true;
    this.msaScalesShouldUpdate = true;
  }

  @Watch('ordinalAccessor')
  ordinalWatcher(_newVal, _oldVal) {
    this.zipColorShouldUpdate = true;
    this.msaColorShouldUpdate = true;
  }

  @Watch('patternImage')
  patternImageWatcher(_newVal, _oldVal) {
    this.patternImageShouldUpdate = true;
  }

  @Watch('noDataAccessor')
  noDataWatcher(_newVal, _oldVal) {
    this.zipColorShouldUpdate = true;
    this.msaColorShouldUpdate = true;
  }

  @Watch('zoomThreshold')
  zoomWatcher(_newVal, _oldVal) {
    this.zoomShouldUpdate = true;
  }

  @Watch('msaData')
  msaDataWatcher(_newVal, _oldVal) {
    this.msaScalesShouldUpdate = true;
    this.msaColorShouldUpdate = true;
  }

  @Watch('zipData')
  zipDataWatcher(_newVal, _oldVal) {
    this.zipScalesShouldUpdate = true;
    this.zipColorShouldUpdate = true;
  }

  @Watch('lassoData')
  lassoDataWatcher(_newVal, _oldVal) {
    this.lassosShouldUpdate = true;
  }

  @Watch('pinIDs')
  pinWatcher(_newVal, _oldVal) {
    this.pinsShouldUpdate = true;
  }

  @Watch('pinStyle')
  pinStyleWatcher(_newVal, _oldVal) {
    this.pinStyleShouldUpdate = true;
  }

  @Watch('height')
  heightWatcher(_newVal, _oldVal) {
    this.sizeShouldUpdate = true;
  }

  @Watch('width')
  widthWatcher(_newVal, _oldVal) {
    this.sizeShouldUpdate = true;
  }

  @Watch('defaultColor')
  defaultColorWatcher(_newVal, _oldVal) {
    this.defaultColorShouldUpdate = true;
  }

  componentWillLoad() {
    mapboxgl.accessToken = this.token;
    this.height = this.height < 300 ? 300 : this.height;
    this.width = this.width < 350 ? 350 : this.width;
  }

  componentDidLoad() {
    this.setMSAScale();
    this.setZipScale();
    this.prepareSelectionHash('MSA');
    this.prepareSelectionHash('Zip');

    this.mapContainer = select(this.mapboxEl).select('#visa-viz-bivariate-mapbox-map');

    this.map = new mapboxgl.Map({
      container: 'visa-viz-bivariate-mapbox-map',
      style: 'mapbox://styles/visa-mapbox-svc/ck7lh8sbl0pms1inwybe2kasg',
      center: [-102.34564403319933, 51.33982905000914],
      // minZoom: 2,
      maxZoom: 10,
      // zoom:  2.263870193755123,
      maxBounds: this.bounds,
      attributionControl: false,
      preserveDrawingBuffer: this.preserveDrawingBuffer
      // trackResize: true
    });
    this.map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');
    this.popup = new mapboxgl.Popup({
      closeButton: false
    });
    // disable rotate for the map
    // disable map rotation using right click + drag
    this.map.dragRotate.disable();

    // disable map rotation using touch rotation gesture
    this.map.touchZoomRotate.disableRotation();

    // set scheme before loading map the first time
    this.setScheme();

    this.map.on('load', () => {
      // remove zoom effect on shift selection
      this.map.boxZoom.disable();

      this.canvas = this.map.getCanvasContainer();

      this.initLasso();

      this.map.addSource('msa-boundaries', {
        type: 'vector',
        url: 'mapbox://visa-mapbox-svc.2kuhbncz'
      });

      this.map.addSource('msa-centroids', {
        type: 'vector',
        url: 'mapbox://visa-mapbox-svc.dftnnw1f'
      });

      // add font icons to map 0xe55f = place icon from material icons
      const icon = String.fromCharCode(0xe55f);
      this.map.addLayer({
        id: 'msa-centroids-join',
        type: 'symbol',
        source: 'msa-centroids',
        'source-layer': this.msaCentroidID,
        maxzoom: this.zoomThreshold,
        layout: {
          'icon-optional': true,
          'text-line-height': 1,
          'text-padding': 0,
          'text-allow-overlap': true,
          'text-field': icon, // IMPORTANT SEE BELOW: -- this should be the unicode character you're trying to render as a string -- NOT the character code but the actual character,
          'text-font': ['Material Icons Regular'],
          visibility: this.zoomThreshold === 0 ? 'none' : 'visible',
          'text-size': typeof this.pinStyle.size === 'number' ? 24 * (this.pinStyle.size / 10) : 24
        },
        paint: {
          'text-translate': [0, -5],
          'text-opacity': 0,
          'text-halo-width': 0.2,
          'text-halo-color': 'black',
          'text-color': [
            'case',
            ['==', ['feature-state', 'isColored'], true],
            ['feature-state', 'color'],
            this.pinStyle.overrideColor ? this.pinStyle.overrideColor : 'white'
          ]
        }
      });

      this.map.addLayer(
        {
          id: 'msa-boundaries-highlight',
          type: 'fill',
          source: 'msa-boundaries',
          'source-layer': this.msaLayerID,
          maxzoom: this.zoomThreshold,
          filter: ['in', 'GEOID', ''],
          layout: {
            visibility: this.zoomThreshold === 0 ? 'none' : 'visible'
          },
          paint: {
            'fill-color': [
              'case',
              ['==', ['feature-state', 'isColored'], true],
              ['feature-state', 'color'],
              this.defaultColor
            ],
            'fill-outline-color': [
              'case',
              ['==', ['feature-state', 'isColored'], true],
              ['feature-state', 'lineColor'],
              hsl(this.defaultColor)
                .darker(1)
                .hex()
            ],
            'fill-opacity': 1
          }
        },
        'waterway-label'
      );

      this.map.addLayer(
        {
          id: 'msa-boundaries-highlight-pattern',
          type: 'fill',
          source: 'msa-boundaries',
          'source-layer': this.msaLayerID,
          maxzoom: this.zoomThreshold,
          filter: ['in', 'GEOID', ''],
          layout: {
            visibility: this.zoomThreshold === 0 ? 'none' : 'visible'
          },
          paint: {
            'fill-pattern': this.patternImage
          }
        },
        'msa-boundaries-highlight'
      );

      this.map.addLayer(
        {
          id: 'msa-boundaries-highlight-pattern-background',
          type: 'fill',
          source: 'msa-boundaries',
          'source-layer': this.msaLayerID,
          maxzoom: this.zoomThreshold,
          filter: ['in', 'GEOID', ''],
          layout: {
            visibility: this.zoomThreshold === 0 ? 'none' : 'visible'
          },
          paint: {
            'fill-color': this.defaultColor,
            'fill-opacity': 1,
            'fill-outline-color': hsl(this.defaultColor)
              .darker(1)
              .hex()
          }
        },
        'msa-boundaries-highlight-pattern'
      );

      this.map.addLayer(
        {
          id: 'msa-boundaries-join',
          type: 'fill',
          source: 'msa-boundaries',
          'source-layer': this.msaLayerID,
          maxzoom: this.zoomThreshold,
          layout: {
            visibility: this.zoomThreshold === 0 ? 'none' : 'visible'
          },
          paint: {
            'fill-color': [
              'case',
              ['==', ['feature-state', 'isColored'], true],
              ['feature-state', 'color'],
              this.defaultColor
            ],
            'fill-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              this.zoomThreshold < 1 ? 0 : this.zoomThreshold - 1,
              0.65,
              this.zoomThreshold < 1 ? this.epsilon : this.zoomThreshold,
              0.1
            ]
          }
        },
        'msa-boundaries-highlight-pattern-background'
      );

      this.map.addLayer(
        {
          id: 'msa-boundaries-join-pattern',
          type: 'fill',
          source: 'msa-boundaries',
          'source-layer': this.msaLayerID,
          maxzoom: this.zoomThreshold,
          layout: {
            visibility: this.zoomThreshold === 0 ? 'none' : 'visible'
          },
          paint: {
            'fill-pattern': this.patternImage,
            'fill-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              this.zoomThreshold < 1 ? 0 : this.zoomThreshold - 1,
              0.85,
              this.zoomThreshold < 1 ? this.epsilon : this.zoomThreshold,
              0.1
            ]
          }
        },
        'msa-boundaries-highlight-pattern'
      );

      this.map.addLayer(
        {
          id: 'msa-boundaries-join-pattern-background',
          type: 'fill',
          source: 'msa-boundaries',
          'source-layer': this.msaLayerID,
          maxzoom: this.zoomThreshold,
          layout: {
            visibility: this.zoomThreshold === 0 ? 'none' : 'visible'
          },
          paint: {
            'fill-color': this.defaultColor,
            'fill-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              this.zoomThreshold < 1 ? 0 : this.zoomThreshold - 1,
              0.85,
              this.zoomThreshold < 1 ? this.epsilon : this.zoomThreshold,
              0.1
            ],
            'fill-outline-color': hsl(this.defaultColor)
              .darker(1)
              .hex()
          }
        },
        'msa-boundaries-join-pattern'
      );

      this.map.addLayer(
        {
          id: 'msa-boundary-borders',
          type: 'line',
          source: 'msa-boundaries',
          'source-layer': this.msaLayerID,
          maxzoom: this.zoomThreshold,
          layout: {
            visibility: this.zoomThreshold === 0 ? 'none' : 'visible'
          },
          paint: {
            'line-color': [
              'case',
              ['==', ['feature-state', 'isColored'], true],
              ['feature-state', 'lineColor'],
              hsl(this.defaultColor)
                .darker(1)
                .hex()
            ],
            'line-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              this.zoomThreshold < 1 ? 0 : this.zoomThreshold - 1,
              0.75,
              this.zoomThreshold < 1 ? this.epsilon : this.zoomThreshold,
              0.15
            ],
            'line-width': 0.5
          }
        },
        'msa-boundaries-join-pattern-background'
      );

      this.map.addLayer(
        {
          id: 'msa-boundaries-grey',
          type: 'fill',
          source: 'msa-boundaries',
          'source-layer': this.msaLayerID,
          maxzoom: this.zoomThreshold,
          layout: {
            visibility: this.zoomThreshold === 0 ? 'none' : 'visible'
          },
          paint: {
            'fill-color': this.defaultColor,
            'fill-outline-color': hsl(this.defaultColor)
              .darker(1)
              .hex(),
            'fill-opacity': this.showEmpty
              ? [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  this.zoomThreshold < 1 ? 0 : this.zoomThreshold - 1,
                  0.65,
                  this.zoomThreshold < 1 ? this.epsilon : this.zoomThreshold,
                  0.1
                ]
              : this.epsilon
          }
        },
        'msa-boundaries-join'
      );

      this.map.addSource('zip-boundaries', {
        type: 'vector',
        url: 'mapbox://visa-mapbox-svc.8rdxcf6o'
      });

      this.map.addSource('zip-centroids', {
        type: 'vector',
        url: 'mapbox://visa-mapbox-svc.d1g34z82'
      });

      // add circles to the map (based on centroids)
      this.map.addLayer({
        id: 'zip-centroids-join',
        type: 'symbol',
        source: 'zip-centroids',
        'source-layer': this.zipCentroidID,
        minzoom: this.zoomThreshold,
        layout: {
          'icon-optional': true,
          'text-line-height': 1,
          'text-padding': 0,
          'text-allow-overlap': true,
          'text-field': icon, // IMPORTANT SEE BELOW: -- this should be the unicode character you're trying to render as a string -- NOT the character code but the actual character,
          'text-font': ['Material Icons Regular'],
          visibility: this.zoomThreshold === 10 ? 'none' : 'visible',
          'text-size': typeof this.pinStyle.size === 'number' ? 24 * (this.pinStyle.size / 10) : 24
        },
        paint: {
          'text-translate': [0, -5],
          'text-opacity': 0,
          'text-halo-width': 0.2,
          'text-halo-color': 'black',
          'text-color': [
            'case',
            ['==', ['feature-state', 'isColored'], true],
            ['feature-state', 'color'],
            this.pinStyle.overrideColor ? this.pinStyle.overrideColor : 'white'
          ]
        }
      });

      this.map.addLayer(
        {
          id: 'zip-boundaries-highlight',
          type: 'fill',
          source: 'zip-boundaries',
          'source-layer': this.zipLayerID,
          minzoom: this.zoomThreshold,
          layout: {
            visibility: this.zoomThreshold === 10 ? 'none' : 'visible'
          },
          filter: ['in', 'GEOID10', ''],
          paint: {
            'fill-color': [
              'case',
              ['==', ['feature-state', 'isColored'], true],
              ['feature-state', 'color'],
              this.defaultColor
            ],
            'fill-outline-color': [
              'case',
              ['==', ['feature-state', 'isColored'], true],
              ['feature-state', 'lineColor'],
              hsl(this.defaultColor)
                .darker(1)
                .hex()
            ],
            'fill-opacity': 1
          }
        },
        'msa-boundaries-grey'
      );

      this.map.addLayer(
        {
          id: 'zip-boundaries-highlight-pattern',
          type: 'fill',
          source: 'zip-boundaries',
          'source-layer': this.zipLayerID,
          minzoom: this.zoomThreshold,
          layout: {
            visibility: this.zoomThreshold === 10 ? 'none' : 'visible'
          },
          filter: ['in', 'GEOID10', ''],
          paint: {
            'fill-pattern': this.patternImage
          }
        },
        'zip-boundaries-highlight'
      );

      this.map.addLayer(
        {
          id: 'zip-boundaries-highlight-pattern-background',
          type: 'fill',
          source: 'zip-boundaries',
          'source-layer': this.zipLayerID,
          minzoom: this.zoomThreshold,
          layout: {
            visibility: this.zoomThreshold === 10 ? 'none' : 'visible'
          },
          filter: ['in', 'GEOID10', ''],
          paint: {
            'fill-color': this.defaultColor,
            'fill-opacity': 1,
            'fill-outline-color': hsl(this.defaultColor)
              .darker(1)
              .hex()
          }
        },
        'zip-boundaries-highlight-pattern'
      );

      this.map.addLayer(
        {
          id: 'zip-boundaries-join-pattern',
          type: 'fill',
          source: 'zip-boundaries',
          'source-layer': this.zipLayerID,
          minzoom: this.zoomThreshold,
          layout: {
            visibility: this.zoomThreshold === 10 ? 'none' : 'visible'
          },
          paint: {
            'fill-pattern': this.patternImage
          }
        },
        'zip-boundaries-highlight-pattern-background'
      );

      this.map.addLayer(
        {
          id: 'zip-boundaries-join-pattern-background',
          type: 'fill',
          source: 'zip-boundaries',
          'source-layer': this.zipLayerID,
          minzoom: this.zoomThreshold,
          layout: {
            visibility: this.zoomThreshold === 10 ? 'none' : 'visible'
          },
          paint: {
            'fill-color': this.defaultColor,
            'fill-opacity': 1,
            'fill-outline-color': hsl(this.defaultColor)
              .darker(1)
              .hex()
          }
        },
        'zip-boundaries-join-pattern'
      );

      this.map.addLayer(
        {
          id: 'zip-boundaries-join',
          type: 'fill',
          source: 'zip-boundaries',
          'source-layer': this.zipLayerID,
          layout: {
            visibility: this.zoomThreshold === 10 ? 'none' : 'visible'
          },
          minzoom: this.zoomThreshold,
          paint: {
            'fill-color': [
              'case',
              ['==', ['feature-state', 'isColored'], true],
              ['feature-state', 'color'],
              this.defaultColor
            ],
            'fill-outline-color': [
              'case',
              ['==', ['feature-state', 'isColored'], true],
              ['feature-state', 'lineColor'],
              hsl(this.defaultColor)
                .darker(1)
                .hex()
            ],
            'fill-opacity': ['interpolate', ['linear'], ['zoom'], this.zoomThreshold, 0.1, this.zoomThreshold + 1, 0.65]
          }
        },
        'zip-boundaries-join-pattern-background'
      );

      this.map.addLayer(
        {
          id: 'zip-boundary-borders',
          type: 'line',
          source: 'zip-boundaries',
          'source-layer': this.zipLayerID,
          layout: {
            visibility: this.zoomThreshold === 10 ? 'none' : 'visible'
          },
          minzoom: this.zoomThreshold,
          paint: {
            'line-color': [
              'case',
              ['==', ['feature-state', 'isColored'], true],
              ['feature-state', 'lineColor'],
              hsl(this.defaultColor)
                .darker(1)
                .hex()
            ],
            'line-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              this.zoomThreshold,
              0.15,
              this.zoomThreshold + 1,
              0.75
            ],
            'line-width': 0.5
          }
        },
        'zip-boundaries-join-pattern-background'
      );

      this.map.addLayer(
        {
          id: 'zip-boundaries-grey',
          type: 'fill',
          source: 'zip-boundaries',
          'source-layer': this.zipLayerID,
          minzoom: this.zoomThreshold,
          layout: {
            visibility: this.zoomThreshold === 10 ? 'none' : 'visible'
          },
          paint: {
            'fill-color': this.defaultColor,
            'fill-outline-color': hsl(this.defaultColor)
              .darker(1)
              .hex(),
            'fill-opacity': this.showEmpty
              ? ['interpolate', ['linear'], ['zoom'], this.zoomThreshold, 0.15, this.zoomThreshold + 1, 0.65]
              : this.epsilon
          }
        },
        'zip-boundaries-join'
      );

      // now that we have added layers on load, we need to also add event listeners for interactivity
      if (this.map.isSourceLoaded('msa-boundaries')) {
        // reset colors for msas
        this.setMSAColor();
        this.joinLassoData();
      } else {
        this.map.on('sourcedata', this.setAfterLoad);
      }

      if (this.map.isSourceLoaded('msa-centroids')) {
        this.setMSAPins();
      } else {
        this.map.on('sourcedata', this.setAfterLoad);
      }

      if (this.map.isSourceLoaded('zip-boundaries')) {
        this.setZIPColor();
        this.joinLassoData();
      } else {
        this.map.on('sourcedata', this.setZipAfterLoad);
      }

      if (this.map.isSourceLoaded('zip-centroids')) {
        this.setZipPins();
      } else {
        this.map.on('sourcedata', this.setZipAfterLoad);
      }
    });

    this.map.on('zoomend', e => {
      const newZoom = this.map.getZoom();
      this.map.zoomEnded = true;
      if (this.map.startZoom < this.zoomThreshold && newZoom >= this.zoomThreshold) {
        this.setZipPins();
        if (Object.keys(this.lassoCollection).length) {
          this.updateAllLassos();
        }
      } else if (this.map.startZoom > this.zoomThreshold && newZoom <= this.zoomThreshold) {
        this.setMSAPins();
        if (Object.keys(this.lassoCollection).length) {
          this.updateAllLassos();
        }
      }
      this.moveEndFunc.emit({
        e,
        zoom: this.map.getZoom(),
        bounds: this.map.getBounds(),
        center: this.map.getCenter()
      });
    });

    this.map.on('zoomstart', _ => {
      this.oldZoom = this.map.getZoom();
      if (!(this.map.zoomEnded === false)) {
        this.map.startZoom = this.map.getZoom();
        this.map.zoomEnded = false;
      }
    });
    this.map.on('dragend', e => {
      this.moveEndFunc.emit({
        e,
        zoom: this.map.getZoom(),
        bounds: this.map.getBounds(),
        center: this.map.getCenter()
      });
    });

    // interactivity event listeners
    // set a global click to reset (overridden by layer specific one below)
    // this is better than layer specific ones because it can do all layers together and handle null click
    this.map.on('click', e => {
      // when we have a click that is not on one of the layers return null to callback functions
      const msaFeatureData = this.map.queryRenderedFeatures(e.point, {
        layers: ['msa-boundaries-join', 'msa-boundaries-join-pattern']
      });
      const zipFeatureData = this.map.queryRenderedFeatures(e.point, {
        layers: ['zip-boundaries-join', 'zip-boundaries-join-pattern']
      });
      this.onClickHandler({
        msa: msaFeatureData.length ? msaFeatureData : null,
        zip: zipFeatureData.length ? zipFeatureData : null
      });
    });

    // we will need to do something like this to make sure the user knows they can click
    this.map.on('mouseenter', 'msa-boundaries-join', e => {
      const featureData = this.map.queryRenderedFeatures(e.point, { layers: ['msa-boundaries-join'] });
      if (featureData.length > 0) {
        this.map.getCanvas().style.cursor = 'pointer';
        this.onHoverHandler(featureData);
      }
    });

    this.map.on('mouseenter', 'msa-boundaries-join-pattern', e => {
      const featureData = this.map.queryRenderedFeatures(e.point, { layers: ['msa-boundaries-join-pattern'] });
      if (featureData.length > 0) {
        this.map.getCanvas().style.cursor = 'pointer';
        this.onHoverHandler(featureData);
      }
    });

    this.map.on('mouseenter', 'zip-boundaries-join', e => {
      const featureData = this.map.queryRenderedFeatures(e.point, { layers: ['zip-boundaries-join'] });
      if (featureData.length > 0) {
        this.map.getCanvas().style.cursor = 'pointer';
        this.onHoverHandler(featureData);
      }
    });

    this.map.on('mouseenter', 'zip-boundaries-join-pattern', e => {
      const featureData = this.map.queryRenderedFeatures(e.point, { layers: ['zip-boundaries-join-pattern'] });
      if (featureData.length > 0) {
        this.map.getCanvas().style.cursor = 'pointer';
        this.onHoverHandler(featureData);
      }
    });

    this.map.on('mousemove', 'msa-boundaries-join', this.msaTooltipHandler);
    this.map.on('mousemove', 'msa-boundaries-join-pattern', this.msaTooltipHandler);
    this.map.on('mousemove', 'zip-boundaries-join', this.zipTooltipHandler);
    this.map.on('mousemove', 'zip-boundaries-join-pattern', this.zipTooltipHandler);

    this.map.on('mouseleave', 'msa-boundaries-join', () => {
      this.map.getCanvas().style.cursor = '';
      this.popup.remove();
      this.onHoverHandler(null);
    });

    this.map.on('mouseleave', 'msa-boundaries-join-pattern', () => {
      this.map.getCanvas().style.cursor = '';
      this.popup.remove();
      this.onHoverHandler(null);
    });

    this.map.on('mouseleave', 'zip-boundaries-join', () => {
      this.map.getCanvas().style.cursor = '';
      this.popup.remove();
      this.onHoverHandler(null);
    });

    this.map.on('mouseleave', 'zip-boundaries-join-pattern', () => {
      this.map.getCanvas().style.cursor = '';
      this.popup.remove();
      this.onHoverHandler(null);
    });

    this.processBounds();
  }

  componentDidUpdate() {
    let shouldEmitBinUpdate = false;
    if (this.sizeShouldUpdate) {
      this.height = this.height < 300 ? 300 : this.height;
      this.width = this.width < 350 ? 350 : this.width;
      this.map.resize();
      this.sizeShouldUpdate = false;
    }
    if (this.zoomShouldUpdate) {
      this.updateZoomThreshold();
    }
    if (this.defaultColorShouldUpdate) {
      this.updateDefaultColor();
      this.defaultColorShouldUpdate = false;
    }
    if (this.patternImageShouldUpdate) {
      this.updatePatternImage();
      this.patternImageShouldUpdate = false;
    }
    if (this.msaScalesShouldUpdate) {
      this.setMSAScale();
      shouldEmitBinUpdate = true;
      this.msaScalesShouldUpdate = false;
    }
    if (this.zipScalesShouldUpdate) {
      this.setZipScale();
      shouldEmitBinUpdate = true;
      this.zipScalesShouldUpdate = false;
    }
    if (this.paletteShouldUpdate) {
      this.setScheme();
      this.paletteShouldUpdate = false;
    }
    if (this.lassosShouldUpdate) {
      this.joinLassoData();
      this.lassosShouldUpdate = false;
    }
    if (this.zipColorShouldUpdate || shouldEmitBinUpdate) {
      this.setZIPColor();
      this.zipColorShouldUpdate = false;
    }
    if (this.msaColorShouldUpdate || shouldEmitBinUpdate) {
      this.setMSAColor();
      this.msaColorShouldUpdate = false;
    }
    if (shouldEmitBinUpdate || this.zoomShouldUpdate) {
      const shouldLasso = this.zoomShouldUpdate;
      this.zoomShouldUpdate = false;
      this.map.once('idle', () => {
        if (shouldEmitBinUpdate) {
          this.binUpdateHandler();
        }
        if (shouldLasso && Object.keys(this.lassoCollection).length) {
          this.updateAllLassos();
        }
      });
    }
    if (this.pinsShouldUpdate) {
      this.setMSAPins();
      this.setZipPins();
      this.pinsShouldUpdate = false;
    }
    if (this.pinStyleShouldUpdate) {
      this.updatePinStyles();
      this.pinStyleShouldUpdate = false;
    }
    if (this.boundsShouldUpdate) {
      this.processBounds();
      this.boundsShouldUpdate = false;
    }
  }

  msaTooltipHandler = e => {
    this.tooltipListener(e);
  };

  zipTooltipHandler = e => {
    this.tooltipListener(e);
  };

  tooltipListener = e => {
    this.map.getCanvas().style.cursor = 'pointer';
    if (this.showTooltip) {
      this.buildTooltip(e);
    }
  };

  // this is not dynamic enough yet, but a good start in terms that it is functioning
  // mapbox.popup() reference => https://docs.mapbox.com/mapbox-gl-js/api/#popup
  buildTooltip = e => {
    // Populate the popup and set its coordinates based on the feature.
    const feature = e.features[0];
    let labelStr = '';

    if (feature.state.data) {
      if (
        feature.state.data[this.noDataAccessor] ||
        (!feature.state.data[this.valueAccessors[0]] && feature.state.data[this.valueAccessors[0]] !== 0) ||
        (!feature.state.data[this.valueAccessors[1]] && feature.state.data[this.valueAccessors[1]] !== 0)
      ) {
        const ordinalNameString = this.ordinalNameAccessor
          ? `<strong> ${feature.state.data[this.ordinalNameAccessor]} (${
              feature.state.data[this.ordinalAccessor]
            }) </strong>`
          : `<strong> ${feature.state.data[this.ordinalAccessor]} </strong>`;
        labelStr = `${ordinalNameString} <br />
        <p> ${this.noDataMessage} </p>`;
      } else if (this.tooltipLabel) {
        this.tooltipLabel.labelAccessor.map((k, i) => {
          const title = this.tooltipLabel.labelTitle[i] !== '' ? this.tooltipLabel.labelTitle[i] + ': ' : '';
          labelStr += `<p> ${title}${
            this.tooltipLabel.format[i]
              ? feature.state.data[k] instanceof Date
                ? formatDate({
                    date: feature.state.data[k],
                    format: this.tooltipLabel.format[i],
                    offsetTimezone: true
                  })
                : !isNaN(parseFloat(feature.state.data[k]))
                ? formatStats(feature.state.data[k], this.tooltipLabel.format[i])
                : feature.state.data[k]
              : feature.state.data[k]
          } </p> `;
        });
        labelStr.replace(',', '');
      } else {
        labelStr = `<strong> ${feature.state.data[this.ordinalNameAccessor]} (${
          feature.state.data[this.ordinalAccessor]
        }) </strong>
          <p> ${this.valueAccessors[0]}: ${feature.state.data[this.valueAccessors[0]]} </p>
          <p> ${this.valueAccessors[1]}: ${feature.state.data[this.valueAccessors[1]]} </p>`;
      }
      this.popup
        .setLngLat(e.lngLat)
        .setHTML('<div id="msa-boundary-join-mapbox-popup" class="popup">' + labelStr + '</div>')
        .addTo(this.map);
    }
  };

  // handle the selection and box highlight for feature selection
  // Return the xy coordinates of the mouse position
  mousePos = e => {
    const rect = this.canvas.getBoundingClientRect();
    return new mapboxgl.Point(
      e.clientX - rect.left - this.canvas.clientLeft,
      e.clientY - rect.top - this.canvas.clientTop
    );
  };

  // bivariate color
  setScheme = () => {
    this.schemesIndex = this.schemes.findIndex(s => s.name === this.colorPalette);
  };

  setMSAScale = () => {
    // prep color scales
    this.xScale = scaleQuantile()
      .domain(extent(this.msaData, d => d[this.valueAccessors[0]]))
      .range(range(this.scaleSteps));

    this.yScale = scaleQuantile()
      .domain(extent(this.msaData, d => d[this.valueAccessors[1]]))
      .range(range(this.scaleSteps));

    this.setBivariateBin('msa', 'xScale', 'yScale');
  };

  setZipScale = () => {
    // prep color scales
    this.zipXScale = scaleQuantile()
      .domain(extent(this.zipData, d => d[this.valueAccessors[0]]))
      .range(range(this.scaleSteps));

    this.zipYScale = scaleQuantile()
      .domain(extent(this.zipData, d => d[this.valueAccessors[1]]))
      .range(range(this.scaleSteps));

    this.setBivariateBin('zip', 'zipXScale', 'zipYScale');
  };

  prepareSelectionHash = (layer: string) => {
    this['select' + layer + 'Hash'] = {};
    this['select' + layer + 's'].forEach(item => {
      this['select' + layer + 'Hash'][item[this.ordinalAccessor]] = 1;
    });
  };

  binUpdateHandler() {
    this.binUpdateFunc.emit(this.bivariateBins);
  }

  setBivariateBin(bin, xScale, yScale) {
    this.bivariateBins[bin] = [];
    this.binHash = {};
    const xUnit = (this[xScale].domain()[1] - this[xScale].domain()[0]) / this.scaleSteps;
    const yUnit = (this[yScale].domain()[1] - this[yScale].domain()[0]) / this.scaleSteps;
    let xStep = this[xScale].domain()[1];
    let yStep = this[yScale].domain()[0];
    let i = 0;
    const x = this.valueAccessors[0];
    const y = this.valueAccessors[1];
    for (i = 0; i < this.scaleSteps; i++) {
      const xMin = xStep - xUnit;
      const xMax = xStep;
      let j = 0;
      for (j = 0; j < this.scaleSteps; j++) {
        // colorKey below is calculated at the middle of the bin
        // by adding half of a step to the min value for the current bin
        const item = {
          count: 0,
          colorKey: this[yScale](yStep + yUnit / 2) + this[xScale](xMin + xUnit / 2) * this.scaleSteps
        };
        item[x] = {
          min: xMin,
          max: xMax
        };
        item[y] = {
          min: yStep,
          max: yStep + yUnit
        };
        this.bivariateBins[bin].push(item);
        yStep += yUnit;
        this.binHash[item.colorKey] = i * this.scaleSteps + j;
      }
      yStep = this[yScale].domain()[0];
      xStep -= xUnit;
    }
    // the assumed render order for a bivariate key is:
    // [ 6, 7, 8,
    //   3, 4, 5,
    //   0, 1, 2 ]
    // this.binHash records the crosswalk between colorindex and index
    this[bin + 'BinCounted'] = false;
  }

  setMSAPins = () => {
    const msaPinFilter = ['in', 'GEOID'];
    if (this.map.getZoom() <= this.zoomThreshold) {
      msaPinFilter.push(...this.pinIDs);
      this.map.setPaintProperty('msa-centroids-join', 'text-opacity', 1);
      this.map.setFilter('msa-centroids-join', msaPinFilter);
    } else {
      this.map.setFilter('msa-centroids-join', ['in', 'GEOID']);
      this.map.setPaintProperty('msa-centroids-join', 'text-opacity', 0);
    }
  };

  setZipPins = () => {
    const zipPinFilter = ['in', 'GEOID10'];
    if (this.map.getZoom() > this.zoomThreshold) {
      zipPinFilter.push(...this.pinIDs);
      this.map.setPaintProperty('zip-centroids-join', 'text-opacity', 1);
      this.map.setFilter('zip-centroids-join', zipPinFilter);
    } else {
      this.map.setFilter('zip-centroids-join', ['in', 'GEOID10']);
      this.map.setPaintProperty('zip-centroids-join', 'text-opacity', 0);
    }
  };

  setMSAColor = async () => {
    await this.setMSAColorAsync();
  };

  setMSAColorAsync = () => {
    return new Promise(resolve => {
      const filter = ['in', 'GEOID'];
      const highlightFilter = ['in', 'GEOID'];
      const patternFilter = ['in', 'GEOID'];
      const patternHighlightFilter = ['in', 'GEOID'];
      const emitObject = []; // this.bivariateFilter.length < 9 ? [] : this.msaData;
      const keys = Object.keys(this.lassoCollection);
      this.msaData.map(d => {
        let included = false;
        const colorIndex =
          this.yScale(d[this.valueAccessors[1]]) + this.xScale(d[this.valueAccessors[0]]) * this.scaleSteps;
        if (!this.msaBinCounted) {
          this.bivariateBins.msa[this.binHash[colorIndex]].count++;
        }

        if (
          this.noDataAccessor &&
          d[this.noDataAccessor] &&
          (!Object.keys(this.selectMSAHash).length || this.selectMSAHash[d[this.ordinalAccessor]])
        ) {
          if (!this.hideNoData) {
            // we are only popoulating filter when they want to show no data
            patternFilter.push(d[this.ordinalAccessor]);

            let i = 0;
            const l = keys.length;
            if (l) {
              for (i = 0; i < l; i++) {
                if (
                  this.lassoCollection[keys[i]]['hash-msa'] &&
                  this.lassoCollection[keys[i]]['hash-msa'][d[this.ordinalAccessor]]
                ) {
                  emitObject.push(d);
                  patternHighlightFilter.push(d[this.ordinalAccessor]);
                  break;
                }
              }
            } else {
              emitObject.push(d);
            }
          }
        } else if (
          this.bivariateFilter.includes(colorIndex) &&
          (!Object.keys(this.selectMSAHash).length || this.selectMSAHash[d[this.ordinalAccessor]])
        ) {
          included = true;
          filter.push(d[this.ordinalAccessor]);

          let i = 0;
          const l = keys.length;
          if (l) {
            for (i = 0; i < l; i++) {
              if (
                this.lassoCollection[keys[i]]['hash-msa'] &&
                this.lassoCollection[keys[i]]['hash-msa'][d[this.ordinalAccessor]]
              ) {
                emitObject.push(d);
                highlightFilter.push(d[this.ordinalAccessor]);
                break;
              }
            }
          } else {
            emitObject.push(d);
          }
        }

        this.map.setFeatureState(
          {
            source: 'msa-boundaries',
            sourceLayer: this.msaLayerID,
            id: d[this.ordinalAccessor]
          },
          {
            isColored: true,
            color: this.schemes[this.schemesIndex].colors[
              this.yScale(d[this.valueAccessors[1]]) + this.xScale(d[this.valueAccessors[0]]) * this.scaleSteps
            ],
            lineColor: hsl(
              included
                ? this.schemes[this.schemesIndex].colors[
                    this.yScale(d[this.valueAccessors[1]]) + this.xScale(d[this.valueAccessors[0]]) * this.scaleSteps
                  ]
                : this.defaultColor
            )
              .darker(included ? 1.5 : 1)
              .hex(),
            data: d
          }
        );
        this.map.setFeatureState(
          {
            source: 'msa-centroids',
            sourceLayer: this.msaCentroidID,
            id: d[this.ordinalAccessor]
          },
          {
            isColored: this.pinStyle.overrideColor ? false : true,
            color: this.schemes[this.schemesIndex].colors[
              this.yScale(d[this.valueAccessors[1]]) + this.xScale(d[this.valueAccessors[0]]) * this.scaleSteps
            ],
            data: d
          }
        );
      });
      this.msaBinCounted = true;

      this.map.setFilter('msa-boundaries-join', filter);
      this.map.setFilter('msa-boundary-borders', filter);
      this.map.setFilter('msa-boundaries-highlight', highlightFilter);
      this.map.setFilter('msa-boundaries-join-pattern-background', patternFilter);
      this.map.setFilter('msa-boundaries-join-pattern', patternFilter);
      this.map.setFilter('msa-boundaries-highlight-pattern-background', patternHighlightFilter);
      this.map.setFilter('msa-boundaries-highlight-pattern', patternHighlightFilter);
      this.onSelectionHandler(emitObject, 'msa');

      if (highlightFilter.length === 2 && !keys.length) {
        // if we have no lasso'd features value we have to return to default opacity for join layer
        this.map.setPaintProperty('msa-boundaries-join', 'fill-opacity', [
          'interpolate',
          ['linear'],
          ['zoom'],
          this.zoomThreshold < 1 ? 0 : this.zoomThreshold - 1,
          0.65,
          this.zoomThreshold < 1 ? this.epsilon : this.zoomThreshold,
          0.1
        ]);
        this.map.setPaintProperty('msa-boundary-borders', 'line-opacity', [
          'interpolate',
          ['linear'],
          ['zoom'],
          this.zoomThreshold < 1 ? 0 : this.zoomThreshold - 1,
          0.75,
          this.zoomThreshold < 1 ? this.epsilon : this.zoomThreshold,
          0.15
        ]);
        this.map.setPaintProperty(
          'msa-boundaries-grey',
          'fill-opacity',
          this.showEmpty
            ? [
                'interpolate',
                ['linear'],
                ['zoom'],
                this.zoomThreshold < 1 ? 0 : this.zoomThreshold - 1,
                0.65,
                this.zoomThreshold < 1 ? this.epsilon : this.zoomThreshold,
                0.1
              ]
            : this.epsilon
        );
        this.map.setPaintProperty('msa-boundaries-join-pattern-background', 'fill-opacity', [
          'interpolate',
          ['linear'],
          ['zoom'],
          this.zoomThreshold < 1 ? 0 : this.zoomThreshold - 1,
          0.85,
          this.zoomThreshold < 1 ? this.epsilon : this.zoomThreshold,
          0.1
        ]);
        this.map.setPaintProperty('msa-boundaries-join-pattern', 'fill-opacity', [
          'interpolate',
          ['linear'],
          ['zoom'],
          this.zoomThreshold < 1 ? 0 : this.zoomThreshold - 1,
          0.85,
          this.zoomThreshold < 1 ? this.epsilon : this.zoomThreshold,
          0.1
        ]);
      } else {
        this.map.setPaintProperty('msa-boundaries-join', 'fill-opacity', 0.2);
        this.map.setPaintProperty('msa-boundary-borders', 'line-opacity', 0.1);
        this.map.setPaintProperty('msa-boundaries-join-pattern-background', 'fill-opacity', 0.2);
        this.map.setPaintProperty('msa-boundaries-join-pattern', 'fill-opacity', 0.2);
        this.map.setPaintProperty('msa-boundaries-grey', 'fill-opacity', this.showEmpty ? 0.2 : this.epsilon);
      }
      resolve('MSA mapping complete');
    });
  };

  // this is the first iteration of coloring at the zip level, it does everything at once and takes a really long time.
  setZIPColor = async () => {
    await this.setZIPColorAsync();
  };

  setZIPColorAsync = () => {
    // this.defaultMSAColor(true);
    return new Promise(resolve => {
      const filter = ['in', 'GEOID10'];
      const highlightFilter = ['in', 'GEOID10'];
      const patternFilter = ['in', 'GEOID10'];
      const patternHighlightFilter = ['in', 'GEOID10'];
      const emitObject = []; // this.bivariateFilter.length < 9 ? [] : this.zipData;
      const keys = Object.keys(this.lassoCollection);

      this.zipData.map(d => {
        let included = false;
        const colorIndex =
          this.zipYScale(d[this.valueAccessors[1]]) + this.zipXScale(d[this.valueAccessors[0]]) * this.scaleSteps;
        if (!this.zipBinCounted) {
          this.bivariateBins.zip[this.binHash[colorIndex]].count++;
        }

        if (
          this.noDataAccessor &&
          d[this.noDataAccessor] &&
          (!Object.keys(this.selectZipHash).length || this.selectZipHash[d[this.ordinalAccessor]])
        ) {
          if (!this.hideNoData) {
            // we are only popoulating filter when they want to show no data
            patternFilter.push(d[this.ordinalAccessor]);

            let i = 0;
            const l = keys.length;
            if (l) {
              for (i = 0; i < l; i++) {
                if (
                  this.lassoCollection[keys[i]]['hash-zip'] &&
                  this.lassoCollection[keys[i]]['hash-zip'][d[this.ordinalAccessor]]
                ) {
                  emitObject.push(d);
                  patternHighlightFilter.push(d[this.ordinalAccessor]);
                  break;
                }
              }
            } else {
              emitObject.push(d);
            }
          }
        } else if (
          this.bivariateFilter.includes(colorIndex) &&
          (!Object.keys(this.selectZipHash).length || this.selectZipHash[d[this.ordinalAccessor]])
        ) {
          included = true;
          filter.push(d[this.ordinalAccessor]);

          let i = 0;
          const l = keys.length;
          if (l) {
            for (i = 0; i < l; i++) {
              if (
                this.lassoCollection[keys[i]]['hash-zip'] &&
                this.lassoCollection[keys[i]]['hash-zip'][d[this.ordinalAccessor]]
              ) {
                emitObject.push(d);
                highlightFilter.push(d[this.ordinalAccessor]);
                break;
              }
            }
          } else {
            emitObject.push(d);
          }
        }

        this.map.setFeatureState(
          {
            source: 'zip-boundaries',
            sourceLayer: this.zipLayerID,
            id: d[this.ordinalAccessor]
          },
          {
            isColored: true,
            color: this.schemes[this.schemesIndex].colors[
              this.zipYScale(d[this.valueAccessors[1]]) + this.zipXScale(d[this.valueAccessors[0]]) * this.scaleSteps
            ],
            lineColor: hsl(
              included
                ? this.schemes[this.schemesIndex].colors[
                    this.zipYScale(d[this.valueAccessors[1]]) +
                      this.zipXScale(d[this.valueAccessors[0]]) * this.scaleSteps
                  ]
                : this.defaultColor
            )
              .darker(included ? 1.5 : 1)
              .hex(),
            data: d
          }
        );
        this.map.setFeatureState(
          {
            source: 'zip-centroids',
            sourceLayer: this.zipCentroidID,
            id: d[this.ordinalAccessor]
          },
          {
            isColored: this.pinStyle.overrideColor ? false : true,
            color: this.schemes[this.schemesIndex].colors[
              this.zipYScale(d[this.valueAccessors[1]]) + this.zipXScale(d[this.valueAccessors[0]]) * this.scaleSteps
            ],
            data: d
          }
        );
      });
      this.zipBinCounted = true;

      this.map.setFilter('zip-boundaries-join', filter);
      this.map.setFilter('zip-boundary-borders', filter);
      this.map.setFilter('zip-boundaries-highlight', highlightFilter);
      this.map.setFilter('zip-boundaries-join-pattern-background', patternFilter);
      this.map.setFilter('zip-boundaries-join-pattern', patternFilter);
      this.map.setFilter('zip-boundaries-highlight-pattern-background', patternHighlightFilter);
      this.map.setFilter('zip-boundaries-highlight-pattern', patternHighlightFilter);
      this.onSelectionHandler(emitObject, 'zip');

      if (highlightFilter.length === 2 && !keys.length) {
        // if we no longer have any selected value we have to return to default opacity for join layer
        this.map.setPaintProperty('zip-boundaries-join', 'fill-opacity', [
          'interpolate',
          ['linear'],
          ['zoom'],
          this.zoomThreshold,
          0.1,
          this.zoomThreshold + 1,
          0.65
        ]);
        this.map.setPaintProperty('zip-boundary-borders', 'line-opacity', [
          'interpolate',
          ['linear'],
          ['zoom'],
          this.zoomThreshold,
          0.15,
          this.zoomThreshold + 1,
          0.75
        ]);
        this.map.setPaintProperty(
          'zip-boundaries-grey',
          'fill-opacity',
          this.showEmpty
            ? ['interpolate', ['linear'], ['zoom'], this.zoomThreshold, 0.1, this.zoomThreshold + 1, 0.65]
            : this.epsilon
        );
        this.map.setPaintProperty('zip-boundaries-join-pattern-background', 'fill-opacity', [
          'interpolate',
          ['linear'],
          ['zoom'],
          this.zoomThreshold,
          0.1,
          this.zoomThreshold + 1,
          0.85
        ]);
        this.map.setPaintProperty('zip-boundaries-join-pattern', 'fill-opacity', [
          'interpolate',
          ['linear'],
          ['zoom'],
          this.zoomThreshold,
          0.1,
          this.zoomThreshold + 1,
          0.85
        ]);
      } else {
        this.map.setPaintProperty('zip-boundaries-join', 'fill-opacity', 0.2);
        this.map.setPaintProperty('zip-boundary-borders', 'line-opacity', 0.1);
        this.map.setPaintProperty('zip-boundaries-join-pattern-background', 'fill-opacity', 0.2);
        this.map.setPaintProperty('zip-boundaries-join-pattern', 'fill-opacity', 0.2);
        this.map.setPaintProperty('zip-boundaries-grey', 'fill-opacity', this.showEmpty ? 0.2 : this.epsilon);
      }
      resolve('zip mapping complete');
    });
  };

  updateDefaultColor = () => {
    this.map.setPaintProperty('msa-boundaries-highlight', 'fill-color', [
      'case',
      ['==', ['feature-state', 'isColored'], true],
      ['feature-state', 'color'],
      this.defaultColor
    ]);
    this.map.setPaintProperty('msa-boundaries-highlight', 'fill-outline-color', [
      'case',
      ['==', ['feature-state', 'isColored'], true],
      ['feature-state', 'lineColor'],
      hsl(this.defaultColor)
        .darker(1)
        .hex()
    ]);
    this.map.setPaintProperty('msa-boundaries-highlight-pattern-background', 'fill-color', this.defaultColor);
    this.map.setPaintProperty(
      'msa-boundaries-highlight-pattern-background',
      'fill-outline-color',
      hsl(this.defaultColor)
        .darker(1)
        .hex()
    );

    this.map.setPaintProperty('msa-boundaries-join-pattern-background', 'fill-color', this.defaultColor);
    this.map.setPaintProperty(
      'msa-boundaries-join-pattern-background',
      'fill-outline-color',
      hsl(this.defaultColor)
        .darker(1)
        .hex()
    );

    this.map.setPaintProperty('msa-boundaries-join', 'fill-color', [
      'case',
      ['==', ['feature-state', 'isColored'], true],
      ['feature-state', 'color'],
      this.defaultColor
    ]);
    this.map.setPaintProperty('msa-boundary-borders', 'line-color', [
      'case',
      ['==', ['feature-state', 'isColored'], true],
      ['feature-state', 'lineColor'],
      hsl(this.defaultColor)
        .darker(1)
        .hex()
    ]);
    this.map.setPaintProperty('msa-boundaries-grey', 'fill-color', this.defaultColor);
    this.map.setPaintProperty(
      'msa-boundaries-grey',
      'fill-outline-color',
      hsl(this.defaultColor)
        .darker(1)
        .hex()
    );

    this.map.setPaintProperty('zip-boundaries-highlight', 'fill-color', [
      'case',
      ['==', ['feature-state', 'isColored'], true],
      ['feature-state', 'color'],
      this.defaultColor
    ]);
    this.map.setPaintProperty('zip-boundaries-highlight', 'fill-outline-color', [
      'case',
      ['==', ['feature-state', 'isColored'], true],
      ['feature-state', 'lineColor'],
      hsl(this.defaultColor)
        .darker(1)
        .hex()
    ]);
    this.map.setPaintProperty('zip-boundaries-highlight-pattern-background', 'fill-color', this.defaultColor);
    this.map.setPaintProperty(
      'zip-boundaries-highlight-pattern-background',
      'fill-outline-color',
      hsl(this.defaultColor)
        .darker(1)
        .hex()
    );

    this.map.setPaintProperty('zip-boundaries-join-pattern-background', 'fill-color', this.defaultColor);
    this.map.setPaintProperty(
      'zip-boundaries-join-pattern-background',
      'fill-outline-color',
      hsl(this.defaultColor)
        .darker(1)
        .hex()
    );

    this.map.setPaintProperty('zip-boundaries-join', 'fill-color', [
      'case',
      ['==', ['feature-state', 'isColored'], true],
      ['feature-state', 'color'],
      this.defaultColor
    ]);
    this.map.setPaintProperty('zip-boundary-borders', 'line-color', [
      'case',
      ['==', ['feature-state', 'isColored'], true],
      ['feature-state', 'lineColor'],
      hsl(this.defaultColor)
        .darker(1)
        .hex()
    ]);
    this.map.setPaintProperty('zip-boundaries-grey', 'fill-color', this.defaultColor);
    this.map.setPaintProperty(
      'zip-boundaries-grey',
      'fill-outline-color',
      hsl(this.defaultColor)
        .darker(1)
        .hex()
    );
  };

  updatePatternImage = () => {
    if (!this.patternImage) {
      this.patternImage = this.patternImageDefault;
    }
    if (this.map.hasImage(this.patternImage)) {
      this.map.setPaintProperty('msa-boundaries-join-pattern', 'fill-pattern', this.patternImage);
      this.map.setPaintProperty('msa-boundaries-highlight-pattern', 'fill-pattern', this.patternImage);
      this.map.setPaintProperty('zip-boundaries-join-pattern', 'fill-pattern', this.patternImage);
      this.map.setPaintProperty('zip-boundaries-highlight-pattern', 'fill-pattern', this.patternImage);
    }
  };

  updatePinStyles = () => {
    this.map.setPaintProperty('msa-centroids-join', 'text-color', [
      'case',
      ['==', ['feature-state', 'isColored'], true],
      ['feature-state', 'color'],
      this.pinStyle.overrideColor ? this.pinStyle.overrideColor : 'white'
    ]);
    this.map.setLayoutProperty(
      'msa-centroids-join',
      'text-size',
      typeof this.pinStyle.size === 'number' ? 24 * (this.pinStyle.size / 10) : 24
    );
    this.map.setPaintProperty('zip-centroids-join', 'text-color', [
      'case',
      ['==', ['feature-state', 'isColored'], true],
      ['feature-state', 'color'],
      this.pinStyle.overrideColor ? this.pinStyle.overrideColor : 'white'
    ]);
    this.map.setLayoutProperty(
      'zip-centroids-join',
      'text-size',
      typeof this.pinStyle.size === 'number' ? 24 * (this.pinStyle.size / 10) : 24
    );
  };

  updateZoomThreshold = () => {
    // msa zoom threshold settings
    this.map.setLayerZoomRange('msa-centroids-join', 0, this.zoomThreshold);
    this.map.setLayoutProperty('msa-centroids-join', 'visibility', this.zoomThreshold === 0 ? 'none' : 'visible');

    this.map.setLayerZoomRange('msa-boundaries-highlight', 0, this.zoomThreshold);
    this.map.setLayoutProperty('msa-boundaries-highlight', 'visibility', this.zoomThreshold === 0 ? 'none' : 'visible');

    this.map.setLayerZoomRange('msa-boundaries-highlight-pattern', 0, this.zoomThreshold);
    this.map.setLayoutProperty(
      'msa-boundaries-highlight-pattern',
      'visibility',
      this.zoomThreshold === 0 ? 'none' : 'visible'
    );

    this.map.setLayerZoomRange('msa-boundaries-highlight-pattern-background', 0, this.zoomThreshold);
    this.map.setLayoutProperty(
      'msa-boundaries-highlight-pattern-background',
      'visibility',
      this.zoomThreshold === 0 ? 'none' : 'visible'
    );

    this.map.setLayerZoomRange('msa-boundaries-join-pattern', 0, this.zoomThreshold);
    this.map.setLayoutProperty(
      'msa-boundaries-join-pattern',
      'visibility',
      this.zoomThreshold === 0 ? 'none' : 'visible'
    );

    this.map.setLayerZoomRange('msa-boundaries-join-pattern-background', 0, this.zoomThreshold);
    this.map.setLayoutProperty(
      'msa-boundaries-join-pattern-background',
      'visibility',
      this.zoomThreshold === 0 ? 'none' : 'visible'
    );

    this.map.setLayerZoomRange('msa-boundaries-join', 0, this.zoomThreshold);
    this.map.setLayoutProperty('msa-boundaries-join', 'visibility', this.zoomThreshold === 0 ? 'none' : 'visible');
    this.map.setPaintProperty('msa-boundaries-join', 'fill-opacity', [
      'interpolate',
      ['linear'],
      ['zoom'],
      this.zoomThreshold < 1 ? 0 : this.zoomThreshold - 1,
      0.65,
      this.zoomThreshold < 1 ? this.epsilon : this.zoomThreshold,
      0.1
    ]);

    this.map.setLayerZoomRange('msa-boundary-borders', 0, this.zoomThreshold);
    this.map.setLayoutProperty('msa-boundary-borders', 'visibility', this.zoomThreshold === 0 ? 'none' : 'visible');
    this.map.setPaintProperty('msa-boundary-borders', 'line-opacity', [
      'interpolate',
      ['linear'],
      ['zoom'],
      this.zoomThreshold < 1 ? 0 : this.zoomThreshold - 1,
      0.75,
      this.zoomThreshold < 1 ? this.epsilon : this.zoomThreshold,
      0.15
    ]);

    this.map.setLayerZoomRange('msa-boundaries-grey', 0, this.zoomThreshold);
    this.map.setLayoutProperty('msa-boundaries-grey', 'visibility', this.zoomThreshold === 0 ? 'none' : 'visible');
    this.map.setPaintProperty(
      'msa-boundaries-grey',
      'fill-opacity',
      this.showEmpty
        ? [
            'interpolate',
            ['linear'],
            ['zoom'],
            this.zoomThreshold < 1 ? 0 : this.zoomThreshold - 1,
            0.65,
            this.zoomThreshold < 1 ? this.epsilon : this.zoomThreshold,
            0.1
          ]
        : this.epsilon
    );

    // zip zoom threshold settings
    this.map.setLayerZoomRange('zip-centroids-join', this.zoomThreshold, 10.1);
    this.map.setLayoutProperty('zip-centroids-join', 'visibility', this.zoomThreshold === 10 ? 'none' : 'visible');

    this.map.setLayerZoomRange('zip-boundaries-highlight', this.zoomThreshold, 10.1);
    this.map.setLayoutProperty(
      'zip-boundaries-highlight',
      'visibility',
      this.zoomThreshold === 10 ? 'none' : 'visible'
    );

    this.map.setLayerZoomRange('zip-boundaries-highlight-pattern', this.zoomThreshold, 10.1);
    this.map.setLayoutProperty(
      'zip-boundaries-highlight-pattern',
      'visibility',
      this.zoomThreshold === 10 ? 'none' : 'visible'
    );

    this.map.setLayerZoomRange('zip-boundaries-highlight-pattern-background', this.zoomThreshold, 10.1);
    this.map.setLayoutProperty(
      'zip-boundaries-highlight-pattern-background',
      'visibility',
      this.zoomThreshold === 10 ? 'none' : 'visible'
    );

    this.map.setLayerZoomRange('zip-boundaries-join-pattern', this.zoomThreshold, 10.1);
    this.map.setLayoutProperty(
      'zip-boundaries-join-pattern',
      'visibility',
      this.zoomThreshold === 10 ? 'none' : 'visible'
    );

    this.map.setLayerZoomRange('zip-boundaries-join-pattern-background', this.zoomThreshold, 10.1);
    this.map.setLayoutProperty(
      'zip-boundaries-join-pattern-background',
      'visibility',
      this.zoomThreshold === 10 ? 'none' : 'visible'
    );

    this.map.setLayerZoomRange('zip-boundaries-join', this.zoomThreshold, 10.1);
    this.map.setLayoutProperty('zip-boundaries-join', 'visibility', this.zoomThreshold === 10 ? 'none' : 'visible');
    this.map.setPaintProperty('zip-boundaries-join', 'fill-opacity', [
      'interpolate',
      ['linear'],
      ['zoom'],
      this.zoomThreshold,
      0.1,
      this.zoomThreshold + 1,
      0.65
    ]);

    this.map.setLayerZoomRange('zip-boundary-borders', this.zoomThreshold, 10.1);
    this.map.setLayoutProperty('zip-boundary-borders', 'visibility', this.zoomThreshold === 10 ? 'none' : 'visible');
    this.map.setPaintProperty('zip-boundary-borders', 'line-opacity', [
      'interpolate',
      ['linear'],
      ['zoom'],
      this.zoomThreshold,
      0.15,
      this.zoomThreshold + 1,
      0.75
    ]);

    this.map.setLayerZoomRange('zip-boundaries-grey', this.zoomThreshold, 10.1);
    this.map.setLayoutProperty('zip-boundaries-grey', 'visibility', this.zoomThreshold === 10 ? 'none' : 'visible');
    this.map.setPaintProperty(
      'zip-boundaries-grey',
      'fill-opacity',
      this.showEmpty
        ? ['interpolate', ['linear'], ['zoom'], this.zoomThreshold, 0.15, this.zoomThreshold + 1, 0.65]
        : this.epsilon
    );
  };

  setAfterLoad = _ => {
    if (this.map.isSourceLoaded('msa-boundaries')) {
      this.msaLoaded = true;
    }

    if (this.map.isSourceLoaded('msa-centroids')) {
      this.msaCentroidLoaded = true;
    }

    // we should be checking to see whether the two sources are independently loaded. however isSourceLoaded seems to be true only at the end.
    if (this.msaLoaded && this.msaCentroidLoaded) {
      this.setMSAColor();
      this.setMSAPins();
      this.joinLassoData();
      this.binUpdateHandler();
      this.map.off('sourcedata', this.setAfterLoad);
    }
  };

  setZipAfterLoad = _ => {
    if (this.map.isSourceLoaded('zip-boundaries')) {
      this.zipLoaded = true;
    }

    if (this.map.isSourceLoaded('zip-centroids')) {
      this.zipCentroidLoaded = true;
    }

    if (this.zipLoaded && this.zipCentroidLoaded) {
      this.setZIPColor();
      this.setZipPins();
      this.joinLassoData();
      this.binUpdateHandler();
      this.map.off('sourcedata', this.setZipAfterLoad);
    }
  };

  onHoverHandler = d => {
    const featureData = [];
    if (d) {
      d.map(innerD => {
        if (innerD.state.data) {
          featureData.push(innerD.state.data);
        }
      });
    }
    this.hoverFunc.emit(featureData);
  };

  onClickHandler = d => {
    const msaFeatureData = [];
    if (d.msa) {
      d.msa.map(innerD => {
        if (innerD.state.data) {
          msaFeatureData.push(innerD.state.data);
        }
      });
    }
    const zipFeatureData = [];
    if (d.zip) {
      d.zip.map(innerD => {
        if (innerD.state.data) {
          zipFeatureData.push(innerD.state.data);
        }
      });
    }
    if (msaFeatureData.length || zipFeatureData.length) {
      this.clickFunc.emit({
        msa: msaFeatureData,
        zip: zipFeatureData
      });
    }
  };

  onSelectionHandler = (d, layer) => {
    const output = {
      layer,
      colorFilter: [...this.bivariateFilter],
      lassoFilter: { ...this.lassoCollection },
      data: [...d]
    };
    this.selectionFunc.emit(output);
  };

  joinLassoData = () => {
    const oldKeys = Object.keys(this.lassoCollection);
    if (oldKeys.length) {
      this.draw.deleteAll();
    }
    this.lassoCollection = {};
    const keys = Object.keys(this.lassoData);
    const incomingData = { ...this.lassoData };
    if (keys.length) {
      keys.forEach(key => {
        this.lassoCollection[key] = incomingData[key];
      });
    }
    this.updateAllLassos();
  };

  updateAllLassos = () => {
    const keys = Object.keys(this.lassoCollection);
    let i = 0;
    for (i = 0; i < keys.length; i++) {
      if (!this.draw.get(keys[i])) {
        this.draw.add(this.lassoCollection[keys[i]]);
      }
      // this delay ensures that we only reset the color filter at the end
      const delay = i + 1 === keys.length ? false : true;
      this.updateLassoData(this.lassoCollection[keys[i]], true, delay);
    }
    if (!keys.length) {
      this.updateLassoData({ type: 'totalDeletion' }, false, false);
      this.toggleTrash({});
    }
  };

  toggleTrash = e => {
    select(this.mapboxEl)
      .select('.mapbox-gl-draw_trash')
      .classed('toggled-on', e.features && e.features.length);
  };

  updateLassoData = (e, isDatum, drawDelay) => {
    const layer = this.map.getZoom() >= this.zoomThreshold ? 'zip' : 'msa';
    if (e.type === 'draw.delete') {
      e.features.forEach(feature => {
        delete this.lassoCollection[feature.id];
      });
      select(this.mapboxEl)
        .select('.mapbox-gl-draw_trash')
        .classed('toggled-on', false);
    } else if (e.type !== 'totalDeletion') {
      const data = !isDatum ? e.features : [e];
      data.forEach(feature => {
        this.lassoCollection[feature.id] = {
          ...feature,
          bbox: bbox(feature)
        };
        if (!(isDatum && feature['hash-' + layer])) {
          this.setLassoFeatures(feature.id, layer);
        }
      });
    }
    if (!drawDelay) {
      const setColor = 'set' + layer.toUpperCase() + 'Color';
      this[setColor]();
    }
  };

  setLassoFeatures = (lassoID, layer) => {
    const newLasso = this.lassoCollection[lassoID];
    const geomExtrema = [
      this.map.project([newLasso.bbox[0], newLasso.bbox[1]]),
      this.map.project([newLasso.bbox[2], newLasso.bbox[3]])
    ];
    const geoID = layer === 'msa' ? 'GEOID' : 'GEOID10';
    const lassoFeatures = this.map.queryRenderedFeatures(geomExtrema, {
      layers: [layer + '-boundaries-grey']
    });
    newLasso['hash-' + layer] = {};
    if (lassoFeatures.length) {
      newLasso['lassoFeatures-' + layer] = [];
      newLasso['filter-' + layer] = lassoFeatures.reduce((memo, feature) => {
        if (feature.state.data) {
          if (feature.geometry.type === 'MultiPolygon') {
            let i = 0;
            for (i = 0; i < feature.geometry.coordinates.length; i++) {
              const featurePoints = points(feature.geometry.coordinates[i][0]);
              if (pointsWithinPolygon(featurePoints, newLasso).features.length) {
                if (!newLasso['hash-' + layer][feature.properties[geoID]]) {
                  newLasso['hash-' + layer][feature.properties[geoID]] = 1;
                  newLasso['lassoFeatures-' + layer].push(feature);
                  memo.push(feature.properties[geoID]);
                }
                break;
              }
            }
          } else {
            const featurePoints = points(feature.geometry.coordinates[0]);
            if (pointsWithinPolygon(featurePoints, newLasso).features.length) {
              if (!newLasso['hash-' + layer][feature.properties[geoID]]) {
                newLasso['hash-' + layer][feature.properties[geoID]] = 1;
                newLasso['lassoFeatures-' + layer].push(feature);
                memo.push(feature.properties[geoID]);
              }
            }
          }
        }
        return memo;
      }, []);
    }
  };

  processBounds = () => {
    const boxes = [];
    this.fitBounds.forEach(box => {
      boxes.push(turf.bboxPolygon(box));
    });
    const inputBounds = this.buildBounds(turf.featureCollection(boxes));
    this.resetBounds(boxes.length ? inputBounds : []);
  };

  buildBounds = collection => {
    return bbox(collection);
  };

  resetBounds = inputBounds => {
    if (!this.defaultBounds) {
      this.defaultBounds = this.map.getBounds();
    }
    const paddingVertical = inputBounds.length ? this.height / 10 : 0;
    const paddingHorizontal = inputBounds.length ? this.width / 10 : 0;
    this.map.fitBounds(inputBounds.length ? inputBounds : this.defaultBounds, {
      speed: 0.8,
      padding: { top: paddingVertical, bottom: paddingVertical, left: paddingHorizontal, right: paddingHorizontal }
    });
  };

  initLasso = () => {
    this.draw = new mapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      styles: [
        {
          id: 'gl-draw-polygon-fill-inactive',
          type: 'fill',
          filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          paint: {
            'fill-color': '#2A2E69',
            'fill-outline-color': '#2A2E69',
            'fill-opacity': 0.1
          }
        },
        {
          id: 'gl-draw-polygon-stroke-inactive',
          type: 'line',
          filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#2A2E69',
            'line-width': 2
          }
        },
        {
          id: 'gl-draw-polygon-fill-active',
          type: 'fill',
          filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          paint: {
            'fill-color': '#0051DC',
            'fill-outline-color': '#0051DC',
            'fill-opacity': 0.1
          }
        },
        {
          id: 'gl-draw-polygon-stroke-active',
          type: 'line',
          filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#0051DC',
            'line-dasharray': [0.2, 2],
            'line-width': 2
          }
        },
        {
          id: 'gl-draw-polygon-midpoint',
          type: 'circle',
          filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
          paint: {
            'circle-radius': 3,
            'circle-color': '#0051DC'
          }
        },
        {
          id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
          paint: {
            'circle-radius': 0,
            'circle-color': '#fff'
          }
        },
        {
          id: 'gl-draw-polygon-and-line-vertex-inactive',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 0,
            'circle-color': '#0051DC'
          }
        },
        {
          id: 'gl-draw-point-point-stroke-inactive',
          type: 'circle',
          filter: [
            'all',
            ['==', 'active', 'false'],
            ['==', '$type', 'Point'],
            ['==', 'meta', 'feature'],
            ['!=', 'mode', 'static']
          ],
          paint: {
            'circle-radius': 5,
            'circle-opacity': 1,
            'circle-color': '#fff'
          }
        },
        {
          id: 'gl-draw-point-inactive',
          type: 'circle',
          filter: [
            'all',
            ['==', 'active', 'false'],
            ['==', '$type', 'Point'],
            ['==', 'meta', 'feature'],
            ['!=', 'mode', 'static']
          ],
          paint: {
            'circle-radius': 3,
            'circle-color': '#0051DC'
          }
        },
        {
          id: 'gl-draw-point-stroke-active',
          type: 'circle',
          filter: ['all', ['==', '$type', 'Point'], ['==', 'active', 'true'], ['!=', 'meta', 'midpoint']],
          paint: {
            'circle-radius': 6,
            'circle-color': '#fff'
          }
        },
        {
          id: 'gl-draw-point-active',
          type: 'circle',
          filter: ['all', ['==', '$type', 'Point'], ['!=', 'meta', 'midpoint'], ['==', 'active', 'true']],
          paint: {
            'circle-radius': 4,
            'circle-color': '#15195A'
          }
        },
        {
          id: 'gl-draw-polygon-fill-static',
          type: 'fill',
          filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
          paint: {
            'fill-color': '#404040',
            'fill-outline-color': '#404040',
            'fill-opacity': 0.1
          }
        },
        {
          id: 'gl-draw-polygon-stroke-static',
          type: 'line',
          filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#404040',
            'line-width': 2
          }
        },
        {
          id: 'gl-draw-line-static',
          type: 'line',
          filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#404040',
            'line-width': 2
          }
        },
        {
          id: 'gl-draw-point-static',
          type: 'circle',
          filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 5,
            'circle-color': '#404040'
          }
        }
      ]
    });
    const globalMap = this.map;
    const enableControls = () => {
      this.map.dragPan.enable();
      this.map.on('mousemove', 'msa-boundaries-join', this.msaTooltipHandler);
      this.map.on('mousemove', 'msa-boundaries-join-pattern', this.msaTooltipHandler);
      this.map.on('mousemove', 'zip-boundaries-join', this.zipTooltipHandler);
      this.map.on('mousemove', 'zip-boundaries-join-pattern', this.zipTooltipHandler);
    };
    const disableControls = () => {
      this.map.dragPan.disable();
      this.map.off('mousemove', 'msa-boundaries-join', this.msaTooltipHandler);
      this.map.off('mousemove', 'msa-boundaries-join-pattern', this.msaTooltipHandler);
      this.map.off('mousemove', 'zip-boundaries-join', this.zipTooltipHandler);
      this.map.off('mousemove', 'zip-boundaries-join-pattern', this.zipTooltipHandler);
    };
    mapboxDraw.modes.draw_polygon.onSetup = function() {
      const polygon = this.newFeature({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[]]
        }
      });

      this.addFeature(polygon);
      this.clearSelectedFeatures();
      this.updateUIClasses({ mouse: 'add' });
      this.activateUIButton('Polygon');
      this.setActionableState({
        trash: true
      });
      return {
        polygon,
        currentVertexPosition: 0
      };
    };
    mapboxDraw.modes.draw_polygon.fireUpdate = function() {
      if (this.getSelected().length) {
        globalMap.fire('draw.update', {
          action: 'move',
          features: this.getSelected().map(f => f.toGeoJSON())
        });
      }
    };
    mapboxDraw.modes.draw_polygon.onMouseDown = (state, _) => {
      state.toggled = true;
      disableControls();
    };
    mapboxDraw.modes.draw_polygon.onMouseUp = function(state, _) {
      state.toggled = false;
      enableControls();
      const factor = globalMap.getZoom();
      let tolerance = 3 / (2 * factor * (2 * factor) + 3); // https://www.desmos.com/calculator/b3zi8jqskw
      if (tolerance < 0 || !isFinite(tolerance)) {
        // Tolerance cannot be negative
        tolerance = 0;
      }
      simplify(state.polygon, {
        tolerance,
        mutate: true
      });
      this.fireUpdate();
      this.changeMode('simple_select', { featureIds: [state.polygon.id] });
    };
    mapboxDraw.modes.draw_polygon.onDrag = mapboxDraw.modes.draw_polygon.onTouchMove = function(state, e) {
      if (state.toggled) {
        this._ctx.ui.queueMapClasses({ mouse: 'add' });
        state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, e.lngLat.lng, e.lngLat.lat);
        state.currentVertexPosition++;
        state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, e.lngLat.lng, e.lngLat.lat);
      }
    };
    this.map.addControl(this.draw, 'top-right');
    const polygonButton = select('.mapbox-gl-draw_polygon');
    polygonButton.attr('title', 'Lasso Tool');
    polygonButton.node().parentNode.insertBefore(select('.mapbox-gl-draw_trash').node(), polygonButton.node());
    this.map.on('draw.create', this.updateLassoData);
    this.map.on('draw.delete', this.updateLassoData);
    this.map.on('draw.update', this.updateLassoData);
    this.map.on('draw.selectionchange', this.toggleTrash);
  };

  textbox = (ctx, scale, snapshot) => {
    // OpenStreetMap and Mapbox attribution are required by
    // the Mapbox terms of service: https://www.mapbox.com/tos/#[YmdMYmdM]
    // set text sizing
    let text = ''; // © Visa

    // dynamically grab text, in case it changes in the future
    select('.mapboxgl-ctrl-attrib-inner')
      .selectAll('*')
      .each((_, i, n) => {
        const innerText = select(n[i]).text();
        text += innerText !== 'Improve this map' ? innerText + ' ' : '';
      });
    const fontsize = 14;
    const height = (fontsize + 6) * scale;
    const width = ((text.length + 3) / fontsize) * 100 * scale;
    // draw attribution to canvas
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(snapshot.width - width, snapshot.height - height, width, height);
    ctx.font = fontsize * scale + 'px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(text, snapshot.width - width + 5, snapshot.height - 5);
  };

  logo = scale => {
    return new Promise(resolve => {
      // OpenStreetMap and Mapbox attribution are required by
      // the Mapbox terms of service: https://www.mapbox.com/tos/#[YmdMYmdM]
      const img = new Image();
      // use the Mapbox logo within the LogoControl as the source image
      const a = document.querySelector('a.mapboxgl-ctrl-logo');
      const style = window.getComputedStyle(a, '');
      // remove "url('')" from the background-image property
      const dataURL = style.backgroundImage.slice(5, -2);
      // logo size
      const logoHeight = +style.height.replace('px', '');
      const logoWidth = +style.width.replace('px', '');
      const logoSVG = this.firefoxBugFix(dataURL, logoHeight * scale, logoWidth * scale);
      const logo = {
        image: logoSVG,
        height: logoHeight * scale,
        width: logoWidth * scale,
        element: img
      };
      img.src = logo.image;
      // draw the logo in img (when ready)
      img.onload = () => resolve(logo);
    });
  };

  firefoxBugFix = (dataURL, height, width) => {
    // Firefox requires SVG to have height and width specified
    // in the root SVG object when drawing to canvas
    // get raw SVG markup by removing the data type, charset, and escaped quotes
    const svg = unescape(dataURL.replace('data:image/svg+xml;charset=utf-8,', '').replace(/\\'/g, '"'));
    const svgStart = svg.indexOf('<svg');
    const parentSVG = svg.substr(svgStart, svg.substr(svgStart).indexOf('>') + 1);
    const heightRegEx = RegExp(`height?[ ]*=?[ ]*['|"]?[ ]*[0-9]*?[ ]*?(px)?[ ]*['|"]`, 'i');
    const widthRegEx = RegExp(`width?[ ]*=?[ ]*['|"]?[ ]*[0-9]*?[ ]*?(px)?[ ]*['|"]`, 'i');
    const parentSVGh = heightRegEx.test(parentSVG)
      ? parentSVG.replace(heightRegEx.exec(parentSVG)[0], 'height= "' + height + 'px"')
      : parentSVG.replace('>', ' height= "' + height + 'px" >');
    const parentSVGhw = widthRegEx.test(parentSVGh)
      ? parentSVGh.replace(widthRegEx.exec(parentSVGh)[0], 'width= "' + width + 'px"')
      : parentSVGh.replace('>', ' width= "' + width + 'px" >');
    const newSvg = svg.substr(0, svgStart) + parentSVGhw + svg.substr(svgStart + parentSVG.length);
    const newBase64 = btoa(newSvg);
    const newDataURL = 'data:image/svg+xml;base64,' + newBase64;
    return newDataURL;
  };

  render() {
    return (
      <div class={`o-layout`}>
        <div class="o-layout--wrapper">
          <div class="o-layout--chart">
            <h2>{this.mainTitle}</h2>
            <p class="visa-ui-text--instructions">{this.subTitle}</p>
            <div class="mapbox-legend" />
            <div
              id="visa-viz-bivariate-mapbox-map"
              style={{
                height: `${this.height}px`,
                width: `${this.width ? this.width : this.height * 1.6}px`
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
