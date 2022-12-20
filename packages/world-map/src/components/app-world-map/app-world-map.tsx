/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Element, h } from '@stencil/core';
import '@visa/visa-charts-data-table';
import '@visa/keyboard-instructions';

@Component({
  tag: 'app-world-map',
  styleUrl: 'app-world-map.scss'
})
export class AppD3Map {
  @State() data: any = [];
  @State() hoverElement: any = '';
  @State() clickElement: any = [
    { ID: 133, Name: 'Greenland', 'Birth Rate': 14.4, random: Math.random() * 10, 'Country Code': '304', Type: 'B' }
  ];
  @State() dataLabel: any = {
    visible: true,
    placement: 'bottom',
    labelAccessor: 'Name',
    format: '',
    collisionHideOnly: true,
    collisionPlacement: 'all'
  };
  @State() animations: any = { disabled: false };
  //  = [
  // {
  //   ID: 507,
  //   Name: 'London',
  //   code: 'LHR',
  //   accepted: 123,
  //   rejected: '76',
  //   issType: '3',
  //   latitude: 51.4706,
  //   longitude: -0.461941
  // }
  // ];
  @State() projectionName: string = 'Equal Earth';
  @State() suppressEvents: boolean = false;
  @State() smallDataToggle: boolean = false;
  @State() smallDataState: any = [
    { ID: 136, Name: 'Brazil', 'Birth Rate': 14.1, random: Math.random() * 10, 'Country Code': '076', Type: 'A' },
    { ID: 143, Name: 'Chile', 'Birth Rate': 15.6, random: Math.random() * 10, 'Country Code': '152', Type: 'B' },
    { ID: 103, Name: 'Peru', 'Birth Rate': 17.8, random: Math.random() * 10, 'Country Code': '604', Type: 'A' },
    { ID: 133, Name: 'Greenland', 'Birth Rate': 14.4, random: Math.random() * 10, 'Country Code': '304', Type: 'B' },
    {
      ID: 159,
      Name: 'United States',
      'Birth Rate': 20.3,
      random: Math.random() * 10,
      'Country Code': '840',
      Type: 'C'
    },
    { ID: 131, Name: 'Australia', 'Birth Rate': 10.3, random: Math.random() * 10, 'Country Code': '036', Type: 'D' }
  ];

