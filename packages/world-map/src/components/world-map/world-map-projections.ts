/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import * as d3Geo from 'd3-geo';
import * as d3GeoProjection from 'd3-geo-projection';

export const d3Projections = [
  { projectionName: 'Aitoff', projection: d3GeoProjection.geoAitoff, scaleMultiplier: 0.155 },
  { projectionName: 'Albers', projection: d3Geo.geoAlbers, scaleMultiplier: 0.151 },
  // {projectionName: "Albers USA", projection: d3Geo.geoAlbersUsa, scaleMultiplier: .151},
  // {projectionName: "August", projection: d3GeoProjection.geoAugust, scaleMultiplier: .0625},
  { projectionName: 'Baker', projection: d3GeoProjection.geoBaker, scaleMultiplier: 0.1 },
  { projectionName: 'Boggs', projection: d3GeoProjection.geoBoggs, scaleMultiplier: 0.155 },
  { projectionName: 'Bonne', projection: d3GeoProjection.geoBonne, scaleMultiplier: 0.125 },
  { projectionName: 'Bromley', projection: d3GeoProjection.geoBromley, scaleMultiplier: 0.15 },
  { projectionName: 'Collignon', projection: d3GeoProjection.geoCollignon, scaleMultiplier: 0.125 },
  { projectionName: 'Craster Parabolic', projection: d3GeoProjection.geoCraster, scaleMultiplier: 0.155 },
  { projectionName: 'Eckert I', projection: d3GeoProjection.geoEckert1, scaleMultiplier: 0.165 },
  { projectionName: 'Eckert II', projection: d3GeoProjection.geoEckert2, scaleMultiplier: 0.165 },
  { projectionName: 'Eckert III', projection: d3GeoProjection.geoEckert3, scaleMultiplier: 0.1875 },
  { projectionName: 'Eckert IV', projection: d3GeoProjection.geoEckert4, scaleMultiplier: 0.1875 },
  { projectionName: 'Eckert V', projection: d3GeoProjection.geoEckert5, scaleMultiplier: 0.17 },
  { projectionName: 'Eckert VI', projection: d3GeoProjection.geoEckert6, scaleMultiplier: 0.1725 },
  { projectionName: 'Eisenlohr', projection: d3GeoProjection.geoEisenlohr, scaleMultiplier: 0.0625 },
  { projectionName: 'Equal Earth', projection: d3Geo.geoEqualEarth, scaleMultiplier: 0.151 },
  { projectionName: 'Gall-Peters', projection: d3GeoProjection.geoCylindricalEqualArea, scaleMultiplier: 0.19 },
  { projectionName: 'Goode Homolosine', projection: d3GeoProjection.geoHomolosine, scaleMultiplier: 0.1525 },
  { projectionName: 'Hammer', projection: d3GeoProjection.geoHammer, scaleMultiplier: 0.165 },
  { projectionName: 'Hill', projection: d3GeoProjection.geoHill, scaleMultiplier: 0.18 },
  { projectionName: 'Hyper Elliptical', projection: d3GeoProjection.geoHyperelliptical, scaleMultiplier: 0.1525 },
  { projectionName: 'Kavrayskiy VII', projection: d3GeoProjection.geoKavrayskiy7, scaleMultiplier: 0.165 },
  { projectionName: 'Lagrange', projection: d3GeoProjection.geoLagrange, scaleMultiplier: 0.125 },
  { projectionName: 'Larrivée', projection: d3GeoProjection.geoLarrivee, scaleMultiplier: 0.098 },
  { projectionName: 'Laskowski', projection: d3GeoProjection.geoLaskowski, scaleMultiplier: 0.125 },
  { projectionName: 'Loximuthal', projection: d3GeoProjection.geoLoximuthal, scaleMultiplier: 0.155 },
  { projectionName: 'Mercator', projection: d3Geo.geoMercator, scaleMultiplier: 0.08 },
  { projectionName: 'Miller', projection: d3GeoProjection.geoMiller, scaleMultiplier: 0.111 },
  {
    projectionName: 'McBryde–Thomas Flat-Polar Parabolic',
    projection: d3GeoProjection.geoMtFlatPolarParabolic,
    scaleMultiplier: 0.165
  },
  {
    projectionName: 'McBryde–Thomas Flat-Polar Quartic',
    projection: d3GeoProjection.geoMtFlatPolarQuartic,
    scaleMultiplier: 0.195
  },
  {
    projectionName: 'McBryde–Thomas Flat-Polar Sinusoidal',
    projection: d3GeoProjection.geoMtFlatPolarSinusoidal,
    scaleMultiplier: 0.165
  },
  { projectionName: 'Mollweide', projection: d3GeoProjection.geoMollweide, scaleMultiplier: 0.165 },
  { projectionName: 'Natural Earth', projection: d3GeoProjection.geoNaturalEarth, scaleMultiplier: 0.16 },
  { projectionName: 'Nell–Hammer', projection: d3GeoProjection.geoNellHammer, scaleMultiplier: 0.15 },
  { projectionName: 'Polyconic', projection: d3GeoProjection.geoPolyconic, scaleMultiplier: 0.105 },
  // { projectionName: 'Orthographic', projection: d3Geo.geoOrthographic, scaleMultiplier: 0.215 },
  { projectionName: 'Robinson', projection: d3GeoProjection.geoRobinson, scaleMultiplier: 0.145 },
  { projectionName: 'Sinusoidal', projection: d3GeoProjection.geoSinusoidal, scaleMultiplier: 0.1525 },
  { projectionName: 'Sinu-Mollweide', projection: d3GeoProjection.geoSinuMollweide, scaleMultiplier: 0.15 },
  { projectionName: 'van der Grinten', projection: d3GeoProjection.geoVanDerGrinten, scaleMultiplier: 0.08 },
  { projectionName: 'van der Grinten IV', projection: d3GeoProjection.geoVanDerGrinten4, scaleMultiplier: 0.125 },
  { projectionName: 'Wagner IV', projection: d3GeoProjection.geoWagner4, scaleMultiplier: 0.175 },
  { projectionName: 'Wagner VI', projection: d3GeoProjection.geoWagner6, scaleMultiplier: 0.15 },
  { projectionName: 'Wagner VII', projection: d3GeoProjection.geoWagner7, scaleMultiplier: 0.16 },
  { projectionName: 'Winkel Tripel', projection: d3GeoProjection.geoWinkel3, scaleMultiplier: 0.155 }
];