  smallData = [
    { ID: 136, Name: 'Brazil', 'Birth Rate': 14.1, random: Math.random() * 10, 'Country Code': '076', Type: 'A' },
    { ID: 143, Name: 'Chile', 'Birth Rate': 15.6, random: Math.random() * 10, 'Country Code': '152', Type: 'B' },
    { ID: 103, Name: 'Peru', 'Birth Rate': 17.8, random: Math.random() * 10, 'Country Code': '604', Type: 'A' },
    { ID: 133, Name: 'Greenland', 'Birth Rate': 14.4, random: Math.random() * 10, 'Country Code': '304', Type: 'B' },
    {
      ID: 159,
      Name: 'United States',
      'Birth Rate': 20.3,
      random: Math.random() * 10,
      'Country Code': '840',
      Type: 'C'
    },
    { ID: 131, Name: 'Australia', 'Birth Rate': 10.3, random: Math.random() * 10, 'Country Code': '036', Type: 'D' }
  ];
  smallData2 = [
    { ID: 123, Name: 'China', 'Birth Rate': 150.1, random: Math.random() * 10, 'Country Code': '156', Type: 'C' },
    { ID: 136, Name: 'Brazil', 'Birth Rate': 134.1, random: Math.random() * 10, 'Country Code': '076', Type: 'A' },
    { ID: 143, Name: 'Chile', 'Birth Rate': 175.6, random: Math.random() * 10, 'Country Code': '152', Type: 'B' },
    { ID: 103, Name: 'Peru', 'Birth Rate': 117.8, random: Math.random() * 10, 'Country Code': '604', Type: 'A' },
    { ID: 133, Name: 'Greenland', 'Birth Rate': 144.4, random: Math.random() * 10, 'Country Code': '304', Type: 'B' },
    {
      ID: 159,
      Name: 'United States',
      'Birth Rate': 230.3,
      random: Math.random() * 10,
      'Country Code': '840',
      Type: 'C'
    },
    { ID: 131, Name: 'Australia', 'Birth Rate': 150.3, random: Math.random() * 10, 'Country Code': '036', Type: 'D' }
  ];
  bigData = [
    { ID: 1, Name: 'Angola', 'Birth Rate': 14.2, 'Country Code': '024' },
    { ID: 2, Name: 'Niger', 'Birth Rate': 44.2, 'Country Code': '562' },
    { ID: 3, Name: 'Mali', 'Birth Rate': 43.9, 'Country Code': '466' },
    { ID: 4, Name: 'Uganda', 'Birth Rate': 42.9, 'Country Code': '800' },
    { ID: 5, Name: 'Zambia', 'Birth Rate': 41.5, 'Country Code': '894' },
    { ID: 6, Name: 'Burundi', 'Birth Rate': 41.3, 'Country Code': '108' },
    { ID: 7, Name: 'Burkina Faso', 'Birth Rate': 41.2, 'Country Code': '854' },
    { ID: 8, Name: 'Malawi', 'Birth Rate': 41, 'Country Code': '454' },
    { ID: 9, Name: 'Somalia', 'Birth Rate': 39.6, 'Country Code': '706' },
    { ID: 10, Name: 'Liberia', 'Birth Rate': 38.3, 'Country Code': '430' },
    { ID: 11, Name: 'Mozambique', 'Birth Rate': 38.1, 'Country Code': '508' },
    { ID: 12, Name: 'Afghanistan', 'Birth Rate': 37.9, 'Country Code': '004' },
    { ID: 13, Name: 'Nigeria', 'Birth Rate': 36.9, 'Country Code': '566' },
    { ID: 14, Name: 'Ethiopia', 'Birth Rate': 36.5, 'Country Code': '231' },
    { ID: 15, Name: 'Sierra Leone', 'Birth Rate': 36.3, 'Country Code': '694' },
    { ID: 16, Name: 'Tanzania', 'Birth Rate': 35.6, 'Country Code': '834' },
    { ID: 17, Name: 'Chad', 'Birth Rate': 35.6, 'Country Code': '148' },
    { ID: 18, Name: 'South Sudan', 'Birth Rate': 35.5, 'Country Code': '728' },
    { ID: 19, Name: 'Cameroon', 'Birth Rate': 35.4, 'Country Code': '120' },
    { ID: 20, Name: 'Guinea', 'Birth Rate': 35.1, 'Country Code': '324' },
    { ID: 21, Name: 'Benin', 'Birth Rate': 35, 'Country Code': '204' },
    { ID: 22, Name: 'Congo, Republic of the', 'Birth Rate': 34.4, 'Country Code': '178' },
    { ID: 23, Name: 'Central African Republic', 'Birth Rate': 34.3, 'Country Code': '140' },
    { ID: 24, Name: 'Gabon', 'Birth Rate': 34.2, 'Country Code': '266' },
    { ID: 25, Name: 'Zimbabwe', 'Birth Rate': 34.2, 'Country Code': '716' },
    { ID: 26, Name: 'Congo, Democratic Republic of the', 'Birth Rate': 33.5, 'Country Code': '180' },
    { ID: 27, Name: 'Timor-Leste', 'Birth Rate': 33.4, 'Country Code': '626' },
    { ID: 28, Name: 'Senegal', 'Birth Rate': 33.4, 'Country Code': '686' },
    { ID: 29, Name: 'Togo', 'Birth Rate': 33.3, 'Country Code': '768' },
    { ID: 30, Name: 'Guinea-Bissau', 'Birth Rate': 32.5, 'Country Code': '624' },
    { ID: 31, Name: 'Sao Tome and Principe', 'Birth Rate': 32.4, 'Country Code': '678' },
    { ID: 32, Name: 'Equatorial Guinea', 'Birth Rate': 32.2, 'Country Code': '226' },
    { ID: 33, Name: 'Madagascar', 'Birth Rate': 31.6, 'Country Code': '450' },
    { ID: 35, Name: 'Rwanda', 'Birth Rate': 30.7, 'Country Code': '646' },
    { ID: 36, Name: 'Ghana', 'Birth Rate': 30.5, 'Country Code': '288' },
    { ID: 37, Name: 'Iraq', 'Birth Rate': 30.4, 'Country Code': '368' },
    { ID: 38, Name: 'Mauritania', 'Birth Rate': 30.4, 'Country Code': '478' },
    { ID: 39, Name: 'Eritrea', 'Birth Rate': 29.6, 'Country Code': '232' },
    { ID: 40, Name: 'Egypt', 'Birth Rate': 29.6, 'Country Code': '818' },
    { ID: 41, Name: 'Gambia, The', 'Birth Rate': 29.4, 'Country Code': '270' },
    { ID: 42, Name: 'Western Sahara', 'Birth Rate': 29.3, 'Country Code': '732' },
    { ID: 43, Name: 'Yemen', 'Birth Rate': 28.4, 'Country Code': '887' },
    { ID: 44, Name: 'Sudan', 'Birth Rate': 27.9, 'Country Code': '729' },
    { ID: 46, Name: 'Namibia', 'Birth Rate': 27.3, 'Country Code': '516' },
    { ID: 49, Name: 'Solomon Islands', 'Birth Rate': 24.9, 'Country Code': '090' },
    { ID: 50, Name: 'Lesotho', 'Birth Rate': 24.6, 'Country Code': '426' },
    { ID: 52, Name: 'Guatemala', 'Birth Rate': 24.1, 'Country Code': '320' },
    { ID: 53, Name: 'Belize', 'Birth Rate': 24, 'Country Code': '084' },
    { ID: 54, Name: 'Oman', 'Birth Rate': 24, 'Country Code': '512' },
    { ID: 56, Name: 'Nauru', 'Birth Rate': 24, 'Country Code': '520' },
    { ID: 57, Name: 'Vanuatu', 'Birth Rate': 24, 'Country Code': '548' },
    { ID: 58, Name: 'Jordan', 'Birth Rate': 23.9, 'Country Code': '400' },
    { ID: 59, Name: 'Kenya', 'Birth Rate': 23.9, 'Country Code': '404' },
    { ID: 60, Name: 'Papua New Guinea', 'Birth Rate': 23.7, 'Country Code': '598' },
    { ID: 62, Name: 'Tuvalu', 'Birth Rate': 23.7, 'Country Code': '798' },
    { ID: 64, Name: 'Djibouti', 'Birth Rate': 23.4, 'Country Code': '262' },
    { ID: 65, Name: 'Tajikistan', 'Birth Rate': 23.3, 'Country Code': '762' },
    { ID: 66, Name: 'Haiti', 'Birth Rate': 23, 'Country Code': '332' },
    { ID: 67, Name: 'Cambodia', 'Birth Rate': 23, 'Country Code': '116' },
    { ID: 68, Name: 'Honduras', 'Birth Rate': 22.4, 'Country Code': '340' },
    { ID: 69, Name: 'Algeria', 'Birth Rate': 22.2, 'Country Code': '012' },
    { ID: 70, Name: 'Tonga', 'Birth Rate': 22.2, 'Country Code': '776' },
    { ID: 71, Name: 'Botswana', 'Birth Rate': 22.1, 'Country Code': '072' },
    { ID: 72, Name: 'Kyrgyzstan', 'Birth Rate': 22.1, 'Country Code': '417' },
    { ID: 74, Name: 'Pakistan', 'Birth Rate': 21.9, 'Country Code': '586' },
    { ID: 76, Name: 'Kiribati', 'Birth Rate': 21.2, 'Country Code': '296' },
    { ID: 77, Name: 'Samoa', 'Birth Rate': 20.4, 'Country Code': '882' },
    { ID: 78, Name: 'South Africa', 'Birth Rate': 20.2, 'Country Code': '710' },
    { ID: 80, Name: 'Micronesia, Federated States of', 'Birth Rate': 20, 'Country Code': '583' },
    { ID: 81, Name: 'Guam', 'Birth Rate': 19.7, 'Country Code': '316' },
    { ID: 82, Name: 'American Samoa', 'Birth Rate': 19.6, 'Country Code': '016' },
    { ID: 83, Name: 'Nepal', 'Birth Rate': 19.5, 'Country Code': '524' },
    { ID: 84, Name: 'Kuwait', 'Birth Rate': 19.2, 'Country Code': '414' },
    { ID: 85, Name: 'Malaysia', 'Birth Rate': 19.1, 'Country Code': '458' },
    { ID: 86, Name: 'Turkmenistan', 'Birth Rate': 19.1, 'Country Code': '795' },
    { ID: 87, Name: 'India', 'Birth Rate': 19, 'Country Code': '356' },
    { ID: 88, Name: 'Mongolia', 'Birth Rate': 18.9, 'Country Code': '496' },
    { ID: 89, Name: 'Bangladesh', 'Birth Rate': 18.8, 'Country Code': '050' },
    { ID: 91, Name: 'Fiji', 'Birth Rate': 18.6, 'Country Code': '242' },
    { ID: 93, Name: 'Saudi Arabia', 'Birth Rate': 18.3, 'Country Code': '682' },
    { ID: 94, Name: 'Mexico', 'Birth Rate': 18.3, 'Country Code': '484' },
    { ID: 95, Name: 'Tunisia', 'Birth Rate': 18.2, 'Country Code': '788' },
    { ID: 96, Name: 'Israel', 'Birth Rate': 18.1, 'Country Code': '376' },
    { ID: 98, Name: 'Kazakhstan', 'Birth Rate': 18.1, 'Country Code': '398' },
    { ID: 99, Name: 'Jamaica', 'Birth Rate': 17.9, 'Country Code': '388' },
    { ID: 100, Name: 'Panama', 'Birth Rate': 17.9, 'Country Code': '591' },
    { ID: 102, Name: 'Ecuador', 'Birth Rate': 17.9, 'Country Code': '218' },
    { ID: 103, Name: 'Peru', 'Birth Rate': 17.8, 'Country Code': '604' },
    { ID: 104, Name: 'Nicaragua', 'Birth Rate': 17.7, 'Country Code': '558' },
    { ID: 105, Name: 'Morocco', 'Birth Rate': 17.7, 'Country Code': '504' },
    { ID: 106, Name: 'Libya', 'Birth Rate': 17.5, 'Country Code': '434' },
    { ID: 107, Name: 'Bhutan', 'Birth Rate': 17.3, 'Country Code': '064' },
    { ID: 109, Name: 'Uzbekistan', 'Birth Rate': 16.8, 'Country Code': '860' },
    { ID: 110, Name: 'Argentina', 'Birth Rate': 16.7, 'Country Code': '032' },
    { ID: 111, Name: 'Paraguay', 'Birth Rate': 16.6, 'Country Code': '600' },
    { ID: 112, Name: 'El Salvador', 'Birth Rate': 16.2, 'Country Code': '222' },
    { ID: 113, Name: 'Indonesia', 'Birth Rate': 16.2, 'Country Code': '360' },
    { ID: 114, Name: 'Colombia', 'Birth Rate': 16.1, 'Country Code': '170' },
    { ID: 115, Name: 'Maldives', 'Birth Rate': 16.1, 'Country Code': '462' },
    { ID: 116, Name: 'Azerbaijan', 'Birth Rate': 15.8, 'Country Code': '031' },
    { ID: 117, Name: 'Suriname', 'Birth Rate': 15.8, 'Country Code': '740' },
    { ID: 118, Name: 'Antigua and Barbuda', 'Birth Rate': 15.7, 'Country Code': '028' },
    { ID: 119, Name: 'Turkey', 'Birth Rate': 15.7, 'Country Code': '792' },
    { ID: 120, Name: 'Costa Rica', 'Birth Rate': 15.5, 'Country Code': '188' },
    { ID: 121, Name: 'Grenada', 'Birth Rate': 15.5, 'Country Code': '308' },
    { ID: 123, Name: 'Guyana', 'Birth Rate': 15.4, 'Country Code': '328' },
    { ID: 125, Name: 'Bahamas, The', 'Birth Rate': 15.3, 'Country Code': '044' },
    { ID: 126, Name: 'Sri Lanka', 'Birth Rate': 15.2, 'Country Code': '144' },
    { ID: 127, Name: 'Dominica', 'Birth Rate': 15.1, 'Country Code': '212' },
    { ID: 129, Name: 'New Caledonia', 'Birth Rate': 15, 'Country Code': '540' },
    { ID: 131, Name: 'French Polynesia', 'Birth Rate': 14.8, 'Country Code': '258' },
    { ID: 133, Name: 'Greenland', 'Birth Rate': 14.4, 'Country Code': '304' },
    { ID: 135, Name: 'Lebanon', 'Birth Rate': 14.3, 'Country Code': '422' },
    { ID: 136, Name: 'Brazil', 'Birth Rate': 14.1, 'Country Code': '076' },
    { ID: 137, Name: 'Ireland', 'Birth Rate': 14.1, 'Country Code': '372' },
    { ID: 139, Name: 'Gibraltar', 'Birth Rate': 14, 'Country Code': '292' },
    { ID: 141, Name: 'Iceland', 'Birth Rate': 13.7, 'Country Code': '352' },
    { ID: 142, Name: 'Seychelles', 'Birth Rate': 13.7, 'Country Code': '690' },
    { ID: 143, Name: 'Chile', 'Birth Rate': 13.6, 'Country Code': '152' },
    { ID: 144, Name: 'Saint Lucia', 'Birth Rate': 13.3, 'Country Code': '662' },
    { ID: 145, Name: 'Bahrain', 'Birth Rate': 13.3, 'Country Code': '48' },
    { ID: 146, Name: 'Saint Vincent and the Grenadines', 'Birth Rate': 13.2, 'Country Code': '670' },
    { ID: 147, Name: 'Saint Kitts and Nevis', 'Birth Rate': 13.2, 'Country Code': '659' },
    { ID: 148, Name: 'Wallis and Futuna', 'Birth Rate': 13.2, 'Country Code': '876' },
    { ID: 149, Name: 'Albania', 'Birth Rate': 13.2, 'Country Code': '008' },
    { ID: 150, Name: 'New Zealand', 'Birth Rate': 13.2, 'Country Code': '554' },
    { ID: 152, Name: 'Uruguay', 'Birth Rate': 13, 'Country Code': '858' },
    { ID: 153, Name: 'Mauritius', 'Birth Rate': 13, 'Country Code': '480' },
    { ID: 154, Name: 'Armenia', 'Birth Rate': 12.9, 'Country Code': '051' },
    { ID: 156, Name: 'Trinidad and Tobago', 'Birth Rate': 12.7, 'Country Code': '780' },
    { ID: 157, Name: 'Anguilla', 'Birth Rate': 12.5, 'Country Code': '660' },
    { ID: 159, Name: 'Aruba', 'Birth Rate': 12.4, 'Country Code': '533' },
    { ID: 160, Name: 'Jersey', 'Birth Rate': 12.4, 'Country Code': '832' },
    { ID: 161, Name: 'China', 'Birth Rate': 12.3, 'Country Code': '156' },
    { ID: 162, Name: 'Georgia', 'Birth Rate': 12.3, 'Country Code': '268' },
    { ID: 164, Name: 'Norway', 'Birth Rate': 12.2, 'Country Code': '578' },
    { ID: 167, Name: 'Sweden', 'Birth Rate': 12.1, 'Country Code': '752' },
    { ID: 169, Name: 'Barbados', 'Birth Rate': 11.7, 'Country Code': '052' },
    { ID: 170, Name: 'Luxembourg', 'Birth Rate': 11.5, 'Country Code': '442' },
    { ID: 173, Name: 'Bermuda', 'Birth Rate': 11.3, 'Country Code': '060' },
    { ID: 174, Name: 'Palau', 'Birth Rate': 11.3, 'Country Code': '585' },
    { ID: 175, Name: 'Belgium', 'Birth Rate': 11.3, 'Country Code': '056' },
    { ID: 176, Name: 'Cyprus', 'Birth Rate': 11.3, 'Country Code': '196' },
    { ID: 179, Name: 'Thailand', 'Birth Rate': 11, 'Country Code': '764' },
    { ID: 180, Name: 'Isle of Man', 'Birth Rate': 11, 'Country Code': '833' },
    { ID: 183, Name: 'Montserrat', 'Birth Rate': 10.8, 'Country Code': '500' },
    { ID: 184, Name: 'Cuba', 'Birth Rate': 10.7, 'Country Code': '192' },
    { ID: 185, Name: 'Finland', 'Birth Rate': 10.7, 'Country Code': '246' },
    { ID: 186, Name: 'Denmark', 'Birth Rate': 10.5, 'Country Code': '208' },
    { ID: 187, Name: 'Switzerland', 'Birth Rate': 10.5, 'Country Code': '756' },
    { ID: 188, Name: 'Liechtenstein', 'Birth Rate': 10.4, 'Country Code': '438' },
    { ID: 189, Name: 'Ukraine', 'Birth Rate': 10.3, 'Country Code': '804' },
    { ID: 190, Name: 'Canada', 'Birth Rate': 10.3, 'Country Code': '124' },
    { ID: 191, Name: 'Belarus', 'Birth Rate': 10.3, 'Country Code': '112' },
    { ID: 192, Name: 'Malta', 'Birth Rate': 10.1, 'Country Code': '470' },
    { ID: 193, Name: 'Estonia', 'Birth Rate': 10.1, 'Country Code': '233' },
    { ID: 194, Name: 'Montenegro', 'Birth Rate': 10, 'Country Code': '499' },
    { ID: 195, Name: 'Lithuania', 'Birth Rate': 9.9, 'Country Code': '440' },
    { ID: 196, Name: 'Guernsey', 'Birth Rate': 9.8, 'Country Code': '831' },
    { ID: 197, Name: 'Slovakia', 'Birth Rate': 9.7, 'Country Code': '703' },
    { ID: 198, Name: 'Latvia', 'Birth Rate': 9.7, 'Country Code': '428' },
    { ID: 199, Name: 'Qatar', 'Birth Rate': 9.6, 'Country Code': '634' },
    { ID: 201, Name: 'Austria', 'Birth Rate': 9.5, 'Country Code': '040' },
    { ID: 202, Name: 'Poland', 'Birth Rate': 9.5, 'Country Code': '616' },
    { ID: 204, Name: 'Spain', 'Birth Rate': 9.2, 'Country Code': '724' },
    { ID: 205, Name: 'Hungary', 'Birth Rate': 9, 'Country Code': '348' },
    { ID: 206, Name: 'Serbia', 'Birth Rate': 9, 'Country Code': '688' },
    { ID: 207, Name: 'Portugal', 'Birth Rate': 9, 'Country Code': '620' },
    { ID: 208, Name: 'Hong Kong', 'Birth Rate': 8.9, 'Country Code': '344' },
    { ID: 209, Name: 'Romania', 'Birth Rate': 8.9, 'Country Code': '642' },
    { ID: 210, Name: 'Croatia', 'Birth Rate': 8.9, 'Country Code': '191' },
    { ID: 211, Name: 'Bosnia and Herzegovina', 'Birth Rate': 8.8, 'Country Code': '070' },
    { ID: 212, Name: 'Bulgaria', 'Birth Rate': 8.7, 'Country Code': '100' },
    { ID: 213, Name: 'Germany', 'Birth Rate': 8.6, 'Country Code': '276' },
    { ID: 214, Name: 'Singapore', 'Birth Rate': 8.6, 'Country Code': '702' },
    { ID: 215, Name: 'Italy', 'Birth Rate': 8.6, 'Country Code': '380' },
    { ID: 217, Name: 'San Marino', 'Birth Rate': 8.6, 'Country Code': '674' },
    { ID: 218, Name: 'Greece', 'Birth Rate': 8.4, 'Country Code': '300' },
    { ID: 221, Name: 'Slovenia', 'Birth Rate': 8.2, 'Country Code': '705' },
    { ID: 222, Name: 'Puerto Rico', 'Birth Rate': 8.1, 'Country Code': '630' },
    { ID: 223, Name: 'Japan', 'Birth Rate': 7.7, 'Country Code': '392' },
    { ID: 224, Name: 'Andorra', 'Birth Rate': 7.5, 'Country Code': '020' },
    { ID: 225, Name: 'Saint Pierre and Miquelon', 'Birth Rate': 7.1, 'Country Code': '666' },
    { ID: 226, Name: 'Monaco', 'Birth Rate': 6.6, 'Country Code': '492' }
  ];
  @State() testData: any = this.smallData;
  @State() propChange: string = 'Baker';
  @State() clickStyle: any = {
    color: 'supp_purple',
    strokeWidth: 3
  };
  @State() hoverStyle: any = {
    color: 'comp_blue',
    strokeWidth: 2
  };
  @State() innerMarkerStyle: any = {
    visible: true,
    blend: false,
    fill: true,
    color: 'categorical_blue',
    radiusRange: [5, 20],
    opacity: 1,
    strokeWidth: 1
  };
  @State() interactionKeys: any = ['Type'];
  @State() colorPalette: any = 'categorical';

  @Element()
  appEl: HTMLElement;
  dataKeyNames: any = {
    Type: 'Letter',
    Name: 'Country',
    'Country Code': 'C Code',
    'Birth Rate': 'Rate'
  };
  legend: any = {
    visible: true,
    interactive: true,
    type: 'key',
    format: ''
  };
  // dataLabel: any = {
  //   visible: true,
  //   labelAccessor: 'Name'
  // };
  countryStyle: any = {
    fill: false,
    color: 'base_grey',
    opacity: 1,
    strokeWidth: 0.5
  };
  @State() accessibility: any = {
    longDescription: 'This is a world map with markers that shows rejected card transactions for 5 regions.',
    contextExplanation: 'This chart receives its data from a change data button.',
    executiveSummary: 'There are no significant trends across these values.',
    purpose: 'This map is meant to visualize anomalies in card rejection data.',
    statisticalNotes: 'This example map is using dummy data.',
    onChangeFunc: d => {
      this.onChangeHandler(d);
    },
    elementsAreInterface: false,
    includeDataKeyNames: true,
    hideTextures: false,
    keyboardNavConfig: { disabled: false }
  };

  // componentWillLoad() {}
  changeProp() {
    this.propChange = this.propChange === 'Equal Earth' ? 'Baker' : 'Equal Earth';
  }

  // Demo Interactivity
  onClickHandler(d) {
    let index = -1;
    this.clickElement.forEach((el, i) => {
      let keyMatch = [];
      this.interactionKeys.forEach(k => {
        el[k] == d.detail.data[k] ? keyMatch.push(true) : keyMatch.push(false);
      });
      keyMatch.every(v => v === true) ? (index = i) : null;
    });

    const newClicks = [...this.clickElement];
    if (index > -1) {
      newClicks.splice(index, 1);
    } else {
      newClicks.push(d.detail.data);
    }
    this.clickElement = newClicks;
  }
  onHoverHandler(ev) {
    this.hoverElement = ev.detail;
  }
  onChangeHandler(d) {
    console.log(d);
  }

  changeSmallData() {
    this.smallDataState = this.smallDataToggle ? this.smallData : this.smallData2;
    this.innerMarkerStyle = {
      visible: true,
      blend: false,
      fill: true, //this.smallDataToggle,
      color: 'categorical_blue',
      radiusRange: [5, 15],
      opacity: 1,
      strokeWidth: 0.5
    };
    this.smallDataToggle = !this.smallDataToggle;
  }

  changeProjection() {
    this.projectionName = this.projectionName === 'Robinson' ? 'Equal Earth' : 'Robinson';
  }

  changeKeys() {
    this.interactionKeys =
      this.interactionKeys.length === 1 ? ['Type', 'ID'] : this.interactionKeys.length === 2 ? [] : ['Type'];
  }

  changeClickStyle() {
    this.clickStyle =
      this.clickStyle.color === 'supp_purple'
        ? {
            color: 'sec_orange',
            strokeWidth: '3px'
          }
        : {
            color: 'supp_purple',
            strokeWidth: '2px'
          };
  }

  changeHoverStyle() {
    this.hoverStyle =
      this.hoverStyle.color === 'comp_blue'
        ? {
            color: 'supp_pink',
            strokeWidth: '3px'
          }
        : {
            color: 'comp_blue',
            strokeWidth: '2px'
          };
  }

  changeDataLabel() {
    this.dataLabel = this.dataLabel.labelAccessor
      ? {
          visible: true,
          placement: 'auto'
        }
      : {
          visible: true,
          labelAccessor: 'random',
          format: '0.00',
          placement: 'auto'
        };
  }
  changeAccessElements() {
    this.accessibility = {
      ...this.accessibility,
      elementsAreInterface: !this.accessibility.elementsAreInterface
    };
  }
  changeKeyNav() {
    const keyboardNavConfig = {
      disabled: !this.accessibility.keyboardNavConfig.disabled
    };
    this.accessibility = {
      ...this.accessibility,
      keyboardNavConfig
    };
  }
  toggleSuppress() {
    this.suppressEvents = !this.suppressEvents;
  }

  toggleMarkerStyle() {
    this.innerMarkerStyle = this.innerMarkerStyle.visible
      ? {
          visible: false,
          blend: false,
          fill: true,
          color: 'categorical_blue',
          radiusRange: [5, 10],
          opacity: 1,
          strokeWidth: 0.5
        }
      : {
          visible: true,
          blend: false,
          fill: true,
          color: 'categorical_blue',
          radiusRange: [10, 50],
          opacity: 1,
          strokeWidth: 0.5
        };

    this.countryStyle.fill = !this.innerMarkerStyle.visible;
  }

  booleanTest() {
    this.interactionKeys =
      this.interactionKeys.length === 1 ? ['Type', 'ID'] : this.interactionKeys.length === 2 ? [] : ['Type'];
    this.colorPalette = this.colorPalette !== 'sequential_secBlue' ? 'sequential_secBlue' : 'single_suppPink';
    this.innerMarkerStyle = this.innerMarkerStyle.visible
      ? {
          visible: false,
          blend: false,
          fill: true,
          color: 'categorical_blue',
          radiusRange: [5, 15],
          opacity: 1,
          strokeWidth: 0.5
        }
      : {
          visible: true,
          blend: false,
          fill: true,
          color: 'categorical_blue',
          radiusRange: [5, 15],
          opacity: 1,
          strokeWidth: 0.5
        };
  }

  toggleTextures() {
    this.accessibility = {
      ...this.accessibility,
      showExperimentalTextures: !this.accessibility.showExperimentalTextures
    };
  }
  toggleAnimations() {
    this.animations = { disabled: !this.animations.disabled };
  }

  render() {
    console.log('!!!!app re-render');
    return (
      <div class="world-map-app">
        <button
          onClick={() => {
            this.changeAccessElements();
          }}
        >
          change elementsAreInterface
        </button>
        <button
          onClick={() => {
            this.toggleSuppress();
          }}
        >
          toggle event suppression
        </button>
        <button
          onClick={() => {
            this.changeKeyNav();
          }}
        >
          toggle keyboard nav
        </button>
        <button
          style={{
            cursor: 'pointer'
          }}
          onClick={() => {
            this.changeSmallData();
          }}
        >
          change data
        </button>
        <button
          style={{
            cursor: 'pointer'
          }}
          onClick={() => {
            this.changeProjection();
          }}
        >
          change projection
        </button>
        <button
          style={{
            cursor: 'pointer'
          }}
          onClick={() => {
            this.changeKeys();
          }}
        >
          change interaction keys {this.interactionKeys.length}
        </button>
        <button
          style={{
            cursor: 'pointer'
          }}
          onClick={() => {
            this.suppressEvents = !this.suppressEvents;
          }}
        >
          toggle suppressEvents {this.suppressEvents}
        </button>
        <button
          style={{
            cursor: 'pointer'
          }}
          onClick={() => {
            this.changeClickStyle();
          }}
        >
          change clickStyle {this.clickStyle.color}
        </button>
        <button
          style={{
            cursor: 'pointer'
          }}
          onClick={() => {
            this.changeHoverStyle();
          }}
        >
          change hoverStyle {this.hoverStyle.color}
        </button>
        <button
          style={{
            cursor: 'pointer'
          }}
          onClick={() => {
            this.changeDataLabel();
          }}
        >
          change dataLabel {this.dataLabel.labelAccessor}
        </button>
        <button
          style={{
            cursor: 'pointer'
          }}
          onClick={() => {
            this.toggleMarkerStyle();
          }}
        >
          change markerStyle {this.innerMarkerStyle.visible}
        </button>

        <button
          style={{
            cursor: 'pointer'
          }}
          onClick={() => {
            this.changeProp();
          }}
        >
          change prop {this.propChange}
        </button>
        <button
          onClick={() => {
            this.booleanTest();
          }}
        >
          boolean test
        </button>
        <button
          onClick={() => {
            this.toggleTextures();
          }}
        >
          toggle textures
        </button>

        <button
          onClick={() => {
            this.toggleAnimations();
          }}
        >
          toggle animations
        </button>
        <div>
          <world-map
            key={'world-map-1'}
            animationConfig={this.animations}
            mainTitle={'WORLD'}
            subTitle="Marker Interaction"
            width={400}
            height={250}
            data={this.smallDataState}
            mapProjection={this.projectionName}
            uniqueID={'unique_map'}
            // mapScaleZoom={1.4}
            cursor={'pointer'}
            suppressEvents={this.suppressEvents}
            hoverHighlight={this.hoverElement}
            clickHighlight={this.clickElement}
            onClickEvent={d => this.onClickHandler(d)}
            onHoverEvent={d => this.onHoverHandler(d)}
            onMouseOutEvent={() => this.onHoverHandler('')}
            // onInitialLoadEvent={e => console.log('load event', e.detail, e)}
            // onInitialLoadEndEvent={e => console.log('load end event', e.detail, e)}
            // onDrawStartEvent={e => console.log('draw start event', e.detail, e)}
            // onDrawEndEvent={e => console.log('draw end event', e.detail, e)}
            // onTransitionEndEvent={e => console.log('transition event', e.detail, e)}
            showGridlines
            // maxValueOverride={this.propChange}
            colorPalette={this.colorPalette}
            valueAccessor={'Birth Rate'}
            groupAccessor={'Type'}
            joinAccessor={'Country Code'}
            joinNameAccessor={'Name'}
            // markerAccessor={'ID'}
            // markerNameAccessor={'Country Code'}
            interactionKeys={this.interactionKeys}
            hoverOpacity={0.8}
            legend={this.legend}
            dataLabel={this.dataLabel}
            dataKeyNames={this.dataKeyNames}
            clickStyle={this.clickStyle}
            // hoverStyle={this.hoverStyle}
            countryStyle={this.countryStyle}
            markerStyle={this.innerMarkerStyle}
            accessibility={this.accessibility}
            // annotations={[{
            //   "note":{
            //     "label":"United States of America",
            //     "bgPadding":20,
            //     "title":"Country",
            //     "align":"right",
            //     "wrap":130
            //   },
            //   "accessibilityDescription":"This is an annotation that explains a drop in tweet activity due to staff change.",
            //   // "data":{ ID: 131, Name: 'Australia', 'Birth Rate': 10.3, 'Country Code': '036', Type: 'D' },
            //   "x": "200",
            //   "y": "200",
            //   "dx": "-75",
            //   "dy": "125",
            //   "type":"annotationCallout",
            //   "connector":{
            //     "end":"dot",
            //     "endScale":3
            //   },
            //   "color":"supp_red"
            // }]}
          />
        </div>
      </div>
    );
  }
}
